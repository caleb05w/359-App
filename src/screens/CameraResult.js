
//Shows the results of the fish once it has been identified and rendered.
//serves as an intermedium between taking photos and uploading fish where a user can decide if they want to save a fish or not.
//(aftr they have captured a photo of one)

import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
  Keyboard,
  StyleSheet,
  ImageBackground,
} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import globalStyles from "../globalStyles";
import PixelFish from "../components/pixelFish";


//
import { collection, addDoc } from "firebase/firestore";
import { db } from '../utils/firebaseConfig'

import LoadState from "../components/Loadstate";
import global from "../globalStyles";
import { handleResponse, imgResponse, fishDescription } from "../../api/chat";

export default function CameraResult({ navigation, route }) {
  //fish upload text
  const [response, setResponse] = useState(null); //what GPT sends
  const [status, setStatus] = useState(""); //feedback status
  const initialPhoto = route?.params?.photo ?? null;
  const [photo, setPhoto] = useState(initialPhoto);
  const [imageUpload, setImageUpload] = useState(!!initialPhoto);
  const [load, setLoad] = useState(false)
  const [description, setDescription] = useState("")
  //stroage system for photo
  const [upload, setUpload] = useState({ name: "", description: "no description" });

  // Bobbing animation for pixel fish
  const bobAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start bobbing animation when response is available
    if (response) {
      const bobAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bobAnim, {
            toValue: 2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(bobAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      bobAnimation.start();

      return () => bobAnimation.stop();
    }
  }, [response]);

  const translateY = bobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8], // Bob up 8 pixels
  });

  const IdentifyUpload = async () => {
    setLoad(true);
    try {
      const imageUri = photo?.uri ?? null;
      const parsedImg = await imgResponse(imageUri);
      setUpload((prev) => ({ ...prev, name: parsedImg }));
      // handleUpload will fetch the description from fishDescription
      await handleUpload(parsedImg);
      setLoad(false);
    }

    catch (e) {
      console.warn("error parsing fish name", e)
      setLoad(false);
    }
  }

  // SaveData: robust version
  const SaveData = async () => {
    setLoad(true);
    try {
      const imageUri = photo?.uri ?? null;
      const docRef = await addDoc(collection(db, "fish"), {
        //need to use parsed image here because it only loads after the await imgResponse calls.
        name: upload.name ?? "no name",
        description: upload?.description ?? "no descriptionnnn",
        imageUri: imageUri ?? "no image",
        schema: response ?? "no schema"
      });
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Saved!");
      setLoad(false);
    } catch (e) {
      console.warn("failed to save photo to DB", e);
    }
  };


  const handleUpload = async (name) => {
    { load === false ? setLoad(true) : "" }
    //feedback
    setStatus("Generating a response…");
    // handleResponse is the returned object from chat.js.
    try {
      const parsedSchema = await handleResponse(name);
      const parsedDescription = await fishDescription(name);
      //response is what GPT responds with.
      setResponse(parsedSchema);
      // Set the description from fishDescription to upload.description
      setUpload((prev) => ({ ...prev, description: parsedDescription || "no description" }));
      //feedback
      setStatus("Complete");
      setLoad(false)
    } catch (e) {
      //catch case in case GPT fails to connect.
      console.warn("Failed to connect", e);
    }
  };

  return (
    <View style={styles.container}>
      {load === true ? <LoadState message="Loading..."></LoadState> : ""}

      {imageUpload === false ? (
        <ImageBackground
          source={require("../../assets/uploadbg.png")}
          style={styles.fullUploadBG}
          resizeMode="cover"
        >
          <View style={styles.topLeftContainer}>
            <Text style={globalStyles.h2}>UPLOAD/TEXT</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Camera");
              }}
              style={styles.topToggleButton}
            >
              <Text style={[globalStyles.h5, { color: "black" }]}>UPLOAD PHOTO</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fullUploadContent}>
            {/* PixelFish / Preview area */}
            {response ? (
              <Animated.View
                style={{
                  transform: [{ translateY }],
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                  paddingBottom: 12,
                }}
              >
                <PixelFish schema={response} />
              </Animated.View>
            ) : (
              <View style={[global.flexRow, global.padding]}>
                <PixelFish schema={null} />
              </View>
            )}
            <Text style={globalStyles.h2}>FISH GENERATOR</Text>
            {/* Text input and Upload button section */}
            <View style={styles.inputStack}>
              <TextInput
                style={[global.upload, globalStyles.h4, { width: "85%" }]}
                placeholder="ENTER NAME"
                placeholderTextColor="#999"
                value={upload.name}
                onChangeText={(text) =>
                  setUpload((prev) => ({ ...prev, name: text }))
                }
                onSubmitEditing={() => Keyboard.dismiss()}
              />

              {response === null ?
                <View style={styles.containerButtons}>
                  <TouchableOpacity
                    style={[styles.whiteBtn]}
                    onPress={() => {
                      handleUpload(upload.name);
                      Keyboard.dismiss();
                    }}
                  >
                    <Text style={globalStyles.h5}>GENERATE FISH</Text>
                  </TouchableOpacity>
                </View>
                :
                <View style={styles.containerButtons}>
                  <TouchableOpacity
                    style={[styles.whiteBtn]}
                    onPress={SaveData}
                  >
                    <Text style={global.h5}>SAVE FISH</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.blkBtn}
                    onPress={() => {
                      handleUpload(upload.name);
                      Keyboard.dismiss();
                    }}
                  >
                    <Text style={globalStyles.h3}>GENERATE NEW FISH</Text>
                  </TouchableOpacity>
                </View>
              }

            </View>
          </View>
        </ImageBackground>

      ) : photo === null ? (

        //retake photo page
        <View style={styles.retakeContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("Camera");
            }}
          >
            <Text style={globalStyles.h5}>Retake Photo</Text>
          </TouchableOpacity>
        </View>

      ) : (

        // Photo results page
        <View style={styles.cameraContainer}>
          <View style={styles.topLeftContainer}>
            <Text style={globalStyles.h2}>UPLOAD/PHOTO</Text>
            <TouchableOpacity
              //navigates back to the photo page
              onPress={() => {
                navigation.navigate("Camera");
              }}
              style={styles.topToggleButton}
            >
              <Text style={[globalStyles.h5, { color: "black" }]}>UPLOAD TEXT</Text>
            </TouchableOpacity>
          </View>
          {/* 

          show after identified */}
          {response !== null ?
            <View style={styles.resultContainer}>
              <View style={styles.photoSquareContainer}>
                <View style={styles.photoSquareCompare}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </View>
                <AntDesign name="arrow-right" size={24} color="white" />
                <PixelFish schema={response} scale={0.5} />
              </View>
              <View style={styles.textResultContainer}>
                <Text style={globalStyles.h2}>IDENTIFIED: {upload.name}</Text>
                <Text style={globalStyles.h3}>{upload.description} </Text>
              </View>

              <TouchableOpacity style={styles.whiteBtn} onPress={SaveData}>
                <Text style={globalStyles.h5}>SAVE FISH</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.blkBtn}
                onPress={() => navigation.navigate("Camera")}
              >
                <Text style={globalStyles.h3}>NEW PHOTO</Text>
              </TouchableOpacity>

            </View>
            :
            <View style={styles.resultContainer}>
              <View style={styles.photoSquare}>
                <Image
                  source={{ uri: photo.uri }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.gap24}>
                <TextInput
                  style={[global.upload, global.h3, styles.centerUpload]}
                  placeholder="ENTER NAME"
                  placeholderTextColor="#999"
                  value={upload.name}
                  onChangeText={(t) => setUpload({ ...upload, name: t })}
                />

                <TouchableOpacity style={styles.whiteBtn} onPress={IdentifyUpload}>
                  <Text style={globalStyles.h5}>IDENTIFY FISH</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.blkBtn}
                  onPress={() => navigation.navigate("Camera")}
                >
                  <Text style={globalStyles.h3}>NEW PHOTO</Text>
                </TouchableOpacity>
              </View>
            </View>

          }
        </View>
      )
      }
    </View >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  whiteBtn: {
    width: "85%",
    backgroundColor: "#fff",
    paddingVertical: 12,
    alignItems: "center",
  },
  blkBtn: {
    width: "80%",
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 6,
  },

  button: {
    width: "45%",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  inputStack: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  fullUploadBG: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  fullUploadContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 150,
  },
  topLeftContainer: {
    position: "absolute",
    top: 24,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 24,
    flex: 1,
    gap: 10,
    zIndex: 999,
    elevation: 999,
    justifyContent: "space-between"
  },

  topToggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 5,
    backgroundColor: "#ffffff",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 150,
    alignItems: "center",
  },

  resultContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },

  gap24: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 24
  },
  photoSquare: {
    width: 180,
    height: 180,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  photoSquareCompare: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  photoSquareContainer: {
    width: "100%",
    height: 180,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24
  },
  textResultContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "col",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  retakeContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  centerUpload: {
    width: "85%",
    paddingHorizontal: 12
  },
  containerButtons: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
  }
});


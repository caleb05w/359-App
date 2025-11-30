
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
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
    <View style={global.page}>
      {load === true ? <LoadState message="Loading..."></LoadState> : ""}
      {imageUpload === false ? (

        <View>
          {response ? (
            <Animated.View
              style={{
                transform: [{ translateY }],
                alignItems: "center",
                justifyContent: "center",
                padding: 4, // Add padding so border is visible around content
                paddingBottom: 12,
              }}
            >
              {/* <Fish schema={response} /> */}
              <PixelFish schema={response} />
            </Animated.View>
          ) : (
            // <Fish schema={null} />
            <View style={[global.flexRow, global.padding]}>
              <PixelFish schema={null} />
            </View>
          )}
          <View style={global.flexRow}>
            <TextInput
              style={global.upload}
              placeholder="Fish Name"
              value={upload.name}
              onChangeText={(text) => {
                setUpload((prev) => ({ ...prev, name: text }));
              }}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
            <Button
              title="Upload"
              onPress={() => {
                handleUpload(upload.name);
                Keyboard.dismiss();
              }}
            />
          </View>
          <View>
            <Text>Status: {status} </Text>
          </View>
        </View>
      ) : photo === null ? (
        //retake photo page
        <View>
          <Button
            title="Retake Photo"
            onPress={() => {
              navigation.navigate("Camera");
            }}
          ></Button>
        </View>
      ) : (
        //results of photo page
        <View>
          <View style={global.flexRow}>
            <Image
              source={{ uri: photo.uri }}
              style={upload.name !== "" ? { width: 100, height: 100 } : { width: 200, height: 200 }}
            ></Image>
            {upload.name !== "" && (
              <>
                <Ionicons name="arrow-forward" size={32} color="black" />
                <PixelFish schema={response} />
              </>
            )}
          </View>
          <View style={[global.container]}>
            <View style={global.flexRow}>
              <Text>Name:</Text>
              <TextInput
                placeholder="Enter Key"
                value={upload.name}
                onChangeText={(text) =>
                  setUpload((prev) => ({ ...prev, name: text }))
                }
              />
            </View>
            <View style={global.flexRow}>
              <Text>Data</Text>
              <TextInput
                placeholder="Enter Data"
                value={upload.description}
                onChangeText={(text) =>
                  setUpload((prev) => ({ ...prev, description: text }))
                }
              />
            </View>
          </View>
        </View>
      )
      }

      {
        //identify photo page
        status === "Complete" || photo !== null ? (
          <View>
            <View style={global.flexRow}>
              {upload.name === "" && photo !== null ? (
                <Button
                  title="Identify Fish"
                  onPress={() => {
                    IdentifyUpload();
                  }}
                ></Button>
              ) : (
                <Button
                  title="Save Fish"
                  onPress={() => {
                    SaveData();
                  }}
                ></Button>
              )}
              <Button
                title="New Photo"
                onPress={() => {
                  navigation.navigate("Camera");
                }}
              />
            </View>
          </View>
        ) : (
          <Text></Text>
        )
      }

      <View style={global.center}>
        <TouchableOpacity
          onPress={() => {
            setImageUpload(!imageUpload);
            setPhoto(null);
          }}
          style={global.m12}
        >
          <Text>{imageUpload === true ? "Upload Text" : "Upload Image"}</Text>
        </TouchableOpacity>
      </View>
    </View >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // black background
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  photo: {
    width: "80%",
    height: 250,
    borderRadius: 12,
    marginBottom: 24,
  },
  button: {
    width: "45%",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 30,
    marginTop: 16,
  },
});


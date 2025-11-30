
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
import { Ionicons } from "@expo/vector-icons";
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
  <ImageBackground
    source={require("../../assets/uploadbg.png")}
    style={styles.fullUploadBG}
    resizeMode="cover"
  >
   <View style={styles.topLeftContainer}>
      <Text style={globalStyles.h1}>UPLOAD/TEXT</Text> 
      <TouchableOpacity
        onPress={() => setImageUpload(true)} // This switches to photo mode
        style={styles.topToggleButton}
      >
        <Text style={[globalStyles.h5, { color: "black" }]}>SWITCH MODE</Text>
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
 <Text style={globalStyles.h1}>FISH GENERATOR</Text>
      {/* Text input + Upload button */}
<View style={styles.inputStack}>
<TextInput
  style={[global.upload, globalStyles.h4, { width: "100%" }]}
  placeholder="ENTER NAME"
  value={upload.name}
  onChangeText={(text) =>
    setUpload((prev) => ({ ...prev, name: text }))
  }
  onSubmitEditing={() => Keyboard.dismiss()}
/>

  <TouchableOpacity
    style={[styles.button, { width: "100%" }]}
      onPress={() => {
      handleUpload(upload.name);
      Keyboard.dismiss();
    }}
  >
    <Text style={globalStyles.h5}>GENERATE FISH</Text>
  </TouchableOpacity>
</View>


      {/* Status */}
     <View>
        <Text style={globalStyles.h2}>STATUS: {status}</Text>
     </View>
    </View>
  </ImageBackground>
) : photo === null ? (

        //retake photo page
      <View>
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
        //results of photo page
        

  <View style={{ flex: 1, backgroundColor: "#000", padding: 20 }}>
    {/* Photo preview */}
    <View style={[styles.photoBox, { width: 150, height: 150 }]}>
      <Image
        source={{ uri: photo.uri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>

        {/* Label + Input */}
    <Text style={global.h3}>NAME</Text>
    <TextInput
      style={global.upload}
      placeholder="Enter Name..."
      placeholderTextColor="#999"
      value={upload.name}
      onChangeText={(t) => setUpload({ ...upload, name: t })}
    />

    {/* DESCRIPTION input */}
    <Text style={global.h3}>DESCRIPTION</Text>
    <TextInput
      style={global.upload}
      placeholder="Enter Description..."
      placeholderTextColor="#999"
      value={upload.description}
      onChangeText={(t) => setUpload({ ...upload, description: t })}
    />

        {/* Buttons */}
      <TouchableOpacity style={styles.whiteBtn} onPress={IdentifyUpload}>
      <Text style={global.h5}>IDENTIFY FISH</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.whiteBtn} onPress={SaveData}>
      <Text style={global.h5}>SAVE FISH</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.whiteBtn} onPress={() => navigation.navigate("Camera")}>
      <Text style={global.h5}>NEW PHOTO</Text>
    </TouchableOpacity>
  </View>
    )}



    {response && (
      <View style={styles.section}>
        <View style={styles.resultRow}>
          <Image
            source={{ uri: photo.uri }}
            style={styles.smallPhoto}
          />

          <Ionicons name="arrow-forward" size={32} color="#fff" />

          <Animated.View style={{ transform: [{ translateY }] }}>
            <PixelFish schema={response} />
          </Animated.View>
        </View>

        {/* Name */}
        <Text style={global.h4}>NAME</Text>
        <TextInput
          style={global.upload}
          value={upload.name}
          onChangeText={(t) => setUpload({ ...upload, name: t })}
        />

        {/* Description */}
        <Text style={global.h4}>DESCRIPTION</Text>
        <TextInput
          style={global.upload}
          value={upload.description}
          onChangeText={(t) => setUpload({ ...upload, description: t })}
        />

        {/* Save + New Photo */}
        <TouchableOpacity style={styles.whiteBtn} onPress={SaveData}>
          <Text style={global.h5}>SAVE FISH</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Camera")}>
          <Text style={global.h5}>NEW PHOTO</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);
}
  const styles = StyleSheet.create({
content: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingTop: 0,           
  width: "100%",
},
  photo: {
    width: "80%",
    height: 250,
    borderRadius: 12,
    marginBottom: 24,
  },
    photoBox: {
    width: "50%",
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
    resultRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },

  smallPhoto: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 4,
  },

  whiteBtn: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
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
  gap: 12,  // spacing between input + button
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
  paddingTop: 100,
  paddingHorizontal: 20,
},

uploadImageButton: {
  marginTop: 40,
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 10,
  backgroundColor: "rgba(255,255,255,0.2)",
},

uploadImageText: {
  color: "#fff",
  fontSize: 16,
},
topLeftContainer: {
  position: "absolute",
  top: 24,
  left: 24,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  zIndex: 999,
  elevation: 999, // Android
},
topToggleButton: {
  width: "50%",
  paddingVertical: 6,
  paddingHorizontal: 5,
  backgroundColor: "#ffffff",
},


});


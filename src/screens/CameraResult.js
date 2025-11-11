import { useState } from "react";
import {
  Text,
  View,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { createData } from "../utils/db";
import Fish from "../components/Fish";
import global from "../globalStyles";
import { handleResponse } from "../../api/chat";

export default function CameraResult({ navigation, route }) {
  //fish upload text
  const [response, setResponse] = useState(null); //what GPT sends
  const [status, setStatus] = useState(""); //feedback status
  const initialPhoto = route?.params?.photo ?? null;
  const [photo, setPhoto] = useState(initialPhoto);
  const [imageUpload, setImageUpload] = useState(!!initialPhoto);

  //stroage system for photo
  const [upload, setUpload] = useState({ name: "", email: "" });
  // SaveData: robust version
  const SaveData = async () => {
    try {
      const imageUri = photo?.uri ?? null;

      await createData(upload.name, upload.email, imageUri, response);
      console.log("saved");
    } catch (e) {
      console.warn("failed to save photo to DB", e);
    }
  };
  const handleUpload = async () => {
    //feedback
    setStatus("Generating a response…");
    // handleResponse is the returned object from chat.js.
    try {
      const parsedSchema = await handleResponse(upload.name);
      //response is what GPT responds with.
      setResponse(parsedSchema);
      //feedback
      setStatus("Complete");
    } catch (e) {
      //catch case in case GPT fails to connect.
      console.warn("Failed to connect", e);
    }
  };

  return (
    <View style={global.page}>
      {imageUpload === false ? (
        <View>
          <Fish schema={response ?? null} />
          <View style={global.flexRow}>
            <TextInput
              style={global.upload}
              placeholder="Fish Name"
              value={upload.name}
              onChangeText={(text) => {
                setUpload((prev) => ({ ...prev, name: text }));
              }}
            />
            <Button
              title="Upload"
              onPress={() => {
                handleUpload();
              }}
            />
          </View>
          <View>
            <Text>Status: {status} </Text>
          </View>
        </View>
      ) : photo === null ? (
        <Text>No Photo</Text>
      ) : (
        <View>
          <Image
            source={{ uri: photo.uri }}
            style={{ width: 200, height: 200 }}
          ></Image>
          <View style={[global.container, global.flexRow]}>
            <View style={global.flexRow}>
              <Text>Key:</Text>
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
                value={upload.email}
                onChangeText={(text) =>
                  setUpload((prev) => ({ ...prev, email: text }))
                }
              />
            </View>
          </View>
        </View>
      )}

      {status === "Complete" || photo !== null ? (
        <View>
          <View style={global.flexRow}>
            <Button
              title="save to DB"
              onPress={() => {
                SaveData();
              }}
            ></Button>

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
      )}

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
    </View>
  );
}

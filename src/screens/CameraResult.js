import { useState, useRef, useEffect } from "react";
import { Text, View, Button, Image, StyleSheet, TextInput } from "react-native";
import { createData, initDb, fetchData } from "../utils/db";
import global from "../globalStyles";

export default function CameraResult({ navigation, route }) {
  const photo = route?.params?.photo ?? null;
  //stroage system for photo
  const [upload, setUpload] = useState({ name: "", email: "" });
  const SaveData = async () => {
    try {
      await initDb; //make sure table exsits before you even try and throw shit in it
      await createData(upload.name, upload.email, photo.uri);
    } catch (e) {
      console.warn("failed to save photo to DB", e);
    }
  };

  return (
    <View style={global.page}>
      {photo === null ? (
        console.warn("Photo failed to save")
      ) : (
        <Image
          source={{ uri: photo.uri }}
          style={{ width: 200, height: 200 }}
        ></Image>
      )}

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

      <Button
        title="save to DB"
        onPress={() => {
          SaveData();
        }}
      ></Button>

      <View>
        <Text>
          <Button
            title="New Photo"
            onPress={() => {
              navigation.navigate("Camera");
            }}
          />
        </Text>
      </View>
    </View>
  );
}

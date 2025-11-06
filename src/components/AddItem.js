import { useState, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, Button } from "react-native";
import global from "../globalStyles";

export default function AddItem({}) {
  //upload
  const [upload, setUpload] = useState({ name: "", batch: "" });

  const handleUpload = () => {
    console.log("uploaded");
  };

  return (
    <View style={[global.test, styles.container]}>
      <View style={global.flexRow}>
        <Text> Key: </Text>
        <TextInput
          placeholder="Enter Key"
          value={upload.name}
          onChangeText={(text) => {
            setUpload((prev) => ({ ...prev, name: text }));
          }}
        ></TextInput>
      </View>
      <View style={global.flexRow}>
        <Text>Batch:</Text>
        <TextInput
          placeholder="enter batch"
          value={upload.batch}
          onChangeText={(text) => {
            setUpload((prev) => ({ ...prev, batch: text }));
          }}
        ></TextInput>
      </View>
      <View style={global.flexRow}>
        <Button title="Save List"></Button>
        <Button title="Delete List"></Button>
      </View>
      <View style={global.flexRow}>
        <Text>{upload.name}</Text>
        <Text>{upload.batch}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
});

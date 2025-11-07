import { useState, useRef } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { createData } from "../utils/db";
export default function CameraScreen({ navigation, route }) {
  //sets direction camera faces
  const [facing, setFacing] = useState(true);
  //handles camera permissions, which according to documnetation, is 100% necessary
  const [permission, requestPermission] = useCameraPermissions();
  //camera reference
  const cameraRef = useRef(null);
  //photo holder
  const [photo, setPhoto] = useState(null);

  const takePhoto = async () => {
    //if it doesnt exist just return and kill this function
    if (!cameraRef.current) return;
    console.log("Photo Taken");
    try {
      const photoResult = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      navigation.navigate("Results");
      setPhoto(photoResult);
      await createData("Caleb", "caleb@example.com", photoResult.uri);
    } catch (e) {
      console.warn(`failed to take photo`, e);
    }
  };

  //if you have permissions, skip
  if (!permission) return <View />;

  //if you have permissions, add this in.
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>We need camera permission</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.camera}>
      <CameraView
        style={styles.camera}
        facing={facing === true ? "front" : "back"}
        ref={cameraRef}
      />
      <View
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          right: 24,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Button
          title="take photo"
          onPress={() => {
            takePhoto();
          }}
        ></Button>
        <Button
          title={`Flip to ${facing === false ? "front" : "back"}`}
          onPress={() => setFacing(!facing)}
        />
      </View>

      {photo && (
        <Image
          source={{ uri: photo.uri }}
          style={{ width: "100%", height: 300, marginTop: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  //according to documentation, you need a flex: 1 for camera to work.
  camera: {
    flex: 1,
  },
});

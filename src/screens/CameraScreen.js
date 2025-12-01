//screen dedicated to taking photos.
//houses our camera object.

import { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import globalStyles from "../globalStyles";


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
      //referenced from documentation, takes the photo -- quality and base64 are for parsing purposes
      const photoResult = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: true,
      });
      //when it takes a photo, goes to photo result page
      navigation.navigate("Results", { photo: photoResult });
      setPhoto(photoResult);
    } catch (e) {
      console.warn(`failed to take photo`, e);
    }
  };

  //if you have permissions, skip
  if (!permission) return <View />;

  //if you have permissions, add this in.
  if (!permission.granted && permission.canAskAgain) {
    return (
      <View style={styles.center}>
        <Text>We need camera permission</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={globalStyles.h5}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.camera}>
      <CameraView
        style={styles.camera}
        //sets the cameras facing direction
        facing={facing === true ? "front" : "back"}
        //according to documentation, we need to use UseRef here.
        ref={cameraRef}
      />
      <View style={styles.topLeftContainer}>
        <Text style={globalStyles.h2}>UPLOAD/PHOTO</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Results", { toggleMode: true })}
          style={styles.topToggleButton}
        >
          <Text style={[globalStyles.h5, { color: "black" }]}>
            SWITCH MODE
          </Text>
        </TouchableOpacity>
      </View>


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
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={globalStyles.h5}>TAKE PHOTO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setFacing(!facing)}
        >
          <Text style={globalStyles.h5}>
            FLIP TO {facing ? "BACK" : "FRONT"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  //according to documentation, you need a flex: 1 for camera to work.
  camera: {
    flex: 1,
  },
  button: {
    width: "100%",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 5,
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
});

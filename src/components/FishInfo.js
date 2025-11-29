import React from "react";
import { View, Text, StyleSheet, Button, ImageBackground } from "react-native";
import globalStyles from "../globalStyles";

export default function FishDetails({ fish, onClose }) {
  if (!fish) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <ImageBackground
          source={require("../../assets/aquariumbg.png")}
          style={styles.bg}
          resizeMode="cover"
        >
          <Text style={globalStyles.h1}>{fish.name}</Text>
          <Text style={globalStyles.h2}>Description: {fish.type}</Text>

          <View style={styles.closeButton}>
            <Button title="Close [x]" onPress={onClose} color="#ffffffff" />
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
  card: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  bg: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
    color: "white",
  },
  closeButton: {
    fontFamily: "departure mono",
    fontSize: 15,
    marginTop: 20,
    alignSelf: "center",
    width: 100,
    color: "black",
  },
});

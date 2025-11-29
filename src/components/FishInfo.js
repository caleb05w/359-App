import React from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import globalStyles from "../globalStyles";

export default function FishDetails({ fish, onClose }) {
  if (!fish) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={globalStyles.h1}>{fish.name}</Text>
        <Text style={globalStyles.h2}>Description: {fish.type}</Text>

       <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={globalStyles.h5}>[X] CLOSE </Text>
        </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    zIndex: 998,
  },
  card: {
    width: "85%",
    padding: 25,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  button: {
    marginTop: 50,
    width: "60%",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
});

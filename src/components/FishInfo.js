import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import globalStyles from "../globalStyles";

export default function FishDetails({ fish, onClose }) {
  if (!fish) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={globalStyles.h1}>{fish.name}</Text>
        <Text style={globalStyles.h2}>Description: {fish.type}</Text>

        <View style={styles.closeButton}>
          <Button title="Close [x]" onPress={onClose} color="#007AFF" />
        </View>
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
    backgroundColor: "rgba(255, 255, 255, 0.92)", // translucent so blur shows through
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  closeButton: {
    marginTop: 20,
    width: 120,
  },
});

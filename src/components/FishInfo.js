import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function FishDetails({ fish, onClose }) {
  if (!fish) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.name}>{fish.name}</Text>
        <Text style={styles.detail}>Description: {fish.type}</Text>

         <View style={styles.closeButton}>
          <Button title="Close" onPress={onClose} color="#007AFF" />
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    width: 100, // optional, to make button a bit smaller
  },
});

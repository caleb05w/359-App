// FishDetailScreen.js
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function FishDetailScreen({ route }) {
  const { fish } = route.params;

  return (
    <View style={styles.container}>
      <Image source={fish.image} style={styles.fishImage} />

      <View style={styles.card}>
        <Text style={styles.name}>{fish.name}</Text>
        <Text style={styles.detail}>Type: {fish.type}</Text>
        <Text style={styles.detail}>Speed: {fish.speed}</Text>
        <Text style={styles.detail}>Color: {fish.color}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E6F7FF",
  },
  fishImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    elevation: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0077B6",
  },
  detail: {
    fontSize: 16,
    marginBottom: 6,
  },
});

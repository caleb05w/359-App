import React from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import globalStyles from "../globalStyles";
import PixelFish from "./pixelFish";

export default function FishDetails({ fish, onClose }) {

  // accepts and parses image of the fish. Makes sure that the fish is returned as a JSON, otherwise the image breaks.
  const parseSchema = (schema) => {
    if (!schema) return null;
    //casts the schema to make sure it is an object
    if (typeof schema === "object") return schema;
    try {
      return JSON.parse(schema);
    } catch {
      return null;
    }
  };

  const schema = parseSchema(fish.schema);

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* renders the fish, if the fish exists */}
        {schema && (
          <View style={styles.fishImageContainer}>
            <PixelFish schema={schema} />
          </View>
        )}
        {/* pulls the fish name */}
        <Text style={globalStyles.h1}>{fish.name}</Text>
        {/* pulls the fish description */}
        <Text style={globalStyles.h2}>Description: {fish.description}</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={globalStyles.h5}>[X] CLOSE </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 998,
  },

  card: {
    width: "85%",
    padding: 25,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 1)",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    flexDirection: "column",
    gap: 24,
  },
  fishImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
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

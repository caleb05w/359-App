import { View, Text, StyleSheet, TextInput } from "react-native";
import { useState, useEffect } from "react";

export default function TestFish({ Attributes = {} }) {
  const { Name, Length, Size, Color } = Attributes;

  return (
    <View style={styles.containerFlex}>
      <Text>Name: {Attributes.Name ?? "Unknown"}</Text>

      <View style={[styles.flex]}>
        <Text>Length: {Attributes.Length ?? "Unknown"}</Text>
        <Text> Size: {Attributes.Size ?? "Unknown"}</Text>
        <Text> Color: {Attributes.Color ?? "Unknown"} </Text>
      </View>
  </View>
  );
}

const styles = StyleSheet.create({
  containerFlex: {
    borderWidth: 2,
    borderColor: "black",
    padding: 10,
    alignSelf: "flex-start",
    height: "auto",
  },

  flex: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 24,
  },
});

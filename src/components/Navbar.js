import global from "../globalStyles";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";

const items = [
  { Text: "Login", route: "Login" },
  { Text: "Sign Up", route: "SignUp" },
  { Text: "HomePage", route: "Home" },
  { Text: "Camera", route: "Camera" },
  { Text: "FishIndex", route: "FishIndex" },
  { Text: "Test", route: "Test" },
];

export default function Navbar({ navigation }) {
  return (
    <View style={global.navBar}>
      {items.map((i) => (
        <TouchableOpacity
          key={i.Text}
          onPress={() => {
            navigation.navigate(i.route, { item: "none", color: "black" });
          }}
        >
          <Text> {i.Text} </Text>
        </TouchableOpacity>
      ))}
      <Text> Ah </Text>
    </View>
  );
}

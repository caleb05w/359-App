import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import global from "../globalStyles";
import AddItem from "../components/AddItem";

export default function FishIndex({ navigation, route }) {
  return (
    <View style={[global.page, global.navbuffer]}>
      <AddItem></AddItem>
      <Text> Hello </Text>
    </View>
  );
}

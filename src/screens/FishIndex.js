import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import global from "../globalStyles";
import ItemAdd from "../components/ItemAdd";

export default function FishIndex({ navigation, route }) {
  return (
    <View style={[global.page, global.navbuffer]}>
      <ItemAdd></ItemAdd>
      <Text> Hello </Text>
    </View>
  );
}

import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import global from "../globalStyles";

export default function Template({ navigation, route }) {
  return (
    <View style={[global.page, global.navbuffer]}>
      <Text>Page Name</Text>
    </View>
  );
}

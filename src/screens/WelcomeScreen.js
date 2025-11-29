import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import globalStyles from "../globalStyles";

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/welcomebg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.content}>

        {/* TITLE */}
        <Text style={globalStyles.h1}>SANCTUARY</Text>
        <Text style={globalStyles.h1}>FISH FINDER</Text>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={globalStyles.h5}>LOGIN</Text>
        </TouchableOpacity>

        {/* SIGNUP LINK */}
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={[globalStyles.h3, styles.linkText]}>
            SIGN UP HERE
          </Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  button: {
    marginTop: 100,
    width: "40%",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  linkText: {
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
});

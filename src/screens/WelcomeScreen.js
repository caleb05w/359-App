import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { GradientBackground } from "../globalStyles";

export default function WelcomeScreen({ navigation }) {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Fish Finder</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Button
          title="skip"
          onPress={() => {
            navigation.navigate("MainTabs", {
              screen: "Upload", // the Tab
              params: { screen: "Results" }, // the Stack screen inside the Upload tab
            });
          }}
        />

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.linkText}>Don’t have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#033A57",
    textAlign: "center", // ensures text is centered
  },
  button: {
    backgroundColor: "#0077A3",
    paddingVertical: 14,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  linkText: {
    fontSize: 16,
    color: "#007AFF",
    textAlign: "center", // centers the text
  },
});

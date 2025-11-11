import { useState, useEffect } from "react";
import { GradientBackground } from "../globalStyles";
import {
  Button,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import globalStyles from "../globalStyles";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const localUserName = route?.params?.localUserName ?? null;
  const localEmail = route?.params?.localEmail ?? null;
  const localPassword = route?.params?.localPassword ?? null;

  const handlePassword = () => {
    localPassword === null
      ? Alert.alert("no password saved")
      : setPassword(localPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login successful!");
      navigation.navigate("MainTabs", {
        screen: "Camera",
      });
    } catch (error) {
      Alert.alert("Login failed", error.message);
    }
  };

  return (
    <GradientBackground>
      <View style={globalStyles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
        </View>

        {/* Inputs */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        {/* Link to Sign Up */}
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#033A57",
    marginTop: 8,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 60,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 18,
    paddingVertical: 8,
    marginBottom: 25,
    color: "#033A57",
  },
  button: {
    backgroundColor: "#0077A3",
    paddingVertical: 14,
    borderRadius: 30,
    width: "100%",
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
  },
});

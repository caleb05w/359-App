import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import global from "../globalStyles";
import { GradientBackground } from "../globalStyles";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!email || !username || !password) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    try {
      console.log("auth?", !!auth, auth?.app?.options?.projectId);
      console.log("auth", auth);
      console.log("auth.app", auth?.app);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: username });
      Alert.alert("Success!", `Welcome, ${username}!`);
      navigation.navigate("Login", {
        localUserName: username,
        localEmail: email,
        localPassword: password,
      });
    } catch (error) {
      Alert.alert("Sign up failed", error.message);
    }
  };

  return (
    <GradientBackground>
    <View style={global.page}>
      <Text style={styles.title}>Create Account</Text>

    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login here</Text>
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

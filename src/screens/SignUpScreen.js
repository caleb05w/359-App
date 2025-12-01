import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import globalStyles from "../globalStyles";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { saveUserPrefs } from "../utils/storage";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const rememberLogin = async () => {
    const payload = { email, password };
    await saveUserPrefs(payload);
    Alert.alert("Saved info!");
  };

  const handleSignUp = async () => {
    if (!email || !username || !password) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
    <ImageBackground
      source={require("../../assets/indexbg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.content}>

        <Text style={globalStyles.h1}>SIGNUP</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={globalStyles.h4}
            placeholder="EMAIL"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={globalStyles.h4}
            placeholder="USERNAME"
            placeholderTextColor="#777"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={globalStyles.h4}
            placeholder="PASSWORD"
            placeholderTextColor="#777"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={globalStyles.h5}>CONTINUE SIGNUP</Text>
        </TouchableOpacity>

        {/* For remembering info */}
        {email && password && username && (
          <TouchableOpacity onPress={rememberLogin}>
            <Text style={[globalStyles.h3, styles.remember]}>Remember Me</Text>
          </TouchableOpacity>
        )}

        {/* swicthes to login pageee*/}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[globalStyles.h3, styles.loginLink]}>
            LOGIN INSTEAD
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
    width: "85%",
    alignItems: "center",
  },

  inputWrapper: {
    width: "100%",
    marginTop: 20,
    marginBottom: 40,
  },

  button: {
    width: "60%",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },

  remember: {
    color: "white",
    marginBottom: 10,
  },

  loginLink: {
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
});

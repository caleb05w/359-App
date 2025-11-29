import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import globalStyles from "../globalStyles";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { loadUserPrefs } from "../utils/storage";

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const localPassword = route?.params?.localPassword ?? null;

  const loadPassword = async () => {
    const load = await loadUserPrefs();
    Alert.alert("Filling saved password...");
    setEmail(load.localUserName.email);
    setPassword(load.localUserName.password);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login successful!");
      navigation.navigate("MainTabs", { screen: "Camera" });
    } catch (error) {
      Alert.alert("Login failed", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/loginbg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.content}>

        <Text style={globalStyles.h1}>LOGIN</Text>

        {/* INPUTS */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={globalStyles.h4}
            placeholder="EMAIL"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
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

        {/* LOGIN BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={globalStyles.h5}>CONTINUE LOGIN</Text>
        </TouchableOpacity>

        {/* FORGOT PASSWORD */}
        <TouchableOpacity onPress={loadPassword}>
          <Text style={[globalStyles.h3, styles.forgot]}>FORGOT PASSWORD?</Text>
        </TouchableOpacity>

        {/* SIGN UP */}
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={[globalStyles.h3, styles.signup]}>
            SIGNUP INSTEAD
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
    marginTop: 30,
    marginBottom: 40,
  },

  button: {
    width: "50%",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },

  forgot: {
    color: "white",
    marginBottom: 10,
  },

  signup: {
    color: "white",
    marginTop: 10,
  },
});

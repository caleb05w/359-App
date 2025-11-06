import { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import globalStyles from "../styles/globalStyles";
import {
  saveUserPrefs,
  loadUserPrefs,
  removeUserPrefs,
} from "../utils/storage";

export default function LoginScreen({ navigation }) {
  const [list, setList] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAddItem = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Please enter both username and password.");
      return;
    }
    setList([{ name: username, pass: password }, ...list]);
    setUsername("");
    setPassword("");
  };

  const updatePrefs = async () => {
    await saveUserPrefs({ name: username, pass: password });
    const load = await loadUserPrefs();
    Alert.alert("Saved Data:\n" + JSON.stringify(load, null, 2));
  };

  useEffect(() => {
    (async () => {
      const load = await loadUserPrefs();
      console.log("Loaded login data:", load);
      if (load?.name) setUsername(load.name);
      if (load?.pass) setPassword(load.pass);
    })();
  }, []);

  return (
    <View style={globalStyles.page}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.h1}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.h1}
        placeholder="Enter password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Add User" onPress={handleAddItem} />
      <Button
        title="Reset Saved Data"
        onPress={async () => {
          await removeUserPrefs();
          Alert.alert("Data cleared.");
        }}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />

      {/* ✅ Bottom NavBar */}
      <View style={globalStyles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert("Settings coming soon!")}>
          <Text>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
  },
  h1: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    width: "80%",
    borderRadius: 6,
  },
});

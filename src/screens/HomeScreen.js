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
import {
  saveUserPrefs,
  loadUserPrefs,
  removeUserPrefs,
} from "../utils/storage";
import global from "../globalStyles";

//things to add
// DB -- idk for what tho lol
// IOS Camera Library
// API Gmap?
// Plan our object thingy
// Plan out GPT pipeline

export default function HomeScreen({ navigation }) {
  const [list, setList] = useState([""]);
  const [item, setItem] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const colors = ["red", "blue", "orange", "green"];
  const [selectedColor, setSelectedColor] = useState("");

  const handleAddItem = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Please enter both username and password.");
      return;
    }
    setList([{ name: username }, ...list]);
    setUsername("");
    setPassword("");
  };

  //pass values onto next page
  //also load it into our asycn storage
  const changePage = () => {
    navigation.navigate("Test", { item: item.trim(), color: selectedColor });
  };

  const updatePrefs = async () => {
    await saveUserPrefs(item, selectedColor);
    const load = await loadUserPrefs();
    Alert.alert(JSON.stringify(load));
  };

  useEffect(() => {
    (async () => {
      const load = await loadUserPrefs();
      console.log(`unloading log`, load);
      if (load?.name) setItem(load.name);
      if (load?.color) setSelectedColor(load.color);
    })();
  }, []);

  return (
    <View>
      <View style={[styles.containerFlex, styles.containerCenter]}>
        {list.map((temp) => (
          <Text key={temp.name}>{temp.name}</Text>
        ))}
        <TextInput
          styles={[styles.h1, { backgroundColor: selectedColor }]}
          placeholder="enterr name"
          value={item}
          onChangeText={setItem}
        />
        <View style={styles.colorsRow}>
          {colors.map((item) => (
            <TouchableOpacity
              onPress={() => setSelectedColor(item)}
              key={item}
              style={[
                styles.colorsSwatch,
                {
                  backgroundColor: item,
                  borderWidth: selectedColor === item ? 3 : 1,
                },
              ]}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.containerFlexRow]}>
          <Button
            title="add items"
            onPress={() => {
              setList([{ name: item }, ...list]);
            }}
          ></Button>
          <Button
            title="Reset List"
            onPress={() => {
              setList([]);
            }}
          ></Button>
        </View>
        <View style={[styles.containerFlexRow]}>
          <Button
            title="Save"
            onPress={() => {
              updatePrefs();
            }}
          />

          <Button
            title="Reset"
            onPress={async () => {
              removeUserPrefs();
              Alert.alert("data wiped");
            }}
          />
        </View>{" "}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerFlex: {
    flexDirection: "column",
    gap: 12,
    marginVertical: 10,
    width: "100%",
  },

  h1: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    width: "80%",
    borderRadius: 6,
  },

  containerFlexRow: {
    flexDirection: "row",
    gap: 12,
  },

  containerCenter: {
    flexDirection: "column",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  colorsRow: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 10,
  },

  colorsSwatch: {
    width: "fit-content",
    height: "fit-content",
    padding: 12,
    borderColor: "#111",
    borderRadius: 8,
  },
});

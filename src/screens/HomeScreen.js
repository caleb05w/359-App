import {useState, useEffect} from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native'


//things to add 

//navigation
// Listing mechanism
// Storage mechanism
// logger
// Storage
// key system

export default function HomeScreen({ navigation }) {
  const [list, setList] = useState([{ name: "role" }, { name: "two" }]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

    const handleAddItem = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Please enter both username and password.");
      return;
    }

    setList([{ name: username }, ...list]);
    setUsername("");
    setPassword("");
  };

 return (
    <View>
      <View style={[styles.containerFlex, styles.containerCenter]}>
        {list.map((temp) => (
          <Text key={temp.name}>{temp.name}</Text>
        ))}

        {/* Username input */}
        <TextInput
          style={styles.h1}
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
        />

        {/* Password input */}
        <TextInput
          style={styles.h1}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true} 
        />

         <View style={styles.containerFlexRow}>
          <Button title="Add item" onPress={handleAddItem} />
          <Button
            title="Reset list"
            onPress={() => {
              setList([]);
            }}
          />
          
        </View>

        <Button
          title="Change page"
          onPress={() => {
            navigation.navigate("Test");
          }}
        />
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
});
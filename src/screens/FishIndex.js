import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, Text, Button, StyleSheet, FlatList, Image, ImageBackground } from "react-native";
import global from "../globalStyles";
import { deleteData, fetchData } from "../utils/db";
import List from "../components/List";
import FishInfo from "../components/FishInfo"; 

export default function FishIndex({ navigation, route }) {
  const [data, setData] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null); 
  const isFocused = useIsFocused(); //imported this because apparently react remembers page screens so every time we swap them, it doesnt refresh and useEffect never calls, so the db appears not to update
  //runs before we start our file
  useEffect(() => {
    if (!isFocused) return; //do nothing if not "focused"
    (async () => {
      setData(await fetchData()); // loads data and sets it into data.
      console.log("set data");
    })();
  }, [isFocused]); //every time changes focuses, load the db. makes sure the itemns are there on load.

  const handleDelete = async () => {
    //await basically means wait until I do this function before you continue.
    await deleteData();
    setData(await fetchData());
  };

return (
    <ImageBackground
        source={require("../../assets/indexbg.png")}
        style={styles.container}
        resizeMode="cover"
      >
  <View style={[global.page]}>

    <Text> Camera Index </Text>

    <View style={global.flexRow}>
      <Text>
        <Button title="Delete List" onPress={handleDelete} />
      </Text>
    </View>

    <List data={data} onPressFish={setSelectedFish} />

    {/* 🟣 MOVE FishInfo HERE — above closing View */}
    {selectedFish && (
      <FishInfo
        fish={selectedFish}
        onClose={() => setSelectedFish(null)}
      />
    )}
  </View>
</ImageBackground>
);
}


const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flex: 1,
  },

  containerItem: {
    padding: 12,
    width: "95%",
    backgroundColor: "white",
    borderColor: "#F1F1F7",
    borderWidth: 2.5,
    borderRadius: 16,
    display: "flex",
    flexDirection: "row",
    margin: 8,
    gap: 12,
  },

  containerText: {
    display: "flex",
    flexDirection: "column",
    margin: 8,
  },

  containerData: {
    display: "column",
    gap: 12,
  },
});

import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, Text, Button, StyleSheet, FlatList, Image, ImageBackground, TouchableOpacity } from "react-native";
import global from "../globalStyles";
import { deleteData, fetchData } from "../utils/db";
import List from "../components/List";
import FishInfo from "../components/FishInfo"; 
import globalStyles from "../globalStyles";

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
    <View style={styles.content}>
      <Text style={[globalStyles.h1, { marginTop: 40 }]}>FISH INDEX</Text>
      <Text style={globalStyles.h2}>NUMBER OF FISH: {data.length}</Text>

      <List data={data} onPressFish={setSelectedFish} />
      
      {selectedFish && (
        <FishInfo
          fish={selectedFish}
          onClose={() => setSelectedFish(null)}
        />
      )}
    </View>
     <TouchableOpacity style={styles.button} onPress={handleDelete}>
        <Text style={globalStyles.h5}>DELETE LIST</Text>
      </TouchableOpacity>
  </ImageBackground>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", 
    paddingTop: 60, 
    width: "100%",
  },
  containerItem: {
    padding: 12,
    width: "95%",
    flexDirection: "row",
    margin: 8,
    gap: 12,
    backgroundColor: "transparent", // removes white background
  },
  containerText: {
    flexDirection: "column",
    margin: 8,
  },
  containerData: {
    flexDirection: "column",
    gap: 12,
  },
  button: {
    width: "60%",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 20,
  },
});

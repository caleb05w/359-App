//Renders the list of fish on fish Index in a flatlist. 
//Pulls data from the firestore

import { Text, View, StyleSheet, Image, FlatList, Pressable } from "react-native";
import PixelFish from "./pixelFish";

export default function List({ data, onPressFish }) {
  const parseFish = (val) => {
    if (!val) return null;
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  };

  const renderItem = ({ item }) => {
    const schema = parseFish(item.schema);

    return (
      <Pressable onPress={() => onPressFish(item)} style={styles.row}>

        <View style={styles.imageBox}>
          {schema ? (
            <View style={styles.pixelFishWrapper}>
              <PixelFish schema={schema} />
            </View>
          ) : item?.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.placeholder}>No Image</Text>
          )}
        </View>

        <View style={styles.vLine} />

        <View style={styles.textBox}>
          <Text style={styles.name}>{item?.name || "NO NAME"}</Text>
          <Text
            style={styles.desc}
            //referenced stack overflow documentation for trailing text
            //https://stackoverflow.com/questions/30594080/how-to-have-ellipsis-effect-on-text
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item?.description || "NO DESCRIPTION"}
          </Text>
        </View>

      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },

  imageBox: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },

  pixelFishWrapper: {
    transform: [{ scale: 0.35 }],
  },

  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  vLine: {
    width: 1,
    height: "80%",
    backgroundColor: "white",
    marginHorizontal: 10,
  },

  textBox: {
    flex: 1,
  },

  name: {
    color: "white",
    fontFamily: "departure mono",
    fontSize: 18,
    marginBottom: 2,
  },

  desc: {
    color: "white",
    opacity: 0.7,
    fontFamily: "departure mono",
    fontSize: 16,
    flexShrink: 1,
  },

  placeholder: { color: "white" }
});

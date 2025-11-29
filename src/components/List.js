import { Text, View, StyleSheet, Image, FlatList, Pressable } from "react-native";
import global from "../globalStyles";
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
     <Pressable
      onPress={() => {
       onPressFish(item); // pass entire item
  }}
        style={styles.containerItem}
      >
        {schema ? (
          <View style={global.listItem}>
            <View style={{ transform: [{ scale: 0.5 }], width: "200%", height: "200%" }}>
              <PixelFish schema={schema} />
            </View>
          </View>
        ) : item?.imageUri ? (
          <Image
            source={{ uri: item.imageUri }}
            style={{ width: 100, height: 100, borderRadius: 8 }}
          />
        ) : (
          <Text>No Item Saved</Text>
        )}

        {/* Always render text info */}
        <View style={styles.containerText}>
          <Text>{item?.name || "No Name"}</Text>
          <Text style={{ color: "#666" }}>
            {item?.description || "No Description"}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[global.test, styles.container]}>
      <View style={{ height: "100%" }}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    width: "100%",
    display: "flex",
  },

  containerItem: {
    padding: 12,
    width: "95%",
    display: "flex",
    flexDirection: "row",
    margin: 8,
    gap: 12,
    borderBottomWidth: 1,   // only bottom line
    borderBottomColor: "#ccc",
  },

  containerText: {
    display: "flex",
    flexDirection: "col",
    margin: 8,
  },

  containerData: {
    display: "column",
    gap: 12,
  },
});

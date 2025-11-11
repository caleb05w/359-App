import { Text, View, StyleSheet, Image, FlatList } from "react-native";
import global from "../globalStyles";
import Fish from "./Fish";

export default function List({ data }) {
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
    const schema = parseFish(item.fish);

    return (
      <View style={styles.containerItem}>
        {schema ? (
          <View style={{ marginTop: 8 }}>
            <Fish schema={schema} />
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
            {item?.email || "No Description"}
          </Text>
        </View>
      </View>
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
    flexDirection: "col",
    margin: 8,
  },

  containerData: {
    display: "column",
    gap: 12,
  },
});

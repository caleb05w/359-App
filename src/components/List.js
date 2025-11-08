import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, FlatList } from "react-native";
import global from "../globalStyles";

export default function List({ data }) {
  return (
    <View style={[global.test, styles.container]}>
      <View style={{ height: "100%" }}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.containerItem}>
              {item.imageUri === null ? (
                <Text> No Image </Text>
              ) : (
                <Image
                  source={{ uri: item.imageUri }}
                  style={{ width: 100, height: 100 }}
                ></Image>
              )}
              <View style={styles.containerText}>
                <Text>{item.name}</Text>
                <Text>{item.email}</Text>
              </View>
            </View>
          )}
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

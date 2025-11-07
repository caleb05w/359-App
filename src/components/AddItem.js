import { useState, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, Button, Image } from "react-native";
import global from "../globalStyles";
import { fetchData, initDb, createData, deleteData } from "../utils/db";

export default function AddItem({}) {
  const [upload, setUpload] = useState({ name: "", batch: "" });
  const [data, setData] = useState([]);

  //runs before we start our file
  useEffect(() => {
    (async () => {
      await initDb(); // important to use await here so you dont call it before hte table exists.
      setData(await fetchData()); // loads data and sets it into data.
    })();
  }, []);

  const handleDelete = async () => {
    await deleteData();
    setData(await fetchData());
  };

  const handleSave = async () => {
    await createData(upload.name, upload.batch, null); //sends our upload object into db
    setData(await fetchData()); //updates list on save.
  };

  return (
    <View style={[global.test, styles.container]}>
      <View style={global.flexRow}>
        <Text>Key:</Text>
        <TextInput
          placeholder="Enter Key"
          value={upload.name}
          onChangeText={(text) =>
            setUpload((prev) => ({ ...prev, name: text }))
          }
        />
      </View>

      <View style={global.flexRow}>
        <Text>Batch:</Text>
        <TextInput
          placeholder="Enter batch"
          value={upload.batch}
          onChangeText={(text) =>
            setUpload((prev) => ({ ...prev, batch: text }))
          }
        />
      </View>

      <View style={global.flexRow}>
        <Button title="Save List" onPress={handleSave} />
        <Button title="Delete List" onPress={() => handleDelete()} />
      </View>

      <View>
        {data.map((item) => (
          <View key={item.id} style={global.flexRow}>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
            {item.imageUri === null ? (
              <Text> No Image Found</Text>
            ) : (
              <Image
                source={{ uri: item.imageUri }}
                style={{ width: 100, height: 100 }}
              ></Image>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    position: "absolute",
    width: "100%",
    bottom: 150,
  },
});

import { Text, View, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useState, useEffect } from "react";
import Fish from "../components/TestFish";
import global from "../globalStyles";

//GPT testing params
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

export default function TestScreen({ navigation, route }) {
  console.log(route.params);
  const initialItem = route?.params?.item ?? null;
  const bg = route?.params?.color ?? null;
  const [fish, setFish] = useState("");
  const [response, setResponse] = useState("");

  async function askGPT() {
    //stage the answer
    try {
      const res = await openai.responses.create({
        model: "gpt-4o-2024-08-06",
        input: fish || "say hello in french",
      });
      setResponse(res.output_text);
    } catch (e) {
      console.warn(`GPT Error`, e);
    }
  }

  const testTribs = {
    Name: "Tadpole",
    Length: "4ft",
    Size: "domesitc",
    Color: "red",
  };

  return (
    <View style={global.page}>
      <Fish Attributes={testTribs} />
      <Text> {fish ?? "no fish"} </Text>
      <View style={styles.flex}>
        <View style={global.colorBox}></View>
        {/* <Text> {initialItem ?? " no item"} </Text> */}

        <View
          style={[
            { display: "flex", flexDirection: "column", marginTop: "40" },
          ]}
        >
          <TextInput
            placeholder="Enter fishh name"
            className="border-2 border-black"
            onChangeText={setFish}
            value={fish}
          />
          <Button
            className="border-2 border-black"
            title="submit"
            onPress={() => {
              askGPT();
            }}
          ></Button>

          <Text className="border-4 border-red-500 p-4 text-xl">
            hello with border
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
  },
});

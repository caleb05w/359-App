import { Text, View, Button, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import Fish from "../components/Fish";
import { handleResponse } from "../../api/chat";

export default function ImportScreen() {
  const [load, setLoad] = useState(""); //what we send
  const [response, setResponse] = useState(""); //what GPT sends
  const [status, setStatus] = useState(""); //feedback status

  //needs to be async because we are relying on server function
  //upload function, takes a prompt (load) which is the string sent to GPT
  const handleUpload = async () => {
    //feedback
    setStatus("Generating a response…");
    // handleResponse is the returned object from chat.js.
    try {
      const parsedSchema = await handleResponse(load);
      //response is what GPT responds with.
      setResponse(parsedSchema);
      //feedback
      setStatus("Complete");
    } catch (e) {
      //catch case in case GPT fails to connect.
      console.warn("Failed to connect", e);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.flexCol}>
        {/* //fish object which takes passed params object (schema) */}
        <Fish schema={response ?? null} />
        <View style={styles.flexRow}>
          <TextInput
            style={styles.upload}
            placeholder="Ask GPT…"
            value={load}
            onChangeText={setLoad}
          />
          <Button title="Send" onPress={handleUpload} />
        </View>
        {/* //status */}
        <Text>{status || "idle"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  flexCol: { flexDirection: "column", gap: 24, alignItems: "center" },
  flexRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  upload: {
    borderColor: "#D9D9D9",
    borderWidth: 2,
    padding: 12,
    borderRadius: 12,
    minWidth: 220,
  },
});

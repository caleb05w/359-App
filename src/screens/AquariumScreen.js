import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { Accelerometer } from "expo-sensors";
import Fish from "../components/Fish";
import { fetchData } from "../utils/db"; 

const { width, height } = Dimensions.get("window");

export default function AquariumScreen() {
  const [fishList, setFishList] = useState([]);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [error, setError] = useState("");

  //Helper function to clamp a value between min and max
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  //Load all saved fish from DB
  useEffect(() => {
    (async () => {
      try {
        const rows = await fetchData(); 
        const validFish = rows
          .map(r => r.fish)
          .filter(f => f !== null);

        if (validFish.length === 0) {
          setError("No saved fish found.");
        }

        setFishList(validFish);
      } catch (e) {
        console.warn("Failed to load fish:", e);
        setError("Could not load fish from DB.");
      }
    })();
  }, []);

  //Accelerometer movement
  useEffect(() => {
    Accelerometer.setUpdateInterval(50);

    const subscription = Accelerometer.addListener(({ x, y }) => {
      setOffsetX(prev => {
        const newX = prev + x * -10; // tilt right -> move right
        return clamp(newX, -width / 2, width / 2); // clamp horizontally
      });

      setOffsetY(prev => {
        const newY = prev + y * 10;
        return clamp(newY, -height / 2, height / 2); // clamp vertically
      });
    });

    return () => subscription && subscription.remove();
  }, []);


  if (fishList.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, padding: 20, textAlign: "center" }}>
          {error || "Loading fish..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Aquarium</Text>
      <Text style={styles.count}>{fishList.length} Fish</Text>
 {fishList.map((schema, i) => {
  const size = schema.size || 220;
  const stagger = i * 40;

  const rawX = (width / 2 - size / 2) + offsetX + (i % 2 === 0 ? -80 : 80);
  const rawY = (height / 2 - size / 3) + offsetY + stagger;

  const left = Math.min(Math.max(rawX, 0), width - size);
  const top = Math.min(Math.max(rawY, 0), height - size - stagger);

  return (
    <View
      key={i}
      style={{
        position: "absolute",
        left,
        top,
      }}
    >
      <Fish schema={schema} />
    </View>
  );
})}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b7defbff",
    alignItems: "center",
    paddingTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
    title: {
    fontSize: 24,
    fontWeight: "600",
  },
  count: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
  },
});

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { Accelerometer } from "expo-sensors";
import Fish from "../components/Fish";
import { fetchData } from "../utils/db";

const { width, height } = Dimensions.get("window");

// Clamp helper
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

export default function AquariumScreen() {
  const [fishList, setFishList] = useState([]);
  const [error, setError] = useState("");

  // Each fish has its own state: { x, y, angle, speed, flip }
  const [swimState, setSwimState] = useState([]);

  // Tilt offsets
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  // ---------------------------
  // Load fish from database
  // ---------------------------
  useEffect(() => {
    (async () => {
      try {
        const rows = await fetchData();
        const validFish = rows.map(r => r.fish).filter(f => f != null);

        if (validFish.length === 0) {
          setError("No saved fish found.");
        }

        setFishList(validFish);

        // Initialize movement state for each fish
        setSwimState(
          validFish.map(() => ({
            x: width / 2,
            y: height / 2,
            angle: Math.random() * Math.PI * 2,
            speed: 2.0 + Math.random() * 1.5,  // 1.2 – 2.2 px/frame
            flip: false,
          }))
        );
      } catch (e) {
        console.warn("Could not load fish:", e);
        setError("Could not load fish from DB.");
      }
    })();
  }, []);

  // ---------------------------
  // Accelerometer input
  // ---------------------------
  useEffect(() => {
    Accelerometer.setUpdateInterval(50);

    const sub = Accelerometer.addListener(({ x, y }) => {
      setTiltX(x * -5);
      setTiltY(y * 5);

    });

    return () => sub && sub.remove();
  }, []);

  // ---------------------------
  // Smooth swimming loop
  // ---------------------------
  useEffect(() => {
    if (swimState.length === 0) return;

    const interval = setInterval(() => {
      setSwimState(prev =>
        prev.map((fish, i) => {
          const size = fishList[i]?.size || 220;

          // 1) Slowly change angle toward a target
          const desiredTurn = (Math.random() - 0.5) * 0.1; // small wandering turn
          const newAngle = fish.angle + desiredTurn;

          // 2) Compute new position
          let newX = fish.x + Math.cos(newAngle) * fish.speed + tiltX;
          let newY = fish.y + Math.sin(newAngle) * fish.speed + tiltY;

          // 3) Keep inside screen
          newX = clamp(newX, 0, width - size);
          newY = clamp(newY, 0, height - size);

          // 4) Determine if it should flip
          const flip = Math.cos(newAngle) < 0;

          return {
            ...fish,
            x: newX,
            y: newY,
            angle: newAngle,
            flip,
          };
        })
      );
    }, 20); // smooth 50 FPS-ish

    return () => clearInterval(interval);
  }, [swimState, fishList, tiltX, tiltY]);

  // ---------------------------
  // Render
  // ---------------------------

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
        const motion = swimState[i];
        if (!motion) return null;

        return (
          <View
            key={i}
            style={{
              position: "absolute",
              left: motion.x,
              top: motion.y,
            }}
          >
            <Fish schema={{ ...schema, flip: motion.flip }} />
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

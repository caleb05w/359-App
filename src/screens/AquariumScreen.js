import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { Accelerometer } from "expo-sensors";
import Fish from "../components/Fish";
import { fetchData } from "../utils/db";
import { ImageBackground } from "react-native";


const { width, height } = Dimensions.get("window");

// clamp helper
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

export default function AquariumScreen() {
  const [fishList, setFishList] = useState([]);
  const [swimState, setSwimState] = useState([]);
  const [error, setError] = useState("");

  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  // Load fish from DB
  useEffect(() => {
    (async () => {
      try {
        const rows = await fetchData();
        const validFish = rows.map((r) => r.fish).filter((f) => f != null);

        if (validFish.length === 0) {
          setError("No saved fish found.");
        }

        setFishList(validFish);

        // Initial movement states
        setSwimState(
          validFish.map(() => ({
            x: width / 2,
            y: height / 2,
            angle: Math.random() * Math.PI * 2,
            speed: 2 + Math.random() * 2,
            flip: false,
          }))
        );
      } catch (err) {
        console.log(err);
        setError("Could not load fish.");
      }
    })();
  }, []);

  // Accelerometer tilt
  useEffect(() => {
    Accelerometer.setUpdateInterval(50);
    const sub = Accelerometer.addListener(({ x, y }) => {
      setTiltX(x * -5);
      setTiltY(y * 5);
    });
    return () => sub && sub.remove();
  }, []);

  // Movement + collision avoidance
  useEffect(() => {
    if (swimState.length === 0) return;

    const interval = setInterval(() => {
      setSwimState((prev) => {
        return prev.map((fish, index) => {
          const size = fishList[index]?.size || 220;
          const avoidDistance = size * 0.15; // reduce to make collision tighter

          let turnAngle = (Math.random() - 0.5) * 0.15; // wandering

          // ----------- COLLISION AVOIDANCE ------------
          prev.forEach((other, j) => {
            if (j === index) return;

            const dx = fish.x - other.x;
            const dy = fish.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < avoidDistance && dist > 0) {
              const awayAngle = Math.atan2(dy, dx);
              turnAngle += (awayAngle - fish.angle) * 0.12;
            }
          });

          const newAngle = fish.angle + turnAngle;

          // Basic forward movement
          let newX = fish.x + Math.cos(newAngle) * fish.speed + tiltX;
          let newY = fish.y + Math.sin(newAngle) * fish.speed + tiltY;

          // ★ boundary clamp
          newX = clamp(newX, 0, width - size);
          newY = clamp(newY, 0, height - size);

          return {
            ...fish,
            x: newX,
            y: newY,
            angle: newAngle,
            flip: Math.cos(newAngle) < 0,
          };
        });
      });
    }, 20);

    return () => clearInterval(interval);
  }, [fishList, tiltX, tiltY]); // ← ★ swimState REMOVED so collisions work

  if (fishList.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18 }}>{error || "Loading fish..."}</Text>
      </View>
    );
  }

  return (
    <ImageBackground
 source={require("../../assets/aquariumbg.png")}
  style={styles.container}
  resizeMode="cover"
>
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
    </ImageBackground>
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
  },
});

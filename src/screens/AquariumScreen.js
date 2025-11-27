import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Text, ImageBackground, Pressable } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Accelerometer } from "expo-sensors";
import PixelFish, { computeFishBounds } from "../components/pixelFish";
import { fetchData } from "../utils/db";
import FishInfo from "../components/FishInfo";

// bounding box of the phone to help with edge detection
const { width, height } = Dimensions.get("window");

export default function AquariumScreen() {
  const isFocused = useIsFocused(); // Refetch when screen comes into focus
  const [fishList, setFishList] = useState([]);
  const [swimState, setSwimState] = useState([]);
  const [error, setError] = useState("");
  // tilt from accelerometer (kept for any UI/debug)
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  // ref to hold latest tilt values for the interval to read
  const tiltRef = useRef({ x: 0, y: 0 });

  //returns a fish name
  const [selectedName, setSelectedName] = useState("none");
  //logs the position of the fish
  const [selectedX, setSelectedX] = useState("none");
  const [selectedY, setSelectedY] = useState("none");

  const [selectedFish, setSelectedFish] = useState(null);

  //selects and returns information on the fish
  const returnSelected = (item, x, y) => {
    setSelectedName(item.name || "Unknown");
    setSelectedX(x.toFixed(2));
    setSelectedY(y.toFixed(2));
  };

  // Load fish from DB
  useEffect(() => {
    if (!isFocused) return;

    (async () => {
      try {
        const rows = await fetchData();
        const validFish = rows;
        if (validFish.length === 0) {
          setError("No saved fish found.");
        }
        setFishList(validFish);
        const initialSwimState = validFish.map((item) => {
          const scale = 0.3 + Math.random() * 0.4;
          const bounds = computeFishBounds(item.schema);
          const fishW = bounds.width * scale;
          const fishH = bounds.height * scale;
          const initialSpeed = 1 + Math.random() * 3;
          const accel = 0.02;
          const maxSpeed = 3 + Math.random() * 5;
          return {
            ...item,
            width: fishW,
            height: fishH,
            scale: scale,
            x: Math.random() * (width - fishW),
            y: Math.random() * (height - fishH),
            vx: initialSpeed,
            vy: initialSpeed,
            angle: Math.random() * Math.PI * 2,
            accel: accel,
            flip: initialSpeed < 0,
            maxSpeed: maxSpeed,
            speed: initialSpeed,
          };
        });
        setSwimState(initialSwimState);

        initialSwimState.forEach((item) => {
          console.log(
            item.name,
            "\nfish width:", item.width,
            "\nfish height:", item.height,
            "\nfish x:", item.x,
            "\nfish y:", item.y,
            "\nfish accel:", item.accel,
            "\n--------------------------"
          );
        });
      } catch (err) {
        console.log(err);
        setError("Could not load fish.");
      }
    })();
  }, [isFocused]);

  // Accelerometer tilt
  useEffect(() => {
    Accelerometer.setUpdateInterval(50);
    const sub = Accelerometer.addListener(({ x, y }) => {
      // update state (optional, useful for UI/debug) and ref (used by interval)
      setTiltX(x * -1);
      setTiltY(y * 1);
      tiltRef.current = { x: x * -1, y: y * 1 };
    });
    return () => sub && sub.remove();
  }, []);

  // Movement
  useEffect(() => {
    if (swimState.length === 0) return;

    const interval = setInterval(() => {
      setSwimState(prev => {
        if (!prev || prev.length === 0) return prev;

        const fishWithNewPositions = prev.map((fish, index) => {
          const fishW = fish.width ?? 100;
          const fishH = fish.height ?? 100;

          let {
            x,
            y,
            vx = 1,
            vy = 0,
            speed = 2,
            accel = 0.02,
            maxSpeed = 5,
            scale = 1,
          } = fish;

          speed = Math.min(speed + accel, maxSpeed);

          if (Math.random() < 0.05) {
            const turnAngle = (Math.random() - 0.5) * Math.PI * 0.5;
            const currentAngle = Math.atan2(vy, vx);
            const newAngle = currentAngle + turnAngle;
            vx = Math.cos(newAngle);
            vy = Math.sin(newAngle);
          }

          // --- READ LATEST TILT AND APPLY IT BEFORE COMPUTING DIRECTION ---
          // Read from ref so interval sees latest accelerometer values
          const currentTilt = tiltRef.current || { x: 0, y: 0 };
          const tiltStrength = 0.4; // tune this
          vx += currentTilt.x * tiltStrength;
          vy += currentTilt.y * tiltStrength;

          // compute normalized direction based on updated velocities
          const len = Math.hypot(vx, vy) || 1;
          const dirX = vx / len;
          const dirY = vy / len;

          // new position based on direction and speed
          let newX = x + dirX * speed;
          let newY = y + dirY * speed;

          // wall detection
          let hitX = false;
          let hitY = false;

          if (newX < 0) {
            newX = 0;
            hitX = true;
          } else if (newX > width - fishW) {
            newX = width - fishW;
            hitX = true;
          }

          const bottomBuffer = 140;
          if (newY < 0) {
            newY = 0;
            hitY = true;
          } else if (newY > height - fishH - bottomBuffer) {
            newY = height - fishH - bottomBuffer;
            hitY = true;
          }

          if (hitX) vx = -vx;
          if (hitY) vy = -vy;

          return {
            ...fish,
            x: newX,
            y: newY,
            vx,
            vy,
            speed,
            accel,
            maxSpeed,
            flip: vx < 0,
            scale,
            fishW,
            fishH,
            index,
          };
        });

        // collision detection and separation
        return fishWithNewPositions.map((fish, i) => {
          let newX = fish.x;
          let newY = fish.y;
          let vx = fish.vx;
          let vy = fish.vy;
          let speed = fish.speed;
          const currentW = fish.fishW;
          const currentH = fish.fishH;

          for (let j = 0; j < fishWithNewPositions.length; j++) {
            if (i === j) continue;
            const otherFish = fishWithNewPositions[j];
            const otherW = otherFish.fishW;
            const otherH = otherFish.fishH;
            const otherX = otherFish.x;
            const otherY = otherFish.y;

            const fishLeft = newX;
            const fishRight = newX + currentW;
            const fishTop = newY;
            const fishBottom = newY + currentH;

            const otherLeft = otherX;
            const otherRight = otherX + otherW;
            const otherTop = otherY;
            const otherBottom = otherY + otherH;

            if (
              fishLeft < otherRight &&
              fishRight > otherLeft &&
              fishTop < otherBottom &&
              fishBottom > otherTop
            ) {
              const dx = (fishLeft + currentW / 2) - (otherLeft + otherW / 2);
              const dy = (fishTop + currentH / 2) - (otherTop + otherH / 2);
              const distance = Math.hypot(dx, dy) || 1;

              const pushDistance = 5;
              newX += (dx / distance) * pushDistance;
              newY += (dy / distance) * pushDistance;

              vx = -vx;
              vy = -vy;
              speed = speed * 0.5;
            }
          }

          return {
            ...fish,
            x: newX,
            y: newY,
            vx,
            vy,
            speed,
            flip: vx < 0,
            fishW: undefined,
            fishH: undefined,
            index: undefined,
          };
        });
      });
    }, 20);

    return () => clearInterval(interval);
    // keep dependencies minimal so interval isn't recreated frequently
  }, [swimState.length, width, height]);

  if (fishList.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18 }}>{error || "Loading fish..."}</Text>
      </View>
    );
  }

  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../assets/aquariumbg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>Your Aquarium</Text>
      <Text>{selectedName}</Text>

      {selectedFish && (
        <FishInfo
          fish={selectedFish}
          onClose={() => setSelectedFish(null)}
        />
      )}

      {fishList.map((item, i) => {
        const newSchema = item.schema;
        const motion = swimState[i];
        if (!motion) return;

        return (
          <Pressable
            key={i}
            style={{
              position: "absolute",
              left: motion.x,
              top: motion.y,
              transform: motion.flip ? [{ scaleX: -1 }] : []
            }}
            onPress={() => {
              setSelectedFish(item);
            }}
          >
            <PixelFish schema={newSchema} flip={false} scale={motion.scale ?? 1} />
          </Pressable>
        );
      })}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#b7defbff",
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

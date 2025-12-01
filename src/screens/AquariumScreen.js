//Screen where all the fish are rendered, and can "sort of" swim. It's a more interactive list, and is kinda cool and fun.
// Alot of the code here was referenced from 265 -- Eric, since it uses alot of the same principles for movement and collison that they teach for OOP. 
//Obviously, adapted for React Native, whcih features server side rendering, which complicates things.

import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Text, ImageBackground, Pressable } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Accelerometer } from "expo-sensors";
import PixelFish, { computeFishBounds } from "../components/pixelFish";
import { fetchData } from "../utils/db";
import FishInfo from "../components/FishInfo";
import globalStyles from "../globalStyles";

// bounding box of the phone to help with edge detection
const { width, height } = Dimensions.get("window");

export default function AquariumScreen() {
  const isFocused = useIsFocused(); // Refetch when screen comes into focus
  const [fishList, setFishList] = useState([]);   //list of the fish rendered from fetch data
  const [swimState, setSwimState] = useState([]);   //renders fish movement and appended inot each fish
  const [error, setError] = useState("");
  // tilt from accelerometer (kept for any UI/debug)
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  // ref to hold latest tilt values for the interval to read
  const tiltRef = useRef({ x: 0, y: 0 });
  const [selectedFish, setSelectedFish] = useState(null);

  // Load fish from DB
  useEffect(() => {
    if (!isFocused) return;

    (async () => {
      try {
        //maps rows to see if any items are null, guardrail to prevent null fish from being rendered.
        const rows = await fetchData();
        const validFish = rows;
        //error state if there are no fish
        if (validFish.length === 0) {
          setError("No saved fish found.");
        }
        //if there are fish, set it in the aquarium.
        setFishList(validFish);
        const initialSwimState = validFish.map((item) => {
          const scale = 0.3 + Math.random() * 0.4; // Random scale between 0.2 and 0.5 so they can vary in size/
          const bounds = computeFishBounds(item.schema);
          // Scale the bounding box dimensions
          const fishW = bounds.width * scale;
          const fishH = bounds.height * scale;
          const initialSpeed = 1 + Math.random() * 3;    // starts the fish at a random speed between 1 and 4
          const accel = 0.02;       //acceleration for the fish, referenced from IAT267.
          const maxSpeed = 3 + Math.random() * 5; //max speed for fish so fish dont become unreasonably fast.

          // this loads and appends parametesr for movement into the fish from when we set it above.
          return {
            ...item,
            width: fishW,
            height: fishH,
            scale: scale,
            x: Math.random() * (width - fishW), //fish starts at random place on the screen
            y: Math.random() * (height - fishH), //fish starts at random place on the screen
            vx: initialSpeed,
            vy: initialSpeed,
            angle: Math.random() * Math.PI * 2,
            accel: accel,
            flip: initialSpeed < 0, //flips the fish if they turn directions.
            maxSpeed: maxSpeed,
            speed: initialSpeed,
          };
        });
        //updates the fish movmement parameter
        setSwimState(initialSwimState);

        //jjust helped me keep track of fish during build
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
    //guard rail, if there is no swim state from fish, kill this function.
    if (swimState.length === 0) return;

    //janky animation to get the fish to move
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

          // READ LATEST TILT AND APPLY IT BEFORE COMPUTING DIRECTION 
          // Read from ref so interval sees latest accelerometer values
          const currentTilt = tiltRef.current || { x: 0, y: 0 };
          const tiltStrength = 0.4; // tune this
          vx += currentTilt.x * tiltStrength;
          vy += currentTilt.y * tiltStrength;

          //Move fish in directions, includeding diagonal
          //had GPT help me write this instead of PVector.
          const len = Math.hypot(vx, vy) || 1;
          const dirX = vx / len;
          const dirY = vy / len;

          //new X position + y position, determined by direction and multipled by speed.
          let newX = x + dirX * speed;
          let newY = y + dirY * speed;

          // wall detection boolean 
          let hitX = false;
          let hitY = false;

          // X walls
          if (newX < 0) {
            newX = 0;
            hitX = true;
          } else if (newX > width - fishW) {
            newX = width - fishW;
            hitX = true;
          }

          // Y walls
          const bottomBuffer = 80; //buffer for the navbar, so fish don't float behind it, but instead "bounce" off it.
          if (newY < 0) {
            newY = 0;
            hitY = true;
          } else if (newY > height - fishH - bottomBuffer) {
            newY = height - fishH - bottomBuffer;
            hitY = true;
          }

          //go the negative direction if a hit is detected.
          if (hitX) vx = -vx;
          if (hitY) vy = -vy;

          //return the numbers so that the movement is updated
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
            index, //stored in index for collision det4ection
          };
        });

        //nested array loop to detect colliison detection, inspired by 267 code from eric
        return fishWithNewPositions.map((fish, i) => {
          //init fish values
          let newX = fish.x;
          let newY = fish.y;
          let vx = fish.vx;
          let vy = fish.vy;
          let speed = fish.speed;
          const currentW = fish.fishW;
          const currentH = fish.fishH;

          // checks fish colliison with others.
          for (let j = 0; j < fishWithNewPositions.length; j++) {
            if (i === j) continue;; //doesnt collide with itself
            const otherFish = fishWithNewPositions[j];
            const otherW = otherFish.fishW;
            const otherH = otherFish.fishH;
            const otherX = otherFish.x;
            const otherY = otherFish.y;

            //bounding box for the fish. Detects when or if something infringes on it.
            const fishLeft = newX;
            const fishRight = newX + currentW;
            const fishTop = newY;
            const fishBottom = newY + currentH;

            const otherLeft = otherX;
            const otherRight = otherX + otherW;
            const otherTop = otherY;
            const otherBottom = otherY + otherH;

            //collision code, checks if the current bounding box overlaps.
            if (
              fishLeft < otherRight &&
              fishRight > otherLeft &&
              fishTop < otherBottom &&
              fishBottom > otherTop
            ) {

              // detects fish colliding, and finds distance to push them apart, otherwise they get stuck in each other
              const dx = (fishLeft + currentW / 2) - (otherLeft + otherW / 2);
              const dy = (fishTop + currentH / 2) - (otherTop + otherH / 2);
              const distance = Math.hypot(dx, dy) || 1;

              // pushes the fish apart, which is importnat otherwise fish can get stuck in each other.
              const pushDistance = 5;
              newX += (dx / distance) * pushDistance;
              newY += (dy / distance) * pushDistance;

              // inverses velocity (looks like they turn away )
              vx = -vx;
              vy = -vy;
              // slow down speed when colliding -- adds epic physics lol
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
            // doesnt return temporary variables
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

  //error handler if there are no fish.
  if (fishList.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18 }}>{error || "Loading fish..."}</Text>
      </View>
    );
  }

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>

      {/* The actual aquarium screen */}
      <ImageBackground
        source={require("../../assets/aquariumbg.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <Text style={globalStyles.h1}>AQUARIUM</Text>
        {/* Swimming Fish */}
        {fishList.map((item, i) => {
          const newSchema = item.schema;
          const motion = swimState[i];
          if (!motion) return null;

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
              <PixelFish
                schema={newSchema}
                flip={false}
                scale={motion.scale ?? 1}
              />
            </Pressable>
          );
        })}
      </ImageBackground>


      {selectedFish && (
        <FishInfo
          fish={selectedFish}
          onClose={() => setSelectedFish(null)}
        />
      )}
    </View>
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

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Accelerometer } from "expo-sensors";
import PixelFish, { computeFishBounds } from "../components/pixelFish";
import { fetchData } from "../utils/db";
import { ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";



//bounding box of the phone to help with edge detection
const { width, height } = Dimensions.get("window");

export default function AquariumScreen() {
  // const { refresh, setRefresh } = useRefresh(); // doesnt work, fix later lol
  const isFocused = useIsFocused(); // Refetch when screen comes into focus
  //list of the fish rendered from fetch data
  const [fishList, setFishList] = useState([]);
  //renders fish movement and appended inot each fish
  const [swimState, setSwimState] = useState([]);
  const [error, setError] = useState("");
  //tilt from accelerometer
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  //returns a fish name
  const [selectedName, setSelectedName] = useState("none");
  //logs the position of the fish
  const [selectedX, setSelectedX] = useState("none");
  const [selectedY, setSelectedY] = useState("none");

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
        //pulls rows from data
        const rows = await fetchData();
        //maps rows to see if any items are null, guardrail to prevent null fish from being rendered.
        const validFish = rows;
        //error state if there are no fish
        if (validFish.length === 0) {
          setError("No saved fish found.");
        }
        //if there are fish, set it in the aquarium.
        setFishList(validFish);
        const initialSwimState = validFish.map((item) => {
          // Random scale between 0.2 and 0.5
          const scale = 0.3 + Math.random() * 0.4;
          const bounds = computeFishBounds(item.schema);
          // Scale the bounding box dimensions
          const fishW = bounds.width * scale;
          const fishH = bounds.height * scale;

          // starts the fish at a random speed between 1 and 4
          const initialSpeed = 1 + Math.random() * 3;
          //acceleration for the fish, lol thanks 167.
          const accel = 0.02;
          //  gives the fihs a random max speed between 3 and 8. 
          const maxSpeed = 3 + Math.random() * 5;
          //loads and appends parametesr for movement into the fish
          return {
            ...item,
            width: fishW, //width of fish
            height: fishH,//height of fish
            scale: scale,
            // random starting position within screen
            x: Math.random() * (width - fishW), //fish starts at random place on the screen
            y: Math.random() * (height - fishH), //fish stats at random height on the screen
            vx: initialSpeed, //fish x velocity
            vy: initialSpeed, //y veloctuy
            angle: Math.random() * Math.PI * 2,
            accel: accel, //acceleration add onto the velocity
            flip: initialSpeed < 0, // Initial flip based on direction
            maxSpeed: maxSpeed, //max speed to prevent fish from going crazy
            speed: initialSpeed //acctual speed addition for fish
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
      setTiltX(x * -1);
      setTiltY(y * 1);
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

        // Debug: log that movement is happening
        // console.log('Moving fish, count:', prev.length);

        // First pass: calculate new positions for all fish
        const fishWithNewPositions = prev.map((fish, index) => {
          const fishW = fish.width ?? 100;
          const fishH = fish.height ?? 100;

          //initial movement values of fish.
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

          //acceleration so the movement doesnt look boring and lienar
          speed = Math.min(speed + accel, maxSpeed);

          //let fish randomly turn to simulate real movement
          if (Math.random() < 0.05) {
            //lol had GPT help me with math here because I suck at it.
            const turnAngle = (Math.random() - 0.5) * Math.PI * 0.5;
            const currentAngle = Math.atan2(vy, vx);
            const newAngle = currentAngle + turnAngle;
            vx = Math.cos(newAngle)
            vy = Math.sin(newAngle)
          }

          //Move fish in directions, includeding diagonal
          //had GPT help me write this instead of PVector.
          const len = Math.hypot(vx, vy) || 1;
          const dirX = vx / len;
          const dirY = vy / len;

          //new X position + y position, determined by direction and multipled by speed.
          let newX = x + dirX * speed;
          let newY = y + dirY * speed;

          //wall detection boolean
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
          const bottomBuffer = 140; //to prevent them from disappearing under the tab bar
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
            index, // Store index for collision detection
          };
        });

        //nested array loop to detect colliison detection, inspired b6 167 code from eric
        return fishWithNewPositions.map((fish, i) => {
          //init fish values
          let newX = fish.x;
          let newY = fish.y;
          let vx = fish.vx;
          let vy = fish.vy;
          let speed = fish.speed;
          const currentW = fish.fishW;
          const currentH = fish.fishH;
          let hasCollision = false;

          // checks fish colliison with others.
          for (let j = 0; j < fishWithNewPositions.length; j++) {
            if (i === j) continue; //doesnt collide with itself

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
              //sets collidiing true
              hasCollision = true;

              // detects fish colliding, and finds distance to push them apart
              const dx = (fishLeft + currentW / 2) - (otherLeft + otherW / 2);
              const dy = (fishTop + currentH / 2) - (otherTop + otherH / 2);
              const distance = Math.hypot(dx, dy) || 1;

              // pushes the fish apart, which is importnat otherwise fish can get stuck in each other.
              const pushDistance = 5;
              newX += (dx / distance) * pushDistance;
              newY += (dy / distance) * pushDistance;

              // inverses velocity
              vx = -vx;
              vy = -vy;

              speed = speed * 0.5;
              // slow down speed when colloding -- adds epic physics lol


            }
          }

          // returns fish
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
    <ImageBackground
      source={require("../../assets/aquariumbg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>Your Aquarium</Text>
      <Text>{selectedName}</Text>
      {/* renders fish */}
      {fishList.map((item, i) => {
        const newSchema = item.schema
        const motion = swimState[i];
        if (!motion) return;

        return (
          //lets you press on a fish to learn more about it.
          <Pressable
            key={i}
            style={{
              position: "absolute",
              left: motion.x,
              top: motion.y,
              //handles flip
              transform: motion.flip ? [{ scaleX: -1 }] : []
            }}
            onPress={() => {
              returnSelected(item, motion.x, motion.y);
              // console.log("FISH TAPPED!");
              // navigation.navigate("FishDetailsScreen", { fish: newSchema });
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



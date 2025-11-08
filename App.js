import { createNativeStackNavigator } from "@react-navigation/native-stack";
//navbar from navbar tutorial https://www.youtube.com/watch?v=AnjyzruZ36E&t=25s
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from "expo-sqlite";
import { initDb } from "./src/utils/db.js";

//screens
import HomeScreen from "./src/screens/HomeScreen.js";
import TestScreen from "./src/screens/TestScreen.js";
import LoginScreen from "./src/screens/LoginScreen.js";
import CameraScreen from "./src/screens/CameraScreen.js";
import FishIndexScreen from "./src/screens/FishIndex.js";
import CameraResultScreen from "./src/screens/CameraResult.js";
import SignUpScreen from "./src/screens/SignUpScreen.js";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// //Create Flow
// function CreateStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{ headerShown: false }} //hide the header again
//       />
//     </Stack.Navigator>
//   );
// }

function UploadStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }} //hide the header again
      />
      <Stack.Screen
        name="Results"
        component={CameraResultScreen}
        options={{ headerShown: false }} //hide the header again
      />
    </Stack.Navigator>
  );
}

function IndexStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Index"
        component={FishIndexScreen}
        options={{ headerShown: false }} //hide the header again
      />
    </Stack.Navigator>
  );
}

function TestStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Test"
        component={TestScreen}
        options={{ headerShown: false }} //hide the header again
      />
    </Stack.Navigator>
  );
}

//Login Flow

function LoginStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SQLiteProvider databaseName="test.db" onInit={initDb}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Tab.Navigator>
            <Tab.Screen name="Login" component={LoginStack}></Tab.Screen>
            <Tab.Screen name="Upload" component={UploadStack}></Tab.Screen>
            <Tab.Screen name="Index" component={IndexStack}></Tab.Screen>
            <Tab.Screen name="Test" component={TestStack}></Tab.Screen>
          </Tab.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </SQLiteProvider>
  );
}

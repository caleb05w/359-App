import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//navbar from navbar tutorial https://www.youtube.com/watch?v=AnjyzruZ36E&t=25s
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from "expo-sqlite";
import { initDb } from "./src/utils/db.js";

// screens
import HomeScreen from "./src/screens/HomeScreen.js";
import WelcomeScreen from "./src/screens/WelcomeScreen.js";
import TestScreen from "./src/screens/TestScreen.js";
import LoginScreen from "./src/screens/LoginScreen.js";
import CameraScreen from "./src/screens/CameraScreen.js";
import FishIndexScreen from "./src/screens/FishIndex.js";
import CameraResultScreen from "./src/screens/CameraResult.js";
import SignUpScreen from "./src/screens/SignUpScreen.js";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Upload stack
function UploadStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Results" component={CameraResultScreen} />
    </Stack.Navigator>
  );
}

// Index stack
function IndexStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Index" component={FishIndexScreen} />
    </Stack.Navigator>
  );
}

// Test stack
function TestStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Test" component={TestScreen} />
    </Stack.Navigator>
  );
}

// Bottom tabs (main app)
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Upload" component={UploadStack} />
      <Tab.Screen name="Index" component={IndexStack} />
      <Tab.Screen name="Test" component={TestStack} />
    </Tab.Navigator>
  );
}

// Main App Navigation
export default function App() {
  return (
    <SQLiteProvider databaseName="test.db" onInit={initDb}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </SQLiteProvider>
  );
}

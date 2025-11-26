import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//navbar from navbar tutorial https://www.youtube.com/watch?v=AnjyzruZ36E&t=25s
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";



// screens
import WelcomeScreen from "./src/screens/WelcomeScreen.js";
import LoginScreen from "./src/screens/LoginScreen.js";
import CameraScreen from "./src/screens/CameraScreen.js";
import FishIndexScreen from "./src/screens/FishIndex.js";
import CameraResultScreen from "./src/screens/CameraResult.js";
import SignUpScreen from "./src/screens/SignUpScreen.js";
import FishScreen from "./src/screens/Upload.js";
import AquariumScreen from "./src/screens/AquariumScreen.js";


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
// function FishStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Fish" component={FishScreen} />
//     </Stack.Navigator>
//   );
// }

// Bottom tabs (main app)
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Upload" component={UploadStack} />
      <Tab.Screen name="Index" component={IndexStack} />
      <Tab.Screen name="Aquarium" component={AquariumScreen} />
    </Tab.Navigator>
  );
}

// Main App Navigation
export default function App() {
  return (
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
  );
}

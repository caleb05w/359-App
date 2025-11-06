import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./src/screens/HomeScreen.js";
import TestScreen from "./src/screens/TestScreen.js";
import LoginScreen from "./src/screens/LoginScreen.js";
import CameraScreen from "./src/screens/CameraScreen.js";
import Navbar from "./src/components/Navbar.js";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            header: (props) => <Navbar {...props} />, // ✅ gives {navigation, route}
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Home Screen" }}
          />

          <Stack.Screen
            name="Test"
            component={TestScreen}
            options={{ title: "Test Screen" }}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login Screen" }}
          />

          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ title: "Camera Screen" }}
          />

          {/* <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: "Welcome Screen" }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

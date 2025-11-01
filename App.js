import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { NavigationContainer } from "@react-native/native";
import { NavigationContainer } from "@react-navigation/native";

import HomeScreen from "./src/screens/HomeScreen.js";
import WelcomeScreen from "./src/screens/WelcomeScreen.js";


const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
        <Stack.Navigator intialRouteName="Home">
          <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home Screen" }}
          />

        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: "Welcome Screen" }}
          />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

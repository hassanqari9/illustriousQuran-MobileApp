import { ActivityIndicator, StyleSheet, View } from "react-native";
import Home from "./screens/homeScreen";
import Bookmark from "./screens/Bookmark"; // Import both screens
import Verses from "./screens/verses";
import Profile from "./screens/profile";
import Settings from "./screens/Settings";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import PdfViewer from "./screens/PdfViewer";
import { useContext, useEffect, useState } from "react";
import authSlice, { addUserToken } from "./store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function BottomTabSlide() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "white",
        },
        headerTitleStyle: { color: "#3B1A74", fontStyle: 'italic' },
        tabBarActiveTintColor: "#3B1A74", // Purple for the active icon
        tabBarInactiveTintColor: "#3B1A74", // Purple for inactive icons (for consistency)
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: "white",
          height: 85,
          paddingBottom: 1,
          paddingTop: 5,
          overflow: 'hidden',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = {
            Home: "home-outline",
            PdfViewer: "document-outline",
            Profile: "person-outline",
            Settings: "settings-outline",
          }[route.name];

          return (
            <View
              style={{
                width: focused ? 60 : 40, // Larger for active, smaller for inactive
                height: focused ? 60 : 40,
                borderRadius: 30, // Ensure circular shape
                backgroundColor: focused ? "#3B1A74" : "#F8F5FC", // Purple for active, grey for inactive
                justifyContent: "center",
                alignItems: "center",
                marginTop: 1 
                // position: focused ? "absolute" : "relative", 
                // top: focused ? -5 : 0,
                // zIndex: focused ? 1 : 0, 
              }}
            >
              <Ionicons
                name={iconName}
                size={size}
                color={focused ? "white" : "#3B1A74"} // Grey for active icon, purple for inactive
              />
            </View>
          );
        },
      })}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          title: "illustrious Quran",
          tabBarLabel: '',
        }}
      />
      <BottomTab.Screen
        name="PdfViewer"
        component={PdfViewer}
        options={{
          headerShown: true,
          title: "The Holy Quran",
          tabBarLabel: "",
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          title: "Profile",
          tabBarLabel: "",
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
          title: "Settings",
          tabBarLabel: "",
        }}
      />
    </BottomTab.Navigator>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={BottomTabSlide}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Verses"
            component={Verses}
            options={{
              title: "Verses",
              headerTitleStyle: { color: "#3B1A74" },
              headerStyle: { backgroundColor: "white" },
            }}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
      </NavigationContainer>
  )
}


function Root() {
  const dispatch = useDispatch();
  const [isTryingLogin, setIsTryingLogin] = useState(true)

  useEffect(() => {
    async function fetchToken() {
      const storedUser = await AsyncStorage.getItem('user')
      // console.log(storedUser);
      const storedToken = await AsyncStorage.getItem('token')
      if (storedToken) {
        dispatch(addUserToken({ token: storedToken, user: JSON.parse(storedUser) }));
      }
      setIsTryingLogin(false)
    }
    fetchToken()
  }, [])
  // if (isTryingLogin) {
  //   return <ActivityIndicator style={{flex: 1}}/>
  // }
  return <Navigation />
}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7ded0",
    alignItems: "center",
    justifyContent: "center",
  },
});

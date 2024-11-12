import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageBackground,
  Alert,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import HomeScreen from "../components/HomeScreen";
import ProductScreen from "../components/ProductScreen";
import ProjectsScreen from "../components/ProjectsScreen";
import Projects from "../components/ProjectProjectScreen";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../Services/UserContext";
import bgg from "../../assets/bg33.png";
import AppointmentScreen from "../components/AppointmentScreen";
import ProjectProjectScreen from "../components/ProjectProjectScreen";

const Tab = createBottomTabNavigator();

const Home = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const translateX = useState(new Animated.Value(300))[0];
  const navigation = useNavigation();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you really want to logout?",
      [
        {
          text: "No",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setUser(null);
            navigation.navigate("Login");
          },
        },
      ],
      { cancelable: true } // Allows the alert to be dismissed by tapping outside of it
    );
  };

  const toggleDrawer = () => {
    if (drawerVisible) {
      // Close the drawer
      Animated.timing(translateX, {
        toValue: 300, // Off-screen
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerVisible(false));
    } else {
      // Open the drawer
      setDrawerVisible(true);
      Animated.timing(translateX, {
        toValue: 0, // On-screen
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleOutsidePress = () => {
    if (drawerVisible) {
      toggleDrawer(); // Close the drawer if it's open
    }
  };

  return (
    <View className="flex-1">
      {/* Hamburger Button */}
      <TouchableOpacity
        className="absolute top-9 right-4 z-10"
        onPress={toggleDrawer}
      >
        <FontAwesome name="bars" size={32} color="black" className="shadow" />
      </TouchableOpacity>

      {/* Tab Navigator */}
      <Tab.Navigator
        className=""
        screenOptions={{
          tabBarStyle: { backgroundColor: "white", height: 60 },
          headerShown: false,
          tabBarLabelStyle: { fontSize: 12, marginBottom: 8 },
          tabBarIconStyle: { marginTop: 8 },
        }}
      >
        <Tab.Screen
          name="Home1"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Appoint"
          component={AppointmentScreen}
          options={{
            tabBarLabel: "Appointments",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Products"
          component={ProductScreen}
          options={{
            tabBarLabel: "Products",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="shopping-cart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Projects"
          component={ProjectsScreen}
          options={{
            tabBarLabel: "Gallery",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="image" size={size} color={color} />
            ),
          }}
        />
        {/* <Tab.Screen
          name="Projectss"
          component={Projects}
          options={{
            tabBarLabel: "Projects",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="tasks" size={size} color={color} />
            ),
          }}
        /> */}
      </Tab.Navigator>

      {/* Background Overlay */}
      {drawerVisible && (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View
            style={StyleSheet.absoluteFill}
            className="bg-black opacity-50"
          />
        </TouchableWithoutFeedback>
      )}

      {/* Custom Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <ImageBackground
          source={bgg}
          style={{ flex: 1, padding: 16 }}
          imageStyle={{ opacity: 0.8 }}
        >
          <View className="flex-1 p-6 pt-24">
            <TouchableOpacity
              className="flex-row justify-end items-center mb-8"
              onPress={() => navigation.navigate("Profile")} // Navigate to Profile screen
            >
              <Text className="text-xl font-semibold text-right text-gray-800 mr-2">
                Profile
              </Text>
              <FontAwesome
                name="user"
                size={26}
                color="#4B5563"
                className="mr-4"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row justify-end items-center mb-8"
              onPress={() => navigation.navigate("WebInfo")}
            >
              <Text className="text-xl font-semibold text-right text-gray-800 mr-2">
                Web info
              </Text>
              <FontAwesome
                name="globe"
                size={26}
                color="#4B5563"
                className="mr-4"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row justify-end items-center mb-8"
              onPress={() => navigation.navigate("Feedbacks")}
            >
              <Text className="text-xl font-semibold text-right text-gray-800 mr-2">
                Feedbacks
              </Text>
              <FontAwesome
                name="comments"
                size={26}
                color="#4B5563"
                className="mr-4"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row justify-end items-center mb-8"
              onPress={handleLogout} // Handle logout functionality
            >
              <FontAwesome
                name="sign-out"
                size={26}
                color="#EF4444"
                className="mr-4"
              />
              <Text className="text-xl font-semibold text-right text-red-600 mr-2">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 230, // Width of the drawer
    backgroundColor: "white",
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default Home;

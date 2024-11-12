import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import Contact from "../components/Contact";
import About from "../components/About";

export default function WebInfo() {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={require("../../assets/2.png")}
      style={{ flex: 1, padding: 16 }}
      imageStyle={{ opacity: 0.8 }}
    >
      <View className="flex-1 mt-10 p-5 justify-center">
        <TouchableOpacity
          onPress={() => navigation.navigate("Home1")}
          className="absolute top-5 left-5 z-10"
        >
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <ScrollView>
          <Contact />
          <About />
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

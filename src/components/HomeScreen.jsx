import React from "react";
import { View, Image, Text, ImageBackground } from "react-native";
import backgroundImage from "../../assets/bghome.png";
import Services from "./Services";
import Appointments from "./Appointments";
import Statistics from "./Statistics";
import { ScrollView } from "react-native-gesture-handler";

const HomeScreen = () => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1, padding: 16 }}
      imageStyle={{ opacity: 0.8 }}
    >
      <ScrollView>
        <View className="relative w-full h-40 mb-4 mt-16 rounded-xl justify-center items-center">
          {/* Background Image */}
          <Image
            source={require("../../assets/Best-Glass-Window.jpg")}
            className="absolute w-full h-full rounded-xl"
            resizeMode="cover"
          />

          {/* Centered Logo Image */}
          <Image
            source={require("../../assets/logo2.png")}
            className="w-36 h-20"
            resizeMode="contain"
          />
        </View>
        <View className="flex">
          <Services />
          <View className="border-b my-5" />
          <Statistics />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default HomeScreen;

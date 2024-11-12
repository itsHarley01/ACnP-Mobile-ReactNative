import React, { useEffect } from "react";
import { View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Ensure your image is in the correct path, e.g., ./assets/logo.png
const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Navigate to Login after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2000);

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 justify-center items-center  bg-white">
      {/* Display the image instead of text */}
      <Image
        source={require("../../assets/logo2.png")}
        className="w-48 h-48"
        resizeMode="contain"
      />
    </View>
  );
};

export default Splash;

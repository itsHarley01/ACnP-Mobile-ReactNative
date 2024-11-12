import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import the navigation hook
import backgroundImage from "../../assets/bghome.png"; // Import the background image

const ProductScreen = () => {
  const navigation = useNavigation(); // Initialize navigation hook

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1, padding: 16 }}
      imageStyle={{ opacity: 0.8 }} // Optional: Adjust the opacity of the background image
    >
      <View className="flex-1 p-4">
        {/* Hero Image */}
        <View className="relative w-full h-40 mb-4 mt-10 rounded-xl justify-center items-center">
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

        {/* Title */}
        <Text className="text-2xl font-bold  mb-6">Product</Text>

        {/* Image Buttons Grid */}
        <View className="flex-row flex-wrap justify-between">
          {/* Glass Button */}
          <TouchableOpacity
            className="w-[48%] h-40 mb-4" // Set height here to make it bigger
            onPress={() => navigation.navigate("Glass")} // Navigate to the Glass screen
          >
            <View className="bg-gray-200 rounded-xl overflow-hidden border shadow-lg h-full">
              {/* Background Image */}
              <Image
                source={require("../../assets/glass3.jpg")}
                className="w-full h-full" // Make the image cover the entire view
                resizeMode="cover"
              />

              {/* Overlay Text */}
              <View className="absolute bottom-0 left-0 right-0 bg-opacity-50">
                <Text className="text-center text-lg font-bold text-black p-2">
                  Glass
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Frame Button */}
          <TouchableOpacity
            className="w-[48%] h-40 mb-4" // Set height here to make it bigger
            onPress={() => navigation.navigate("Frame")}
          >
            <View className="bg-white rounded-xl overflow-hidden shadow-lg h-full border">
              {/* Background Image */}
              <Image
                source={require("../../assets/3d-rendering.png")} // Replace with Frame image URL
                className="w-full h-full" // Make the image cover the entire view
                resizeMode="contain"
              />
              {/* Overlay Text */}
              <View className="absolute bottom-0 left-0 right-0 bg-opacity-50">
                <Text
                  className="text-center text-lg font-bold text-black p-2"
                  style={{
                    textShadowColor: "white",
                    textShadowOffset: { width: 1, height: -2 },
                    textShadowRadius: 1,
                  }}
                >
                  Frame
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Complete Unit Button */}
          <TouchableOpacity
            className="w-[48%] h-40 mb-4" // Set height here to make it bigger
            onPress={() => navigation.navigate("CompleteUnit")}
          >
            <View className="bg-gray-200 rounded-xl overflow-hidden border shadow-lg h-full">
              {/* Background Image */}
              <Image
                source={require("../../assets/cunit.png")}
                className="w-full h-full" // Make the image cover the entire view
                resizeMode="cover"
              />
              {/* Overlay Text */}
              <View className="absolute bottom-0 left-0 right-0 bg-opacity-50">
                <Text className="text-center text-lg font-bold text-black p-2">
                  Others
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ProductScreen;

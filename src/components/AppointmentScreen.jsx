import { View, Image, Text, ImageBackground } from "react-native";
import backgroundImage from "../../assets/bghome.png";
import Appointments from "./Appointments";

const AppointmentScreen = () => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1, padding: 16 }}
      imageStyle={{ opacity: 0.8 }}
    >
      <View className="flex">
        <View className="relative w-full h-40 mb-4 mt-16 rounded-xl justify-center items-center">
          <Image
            source={require("../../assets/closeup-aluminium-.png")}
            className="absolute w-full h-full rounded-xl"
            resizeMode="cover"
          />
          <Image
            source={require("../../assets/logo2.png")}
            className="w-36 h-20"
            resizeMode="contain"
          />
        </View>

        <Text className="text-2xl font-bold text-gray-700 mt-4">
          Appointments
        </Text>
        <Appointments />
      </View>
    </ImageBackground>
  );
};

export default AppointmentScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator, // Import for the loading spinner
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../Services/UserContext"; // Import the useUser hook
import backgroundImage from "../../assets/2.png"; // Adjust the path as necessary
import { loginUser } from "../Services/Api"; // Import the loginUser function

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigation = useNavigation();
  const { setUser } = useUser(); // Get setUser from UserContext

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return emailPattern.test(email);
  };

  const handleLogin = async () => {
    let newErrors = {};

    // Validate email
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email.";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    // If there are any errors, return early
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Set loading to true and disable the button
    setIsLoading(true);

    try {
      const userData = await loginUser({ email, password });

      setUser(userData.user); // Store user data in UserContext
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error during login:", error);
      alert("Incorrect email or password. Please try again.");
    } finally {
      // Set loading to false once done
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  const handleFor = () => {
    navigation.navigate("ForgotPass");
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      imageStyle={{ opacity: 0.8 }} // Optional: makes the background a bit transparent
    >
      <View
        className="bg-white p-8 rounded-lg shadow-lg shadow-gray-600"
        style={{ width: "90%", maxWidth: 400 }} // Adjusts width for better centering
      >
        <Text className="text-3xl font-bold text-center mb-6">Login</Text>

        {/* Email Input */}
        <TextInput
          className={`w-full rounded-lg p-4 mb-4 ${
            errors.email ? "border-2 border-red-500" : "bg-gray-100"
          }`}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        {errors.email && (
          <Text className="text-red-500 mb-2">{errors.email}</Text>
        )}

        {/* Password Input */}
        <TextInput
          className={`w-full rounded-lg p-4 mb-4 ${
            errors.password ? "border-2 border-red-500" : "bg-gray-100"
          }`}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {errors.password && (
          <Text className="text-red-500 mb-2">{errors.password}</Text>
        )}

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading} // Disable button if loading
          className={`w-full rounded-lg p-4 items-center mb-4 ${
            isLoading ? "bg-gray-400" : "bg-blue-500"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" /> // Show spinner while loading
          ) : (
            <Text className="text-white text-lg font-bold">Login</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Navigation */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text className="text-blue-500 font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-4">
          <TouchableOpacity onPress={handleFor}>
            <Text className="text-blue-500">Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;

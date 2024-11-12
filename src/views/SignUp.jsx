import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for the back icon
import backgroundImage from "../../assets/2.png"; // Adjust the path as necessary
import { registerUser } from "../Services/Api"; // Import the registerUser function

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async () => {
    let valid = true;
    let newErrors = {};

    // Validate First Name and Last Name
    if (!firstName) {
      valid = false;
      newErrors.firstName = "Please enter your first name.";
    }
    if (!lastName) {
      valid = false;
      newErrors.lastName = "Please enter your last name.";
    }

    // Validate Email
    if (!email) {
      valid = false;
      newErrors.email = "Please enter your email.";
    } else if (!validateEmail(email)) {
      valid = false;
      newErrors.email = "Not a valid email.";
    }

    // Validate Password
    if (!password) {
      valid = false;
      newErrors.password = "Please enter a password.";
    } else if (!validatePassword(password)) {
      valid = false;
      newErrors.password =
        "Password must be at least 6 characters long, contain at least 1 uppercase letter, and 1 number.";
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      valid = false;
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      valid = false;
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (valid) {
      setLoading(true);
      try {
        setLoading(true);
        const userData = {
          firstName,
          lastName,
          email,
          password,
        };

        await registerUser(userData);
        setLoading(false);
        Alert.alert(
          "Registration Complete", // Title
          "You have successfully signed up! Please proceed to the login page.", // Message
          [{ text: "OK" }] // Buttons
        );

        navigation.navigate("Login");
      } catch (error) {
        setLoading(false); // Stop loading
        console.error("Registration error:", error);
        alert("Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Sign Up failed due to validation errors");
    }
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
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="absolute top-5 left-5 z-10"
        >
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-center mb-6">Sign Up</Text>

        {/* First Name Input */}
        <TextInput
          className={`w-full rounded-lg p-4 mb-1 ${
            errors.firstName ? "border-2 border-red-500" : "bg-gray-100"
          }`}
          placeholder="First Name"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
        {errors.firstName && (
          <Text className="text-red-500 mb-4">{errors.firstName}</Text>
        )}

        {/* Last Name Input */}
        <TextInput
          className={`w-full rounded-lg p-4 mb-1 ${
            errors.lastName ? "border-2 border-red-500" : "bg-gray-100"
          }`}
          placeholder="Last Name"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
        {errors.lastName && (
          <Text className="text-red-500 mb-4">{errors.lastName}</Text>
        )}

        {/* Email Input */}
        <TextInput
          className={`w-full rounded-lg p-4 mb-1 ${
            errors.email ? "border-2 border-red-500" : "bg-gray-100"
          }`}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        {errors.email && (
          <Text className="text-red-500 mb-4">{errors.email}</Text>
        )}

        {/* Password Input */}
        <TextInput
          className={`w-full rounded-lg p-4 mb-1 ${
            errors.password ? "border-2 border-red-500" : "bg-gray-100"
          }`}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {errors.password && (
          <Text className="text-red-500 mb-4">{errors.password}</Text>
        )}

        {/* Confirm Password Input */}
        <TextInput
          className={`w-full rounded-lg p-4 mb-1 ${
            errors.confirmPassword ? "border-2 border-red-500" : "bg-gray-100"
          }`}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        {errors.confirmPassword && (
          <Text className="text-red-500 mb-4">{errors.confirmPassword}</Text>
        )}

        {/* Sign Up Button */}
        <TouchableOpacity
          disabled={loading}
          onPress={handleSignUp}
          className={`w-full bg-blue-500 rounded-lg p-4 items-center mb-4 ${
            loading ? "bg-gray-400" : "bg-blue-500"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-bold">Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Navigation Back to Login */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-blue-500 font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SignUp;

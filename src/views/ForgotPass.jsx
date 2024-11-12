import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import backgroundImage from "../../assets/2.png";
import {
  sendOtpEmail,
  updateUserPassword,
  getAllUserEmails,
} from "../Services/Api"; // Include the API

const ForgotPass = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const navigation = useNavigation();

  useEffect(() => {
    let interval = null;
    if (otpCooldown && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setOtpCooldown(false);
      setOtpTimer(30);
    }
    return () => clearInterval(interval);
  }, [otpCooldown, otpTimer]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkIfEmailRegistered = async (email) => {
    try {
      const userEmails = await getAllUserEmails();
      console.log(userEmails);

      const user = userEmails.find((userObj) => userObj.email === email);

      return !!user;
    } catch (error) {
      console.error("Error verifying email:", error);
      throw new Error("Error verifying email.");
    }
  };

  const validatePassword = (password) => {
    const passwordErrors = {};
    if (password.length < 6) {
      passwordErrors.length = "Password must be at least 6 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.uppercase =
        "Password must have at least one uppercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      passwordErrors.number = "Password must have at least one number.";
    }
    return passwordErrors;
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!email || !validateEmail(email)) {
        setErrors({ email: "Please enter a valid email." });
        return;
      }

      setLoading(true);

      try {
        const isRegistered = await checkIfEmailRegistered(email);
        if (isRegistered) {
          setErrors({});
          setStep(2);
        } else {
          setErrors({
            email:
              "We couldn't find an account with this email. Please double-check and try again.",
          });
        }
      } catch (error) {
        setErrors({ email: error.message });
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      if (otp !== generatedOtp) {
        setErrors({ otp: "Incorrect OTP. Please try again." });
      } else {
        setErrors({});
        setStep(3);
      }
    }
  };

  const handleSendOtp = async () => {
    if (!otpCooldown) {
      setLoading(true);
      const randomOtp = Math.floor(10000 + Math.random() * 90000);
      console.log("Generated OTP:", randomOtp);
      setGeneratedOtp(randomOtp.toString());
      try {
        const response = await sendOtpEmail(email, randomOtp);
        console.log("OTP sent successfully: ", response);
        setOtpCooldown(true);
        setLoading(false);
      } catch (error) {
        console.error("Failed to send OTP: ", error);
        setLoading(false);
      }
    }
  };

  const handleChangePassword = async () => {
    const passwordErrors = validatePassword(password);
    if (Object.keys(passwordErrors).length > 0) {
      setErrors({ confirmPassword: passwordErrors });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Call the update password API
      const response = await updateUserPassword(email, password);
      setLoading(false); // Hide loading spinner

      Alert.alert("Password Changed", "Password is successfully changed.", [
        { text: "OK" },
      ]);
      navigation.navigate("Login");
      setOtp("");
    } catch (error) {
      setLoading(false); // Hide loading spinner
      Alert.alert("Error", "Failed to change password. Please try again.");
      console.error("Failed to change password:", error);
    }
  };

  const handleBackPress = () => {
    Alert.alert(
      "Cancel Forgot Password?",
      "Are you sure you want to cancel the forgot password process?",
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setStep(1);
            setEmail("");
            setOtp("");
            setGeneratedOtp(null);
            setPassword("");
            setConfirmPassword("");
            setErrors({});
            navigation.navigate("Login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      imageStyle={{ opacity: 0.8 }}
    >
      <View
        className="bg-white p-8 rounded-lg shadow-lg shadow-gray-600"
        style={{ width: "90%", maxWidth: 400 }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleBackPress}
          className="absolute top-5 left-5 z-10"
        >
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </Text>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <>
            <TextInput
              className={`w-full rounded-lg p-4 mb-10 ${
                errors.email ? "border-2 border-red-500" : "bg-gray-100"
              }`}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            {errors.email && (
              <Text className="text-red-500 mb-4">{errors.email}</Text>
            )}
            <TouchableOpacity
              onPress={handleNextStep}
              className="w-full bg-blue-500 rounded-lg p-4 items-center mb-4"
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" /> // Show loading indicator
              ) : (
                <Text className="text-white text-lg font-bold">Next</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <>
            <View className="flex w-full">
              <Text className="text-gray-500">
                After clicking 'Send OTP,' check your email for a 5-digit OTP to
                complete the verification.
              </Text>
              <View className="flex-row w-full mt-6">
                <TextInput
                  className={`flex-1 rounded-lg p-4 mb-10 ${
                    errors.otp ? "border-2 border-red-500" : "bg-gray-100"
                  }`}
                  placeholder="Enter OTP"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={(text) => setOtp(text)}
                />
                <TouchableOpacity
                  onPress={handleSendOtp}
                  disabled={otpCooldown || loading}
                  className={`ml-2 rounded-lg p-4 items-center mb-10 ${
                    otpCooldown || loading ? "bg-gray-400" : "bg-blue-500"
                  }`}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className={`text-white font-bold text-lg`}>
                      {otpCooldown ? `Resend ${otpTimer}s` : "Send OTP"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            {errors.otp && (
              <Text className="text-red-500 mb-4">{errors.otp}</Text>
            )}
            <TouchableOpacity
              onPress={handleNextStep}
              className="w-full bg-blue-500 rounded-lg p-4 items-center mb-4"
            >
              <Text className="text-white text-lg font-bold">Next</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Step 3: Password Reset */}
        {step === 3 && (
          <>
            <TextInput
              className={`w-full rounded-lg p-4 mb-3 bg-gray-100`}
              placeholder="New Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TextInput
              className={`w-full rounded-lg p-4 mb-10 bg-gray-100`}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 mb-4">
                {typeof errors.confirmPassword === "string"
                  ? errors.confirmPassword // If it's a string error (e.g. "Passwords do not match")
                  : Object.values(errors.confirmPassword).join("\n")}{" "}
                {/* If it's an object, join the error messages */}
              </Text>
            )}

            <TouchableOpacity
              onPress={handleChangePassword}
              disabled={loading} // Disable button while loading
              className={`w-full rounded-lg p-4 mb-4 ${
                loading ? "bg-gray-400" : "bg-blue-500"
              }`}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loading && (
                  <ActivityIndicator color="white" style={{ marginRight: 8 }} /> // Show loading spinner
                )}
                <Text className="text-white text-lg font-bold">
                  {loading ? "Changing Password..." : "Change Password"}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
};

export default ForgotPass;

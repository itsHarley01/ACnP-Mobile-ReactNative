import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../Services/UserContext";
import { updateUser } from "../Services/Api"; // Import your updateUser function

export default function Profile() {
  const navigation = useNavigation();
  const { user, setUser } = useUser(); // Add setUser to update user state after successful update

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [isUpdating, setIsUpdating] = useState(false); // Track if the update is in progress
  const [isEditing, setIsEditing] = useState(false); // Track if in edit mode

  const handleUpdate = async () => {
    // Validate fields are not empty
    if (!firstName || !lastName) {
      Alert.alert("Error", "First name and Last name cannot be empty");
      return;
    }

    try {
      setIsUpdating(true); // Start the update process
      // Call the API to update the user's information
      const updatedUser = await updateUser(user.id, firstName, lastName);

      // If successful, update the user in the UserContext
      setUser({
        ...user,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      });

      // Show success message
      Alert.alert("Success", "Profile updated successfully");
      setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false); // End the update process
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/2.png")}
      style={{ flex: 1, padding: 16 }}
      imageStyle={{ opacity: 0.8 }}
    >
      <View className="flex-1 mt-10 p-5 justify-center">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          className="absolute top-5 left-5 z-10"
        >
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>

        {/* Profile Section */}
        <View className="items-center mb-10">
          <FontAwesome name="user-circle" size={80} color="#4A90E2" />
          {user ? (
            <Text className="text-lg mt-3 text-gray-700">{user.email}</Text>
          ) : (
            <Text className="text-lg mt-3 text-gray-700">
              No user information
            </Text>
          )}
        </View>

        {/* Information Section */}
        <View className="bg-white p-6 rounded-lg shadow-lg shadow-gray-400">
          {isEditing ? (
            <>
              <Text className="text-sm text-gray-600 mb-2">First Name</Text>
              <TextInput
                className="bg-gray-100 p-3 rounded-lg border border-gray-300 mb-4 text-lg"
                value={firstName}
                onChangeText={setFirstName} // Allow editing
                editable={true}
              />

              <Text className="text-sm text-gray-600 mb-2">Last Name</Text>
              <TextInput
                className="bg-gray-100 p-3 rounded-lg border border-gray-300 mb-4 text-lg"
                value={lastName}
                onChangeText={setLastName} // Allow editing
                editable={true}
              />
            </>
          ) : (
            <>
              <Text className="text-sm text-gray-600 mb-2">First Name</Text>
              <Text className="text-lg text-gray-800 mb-4">{firstName}</Text>

              <Text className="text-sm text-gray-600 mb-2">Last Name</Text>
              <Text className="text-lg text-gray-800 mb-4">{lastName}</Text>
            </>
          )}

          {/* Edit or Update Button */}
          {isEditing ? (
            <TouchableOpacity
              onPress={handleUpdate}
              className="bg-blue-500 p-3 rounded-lg mt-4"
              disabled={isUpdating} // Disable button while updating
            >
              <Text className="text-center text-white text-lg">
                {isUpdating ? "Updating..." : "Update Profile"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="bg-blue-500 p-3 rounded-lg mt-4"
            >
              <Text className="text-center text-white text-lg">
                Edit Profile
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

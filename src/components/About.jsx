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
import { getAllAbout, updateAbout } from "../Services/Api"; // Import your API functions

export default function About() {
  const navigation = useNavigation();

  const [aboutText, setAboutText] = useState("");
  const [aboutId, setAboutId] = useState(""); // State for the about ID
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const response = await getAllAbout(); // Fetch about information
        console.log("Fetched about info:", response); // Log the response
        if (response && response.length > 0) {
          setAboutId(response[0]._id); // Store the _id
          setAboutText(response[0].description || ""); // Use the description from the first item
        } else {
          Alert.alert("Info", "No about information found");
        }
      } catch (error) {
        console.error("Error fetching about information:", error);
        Alert.alert("Error", "Failed to load about information");
      }
    };

    fetchAboutInfo();
  }, []);

  const handleUpdateAbout = async () => {
    try {
      await updateAbout(aboutId, { description: aboutText }); // Include the about ID in the update
      Alert.alert("Success", "About information updated successfully");
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error updating about information:", error);
      Alert.alert("Error", "Failed to update about information");
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleUpdateAbout(); // Save changes when exiting edit mode
    } else {
      setIsEditing(true); // Enter edit mode
    }
  };

  return (
    <View className="bg-white p-6 mt-10 rounded-lg shadow-md shadow-gray-400 border">
      <Text className="text-lg text-gray-700 mb-4">About</Text>
      <TextInput
        className="bg-gray-100 p-3 rounded-lg border border-gray-300 mb-4 text-lg"
        value={aboutText}
        editable={isEditing}
        onChangeText={(text) => setAboutText(text)}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg mt-4"
        onPress={toggleEdit}
      >
        <Text className="text-white text-center text-lg font-bold">
          {isEditing ? "Save" : "Edit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

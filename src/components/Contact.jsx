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
import { getContacts, updateContact } from "../Services/Api"; // Import your API functions

export default function Contact() {
  const [contactId, setContactId] = useState(""); // State for contact ID
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [fbLink, setFbLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getContacts(); // Fetch contact data
        if (response && response.length > 0) {
          const contactData = response[0]; // Assuming the response is an array of contacts
          setContactId(contactData._id); // Set the contact ID here
          setContactNumber(contactData.contactNumber || "");
          setEmail(contactData.email || "");
          setFbLink(contactData.fbLink || "");
        } else {
          Alert.alert("Info", "No contact information found");
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        Alert.alert("Error", "Failed to load contact information");
      }
    };

    fetchContacts();
  }, []);

  const handleUpdateContact = async () => {
    try {
      await updateContact(contactId, {
        // Use contactId instead of id
        contactNumber: contactNumber || "",
        email: email || "",
        fbLink: fbLink || "",
      });
      Alert.alert("Success", "Contact information updated successfully");
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error("Error updating contact:", error);
      Alert.alert("Error", "Failed to update contact information");
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleUpdateContact(); // Save changes when exiting edit mode
    } else {
      setIsEditing(true); // Enter edit mode
    }
  };

  return (
    <View className="bg-white p-6 rounded-lg shadow-lg shadow-gray-500 border mb-10 mt-10">
      <Text className="text-lg font-semibold mb-4">
        Business Contact Information
      </Text>

      <Text className="text-sm text-gray-600 mb-2">Contact Number</Text>
      <TextInput
        className="bg-gray-100 p-3 rounded-lg border border-gray-300 mb-4 text-lg"
        value={contactNumber}
        editable={isEditing}
        onChangeText={setContactNumber}
      />

      <Text className="text-sm text-gray-600 mb-2">Email</Text>
      <TextInput
        className="bg-gray-100 p-3 rounded-lg border border-gray-300 mb-4 text-lg"
        value={email}
        editable={isEditing}
        onChangeText={setEmail}
      />

      <Text className="text-sm text-gray-600 mb-2">Facebook Link</Text>
      <TextInput
        className="bg-gray-100 p-3 rounded-lg border border-gray-300 mb-4 text-lg"
        value={fbLink}
        editable={isEditing}
        onChangeText={setFbLink}
      />

      {/* Edit / Save Button */}
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

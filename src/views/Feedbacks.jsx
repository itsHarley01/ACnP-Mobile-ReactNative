import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAllFeedback } from "../Services/Api"; // Adjust the import path as needed

export default function Feedbacks() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [feedbacks, setFeedbacks] = useState([]); // State for feedback data
  const [refreshing, setRefreshing] = useState(false); // State for refresh control

  // Function to fetch feedback data
  const fetchFeedbacks = async () => {
    try {
      const data = await getAllFeedback();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  // Effect to fetch feedback on component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Format date to readable text
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", // Gives full month name
      day: "2-digit",
    });
  };

  // Effect to filter feedback based on search query
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      (feedback.name?.toLowerCase() || "").includes(lowerCaseQuery) ||
      (feedback.email?.toLowerCase() || "").includes(lowerCaseQuery) ||
      (formatDate(feedback.createdAt)?.toLowerCase() || "").includes(
        lowerCaseQuery
      )
    );
  });

  // Function to handle refreshing
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFeedbacks(); // Fetch data again
    setRefreshing(false); // Stop refreshing
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/2.png")}
      style={{ flex: 1, padding: 16 }}
      imageStyle={{ opacity: 0.8 }}
    >
      <View className="flex-1 mt-10 p-5 justify-center">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Home1")}
          className="absolute top-5 left-5 z-10"
        >
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>

        {/* Title Below Back Button */}
        <Text className="text-lg font-bold mb-2" style={{ marginTop: 50 }}>
          Feedbacks / Messages
        </Text>

        {/* Search Bar */}
        <TextInput
          placeholder="Search Feedback"
          value={searchQuery}
          onChangeText={setSearchQuery} // Update state on text change
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginTop: 10, // Space between title and search bar
            marginBottom: 16, // Space between search bar and ScrollView
            backgroundColor: "white",
          }}
        />

        {/* ScrollView for displaying feedback cards */}
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Check if there are any filtered feedbacks */}
          {filteredFeedbacks.length === 0 ? (
            <Text className="text-center mt-10 text-gray-500">
              No feedback found.
            </Text>
          ) : (
            filteredFeedbacks.map((feedback, index) => (
              <View
                key={index}
                className="bg-white p-4 rounded-lg mb-4 border border-gray-300 shadow-lg shadow-gray-500"
                style={{ padding: 16 }}
              >
                <View className="flex-row gap-2">
                  <Text className="font-bold">Date:</Text>
                  <Text>{formatDate(feedback.createdAt)}</Text>
                </View>
                <View className="flex-row gap-2">
                  <Text className="font-bold">Name:</Text>
                  <Text>{feedback.name}</Text>
                </View>
                <View className="flex-row gap-2">
                  <Text className="font-bold">Email:</Text>
                  <Text>{feedback.email}</Text>
                </View>
                <Text className="font-bold">Message:</Text>
                <Text className="border border-gray-300 p-2 rounded-lg">
                  {feedback.note}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

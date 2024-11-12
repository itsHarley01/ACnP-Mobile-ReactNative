import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { getAppointments, getAllFeedback } from "../Services/Api"; // Import your API functions
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

const Statistics = () => {
  const [appointments, setAppointments] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const navigation = useNavigation(); // Hook to navigate to other screens

  // Function to fetch data from the server and calculate counts
  const fetchData = async () => {
    try {
      const appointmentsData = await getAppointments();
      const feedbackData = await getAllFeedback();

      const pending = appointmentsData.filter(
        (appt) => appt.status === "pending"
      ).length;
      const cancelled = appointmentsData.filter(
        (appt) => appt.status === "cancelled"
      ).length;
      const accepted = appointmentsData.filter(
        (appt) => appt.status === "accepted"
      ).length;

      setAppointments(appointmentsData);
      setPendingCount(pending);
      setCancelledCount(cancelled);
      setAcceptedCount(accepted);
      setFeedbackCount(feedbackData.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh control
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(); // Re-fetch data
    setRefreshing(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      className=" mx-5 "
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex-1 justify-center items-center">
        <View className="w-full flex flex-row flex-wrap justify-between">
          {/* Left Column */}
          <View className="w-[48%]">
            {/* Pending Appointments */}
            <TouchableOpacity
              className="bg-blue-500 p-4 rounded-lg h-[160px] mb-4"
              onPress={() =>
                navigation.navigate("Appoint", { selectedStatus: "pending" })
              }
              style={{
                shadowColor: "#000", // Shadow for iOS
                shadowOffset: { width: 0, height: 4 }, // Offset for iOS
                shadowOpacity: 0.3, // Shadow opacity for iOS
                shadowRadius: 4.65, // Blur radius for iOS
                elevation: 5, // Elevation for Android
              }}
            >
              <View className="flex-col justify-between items-start h-full">
                <Text className="text-white text-lg">Pending Appointments</Text>
                <Text className="text-white text-3xl font-bold">
                  {pendingCount}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Accepted Appointments */}

            <TouchableOpacity
              className="bg-green-500 p-4 rounded-lg h-[140px] mb-4"
              onPress={() =>
                navigation.navigate("Appoint", { selectedStatus: "accepted" })
              }
              style={{
                shadowColor: "#000", // Shadow for iOS
                shadowOffset: { width: 0, height: 4 }, // Offset for iOS
                shadowOpacity: 0.3, // Shadow opacity for iOS
                shadowRadius: 4.65, // Blur radius for iOS
                elevation: 5, // Elevation for Android
              }}
            >
              <View className="flex-col justify-between items-start h-full">
                <Text className="text-white text-lg">
                  Accepted Appointments
                </Text>
                <Text className="text-white text-3xl font-bold">
                  {acceptedCount}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Right Column */}
          <View className="w-[48%]">
            {/* Cancelled Appointments */}
            <TouchableOpacity
              className="bg-red-500 p-4 rounded-lg h-[120px] mb-4"
              onPress={() =>
                navigation.navigate("Appoint", { selectedStatus: "cancelled" })
              }
              style={{
                shadowColor: "#000", // Shadow for iOS
                shadowOffset: { width: 0, height: 4 }, // Offset for iOS
                shadowOpacity: 0.3, // Shadow opacity for iOS
                shadowRadius: 4.65, // Blur radius for iOS
                elevation: 5, // Elevation for Android
              }}
            >
              <View className="flex-col justify-between items-start h-full">
                <Text className="text-white text-lg">
                  Cancelled Appointments
                </Text>
                <Text className="text-white text-3xl font-bold">
                  {cancelledCount}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Feedback/Messages */}
            <TouchableOpacity
              className="bg-blue-500 p-4 rounded-lg h-[180px] mb-4"
              onPress={() => navigation.navigate("Feedbacks")}
              style={{
                shadowColor: "#000", // Shadow for iOS
                shadowOffset: { width: 0, height: 4 }, // Offset for iOS
                shadowOpacity: 0.3, // Shadow opacity for iOS
                shadowRadius: 4.65, // Blur radius for iOS
                elevation: 5, // Elevation for Android
              }}
            >
              <View className="flex-col justify-between items-start h-full">
                <Text className="text-white text-lg">Feedback / Messages</Text>
                <Text className="text-white text-3xl font-bold">
                  {feedbackCount}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Statistics;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import {
  getAppointmentsByStatus,
  toggleContacted,
  createProject,
  updateAppointment,
} from "../Services/Api.js";
import { useRoute } from "@react-navigation/native";
import CreateProjectModal from "./CreateProjectModal.jsx";

const Appointments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingC, setIsLoadingC] = useState(false);
  const [isLoadingB, setIsLoadingB] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleP, setModalVisibleP] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const route = useRoute();
  const [selectedStatus, setSelectedStatus] = useState(
    route.params?.selectedStatus || "pending"
  );
  const [isContacted, setIsContacted] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckboxClick = async (appointment) => {
    setLoading(true);
    try {
      await toggleContacted(appointment._id);
      setIsContacted(!isContacted);
      setLoading(false);
    } catch (error) {
      console.error(`Failed to toggle contacted status: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointmentsByStatus(selectedStatus);
  }, [selectedStatus]);

  useEffect(() => {
    if (route.params?.selectedStatus) {
      setSelectedStatus(route.params.selectedStatus);
    }
  }, [route.params?.selectedStatus]);

  const loadAppointmentsByStatus = async (status) => {
    setIsLoading(true);
    try {
      const fetchedAppointments = await getAppointmentsByStatus(status);
      setAppointments(fetchedAppointments);
      setFilteredAppointments(fetchedAppointments); // Initialize the filtered array with all data
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabClick = (status) => {
    setSelectedStatus(status);
    setSearchQuery("");
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredAppointments(appointments); // Reset to original fetched data when query is empty
    } else {
      const filtered = appointments.filter(
        (appointment) =>
          appointment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.contactNumber.includes(searchQuery) ||
          appointment.preferredDate.includes(searchQuery)
      );
      setFilteredAppointments(filtered);
    }
  }, [searchQuery, appointments]);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    console.log(appointment);
    setIsContacted(appointment.contacted);
    setModalVisible(true);
  };

  const resetModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null);
    loadAppointmentsByStatus(selectedStatus);
  };
  const resetModal2 = () => {
    setModalVisibleP(false);
    setProjectTitle("");
  };
  // Helper function to format the date
  const formatPreferredDate = (dateString) => {
    const date = new Date(dateString); // Convert the string to a Date object
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", // This will convert the month into full text (e.g., "October")
      day: "numeric",
    });
  };

  // Accept a pending appointment
  const handleAcceptAppointment = async () => {
    Alert.alert(
      "Accept Appointment",
      "Are you sure you want to accept this appointment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: async () => {
            setIsLoading(true);
            try {
              await updateAppointment(selectedAppointment._id, {
                status: "accepted",
              });
              setModalVisible(false);
              setSelectedStatus("accepted"); // Automatically switch tab to accepted
              setIsLoading(false);
            } catch (error) {
              console.error("Failed to update appointment:", error);
              Alert.alert("Error", "Failed to accept the appointment.");
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };
  const handleFinishAppointment = async () => {
    Alert.alert(
      "Finish Appointment",
      "Are you sure you want to finish this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            setIsLoading(true);
            try {
              await updateAppointment(selectedAppointment._id, {
                status: "finshed",
              });
              setModalVisible(false);
              setSelectedStatus("accepted");
              setIsLoading(false);
            } catch (error) {
              console.error("Failed to update appointment:", error);
              Alert.alert("Error", "Failed to accept the appointment.");
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // Cancel a pending appointment
  const handleCancelAppointment = async () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            setIsLoadingC(true);
            try {
              await updateAppointment(selectedAppointment._id, {
                status: "cancelled",
              });
              setModalVisible(false);
              setSelectedStatus("cancelled"); // Automatically switch tab to cancelled
              setIsLoadingC(false);
            } catch (error) {
              console.error("Failed to update appointment:", error);
              Alert.alert("Error", "Failed to cancel the appointment.");
              setIsLoadingC(false);
            }
          },
        },
      ]
    );
  };

  const handleCreateProject = async () => {
    if (!projectTitle.trim()) {
      setErrorMessage("Please enter a title for the project");
      return;
    }

    setIsLoadingB(true);
    setErrorMessage("");

    try {
      await updateAppointment(selectedAppointment._id, {
        status: "finished",
      });

      const projectData = {
        title: projectTitle,
        name: selectedAppointment.name,
        service: selectedAppointment.service,
        email: selectedAppointment.email || "",
        contactNumber: selectedAppointment.contactNumber,
        address: selectedAppointment.address,
        expectedDate: selectedAppointment.expectedDate,
        status: "ongoing",
      };

      await createProject(projectData);

      setModalVisible(false);
      setModalVisibleP(false);
      setSelectedStatus("accepted");
      loadAppointmentsByStatus(selectedStatus);
      setProjectTitle("");
    } catch (error) {
      console.error("Failed to create project and update appointment:", error);
      Alert.alert(
        "Error",
        "Failed to create the project or update the appointment."
      );
    } finally {
      setIsLoadingB(false); // Stop the loading indicator
    }
  };

  // Revert a cancelled appointment back to pending
  const handleRevertToPending = async () => {
    Alert.alert(
      "Revert to Pending",
      "Are you sure you want to revert this appointment to pending?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Revert",
          onPress: async () => {
            setIsLoading(true);
            try {
              await updateAppointment(selectedAppointment._id, {
                status: "pending",
              });
              setModalVisible(false);
              setSelectedStatus("pending");
              setIsLoading(false);
            } catch (error) {
              console.error("Failed to revert appointment:", error);
              Alert.alert("Error", "Failed to revert the appointment.");
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="h-auto w-full p-4">
      <TextInput
        className="bg-white p-2 mb-4 rounded-md"
        placeholder="Search by name, contact, or date..."
        value={searchQuery}
        onChangeText={setSearchQuery} // Handle search input
      />

      {/* Tabs for different statuses */}
      <View
        className="border-b border-blue-400 rounded-lg mb-3"
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => handleTabClick("pending")}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.tabText,
                selectedStatus === "pending" && styles.selectedTab,
              ]}
            >
              Pending
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleTabClick("accepted")}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.tabText,
                selectedStatus === "accepted" && styles.selectedTab,
              ]}
            >
              Accepted
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleTabClick("cancelled")}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.tabText,
                selectedStatus === "cancelled" && styles.selectedTab,
              ]}
            >
              Cancelled
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleTabClick("finished")}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.tabText,
                selectedStatus === "finished" && styles.selectedTab,
              ]}
            >
              finished
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Show data or loading spinner */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : filteredAppointments.length === 0 ? (
        <Text className="text-center mt-4">No appointments found.</Text>
      ) : (
        <ScrollView style={{ maxHeight: "60%" }}>
          {filteredAppointments.map((appointment) => (
            <TouchableOpacity
              key={appointment._id}
              onPress={() => handleAppointmentClick(appointment)}
            >
              <View className="flex-row justify-between" style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{appointment.name}</Text>
                  <Text style={styles.cardDetail}>{appointment.service}</Text>
                  <Text style={styles.cardDetail}>
                    <Text>Preferred Date:</Text>
                    {formatPreferredDate(appointment.preferredDate)}
                  </Text>
                </View>
                <View>
                  <Text
                    className={appointment.contacted ? "text-green-600" : ""}
                  >
                    {appointment.contacted ? "Contacted" : ""}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modal for Appointment Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={resetModal}
            >
              <Text className="font-bold text-xl p-1">X</Text>
            </TouchableOpacity>

            {selectedAppointment && (
              <>
                {(selectedAppointment.status === "pending" ||
                  selectedAppointment.status === "cancelled") && (
                  <View className="flex-row items-center pb-5">
                    <TouchableOpacity
                      onPress={() => handleCheckboxClick(selectedAppointment)}
                      className="mr-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#0000ff" /> // Show loading spinner when loading is true
                      ) : (
                        <View
                          className={`w-5 h-5 border border-gray-400 rounded ${
                            isContacted ? "bg-blue-500" : "bg-white"
                          }`}
                        >
                          {isContacted && (
                            <Text className="text-white text-center">✓</Text>
                          )}
                        </View>
                      )}
                    </TouchableOpacity>
                    <Text className="text-lg">
                      I have contacted this customer.
                    </Text>
                  </View>
                )}

                {selectedAppointment.status === "accepted" && (
                  <View className="pb-5">
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        onPress={() => handleCheckboxClick(selectedAppointment)}
                        className="mr-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="#0000ff" /> // Show loading spinner when loading is true
                        ) : (
                          <View
                            className={`w-5 h-5 border border-gray-400 rounded ${
                              isContacted ? "bg-blue-500" : "bg-white"
                            }`}
                          >
                            {isContacted && (
                              <Text className="text-white text-center">✓</Text>
                            )}
                          </View>
                        )}
                      </TouchableOpacity>
                      <Text className="text-lg">
                        I have contacted this customer.
                      </Text>
                    </View>
                  </View>
                )}

                <Text style={styles.modalTitle}>Appointment Details</Text>
                <Text style={styles.modalText}>
                  Name: {selectedAppointment.name}
                </Text>
                <Text style={styles.modalText}>
                  Service: {selectedAppointment.service}
                </Text>
                <Text style={styles.modalText}>
                  Contact: {selectedAppointment.contactNumber}
                </Text>
                <Text style={styles.modalText}>
                  Address: {selectedAppointment.address}
                </Text>
                <Text style={styles.modalText}>
                  Preferred Date: {selectedAppointment.preferredDate}
                </Text>
                <Text style={styles.modalText}>
                  Preferred Time: {selectedAppointment.preferredTime}
                </Text>
                <Text style={styles.modalText}>
                  Note: {selectedAppointment.note}
                </Text>

                <View style={styles.buttonContainer}>
                  {selectedAppointment.status === "pending" && (
                    <>
                      <TouchableOpacity
                        className="bg-green-500 p-3 rounded-lg w-[48%]"
                        onPress={handleAcceptAppointment}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                          <Text className="text-white text-center">Accept</Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-red-500 p-3 rounded-lg w-[48%]"
                        onPress={handleCancelAppointment}
                        disabled={isLoadingC}
                      >
                        {isLoadingC ? (
                          <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                          <Text className="text-white text-center">Cancel</Text>
                        )}
                      </TouchableOpacity>
                    </>
                  )}

                  {selectedAppointment.status === "cancelled" && (
                    <TouchableOpacity
                      className="bg-blue-500 p-3 rounded-lg mx-auto w-[48%]"
                      onPress={handleRevertToPending}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text className="text-white text-center">Revert</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  {selectedAppointment.status === "accepted" && (
                    <TouchableOpacity
                      className="bg-green-500 p-3 rounded-lg w-[60%] mx-auto"
                      onPress={() => {
                        handleFinishAppointment();
                      }}
                    >
                      <Text className="text-white text-center">
                        Finish Appointment
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      {/* 
      <CreateProjectModal
        modalVisibleP={modalVisibleP}
        resetModal2={resetModal2}
        handleCreateProject={() => handleCreateProject()}
        isLoadingB={isLoadingB}
        selectedAppointment={selectedAppointment}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  tabText: {
    fontSize: 15,
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 }, // Adjust the offset for stroke effect
    textShadowRadius: 5, // Adjust the radius to smoothen the stroke
  },
  selectedTab: {
    backgroundColor: "rgb(96 165 250)", // Change to your preferred selected color
    fontSize: 18,
    color: "white",
    borderTopLeftRadius: 10, // Rounded corners on top-left
    borderTopRightRadius: 10, // Rounded corners on top-right
    borderBottomLeftRadius: 0, // Flat bottom-left
    borderBottomRightRadius: 0, // Flat bottom-right
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardDetail: {
    fontSize: 14,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    width: "48%",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    width: "48%",
  },
});

export default Appointments;

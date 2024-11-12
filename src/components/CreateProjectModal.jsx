import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Button,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";

const CreateProjectModal = ({
  modalVisibleP,
  resetModal2,
  handleCreateProject,
  isLoadingB,
  selectedAppointment,
}) => {
  // Form State Variables
  const [projectTitle, setProjectTitle] = useState("");
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [expectedDate, setExpectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Synchronize state variables with selectedAppointment using useEffect
  useEffect(() => {
    if (selectedAppointment) {
      setName(selectedAppointment.name || "");
      setService(selectedAppointment.service || "");
      setEmail(selectedAppointment.email || "");
      setContactNumber(selectedAppointment.contactNumber || "");
      setAddress(selectedAppointment.address || "");
    }
  }, [selectedAppointment]);

  const handleClose = () => {
    setProjectTitle("");
    setName(selectedAppointment?.name || "");
    setService(selectedAppointment?.service || "");
    setEmail(selectedAppointment?.email || "");
    setContactNumber(selectedAppointment?.contactNumber || "");
    setAddress(selectedAppointment?.address || "");
    setExpectedDate(new Date());
    setTasks([]);
    setTaskInput("");
    setErrorMessage("");

    resetModal2();
  };

  // Handle Add Task
  const addTask = () => {
    if (taskInput.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), task: taskInput }]);
      setTaskInput(""); // Clear input after adding
    }
  };

  // Handle Remove Task
  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks); // Update task list
  };

  // Handle Date Selection from Calendar
  const onDateSelected = (date) => {
    setExpectedDate(new Date(date.dateString)); // Update expected date
  };

  // Submit and Create Project
  const handleSubmit = () => {
    setErrorMessage("");

    // Validate Project Title
    if (!projectTitle.trim()) {
      setErrorMessage("Please enter a project title.");
      return;
    }

    // Validate Client Info
    if (
      !name.trim() ||
      !service.trim() ||
      !contactNumber.trim() ||
      !address.trim()
    ) {
      setErrorMessage("Please enter all the required client info fields.");
      return;
    }

    // Validate Expected Completion Date
    const today = new Date();
    if (expectedDate.toDateString() === today.toDateString()) {
      setErrorMessage("Expected completion date cannot be today.");
      return;
    }

    const projectData = {
      title: projectTitle,
      name,
      service,
      email,
      contactNumber,
      address,
      expectedDate,
      tasks,
    };

    handleCreateProject(projectData);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisibleP}
      onRequestClose={handleClose}
      disabled={isLoadingB}
    >
      <View className="flex-1 justify-center my-10 items-center bg-black bg-opacity-50">
        <View className="bg-white p-5 rounded-lg w-11/12">
          <TouchableOpacity
            onPress={handleClose}
            className="absolute top-2 right-2"
          >
            <Text className="text-xl font-bold">X</Text>
          </TouchableOpacity>

          <FlatList
            ListHeaderComponent={
              <>
                {/* Form Fields */}
                <Text className="text-xl font-bold mt-10">Project Title</Text>
                <TextInput
                  placeholder="Project Title"
                  value={projectTitle}
                  onChangeText={setProjectTitle}
                  className="border border-gray-300 p-3 rounded-lg mb-4"
                />
                {errorMessage === "Please enter a project title." && (
                  <Text className="text-red-500">
                    Please enter a project title.
                  </Text>
                )}
                <Text className="text-xl font-bold ">Client Info</Text>
                <TextInput
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                  className="border border-gray-300 p-3 rounded-lg mb-4"
                />
                <TextInput
                  placeholder="Service"
                  value={service}
                  onChangeText={setService}
                  className="border border-gray-300 p-3 rounded-lg mb-4"
                />
                <TextInput
                  placeholder="Email (optional)"
                  value={email}
                  onChangeText={setEmail}
                  className="border border-gray-300 p-3 rounded-lg mb-4"
                />
                <TextInput
                  placeholder="Contact Number"
                  value={contactNumber}
                  onChangeText={setContactNumber}
                  className="border border-gray-300 p-3 rounded-lg mb-4"
                />
                <TextInput
                  placeholder="Address"
                  value={address}
                  onChangeText={setAddress}
                  className="border border-gray-300 p-3 rounded-lg mb-4"
                />
                {errorMessage ===
                  "Please enter all the required client info fields." && (
                  <Text className="text-red-500">
                    Please enter all the required client info fields.
                  </Text>
                )}
                <Text className="text-xl font-bold ">
                  Expected Completion Date
                </Text>
                <Calendar
                  onDayPress={onDateSelected}
                  markedDates={{
                    [expectedDate.toISOString().split("T")[0]]: {
                      selected: true,
                      marked: true,
                      selectedColor: "blue",
                    },
                  }}
                />
                <Text className="border border-gray-300 p-3 rounded-lg mb-4">
                  Expected Date: {expectedDate.toDateString()}
                </Text>
                {errorMessage ===
                  "Expected completion date cannot be today." && (
                  <Text className="text-red-500">
                    Expected completion date cannot be today.
                  </Text>
                )}

                {/* Task Input */}
                <View className="flex-row items-center mt-4">
                  <TextInput
                    placeholder="Task"
                    value={taskInput}
                    onChangeText={setTaskInput}
                    className="border border-gray-300 p-3 rounded-lg flex-1"
                  />
                  <TouchableOpacity
                    className="bg-blue-400 p-4 rounded-lg"
                    onPress={addTask}
                  >
                    <Text style={{ color: "white" }}>Add Task</Text>
                  </TouchableOpacity>
                </View>
              </>
            }
            data={tasks}
            renderItem={({ item }) => (
              <View className="flex-row justify-between mt-4">
                <Text>{item.task}</Text>
                <TouchableOpacity onPress={() => removeTask(item.id)}>
                  <Text className="text-red-500 text-xl">X</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Create Project Button */}
          <TouchableOpacity
            className="bg-green-500 p-4 rounded-lg mt-4"
            onPress={handleSubmit}
            disabled={isLoadingB}
          >
            {isLoadingB ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white text-center font-bold">
                Create Project
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CreateProjectModal;

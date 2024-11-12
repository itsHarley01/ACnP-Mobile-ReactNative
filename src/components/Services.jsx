import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  getServices,
  addService,
  updateService,
  deleteService,
} from "../Services/Api";
import * as ImagePicker from "expo-image-picker";

const Services = () => {
  const [services, setServices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesList = await getServices();
        setServices(servicesList);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.price.toString().includes(searchTerm)
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Handle saving a new service
  const handleSaveService = async () => {
    if (!name || !description || !image) {
      alert("Please provide a name, description, price, and image.");
      return;
    }
    setIsUploading(true);
    try {
      const newService = { image, name, description, price };
      await addService(newService);

      const updatedServices = await getServices();
      setServices(updatedServices);
      resetModal();
    } catch (error) {
      console.error("Error adding service:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle updating a service
  const handleUpdateService = async () => {
    if (!name || !description || !image || !price) {
      alert("Please provide a name, description, and image.");
      return;
    }
    setIsUploading(true);
    try {
      const updatedService = { image, name, description, price };
      await updateService(selectedService._id, updatedService);

      const updatedServices = await getServices();
      setServices(updatedServices);
      resetModal();
    } catch (error) {
      console.error("Error updating service:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle deleting a service
  const handleDeleteService = async () => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteService(selectedService._id);
              const updatedServices = await getServices();
              setServices(updatedServices);
              resetModal();
            } catch (error) {
              console.error("Error deleting service:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const resetModal = () => {
    setModalVisible(false);
    setName("");
    setPrice("");
    setDescription("");
    setImage(null);
    setSelectedService(null);
    setIsEditing(false);
  };

  // Open modal for editing
  const handleEditService = (service) => {
    setSelectedService(service);
    setName(service.name);
    setDescription(service.description);
    setImage(service.image);
    setPrice(service.price);
    setIsEditing(true);
    setModalVisible(true);
  };

  const renderServiceList = () => (
    <FlatList
      data={filteredServices}
      renderItem={({ item }) => (
        <TouchableOpacity className="" onPress={() => handleEditService(item)}>
          <ServiceItem service={item} />
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item._id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    />
  );

  const ServiceItem = ({ service }) => (
    <View className="py-3">
      <View className="w-64 h-32 mx-2 rounded-lg shadow-lg shadow-black">
        <ImageBackground
          source={{ uri: service.image }}
          style={{ width: "100%", height: "100%" }}
          imageStyle={{ borderRadius: 10 }}
          className="w-full h-full rounded-lg overflow-hidden"
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              opacity: 0.5,
            }}
          />

          <View className="flex-1 p-4 relative">
            <Text className="text-white text-lg font-bold">{service.name}</Text>
            <Text className="text-white text-sm mt-1">
              {service.description}
            </Text>
            <Text className="text-white text-sm mt-1">{service.price}</Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );

  return (
    <ScrollView className="">
      <View className="flex flex-col">
        <Text className="text-black text-3xl font-bold">Services</Text>
        <View className="flex-row justify-end gap-1">
          {/* <Text className="text-2xl font-bold text-gray-700">Services</Text> */}
          <TextInput
            placeholder="Search services..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            className="border p-2 rounded-lg w-[230px] mb-5 bg-white" // Adjust width as needed
          />
          <TouchableOpacity
            className=" bg-blue-400 rounded-lg p-1 mb-5 justify-center items-center"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-xl font-bold text-white px-2">
              Add Service
            </Text>
          </TouchableOpacity>
        </View>
        {renderServiceList()}
      </View>

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
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>X</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold">
              {isEditing ? "Edit Service" : "Add Service"}
            </Text>
            <TouchableOpacity
              onPress={pickImage}
              className="mb-4"
              disabled={isUploading}
            >
              <Text className="text-blue-500">Pick an Image</Text>
            </TouchableOpacity>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100, marginBottom: 10 }}
              />
            )}
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              className="border p-2 rounded w-full mb-2"
              editable={!isUploading}
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              className="border p-2 rounded w-full mb-2"
              editable={!isUploading}
            />
            <TextInput
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              className="border p-2 rounded w-full mb-2"
              editable={!isUploading}
              keyboardType="numeric"
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {isEditing ? (
                <>
                  <TouchableOpacity
                    onPress={handleUpdateService}
                    className={`${
                      isUploading ? "bg-gray-400" : "bg-blue-400"
                    } text-center p-4 rounded-lg flex-1 mr-1`}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-white font-bold text-center">
                        Update
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDeleteService}
                    className="bg-red-500 p-4 rounded-lg text-center flex-1 ml-1"
                    disabled={isUploading}
                  >
                    <Text className="text-white font-bold text-center">
                      Delete
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={handleSaveService}
                  className={`${
                    isUploading ? "bg-gray-400" : "bg-blue-400"
                  } text-center p-4 rounded-lg flex-1 mx-20`}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-bold text-center">
                      Save
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 0,
  },
  tabButton: {
    padding: 10,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  activeTabText: {
    color: "#007bff",
  },
  appointmentItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  appointmentDetails: {
    fontSize: 14,
    color: "#555",
  },
};

export default Services;

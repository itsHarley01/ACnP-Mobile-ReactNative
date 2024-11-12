import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ImageBackground,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl, // Import RefreshControl
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getProductsByType, addProduct, deleteProduct } from "../Services/Api";

const Glass = () => {
  const navigation = useNavigation();

  const [glassItems, setGlassItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // New state for refreshing

  useEffect(() => {
    fetchGlassProducts();
  }, []);

  const fetchGlassProducts = async () => {
    setLoading(true);
    try {
      const products = await getProductsByType("glass");
      setGlassItems(products);
    } catch (error) {
      console.error("Error fetching glass products:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGlassProducts(); // Fetch updated products
    setRefreshing(false); // Reset refreshing state
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      } else {
        Alert.alert(
          "Image selection was canceled or failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert(
        "Error",
        "There was an error selecting the image. Please try again."
      );
    }
  };

  const handleAddGlass = () => {
    setModalVisible(true);
  };

  const handleSaveGlass = async () => {
    if (!name || !description || !image) {
      Alert.alert("Please fill all fields and select an image.");
      return;
    }

    setIsUploading(true); // Set uploading state to true

    try {
      const newGlassItem = {
        image,
        name,
        description,
        type: "glass",
      };

      await addProduct(newGlassItem);
      const updatedProducts = await getProductsByType("glass");
      setGlassItems(updatedProducts);
      Alert.alert("Success", "Added successfully!");
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("Error saving glass product:", error);
      Alert.alert(
        "Error",
        "There was an error adding the glass product. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setName("");
    setDescription("");
  };

  const handleDeleteGlass = async (id) => {
    Alert.alert(
      "Delete Glass",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(id);
              const updatedProducts = await getProductsByType("glass");
              setGlassItems(updatedProducts);
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to delete the item. Please try again."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity className="bg-white rounded-lg shadow-lg p-4 mb-4 border">
      <Image
        source={{ uri: item.image }}
        className="w-full h-40 rounded-lg mb-2"
        resizeMode="cover"
      />
      <Text className="text-xl font-bold">{item.name}</Text>
      <Text className="text-gray-600">{item.description}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteGlass(item._id)}
        className="mt-4 bg-red-500 p-2 rounded-lg items-center w-1/2 mx-auto"
      >
        <Text className="text-white font-bold">Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/2.png")}
      style={{ flex: 1, padding: 16 }}
      imageStyle={{ opacity: 0.8 }}
    >
      <View className="flex-1 p-4 pt-10">
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            className="z-10"
            disabled={isUploading}
          >
            <FontAwesome name="chevron-left" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddGlass}
            className="bg-blue-500 p-2 rounded-lg"
            disabled={isUploading}
          >
            <Text className="text-white font-bold">Add Product</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={glassItems}
          keyExtractor={(item) => String(item._id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing} // Manage the refresh state
              onRefresh={onRefresh} // Trigger fetch on refresh
            />
          }
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text className="text-2xl font-bold mb-4">Add Glass</Text>
              <TouchableOpacity
                onPress={pickImage}
                className="mb-4"
                disabled={isUploading} // Disable when uploading
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
                editable={!isUploading} // Disable input when uploading
              />
              <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                className="border p-2 rounded w-full mb-2"
                editable={!isUploading} // Disable input when uploading
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  onPress={handleSaveGlass}
                  className={`${
                    isUploading ? "bg-gray-400" : "bg-blue-400"
                  } text-center p-4 rounded-lg flex-1 mr-1`}
                  disabled={isUploading} // Disable button during upload
                >
                  {isUploading ? (
                    <ActivityIndicator color="#fff" /> // Show spinner while uploading
                  ) : (
                    <Text className="text-white font-bold">Save</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="bg-red-500 p-4 rounded-lg text-center flex-1 ml-1"
                  disabled={isUploading} // Disable button during upload
                >
                  <Text className="text-white font-bold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
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
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
};

export default Glass;

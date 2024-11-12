import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import backgroundImage from "../../assets/bghome.png";
import {
  uploadImage,
  fetchImages,
  deleteImage,
  toggleFeaturedImage,
} from "../Services/Api";

const SettingsScreen = () => {
  const [images, setImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // New state for the selected image
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [featureLoading, setFeatureLoading] = useState(false);

  const fetchImagesFromServer = async () => {
    try {
      const fetchedImages = await fetchImages();
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageData = result.assets[0];
      setModalVisible(true);
      setLoading(true);
      try {
        await uploadImage(imageData);
        await fetchImagesFromServer();
      } catch (error) {
        Alert.alert("Upload failed", "There was an error uploading the image.");
      } finally {
        setLoading(false);
        setModalVisible(false);
      }
    }
  };

  const deleteSelectedImage = async () => {
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          setDeleteLoading(true);
          try {
            await deleteImage(selectedImageId);
            setImages((prevImages) =>
              prevImages.filter((img) => img._id !== selectedImageId)
            );
            setModalVisible(false);
          } catch (error) {
            console.error("Error deleting image:", error);
          } finally {
            setDeleteLoading(false);
          }
        },
      },
    ]);
  };

  const featureImage = async () => {
    setFeatureLoading(true);
    try {
      await toggleFeaturedImage(selectedImageId);
      await fetchImagesFromServer();
      setModalVisible(false);
    } catch (error) {
      console.error("Error toggling featured:", error);
    } finally {
      setFeatureLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchImagesFromServer();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchImagesFromServer();
  }, []);

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1, padding: 16 }}
      imageStyle={{ opacity: 0.8 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="text-2xl font-bold mb-6">Project Gallery</Text>

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-md mb-4"
          onPress={pickImage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center">Add Image</Text>
          )}
        </TouchableOpacity>

        <View className="flex flex-col mb-4">
          <View className="flex flex-row">
            <View className="bg-green-500 my-auto w-3 h-3" />
            <Text>The image is featured</Text>
          </View>

          <View className="flex flex-row">
            <View className="bg-gray-500 my-auto w-3 h-3" />
            <Text>Not featured</Text>
          </View>
        </View>

        {images.length > 0 ? (
          images.map((image) => (
            <TouchableOpacity
              key={image._id}
              onPress={() => {
                setSelectedImageId(image._id);
                setSelectedImage(image.uri); // Set the selected image URI for display
                setModalVisible(true);
              }}
              className="w-full h-[300px] mb-2 border-4 rounded-lg overflow-hidden"
              style={{
                borderColor: image.featured ? "green" : "gray",
                borderWidth: 2,
              }}
            >
              <Image
                source={{ uri: image.uri }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-gray-500 text-center">No images uploaded</Text>
        )}
      </ScrollView>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "80%",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                padding: 5,
                zIndex: 10,
              }}
            >
              <Text className="text-xl font-bold">X</Text>
            </TouchableOpacity>

            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={{
                  width: "100%",
                  height: 200,
                  marginBottom: 20,
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={deleteSelectedImage}
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 5,
                  width: "48%",
                }}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Delete Image
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={featureImage}
                style={{
                  backgroundColor: "green",
                  padding: 10,
                  borderRadius: 5,
                  width: "48%",
                }}
                disabled={featureLoading}
              >
                {featureLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "white", textAlign: "center" }}>
                    {images.find((img) => img._id === selectedImageId)?.featured
                      ? "Unfeature Image"
                      : "Feature Image"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading && (
        <Modal transparent={true} animationType="none" visible={modalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={{ marginTop: 10 }}>Uploading...</Text>
            </View>
          </View>
        </Modal>
      )}
    </ImageBackground>
  );
};

export default SettingsScreen;

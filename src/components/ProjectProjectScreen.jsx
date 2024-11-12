import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  ImageBackground,
  StyleSheet,
} from "react-native";
import backgroundImage from "../../assets/bghome.png";
import { getProjectsByStatus } from "../Services/Api";

const ProjectProjectScreen = () => {
  const [selectedStatus, setSelectedStatus] = useState("ongoing");
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProjectsByStatus(selectedStatus);
  }, [selectedStatus]);

  const loadProjectsByStatus = async (status) => {
    setIsLoading(true);
    setSearchQuery("");
    try {
      const fetchedProjects = await getProjectsByStatus(status);
      setProjects(fetchedProjects);
      setFilteredProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab switch
  const handleTabClick = (status) => {
    setSelectedStatus(status);
    setSearchQuery("");
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
          formatDate(project.createdAt).includes(searchQuery)
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1, padding: 16 }}
      imageStyle={{ opacity: 0.8 }}
    >
      <View className="flex">
        <Text className="text-2xl font-bold text-gray-700 mt-10">Projects</Text>
      </View>

      {/* Search bar */}
      <TextInput
        className="bg-white p-2 mb-4 rounded-md border"
        placeholder="Search by title, name, service, or date..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Tabs for Ongoing and Finished */}
      <View
        className="border-b border-blue-400 rounded-lg mb-3"
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => handleTabClick("ongoing")}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.tabText,
                selectedStatus === "ongoing" ? styles.selectedTab : null,
              ]}
            >
              Ongoing
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleTabClick("finished")}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.tabText,
                selectedStatus === "finished" ? styles.selectedTab : null,
              ]}
            >
              Finished
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Show data or loading spinner */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : filteredProjects.length === 0 ? (
        <Text className="text-center mt-4">No projects found.</Text>
      ) : (
        <ScrollView style={{ maxHeight: "60%" }}>
          {filteredProjects.map((project) => (
            <View
              key={project._id}
              className="flex-row justify-between border bg-white p-4 mb-2 rounded-lg shadow-md"
            >
              <View>
                <Text className="text-lg font-bold">{project.title}</Text>
                <Text className="text-gray-600">{project.name}</Text>
                <Text className="text-gray-600">{project.service}</Text>
                <Text className="text-gray-600">
                  Project Started: {formatDate(project.createdAt)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  tabText: {
    fontSize: 16,
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  selectedTab: {
    backgroundColor: "rgb(96 165 250)",
    fontSize: 18,
    color: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default ProjectProjectScreen;

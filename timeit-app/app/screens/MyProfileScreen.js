import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Screen from "../components/Screen";
import colors from "../config/colors";
import users from "../api/users";

const MyProfileScreen = ({ route }) => {
  const userData = route.params.data;

  const [image, setImage] = useState(userData.profilePhoto);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (Platform.OS === "web") {
        setImage(result.uri);
        await users.uploadAvatar(result.uri);
      } else {
        setImage(result.assets[0].uri);
        await users.uploadAvatar(result.assets[0].uri);
      }
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.overlay} onPress={pickImage}>
          {image ? (
            <Image style={styles.avatar} source={{ uri: image }} />
          ) : (
            <Image
              style={styles.avatar}
              source={require("../assets/profile.png")}
            />
          )}
          <Text style={styles.overlayText}>Tap to update</Text>
        </TouchableOpacity>
        <Text style={styles.name}>
          {userData.firstname} {userData.lastname}
        </Text>
        <Text style={styles.email}>{userData.email}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}></Text>
            <Text style={styles.statValue}></Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingTop: 2,
    backgroundColor: colors.light,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  overlay: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayText: {
    position: "absolute",
    fontSize: 14,
    color: "white",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 10,
    padding: 4,
    bottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: "gray",
    marginBottom: 20,
  },
  screen: {
    paddingTop: 2,
    backgroundColor: colors.light,
  },
  statsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "80%",
  },
  stat: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 16,
    color: "gray",
  },
  statValue: {
    fontSize: 20,
    marginTop: 5,
  },
});

export default MyProfileScreen;

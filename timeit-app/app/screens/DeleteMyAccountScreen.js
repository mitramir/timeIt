import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import useAuth from "../auth/useAuth";
import users from "../api/users";

const DeleteMyAccountScreen = () => {
  const { user, logOut } = useAuth();

  const handleDelete = async () => {
    Alert.alert(
      "Permanently Delete Account",
      "Your data will no longer be available! Are you sure you want to delete your account?",
      [
        {
          text: "Yes",
          onPress: async () => {
            try {
              // Wait for the account deletion operation to complete
              const response = await users.deleteAccount();

              // After deletion is successful, log the user out
              if (response.ok) {
                Alert.alert(
                  "Successful!",
                  "Your account deleted! you will automaticaly signout!"
                );
                logOut();
              } else {
                Alert.alert("Failed!", response.data.message);
              }
            } catch (error) {
              console.error("Account deletion error:", error);
            }
          },
        },
        { text: "No" },
      ]
    );
  };

  return (
    <Screen style={styles.container}>
      <AppText>Are you sure you want to Delete your account? </AppText>

      <AppButton
        color="danger"
        title="Delete My Account"
        onPress={handleDelete}
        textStyle={{ fontSize: 12, fontWeight: "bold" }}
      />
    </Screen>
  );
};

export default DeleteMyAccountScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    textAlign: "center",
    padding: 20,
  },
});

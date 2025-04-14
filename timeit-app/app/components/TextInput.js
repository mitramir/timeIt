import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../config/styles";

function AppTextInput({ icon, width = "100%", ...otherProps }) {
  const inputRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prev) => {
      otherProps.togglePassword(!prev);
      return !prev;
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        inputRef.current.focus();
      }}
    >
      <View style={[styles.container, { width }]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={defaultStyles.colors.medium}
            style={styles.icon}
          />
        )}

        <TextInput
          placeholderTextColor={defaultStyles.colors.medium}
          style={defaultStyles.text}
          ref={inputRef}
          {...otherProps}
        />
        {otherProps.rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={toggleShowPassword}
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.lightsecondary,
    borderRadius: 5,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: defaultStyles.colors.medium,
  },
  icon: {
    marginRight: 10,
  },
  rightIcon: {
    position: "absolute",
    height: "100%",
    top: "70%",
    right: 15,
  },
});

export default AppTextInput;

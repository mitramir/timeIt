import React, { useState } from "react";
import { StyleSheet, Image } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
  const auth = useAuth();
  const [loginFailed, setLoginFailed] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSumbit = async ({ email, password }) => {
    const result = await authApi.login(email, password);

    if (!result.ok) {
      setLoginErrorMsg(result.data);
      return setLoginFailed(true);
    }

    setLoginFailed(false);
    auth.logIn(result.data);
  };

  const togglePasswordVisibility = (value) => {
    setPasswordVisible(value);
  };

  return (
    <Screen style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../assets/timeit-icon-2.png")}
      />

      <Form
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSumbit}
        validationSchema={validationSchema}
      >
        <ErrorMessage error={loginErrorMsg} visible={loginFailed} />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          textContentType="password"
          togglePassword={togglePasswordVisibility}
          rightIcon={{
            name: passwordVisible ? "eye-off" : "eye",
            type: "feather",
          }}
        />
        <SubmitButton title="Login" />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.white,
  },
  logo: {
    width: 240,
    height: 80,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
});

export default LoginScreen;

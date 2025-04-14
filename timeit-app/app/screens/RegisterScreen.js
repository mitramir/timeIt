import React, { useState } from "react";
import { StyleSheet, Image, View } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import ActivityIndicator from "../components/ActivityIndicator";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import userApi from "../api/users";
import useApi from "../hooks/useApi";
import colors from "../config/colors";
import AppText from "../components/Text";

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required().label("First Name"),
  lastname: Yup.string().label("Last Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(5).label("Password"),
});

function RegisterScreen() {
  const registerApi = useApi(userApi.register);
  const loginApi = useApi(authApi.login);
  const auth = useAuth();
  const [error, setError] = useState();
  const [confirmMsg, SetConfirmMsg] = useState(false);

  const handleSubmit = async (userInfo) => {
    const result = await registerApi.request(userInfo);
    if (!result.ok) {
      if (result.data) setError(result.data);
      else {
        setError("An unexpected error occured.");
      }
      return;
    }
    SetConfirmMsg(true);
    //User Must Confirm email first
    // const { data: authToken } = await loginApi.request(
    //   userInfo.email,
    //   userInfo.password
    // );

    // auth.logIn(authToken);
  };

  return (
    <>
      <ActivityIndicator visible={registerApi.loading || loginApi.loading} />
      <Screen style={styles.container}>
        {!confirmMsg && (
          <Form
            initialValues={{
              firstname: "",
              lastname: "",
              email: "",
              password: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <ErrorMessage error={error} visible={error} />
            <FormField
              autoCorrect={false}
              icon="account"
              name="firstname"
              placeholder="First Name"
            />
            <FormField
              autoCorrect={false}
              icon="account"
              name="lastname"
              placeholder="Last Name"
            />
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
              secureTextEntry
              textContentType="password"
            />
            <SubmitButton title="SIGN UP" />
          </Form>
        )}

        {confirmMsg && (
          <View>
            <Image
              style={styles.logo}
              source={require("../assets/timeit-icon-2.png")}
            />
            <AppText style={styles.msg}>
              Great.. Please confirm your email! We have sent you an email with
              confirmation link.
            </AppText>
          </View>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 10,
  },
  logo: {
    width: 240,
    height: 80,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  msg: {
    marginTop: "50%",
    marginHorizontal: 30,
    fontWeight: "500",
  },
});

export default RegisterScreen;

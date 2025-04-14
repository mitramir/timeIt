import React, { useEffect, useState } from "react";
import { StyleSheet, Image } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import colors from "../config/colors";
import passwordApi from "../api/password";
import AppText from "../components/AppText";
import ActivityLoading from "../components/ActivityLoading";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

function ForgotPassScreen(props) {
  const [passwordResetFailed, setPasswordResetFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSumbit = async ({ email }) => {
    setLoading(true);
    const response = await passwordApi.passwordReset(email);

    if (!response.ok) {
      setPasswordResetFailed(true);
      setLoading(false);
      return;
    }
    setPasswordResetFailed(false);
    setLoading(false);
    setMsg(response.data);
  };
  return (
    <>
      <ActivityLoading visible={loading} />
      <Screen style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/timeit-icon.png")}
        />

        <Form
          initialValues={{ email: "" }}
          onSubmit={handleSumbit}
          validationSchema={validationSchema}
        >
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <ErrorMessage error="Invalid email" visible={passwordResetFailed} />
          <SubmitButton title="Submit" />
        </Form>
        <AppText style={styles.msg}>{msg}</AppText>
      </Screen>
    </>
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
  msg: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotPassScreen;

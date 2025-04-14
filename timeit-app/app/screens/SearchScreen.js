import React from "react";
import { StyleSheet, Button, View } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import searchApi from "../api/search";
import scanApi from "../api/scan";
import routes from "../navigation/routes";
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
  query: Yup.string().required().label("Search Term"),
});

function SearchScreen({ navigation }) {
  const handleSumbit = async ({ query }) => {
    navigation.navigate(routes.SEARCH_RESULT, {
      title: query,
    });
  };

  return (
    <Screen style={styles.container}>
      <Form
        initialValues={{ query: "" }}
        onSubmit={handleSumbit}
        validationSchema={validationSchema}
      >
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="text-search"
          name="query"
          placeholder="Search Terms"
        />
        <View style={styles.btnContainer}>
          <SubmitButton title="Search" />
        </View>
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    width: "30%",
    alignSelf: "flex-end",
  },
  container: {
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
export default SearchScreen;

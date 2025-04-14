import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import Screen from "../components/Screen";
import {
  ListMessage,
  ListItemDeleteAction,
  ListItemSeparator,
} from "../components/lists";
import AppText from "../components/AppText";
import colors from "../config/colors";

const initialMessages = [
  {
    id: 1,
    title: "",
    description:
      'Hello!\n Welcome to TimeIt AI, where convenience meets innovation! We are thrilled to have you join our growing community of users. Get ready to experience a seamless and personalized journey as we bring you a world of possibilities right at your fingertips. With TimeIt AI app, you can scan the barcode of a book (or search the book in our app) to check the selling eligibility, estimated Time to Sell, and more importantly the decision of "Buy" or "Not to Buy" the book.\n\
    Our intuitive interface and user-friendly design ensure that you can navigate the app with ease, making your journey with us enjoyable from the start. Thank you for choosing us as your trusted companion on this exciting journey. We can\'t wait to see what you\'ll achieve!',
  },
];

function MessagesScreen(props) {
  const [messages, setMessages] = useState(initialMessages);
  const [refreshing, setRefreshing] = useState(false);

  const handleDelete = (message) => {
    // Delete the message from messages
    setMessages(messages.filter((m) => m.id !== message.id));
  };

  return (
    <Screen style={styles.screen}>
      {messages.length == 0 && (
        <>
          <AppText style={styles.text}>
            List is empty! You don't have any message
          </AppText>
        </>
      )}
      <FlatList
        data={messages}
        keyExtractor={(message) => message.id.toString()}
        renderItem={({ item }) => (
          <ListMessage
            title={item.title}
            subTitle={item.description}
            onPress={() => console.log("Message selected", item)}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => handleDelete(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={refreshing}
        onRefresh={() => {
          setMessages([
            {
              id: 2,
              title: "T2",
              description: "D2",
              image: require("../assets/ti-icon2-small.png"),
            },
          ]);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  text: {
    padding: 20,
  },
});

export default MessagesScreen;

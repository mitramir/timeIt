import React, { useEffect } from "react";
import { Alert, StyleSheet, View, FlatList } from "react-native";

import { ListItem, ListItemSeparator } from "../components/lists";
import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/AppButton";
import colors from "../config/colors";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import useAuth from "../auth/useAuth";
import useApi from "../hooks/useApi";
import users from "../api/users";
import AppText from "../components/AppText";

const menuItems = [
  {
    title: "My Plan/Credit",
    icon: {
      name: "account-cash",
      backgroundColor: colors.yellow,
    },
    targetScreen: routes.MY_PLAN_CREDIT_SCREEN,
  },
  {
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: routes.MY_LISTINGS,
  },
  {
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    targetScreen: routes.MY_MESSAGES,
  },
];

function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();

  const getMyDetail = useApi(users.me);

  useEffect(() => {
    getMyDetail.request();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getMyDetail.request();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, getMyDetail.request]);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Yes", onPress: () => logOut() },
      { text: "No" },
    ]);
  };

  return (
    <>
      <ActivityIndicator visible={getMyDetail.loading} />
      <Screen style={styles.screen}>
        {(getMyDetail.error || !getMyDetail.data) && (
          <>
            <AppText>Couldn't retrieve data</AppText>
            <Button title="Reload" onPress={getMyDetail.request} />
          </>
        )}
        <View style={styles.container}>
          {getMyDetail.data && getMyDetail.data.length !== 0 && (
            <ListItem
              title={
                getMyDetail.data.firstname + " " + getMyDetail.data.lastname
              }
              subTitle={getMyDetail.data.email}
              setImage={true}
              image={getMyDetail.data.profilePhoto}
              onPress={() =>
                navigation.navigate(routes.MY_PROFILE, {
                  data: getMyDetail.data,
                })
              }
            />
          )}
        </View>
        <View style={styles.container}>
          <FlatList
            data={menuItems}
            keyExtractor={(menuItem) => menuItem.title}
            ItemSeparatorComponent={ListItemSeparator}
            renderItem={({ item }) => (
              <ListItem
                title={item.title}
                IconComponent={
                  <Icon
                    name={item.icon.name}
                    backgroundColor={item.icon.backgroundColor}
                  />
                }
                onPress={() => navigation.navigate(item.targetScreen)}
              />
            )}
          />
        </View>
        <ListItemSeparator />
        <ListItem
          title="Log Out"
          IconComponent={
            <Icon name="logout" backgroundColor={colors.grayish} />
          }
          onPress={handleLogout}
        />
        <View style={styles.lastItem}>
          <ListItem
            title="Delete My Account"
            IconComponent={<Icon name="delete" backgroundColor="#ff5252" />}
            onPress={() => navigation.navigate(routes.DELETE_MY_ACCOUNT)}
          />
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  lastItem: {
    // paddingTop: 210,
    paddingBottom: 0,
  },
  screen: {
    paddingTop: 2,
    backgroundColor: colors.light,
  },
});

export default AccountScreen;

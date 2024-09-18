import React from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.slideHeader}>
        <MaterialCommunityIcons
          size={48}
          name={"weather-sunny"}
          color={"#fff"}
        />
        <Text style={styles.welcomeTitle}>Welcome to myWeather˚</Text>
        <Text style={styles.subtitle}>View the weather in your city here!</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate("Home")}
        >
          <AntDesign name="pluscircleo" size={24} color="white" />
        </Pressable>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.welcomeTitle}>I am happy to see you! :D</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffb400",
  },
  addButton: {
    paddingTop: 0,
    paddingLeft: 0,
  },
  slideHeader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footerContainer: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingLeft: 25,
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 38,
    color: "white",
  },
  subtitle: {
    fontSize: 24,
    color: "#fff",
  },
  error: {
    color: "#d32f2f",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default Welcome;

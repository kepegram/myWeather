import React from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={["#ffffff", "#0042ff"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="weather-windy-variant"
            size={350}
            color="#fff"
            style={styles.icon}
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.welcomeTitle}>myWeather˚</Text>

          <Pressable
            style={({ pressed }) => [
              styles.getStartedButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate("Home")}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 70,
  },
  welcomeTitle: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "System",
  },
  getStartedButton: {
    backgroundColor: "#000",
    width: "60%",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  getStartedText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "System",
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
});

export default Welcome;

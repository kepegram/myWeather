import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

const Weather = ({ route }) => {
  const navigation = useNavigation();
  const [color, setColor] = useState("");
  const [icon, setIcon] = useState("");

  const { entry } = route.params || {};

  // Update state when `entry` changes
  useEffect(() => {
    if (entry) {
      switch (entry.description) {
        case "clear sky":
          setIcon("weather-sunny");
          setColor("#ffcc29");
          break;
        case "few clouds":
          setIcon("weather-partly-cloudy");
          setColor("#96d5f0");
          break;
        case "scattered clouds":
          setIcon("weather-cloudy");
          setColor("#afbfc6");
          break;
        case "overcast clouds":
          setIcon("weather-cloudy");
          setColor("#afbfc6");
          break;
        case "broken clouds":
          setIcon("weather-partly-cloudy");
          setColor("#9dbfd5");
          break;
        case "shower rain":
          setIcon("weather-partly-rainy");
          setColor("#7495a4");
          break;
        case "rain":
          setIcon("weather-pouring");
          setColor("#7495a4");
          break;
        case "moderate rain":
          setIcon("weather-pouring");
          setColor("#7495a4");
          break;
        case "snow":
          setIcon("weather-snowy");
          setColor("#ffffff"); // Optional: set a default color for snow
          break;
        case "mist":
          setIcon("weather-fog");
          setColor("#afbfc6");
          break;
        default:
          setIcon("weather-sunny");
          setColor("black");
      }
    }
  }, [entry]);

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>No weather entry selected</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </Pressable>
      <View style={styles.slideHeader}>
        <MaterialCommunityIcons size={48} name={icon} color={"#fff"} />
        <Text style={styles.welcomeTitle}>{entry.city}</Text>
        <Text style={styles.subtitle}>{entry.temp}˚F</Text>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.welcomeTitle}>{entry.description}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0f7fa",
  },
  addButton: {
    paddingTop: 30,
    paddingLeft: 8,
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

export default Weather;

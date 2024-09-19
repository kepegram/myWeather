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
          setColor("#ffffff");
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
    <SafeAreaView style={[styles.container, { backgroundColor: color }]}>
      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </Pressable>
      <View style={styles.header}>
        <MaterialCommunityIcons size={64} name={icon} color={"#fff"} />
        <View style={styles.temperatureContainer}>
          <Text style={styles.city}>{entry.city}</Text>
          <Text style={styles.temperature}>{entry.temp}˚F</Text>
          <Text style={styles.description}>{entry.description}</Text>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidity:</Text>
          <Text style={styles.detailValue}>{entry.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Pressure:</Text>
          <Text style={styles.detailValue}>{entry.pressure} hPa</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Wind Speed:</Text>
          <Text style={styles.detailValue}>{entry.windSpeed} m/s</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    paddingTop: 30,
  },
  header: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  temperatureContainer: {
    alignItems: "center",
  },
  city: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  temperature: {
    fontSize: 64,
    color: "white",
    fontWeight: "bold",
  },
  description: {
    fontSize: 24,
    color: "white",
    marginTop: 10,
    textTransform: "capitalize",
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 18,
    color: "white",
  },
  error: {
    color: "#d32f2f",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default Weather;

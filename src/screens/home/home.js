import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  TextInput,
} from "react-native";
import { getWeather } from "../../utils/API/weatherAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { majorCities } from "../../utils/cities";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Sort cities alphabetically
const sortedCities = majorCities.sort((a, b) => a.label.localeCompare(b.label));

const WeatherEntry = ({ entry, onDelete, onPress }) => {
  let icon = "";
  let color = "";

  switch (entry.description) {
    case "clear sky":
      icon = "weather-sunny";
      color = "#ffcc29";
      break;
    case "few clouds":
      icon = "weather-partly-cloudy";
      color = "#96d5f0";
      break;
    case "scattered clouds":
      icon = "weather-cloudy";
      color = "#afbfc6";
      break;
    case "overcast clouds":
      icon = "weather-cloudy";
      color = "#afbfc6";
      break;
    case "broken clouds":
      icon = "weather-partly-cloudy";
      color = "#9dbfd5";
      break;
    case "shower rain":
      icon = "weather-partly-rainy";
      color = "#7495a4";
      break;
    case "rain":
      icon = "weather-pouring";
      color = "#7495a4";
      break;
    case "moderate rain":
      icon = "weather-pouring";
      color = "#7495a4";
      break;
    case "snow":
      icon = "weather-snowy";
      color = "#ffffff";
      break;
    case "mist":
      icon = "weather-fog";
      color = "#afbfc6";
      break;
    default:
      icon = "weather-sunny";
      color = "black";
  }

  return (
    <TouchableOpacity
      style={[styles.weatherContainer, { borderColor: color }]}
      onPress={() => onPress(entry)}
    >
      <View style={styles.weatherHeader}>
        <Text style={styles.weatherCity}>{entry.city}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(entry.id)}
        >
          <MaterialIcons name="delete" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <MaterialCommunityIcons size={48} name={icon} color={color} />
      <Text style={[styles.weatherTemp, { color }]}>{entry.temp}°F</Text>
      <Text style={styles.weatherDescription}>{entry.description}</Text>
      <View style={styles.weatherDetailsContainer}>
        <Text style={styles.weatherDetails}>Humidity: {entry.humidity}%</Text>
        <Text style={styles.weatherDetails}>
          Pressure: {entry.pressure} hPa
        </Text>
        <Text style={styles.weatherDetails}>
          Wind Speed: {entry.windSpeed} m/s
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [weatherEntries, setWeatherEntries] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const navigation = useNavigation();

  const fetchWeather = async (cityName) => {
    const queryCity = cityName.trim();

    if (queryCity === "") {
      setError("City name cannot be empty");
      return;
    }

    try {
      const data = await getWeather(queryCity);

      if (data) {
        const newEntry = {
          id: new Date().toISOString(),
          city: data.name,
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          windSpeed: data.wind.speed,
        };
        const updatedEntries = [...weatherEntries, newEntry];
        setWeatherEntries(updatedEntries);
        await AsyncStorage.setItem(
          "@weatherApp:weatherEntries",
          JSON.stringify(updatedEntries)
        );
        setSearchTerm("");
        setError("");
      } else {
        setError("Unable to fetch weather data");
      }
    } catch (err) {
      console.error("Error fetching or saving data: ", err);
      setError("An error occurred");
    }
  };

  const deleteEntry = useCallback(
    async (id) => {
      const updatedEntries = weatherEntries.filter((entry) => entry.id !== id);
      setWeatherEntries(updatedEntries);
      await AsyncStorage.setItem(
        "@weatherApp:weatherEntries",
        JSON.stringify(updatedEntries)
      );
    },
    [weatherEntries]
  );

  const handlePress = (entry) => {
    navigation.navigate("Weather", { entry });
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    if (term === "") {
      setFilteredCities([]);
    } else {
      setFilteredCities(
        sortedCities
          .filter((city) =>
            city.label.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 3)
      );
    }
  };

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const savedEntries = await AsyncStorage.getItem(
          "@weatherApp:weatherEntries"
        );
        if (savedEntries) {
          setWeatherEntries(JSON.parse(savedEntries));
        }
      } catch (err) {
        console.error("Error loading saved entries: ", err);
      }
    };

    loadEntries();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>myWeather˚</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <MaterialIcons
            name="search"
            size={24}
            color="#8e8e93"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a city..."
            value={searchTerm}
            onChangeText={handleSearchChange}
            onSubmitEditing={() => {
              if (searchTerm) {
                fetchWeather(filteredCities[0]?.label || searchTerm);
              }
            }}
          />
        </View>
        {filteredCities.length > 0 && (
          <View style={styles.autocompleteContainer}>
            {filteredCities.map((city) => (
              <TouchableOpacity
                key={city.value}
                style={styles.autocompleteItem}
                onPress={() => {
                  setSearchTerm(city.label);
                  fetchWeather(city.label);
                  setFilteredCities([]);
                }}
              >
                <Text style={styles.autocompleteItemText}>
                  {city.label}, {city.state}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={weatherEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WeatherEntry
            entry={item}
            onDelete={deleteEntry}
            onPress={handlePress}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyList}>
            No weather entries. Start by searching for a city above!
          </Text>
        }
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f7",
  },
  headerContainer: {
    flexDirection: "row",
    paddingTop: 30,
    marginBottom: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1c1c1e",
    fontFamily: "System",
  },
  searchContainer: {
    marginBottom: 20,
    position: "relative",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1c1c1e",
    fontFamily: "System",
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  autocompleteContainer: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 150,
    position: "absolute",
    width: "100%",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  autocompleteItem: {
    padding: 10,
  },
  autocompleteItemText: {
    fontSize: 16,
    color: "black",
  },
  error: {
    color: "#ff3b30",
    textAlign: "center",
    fontSize: 14,
    marginVertical: 10,
  },
  weatherContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weatherCity: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  weatherTemp: {
    fontSize: 24,
    color: "#007aff",
    marginTop: 5,
  },
  weatherDescription: {
    fontSize: 16,
    color: "#8e8e93",
    marginTop: 5,
    textTransform: "capitalize",
  },
  weatherDetailsContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weatherDetails: {
    fontSize: 14,
    color: "#8e8e93",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    padding: 8,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContent: {
    flexGrow: 1,
  },
  emptyList: {
    textAlign: "center",
    fontSize: 16,
    color: "#8e8e93",
  },
});

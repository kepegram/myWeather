import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  View,
  TextInput,
  Platform,
  Image,
} from "react-native";
import { getWeather } from "../../utils/API/weatherAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { majorCities } from "../../utils/cities";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Sort cities alphabetically
const sortedCities = majorCities.sort((a, b) => a.label.localeCompare(b.label));

const WeatherEntry = ({ entry, onDelete, onPress }) => (
  <TouchableOpacity
    style={styles.weatherContainer}
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
    <Text style={styles.weatherTemp}>{entry.temp}°F</Text>
    <Text style={styles.weatherDescription}>{entry.description}</Text>
  </TouchableOpacity>
);

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [error, setError] = useState("");
  const [weatherEntries, setWeatherEntries] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const navigation = useNavigation();

  // Fetch weather data
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
        };
        const updatedEntries = [...weatherEntries, newEntry];
        setWeatherEntries(updatedEntries);
        await AsyncStorage.setItem(
          "@weatherApp:weatherEntries",
          JSON.stringify(updatedEntries)
        );
        setSelectedCity("");
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

  // Delete weather entry
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

  // Handle press event for entries
  const handlePress = (entry) => {
    navigation.navigate("Weather", { entry });
  };

  // Filter cities based on the search term
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
          .slice(0, 3) // Limit suggestions to 3
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
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>myWeather˚</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <MaterialIcons
            name="search"
            size={24}
            color="#ffb400"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a city..."
            value={searchTerm}
            onChangeText={handleSearchChange}
            onSubmitEditing={() => {
              if (
                searchTerm &&
                !filteredCities.find(
                  (city) =>
                    city.label.toLowerCase() === searchTerm.toLowerCase()
                )
              ) {
                fetchWeather(searchTerm);
              } else if (filteredCities.length > 0) {
                fetchWeather(filteredCities[0].label);
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
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F0F4F8",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  header: {
    fontSize: 36,
    fontWeight: "700",
    color: "#ffb400",
    textAlign: "center",
    marginRight: 10,
  },
  searchContainer: {
    marginBottom: 20,
    position: "relative",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  autocompleteContainer: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    maxHeight: 150,
    position: "absolute",
    width: "100%",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  autocompleteItem: {
    padding: 10,
  },
  autocompleteItemText: {
    fontSize: 16,
    color: "#ffb400",
  },
  error: {
    color: "#d32f2f",
    textAlign: "center",
    fontSize: 14,
    marginVertical: 10,
  },
  weatherContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    color: "#333",
  },
  weatherTemp: {
    fontSize: 24,
    color: "#ffb400",
    marginTop: 5,
  },
  weatherDescription: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "#d32f2f",
    padding: 8,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

import axios from "axios";
import { API_KEY, BASE_URL } from "./api";

export const getWeather = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "imperial",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data: ", error);
    return null;
  }
};

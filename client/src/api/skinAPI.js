import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
axios.defaults.timeout = 5000;

export const fetchSkins = async () => {
  try {
    const response = await axios.get("/api/skins");
    return response.data;
  } catch (error) {
    console.error("Error fetching skins:", error);
    return [];
  }
};

import axios from "axios";

// Set the base URL for Axios
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
axios.defaults.timeout = 5000; // 5 seconds timeout

// Fetch skins from the API
export const fetchSkins = async () => {
  try {
    const response = await axios.get("/api/skins");
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("No Response from Server:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return [];
  }
};

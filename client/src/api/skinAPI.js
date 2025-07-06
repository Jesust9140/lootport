import axios from "axios";

// I should probably create a seperate axios instance for skin API calls
// and maybe add request/response interceptors for better error handling
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
axios.defaults.timeout = 5000; // might need to increase this for large responses

export const fetchSkins = async () => {
  try {
    const response = await axios.get("/api/skins");
    return response.data;
  } catch (error) {
    console.error("Error fetching skins:", error);
    // TODO: I should implement proper error handling here instead of just returning empty array
    // maybe show user-friendly error messages or retry logic
    return [];
  }
};

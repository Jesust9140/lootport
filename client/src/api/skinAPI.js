import axios from "axios";

const API_URL = "http://localhost:5000/api/skins";

export const fetchSkins = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addSkin = async (skinData) => {
  const res = await axios.post(API_URL, skinData);
  return res.data;
};

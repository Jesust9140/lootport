import express from "express";
import Skin from "../models/Skin.js";

const router = express.Router();

// TODO: I should add pagination, filtering, and search functionality here
// also need error handling and maybe caching for better performance
router.get("/", async (req, res) => {
  const skins = await Skin.find();
  res.json(skins);
});

export default router;

import express from "express";
import Skin from "../models/Skin.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const skins = await Skin.find();
  res.json(skins);
});

export default router;

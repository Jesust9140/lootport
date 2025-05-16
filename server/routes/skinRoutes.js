const express = require("express");
const router = express.Router();
const { getSkins, addSkin } = require("../controllers/SkinController");

router.get("/", getSkins);
router.post("/", addSkin);

module.exports = router;

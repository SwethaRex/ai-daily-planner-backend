const express = require("express");
const router = express.Router();

const {
  planDay,
  allSchedules,
  chatWithAI,
} = require("../controllers/aiController");
const validate = require("../middleware/validate");
const { chatSchema } = require("../schemas/aiSchema");

router.post("/plan", planDay);
router.get("/schedules", allSchedules);
router.post("/chat", chatWithAI);
router.post("/chat", validate(chatSchema), chatWithAI);

module.exports = router;

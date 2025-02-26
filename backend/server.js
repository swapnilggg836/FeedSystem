const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/feedbackDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Schema & Model
const feedbackSchema = new mongoose.Schema({
  rating: Number,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// API Routes

// 📌 POST Feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const { rating, description } = req.body;
    if (!description) return res.status(400).json({ error: "Feedback cannot be empty" });

    const newFeedback = new Feedback({ rating, description });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 GET Feedback
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

import { useState } from "react";
import "./FeedbackForm.css"; // Ensure this file exists

export default function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStarClick = (value) => setRating(value);

  const clearFeedback = () => {
    setFeedbackText("");
    setRating(5);
    setMessage("");
  };

  const postFeedback = async () => {
    if (!feedbackText.trim()) {
      setMessage("❌ Feedback cannot be empty!");
      return;
    }

    const feedbackData = { rating, description: feedbackText };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage("✅ Feedback posted successfully!");
        clearFeedback();
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to post feedback"}`);
      }
    } catch (error) {
      setLoading(false);
      setMessage("❌ Error connecting to the server.");
    }
  };

  return (
    <div className="feedback-container">
      <div className="profile">
        <img src="photo.jpg" alt="Profile" />
        <p>Om Gaikwad</p>
      </div>

      <div className="rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "active" : "inactive"}
            onClick={() => handleStarClick(star)}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        placeholder="Share details of your experience at this place..."
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
      ></textarea>

      <div className="button-group">
        <button className="cancel-btn" onClick={clearFeedback}>Cancel</button>
        <button
          className={`post-btn ${!feedbackText.trim() ? "disabled" : ""}`}
          onClick={postFeedback}
          disabled={!feedbackText.trim() || loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
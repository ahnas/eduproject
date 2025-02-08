import React, { useEffect, useState, useContext, use } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Reviews.css";
import axios from 'axios';


const Reviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/register/');
        const data = response.data;
        const uid = data.find(u => u.username === user);
        setUserID(uid.id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserID();
  }, []);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/reviews/");
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim() || rating === 0) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/reviews/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student: userID,
          review_text: feedback,
          rating,
        }),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews((prev) => [newReview, ...prev]);
        setFeedback("");
        setRating(0);
      } else {
        console.error("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={index < rating ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  return (
    <div className="reviews-container">
      <h1 className="heading">Student Reviews</h1>

      {user ? (
        <div className="feedback-form">
          <h2>Share Your Feedback</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              className="feedback-input"
            />
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={star <= rating ? "star-button filled" : "star-button"}
                >
                  ★
                </button>
              ))}
            </div>
            <button type="submit" className="submit-btn">
              Submit Feedback
            </button>
          </form>
        </div>
      ) : (
        <p className="login-prompt">Log in to submit your feedback.</p>
      )}

      <div className="reviews-list">
        <h2>What Others Say</h2>
        {reviews.length === 0 ? (
          <p className="no-reviews">No feedback available yet.</p>
        ) : (
          <ul>
            {reviews.map((review) => (
              <li key={review.id} className="review-item">
                <p className="student-id">Student Name: {review.reviewer_username}</p>
                <p className="review-text">{review.review_text}</p>
                <div className="review-rating">{renderStars(review.rating)}</div>
                <p className="review-date">
                  Posted on {new Date(review.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Reviews;

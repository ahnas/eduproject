import React, { useState, useEffect, useContext, useCallback } from "react";
import questionsData from "./questions.json";
import "./Assessment.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Assessment = () => {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [quizFinished, setQuizFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [userID, setUserID] = useState(null);

  // Shuffle and load 10 questions from the dataset
  useEffect(() => {
    const shuffledQuestions = [...questionsData]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    setQuestions(shuffledQuestions);
  }, []);

  // Fetch user ID from backend
  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/register/");
        const userData = response.data.find((u) => u.username === user);
        if (userData) setUserID(userData.id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    if (user) fetchUserID();
  }, [user]);

  // Handle next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(120);
    } else {
      setQuizFinished(true);
      saveScoreToBackend();
    }
  }, [currentQuestion, questions.length]);

  // Timer countdown
  useEffect(() => {
    if (!started || quizFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, quizFinished, handleNextQuestion]);

  // Handle answer selection
  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => handleNextQuestion(), 1000);
  };

  // Save score to backend
  const saveScoreToBackend = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/reward/", {
        user: userID,
        points: score * 10,
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  // Check when the user can play again
  let countdownTimer; // Declare countdown timer outside to keep reference

  const checkLastUpdated = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/reward/");
      const userData = response.data.find((u) => u.username === user);
  
      if (!userData || !userData.last_updated) {
        setCanPlay(true);
        return;
      }
  
      const lastUpdated = new Date(userData.last_updated);
      const now = new Date();
      const timeDifference = now - lastUpdated;
      const hoursDifference = timeDifference / 36e5;
  
      if (hoursDifference >= 24) {
        setCanPlay(true);
      } else {
        const remainingTime = 24 * 3600 * 1000 - timeDifference;
  
        // Clear any existing timer before setting a new one
        if (countdownTimer) clearInterval(countdownTimer);
  
        countdownTimer = setInterval(() => {
          const now = new Date();
          const updatedRemainingTime = 24 * 3600 * 1000 - (now - lastUpdated);
  
          if (updatedRemainingTime <= 0) {
            clearInterval(countdownTimer);
            setCanPlay(true);
            setCountdown("");
          } else {
            const hours = Math.floor(updatedRemainingTime / (1000 * 60 * 60));
            const minutes = Math.floor((updatedRemainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((updatedRemainingTime % (1000 * 60)) / 1000);
            setCountdown(`${hours}h ${minutes}m ${seconds}s`);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error checking last updated time:", error);
    }
  };

  useEffect(() => {
    if (user) checkLastUpdated();
  }, [user]);

  if (!canPlay) {
    return (
      <div className="quiz-restricted">
        <h2>Quiz Restricted</h2>
        {countdown && <p>You can play again in {countdown}</p>}
        {!user && <p>You need to log in to play the quiz.</p>}
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="quiz-finish">
        <h2>Quiz Over! Your score: {score}/{questions.length}</h2>
        <p>Your reward points: {score * 10}</p>
      </div>
    );
  }

  return (
    <>
      {!started ? (
        <div className="quiz-intro">
          <p>Welcome to the Quiz! You will have 2 minutes for each question. Good luck!</p>
          <button onClick={() => setStarted(true)} className="start-btn">
            Start Assessment
          </button>
        </div>
      ) : (
        <div className="quiz-container">
          <h2>Question {currentQuestion + 1}/{questions.length}</h2>
          <p>{questions[currentQuestion]?.question}</p>
          <ul>
            {questions[currentQuestion]?.options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleAnswerClick(option)}
                className={
                  selectedAnswer
                    ? option === questions[currentQuestion].correctAnswer
                      ? "correct"
                      : selectedAnswer === option
                      ? "wrong"
                      : ""
                    : ""
                }
              >
                {option}
              </li>
            ))}
          </ul>
          <p className="timer">Time left: {timeLeft}s</p>
        </div>
      )}
    </>
  );
};

export default Assessment;

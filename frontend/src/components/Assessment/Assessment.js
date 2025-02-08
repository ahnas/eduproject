import React, { useState, useEffect, useCallback } from "react";
import questionsData from "./questions.json";
import "./Assessment.css";

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [quizFinished, setQuizFinished] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const shuffledQuestions = [...questionsData].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuestions(shuffledQuestions);
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(120);
    } else {
      setQuizFinished(true);
    }
  }, [currentQuestion, questions.length]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleNextQuestion]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => handleNextQuestion(), 1000);
  };

  if (quizFinished) {
    return <h2 className="over">Quiz Over! Your score: {score}/{questions.length}</h2>;
  }

  return (
    <>
      {!started ? (
        <div className="quiz-intro">
          <p className="quiz-rules">
            Welcome to the Quiz! Here are the rules:
            <br />- You will have a limited time to answer each question.
            <br />- Click on an option to submit your answer.
            <br />- Green indicates a correct answer, red indicates a wrong answer.
            <br />- Try to score as high as possible. Good luck!
          </p>
          <button onClick={() => setStarted(true)} className="start-btn">
            Start Assessment
          </button>
        </div>
      ) : (
        <div className="quiz-container">
          <h2>Question {currentQuestion + 1}</h2>
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
          <p className="timer">Time left: {timeLeft} seconds</p>
        </div>
      )}
    </>
  );
};

export default Assessment;

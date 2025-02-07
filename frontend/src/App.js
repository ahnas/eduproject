import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ResumeChat from './components/ResumeChat/ResumeChat';
import MentorChat from './components/MentorChat';
import OneToOneChat from './components/OneToOneChat';
import Assessment from './components/Assessment';
import Quiz from './components/Quiz';
import Reviews from './components/Reviews';
import Rewards from './components/Rewards';
import Achievements from './components/Achievements';
import Courses from './components/Courses';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<ResumeChat />} />
          <Route path="/mentor-chat" element={<MentorChat />} />
          <Route path="/one-to-one" element={<OneToOneChat />} />
          <Route path="/assessments" element={<Assessment />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/courses" element={<Courses />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

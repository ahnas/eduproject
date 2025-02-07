import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2 className="logo">Edu Platform</h2>
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </div>
        <ul className={`nav-links ${isOpen ? "open" : ""}`}>
          <li><Link to="/">Resume Chat</Link></li>
          <li><Link to="/mentor-chat">Mentor Chat</Link></li>
          <li><Link to="/one-to-one">1:1 Chat</Link></li>
          <li><Link to="/assessments">Assessments</Link></li>
          <li><Link to="/quiz">Quiz</Link></li>
          <li><Link to="/reviews">Reviews</Link></li>
          <li><Link to="/rewards">Rewards</Link></li>
          <li><Link to="/achievements">Achievements</Link></li>
          <li><Link to="/courses">Courses</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

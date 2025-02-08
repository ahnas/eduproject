import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";
import axios from "axios";

const Navbar = () => {
  const { user, logout, login } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const response = await axios.post("http://127.0.0.1:8000/api/register/", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 201) {
          alert("Registration successful!");
          login(formData.username);
          localStorage.setItem("username", formData.username);
          setShowModal(false);
        }
      } else {
        setShowModal(false);
        login(formData.username);
        navigate("/one-to-one");
      }
    } catch (error) {
      console.error(error.message);
      alert("Operation failed. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
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
            <li><Link to="/assessments">Assessments/Quiz</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/rewards">Rewards</Link></li>
            <li><Link to="/achievements">Achievements</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            {user ? (
              <li className="username margin-left-30">
                Hello, {user}!
                <button className="logout-btn" onClick={handleLogout}>
                  🔒
                </button>
              </li>
            ) : (
              <li className="margin-left-30">
                <button className="register-btn" onClick={() => setShowModal(true)}>
                  Register/Login
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </span>
            <h2>{isRegister ? "Register" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
              {isRegister && (
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
              )}
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
              <button type="submit">{isRegister ? "Register" : "Login"}</button>
            </form>
            <p onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Already have an account? Login" : "New here? Register"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

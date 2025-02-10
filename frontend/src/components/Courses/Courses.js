import React, { use, useContext, useEffect, useState } from 'react';
import './Courses.css';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Modal = ({ isOpen, onClose, course }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Course Completed!</h2>
        <p>Congratulations! You have successfully completed the <strong>{course.name}</strong> course.</p>
        <p>Duration: {course.duration}</p>
        <p>Price: {course.price}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [userID, setUserID] = useState(null);
  const [userAchievements, setUserAchievements] = useState([]);

  useEffect(() => {
    const fetchUserAchievements = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/achievements/`);
        const achievedData = response.data.filter(ach => ach.user === userID);
        setUserAchievements(achievedData);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };
    fetchUserAchievements();
  }, [userID]);
  console.log(userAchievements);

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


  const courses = [
    { name: "Introduction to Web Development", duration: "2 hours", price: "Free" },
    { name: "Advanced JavaScript", duration: "4 hours", price: "$99" }
  ];

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleCourseComplete = () => {
    setIsModalOpen(true);
  };

  const closeModal = async () => {
    try {
      const achievedOn = new Date().toISOString().split('T')[0];

      await axios.post("http://127.0.0.1:8000/api/achievements/", {
        user: userID,
        title: selectedCourse.name,
        achieved_on: achievedOn,
      });
    } catch (error) {
      console.error("Error while saving achievement:", error);
    } finally {
      setIsModalOpen(false);
      setSelectedCourse(null);
      window.location.reload();
    }
  };

  return (
    <div className="component-cor">
      <div className="content">
        <section className="courses">
          <h2>Courses</h2>
          <ul>
            {courses.map((course, index) => (
              <li className='course' key={index} onClick={() => handleCourseClick(course)}>
                <h3>{course.name}</h3>
                <p>Duration: {course.duration}</p>
                <p><strong>{course.price}</strong></p>
              </li>
            ))}
          </ul>
        </section>

        {selectedCourse && (
          <section className="course-details">
            <h2>Course Details</h2>
            <p>Course: {selectedCourse.name}</p>
            <p>Duration: {selectedCourse.duration}</p>
            <p>Price: {selectedCourse.price}</p>
            <button
              style={{
                backgroundColor: userAchievements.find((ach) => ach.title === selectedCourse.name)
                  ? "#d3d3d3"
                  : "#4CAF50", 
                color: userAchievements.find((ach) => ach.title === selectedCourse.name)
                  ? "#888"
                  : "#fff", 
              }}
              onClick={handleCourseComplete} disabled={userAchievements.find((ach) => ach.title === selectedCourse.name)}>{userAchievements.find((ach) => ach.title === selectedCourse.name) ? "Completed" : "Start Course"}</button>
          </section>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} course={selectedCourse} />
    </div>
  );
};

export default Courses;

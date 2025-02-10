import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./Rewards.css";

const Rewards = () => {
  const { user } = useContext(AuthContext);
  const [rewardData, setRewardData] = useState(null);
  const [error, setError] = useState("");
  const [userID, setUserID] = useState(null);
  const [userAchievements, setUserAchievements] = useState([]);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/reward/");
        const data = response.data;
        const userReward = data.find((item) => item.username === user);

        if (userReward) {
          setRewardData(userReward);
        } else {
          setError("No rewards found for this user.");
        }
      } catch (err) {
        console.error("Error fetching rewards:", err);
        setError("Failed to fetch rewards. Please try again later.");
      }
    };

    if (user) {
      fetchRewards();
    }
  }, [user]);

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


  if (error) {
    return (
      <div className="component">
        <h1>Rewards</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="component">
        <h1>Rewards</h1>
        {rewardData ? (
          <div>
            <p>You got Points : {rewardData.points}</p>
          </div>
        ) : (
          <p>Take an assessment to get rewards</p>
        )}
      </div>

      <div className="component">
        <h1>Achievements</h1>
        <div>
          <h2>Completed Courses:</h2>
          <ul style={{ listStyleType: "none" }}>
            {userAchievements.length > 0 ? (
              userAchievements.map((item, index) => (
                <li key={index}>{item.title}</li>
              ))
            ) : (
              <p>No courses completed yet!</p>
            )}
          </ul>
        </div>
      </div>

    </>
  );
};

export default Rewards;

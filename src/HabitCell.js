// src/HabitCell.js

import React from "react";
import "./HabitCell.css";

const HabitCell = ({ state, onClick, active }) => {
  const pointsText = {
    white: "",
    red: "1/3",
    yellow: "2/3",
    green: "3/3",
    grey: "0/3",
  };

  const labels = {
    white: "",
    red: "Easy",
    yellow: "Medium",
    green: "Hard",
    grey: "Skip",
  };

  return (
    <td className={`habit-cell ${state}`} onClick={onClick}>
      <span className="habit-points">{pointsText[state]}</span>
      <span className="habit-label">{labels[state]}</span>
    </td>
  );
};

export default HabitCell;

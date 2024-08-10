import React, { useState, useEffect } from "react";
import "./HabitTracker.css";
import HabitCell from "./HabitCell";
import HabitDetailsModal from "./HabitDetailsModal"; // Import the new HabitDetailsModal component

// Utility Functions
const calculateOverallWeeklyGoal = (habits) =>
  habits.reduce((total, habit) => total + parseInt(habit.weeklyGoal, 10), 0);
const calculateMaxPoints = (habit) =>
  habit.activeDays.reduce((sum, isActive) => (isActive ? sum + 3 : sum), 0);

const habitsData = [
  {
    name: "Exercise",
    description: "Daily exercise routine",
    levels: ["Easy", "Medium", "Hard", "Skip"],
    levelDescriptions: ["15 min", "30 min", "1 hour", "No exercise"],
    activeDays: [true, true, true, true, true, true, true],
    weeklyGoal: 20, // Default goal
  },
  {
    name: "Read",
    description: "Read for 30 minutes",
    levels: ["Easy", "Medium", "Hard", "Skip"],
    levelDescriptions: ["10 pages", "20 pages", "30 pages", "No reading"],
    activeDays: [true, true, true, true, true, true, true],
    weeklyGoal: 20, // Default goal
  },
  {
    name: "Meditate",
    description: "Meditate for 10 minutes",
    levels: ["Easy", "Medium", "Hard", "Skip"],
    levelDescriptions: ["5 min", "10 min", "20 min", "No meditation"],
    activeDays: [true, true, true, true, true, true, true],
    weeklyGoal: 20, // Default goal
  },
];

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const getCurrentDayIndex = () => {
  const today = new Date();
  return (today.getDay() + 6) % 7; // Adjust so that Monday is 0 and Sunday is 6
};

const reorderDays = (days, startIndex) => {
  return [...days.slice(startIndex + 1), ...days.slice(0, startIndex + 1)];
};

const getDateForDay = (startIndex, offset) => {
  const today = new Date();
  today.setDate(today.getDate() - offset);
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${month}/${day}`;
};

const points = {
  white: 0,
  red: 1,
  yellow: 2,
  green: 3,
  grey: 0,
};

const labels = {
  white: "",
  red: "Easy",
  yellow: "Medium",
  green: "Hard",
  grey: "Skip",
};

const pointsText = {
  white: "",
  red: "1/3",
  yellow: "2/3",
  green: "3/3",
  grey: "0/3",
};

const HabitTracker = () => {
  const currentDayIndex = getCurrentDayIndex();
  const days = reorderDays(allDays, currentDayIndex);

  const initializeHabitStates = (habits, days) => {
    const initialState = habits.map((habit) =>
      days.map((_, dayIndex) => (habit.activeDays[dayIndex] ? "white" : "grey"))
    );
    return initialState;
  };

  const [habits, setHabits] = useState(habitsData);
  const [habitStates, setHabitStates] = useState(
    initializeHabitStates(habitsData, days)
  );
  const [dailyTotals, setDailyTotals] = useState(days.map(() => 0));
  const [weeklyTotals, setWeeklyTotals] = useState(habits.map(() => 0));
  const [weeklyPointTotal, setWeeklyPointTotal] = useState(0); // State for weekly point total
  const [streaks, setStreaks] = useState(habits.map(() => 0));
  const [bestStreaks, setBestStreaks] = useState(habits.map(() => 0)); // Add state for best streaks
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [habitDetails, setHabitDetails] = useState({
    name: "",
    description: "",
    levels: ["Easy", "Medium", "Hard", "Skip"],
    levelDescriptions: ["", "", "", ""],
    activeDays: [true, true, true, true, true, true, true],
    weeklyGoal: 20,
  });

  const [weeklyGoal, setWeeklyGoal] = useState(
    calculateOverallWeeklyGoal(habitsData)
  );

  const openModal = (habitIndex) => {
    console.log("Opening modal for habit index:", habitIndex);
    setSelectedHabit(habitIndex);
    setHabitDetails({ ...habits[habitIndex] });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditMode(false);
    setSelectedHabit(null);
  };

  const handleSaveChanges = () => {
    const updatedHabits = [...habits];
    updatedHabits[selectedHabit] = habitDetails;
    setHabits(updatedHabits);
    const newWeeklyGoal = calculateOverallWeeklyGoal(updatedHabits);
    setWeeklyGoal(newWeeklyGoal);
    setEditMode(false);
    setModalIsOpen(false);
  };

  const updateHabitState = (habitIndex, dayIndex) => {
    const newStates = [...habitStates];
    const currentState = newStates[habitIndex][dayIndex];
    const states = ["white", "red", "yellow", "green", "grey"];
    const nextState =
      states[(states.indexOf(currentState) + 1) % states.length];
    newStates[habitIndex][dayIndex] = nextState;

    const newDailyTotals = [...dailyTotals];
    const newWeeklyTotals = [...weeklyTotals];

    newDailyTotals[dayIndex] =
      newDailyTotals[dayIndex] - points[currentState] + points[nextState];
    newWeeklyTotals[habitIndex] =
      newWeeklyTotals[habitIndex] - points[currentState] + points[nextState];

    setHabitStates(newStates);
    setDailyTotals(newDailyTotals);
    setWeeklyTotals(newWeeklyTotals);
    setWeeklyPointTotal(
      newDailyTotals.reduce((total, points) => total + points, 0)
    ); // Update weekly point total

    updateStreaks(newStates, habitIndex);
    updateBestStreaks(newStates, habitIndex); // Update best streaks when habit state changes
  };

  const updateStreaks = (newStates, habitIndex) => {
    const newStreaks = [...streaks];
    let streak = 0;
    for (let i = newStates[habitIndex].length - 1; i >= 0; i--) {
      if (newStates[habitIndex][i] === "white") {
        break;
      } else if (newStates[habitIndex][i] !== "grey") {
        streak += 1;
      }
    }
    newStreaks[habitIndex] = streak;
    setStreaks(newStreaks);
  };

  const updateBestStreaks = (newStates, habitIndex) => {
    const newBestStreaks = [...bestStreaks];
    let currentStreak = 0;
    let bestStreak = 0;

    newStates[habitIndex].forEach((state) => {
      if (state === "white") {
        currentStreak = 0;
      } else if (state !== "grey") {
        currentStreak += 1;
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }
      }
    });

    newBestStreaks[habitIndex] = bestStreak;
    setBestStreaks(newBestStreaks);
  };

  const resetStreaksIfNecessary = () => {
    const today = new Date();
    if (today.getHours() === 4) {
      const yesterdayIndex = (currentDayIndex - 1 + days.length) % days.length;
      const newStreaks = [...streaks];
      for (let habitIndex = 0; habitIndex < habits.length; habitIndex++) {
        if (habitStates[habitIndex][yesterdayIndex] === "white") {
          newStreaks[habitIndex] = 0;
        }
      }
      setStreaks(newStreaks);
    }
  };

  const simulateWeek = () => {
    const newStates = habits.map((habit) =>
      days.map((_, dayIndex) => (habit.activeDays[dayIndex] ? "white" : "grey"))
    );
    setHabitStates(newStates);
    calculateTotals(newStates);
    newStates.forEach((_, habitIndex) => {
      updateBestStreaks(newStates, habitIndex); // Calculate initial best streaks
    });
  };

  const calculateTotals = (states) => {
    const newDailyTotals = days.map((_, dayIndex) =>
      habits.reduce(
        (sum, _, habitIndex) => sum + points[states[habitIndex][dayIndex]],
        0
      )
    );
    const newWeeklyTotals = habits.map((_, habitIndex) =>
      days.reduce(
        (sum, _, dayIndex) => sum + points[states[habitIndex][dayIndex]],
        0
      )
    );
    setDailyTotals(newDailyTotals);
    setWeeklyTotals(newWeeklyTotals);
    setWeeklyPointTotal(
      newDailyTotals.reduce((total, points) => total + points, 0)
    ); // Update weekly point total
  };

  const addHabit = () => {
    const newHabit = {
      name: "New Habit",
      description: "",
      levels: ["Easy", "Medium", "Hard", "Skip"],
      levelDescriptions: ["", "", "", ""],
      activeDays: [true, true, true, true, true, true, true],
      weeklyGoal: 20,
    };
    const updatedHabits = [...habits, newHabit];
    const newStates = [
      ...habitStates,
      days.map((_, dayIndex) =>
        newHabit.activeDays[dayIndex] ? "white" : "grey"
      ),
    ];
    setHabits(updatedHabits);
    setHabitStates(newStates);
    setWeeklyTotals([...weeklyTotals, 0]);
    setStreaks([...streaks, 0]);
    setBestStreaks([...bestStreaks, 0]); // Initialize best streak for new habit
    const newWeeklyGoal = calculateOverallWeeklyGoal(updatedHabits);
    setWeeklyGoal(newWeeklyGoal); // Update overall weekly goal
    calculateTotals(newStates);
  };

  const removeHabit = (habitIndex) => {
    const updatedHabits = habits.filter((_, index) => index !== habitIndex);
    const updatedStates = habitStates.filter(
      (_, index) => index !== habitIndex
    );
    setHabits(updatedHabits);
    setHabitStates(updatedStates);
    setWeeklyTotals(weeklyTotals.filter((_, index) => index !== habitIndex));
    setStreaks(streaks.filter((_, index) => index !== habitIndex));
    setBestStreaks(bestStreaks.filter((_, index) => index !== habitIndex)); // Remove best streak for deleted habit
    const newWeeklyGoal = calculateOverallWeeklyGoal(updatedHabits);
    setWeeklyGoal(newWeeklyGoal); // Update overall weekly goal
    calculateTotals(updatedStates);
    setModalIsOpen(false); // Close the modal when a habit is removed
  };

  useEffect(() => {
    simulateWeek();
    calculateTotals(habitStates);

    const interval = setInterval(() => {
      resetStreaksIfNecessary();
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("Selected habit:", selectedHabit);
    console.log("Habit details:", habitDetails);
    console.log("Modal is open:", modalIsOpen);
  }, [selectedHabit, habitDetails, modalIsOpen]);

  return (
    <div className="habit-tracker">
      <table>
        <thead>
          <tr>
            <th>Habit/Day</th>
            {days.map((day, index) => (
              <th key={day}>
                {day}
                <br />
                {getDateForDay(currentDayIndex, days.length - 1 - index)}
              </th>
            ))}
            <th>Points</th>
            <th>Goal</th> {/* Add header for weekly goal */}
            <th>Streak</th>
            <th>Best Streak</th> {/* Add header for best streak */}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, habitIndex) => (
            <tr key={habitIndex}>
              <td
                className="habit-name"
                onClick={() => openModal(habitIndex)} // Ensure this is correct
                title={`Easy: ${habit.levelDescriptions[0]}, Medium: ${habit.levelDescriptions[1]}, Hard: ${habit.levelDescriptions[2]}, Skip: ${habit.levelDescriptions[3]}`}
              >
                {habit.name}
              </td>
              {days.map((day, dayIndex) => (
                <HabitCell
                  key={`${habit.name}-${day}`}
                  state={habitStates[habitIndex][dayIndex]}
                  onClick={() => updateHabitState(habitIndex, dayIndex)}
                  active={habit.activeDays[dayIndex]}
                />
              ))}
              <td
                className={
                  weeklyTotals[habitIndex] >= habit.weeklyGoal
                    ? "goal-reached"
                    : ""
                }
              >
                <strong>{weeklyTotals[habitIndex]}</strong>
                <br />
                <span>
                  {weeklyTotals[habitIndex]}/{calculateMaxPoints(habit)}
                </span>{" "}
                {/* Display habit max points */}
              </td>
              <td>{habit.weeklyGoal}</td> {/* Display habit weekly goal */}
              <td>
                <strong>{streaks[habitIndex]}</strong>
              </td>
              <td>
                <strong>{bestStreaks[habitIndex]}</strong>
              </td>{" "}
              {/* Display best streak */}
            </tr>
          ))}
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            {days.map((day, dayIndex) => (
              <td key={dayIndex}>
                <strong>{dailyTotals[dayIndex]}</strong>
              </td>
            ))}
            <td
              className={weeklyPointTotal >= weeklyGoal ? "goal-reached" : ""}
            >
              <strong>{weeklyPointTotal}</strong>
              <br />
              <span>
                {weeklyPointTotal}/
                {calculateMaxPoints({ activeDays: Array(7).fill(true) }) *
                  habits.length}
              </span>{" "}
              {/* Display overall max points */}
            </td>
            <td>{weeklyGoal}</td> {/* Display overall weekly goal */}
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <button onClick={addHabit}>Add Habit</button>

      <HabitDetailsModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        editMode={editMode}
        habitDetails={habitDetails}
        setHabitDetails={setHabitDetails}
        handleSaveChanges={handleSaveChanges}
        removeHabit={removeHabit}
        selectedHabit={selectedHabit}
        setEditMode={setEditMode}
        allDays={allDays}
        calculateMaxPoints={calculateMaxPoints}
      />
    </div>
  );
};

export default HabitTracker;

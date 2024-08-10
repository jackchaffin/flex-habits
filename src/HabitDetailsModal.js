import React from "react";
import Modal from "react-modal";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

// Initialize Modal
Modal.setAppElement("#root");

const HabitDetailsModal = ({
  isOpen,
  closeModal,
  editMode,
  habitDetails,
  setHabitDetails,
  handleSaveChanges,
  removeHabit,
  selectedHabit,
  setEditMode,
  allDays,
  calculateMaxPoints,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Habit Details"
      className="modal"
      overlayClassName="overlay"
    >
      {selectedHabit !== null && (
        <div className="habit-details-modal">
          <div className="habit-details-header">
            <h2 className="habit-details-title">
              {editMode ? (
                <input
                  type="text"
                  value={habitDetails.name}
                  onChange={(e) =>
                    setHabitDetails({ ...habitDetails, name: e.target.value })
                  }
                />
              ) : (
                habitDetails.name
              )}
            </h2>
          </div>
          <p className="habit-details-description">
            {editMode ? (
              <textarea
                value={habitDetails.description}
                onChange={(e) =>
                  setHabitDetails({
                    ...habitDetails,
                    description: e.target.value,
                  })
                }
              />
            ) : (
              habitDetails.description
            )}
          </p>
          <div className="habit-details-section">
            <h3>Levels of Completion Descriptions</h3>
            {habitDetails.levels.map((level, index) => (
              <div key={index} className="habit-details-level">
                <strong>{level}:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    value={habitDetails.levelDescriptions[index]}
                    onChange={(e) => {
                      const newLevelDescriptions = [
                        ...habitDetails.levelDescriptions,
                      ];
                      newLevelDescriptions[index] = e.target.value;
                      setHabitDetails({
                        ...habitDetails,
                        levelDescriptions: newLevelDescriptions,
                      });
                    }}
                  />
                ) : (
                  <span>{habitDetails.levelDescriptions[index]}</span>
                )}
              </div>
            ))}
          </div>
          <div className="habit-details-section">
            <h3>Active Days</h3>
            {allDays.map((day, index) => (
              <div key={day} className="habit-details-day">
                <label>
                  <input
                    type="checkbox"
                    checked={habitDetails.activeDays[index]}
                    onChange={(e) => {
                      const newActiveDays = [...habitDetails.activeDays];
                      newActiveDays[index] = e.target.checked;
                      setHabitDetails({
                        ...habitDetails,
                        activeDays: newActiveDays,
                      });
                    }}
                    disabled={!editMode}
                  />
                  {day}
                </label>
              </div>
            ))}
          </div>
          <div className="habit-details-section">
            <h3>
              Weekly Goal: <span>{habitDetails.weeklyGoal}</span>
            </h3>
            {editMode && (
              <Slider
                min={0}
                max={calculateMaxPoints(habitDetails)}
                value={habitDetails.weeklyGoal}
                onChange={(value) =>
                  setHabitDetails({ ...habitDetails, weeklyGoal: value })
                }
              />
            )}
          </div>
          {editMode ? (
            <button className="modal-button" onClick={handleSaveChanges}>
              Save
            </button>
          ) : (
            <button className="modal-button" onClick={() => setEditMode(true)}>
              Edit
            </button>
          )}
          <button
            className="modal-button"
            onClick={() => removeHabit(selectedHabit)}
          >
            Remove
          </button>
          <button className="modal-button" onClick={closeModal}>
            Close
          </button>
        </div>
      )}
    </Modal>
  );
};

export default HabitDetailsModal;

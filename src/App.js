// src/App.js

import React from "react";
import "./App.css";
import HabitTracker from "./HabitTracker";

const App = () => {
  return (
    <div className="App">
      <header className="app-header">
        <h1>FlexHabits</h1>
        <p>the smarter way to track habits</p>
      </header>
      <HabitTracker />
      <footer className="app-footer">
        <p>www.flexhabits.com</p>
      </footer>
    </div>
  );
};

export default App;

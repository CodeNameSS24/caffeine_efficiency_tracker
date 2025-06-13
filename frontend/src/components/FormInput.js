import React, { useState } from "react";
import "../App.css";

const FormInput = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    sleepHours: 7,
    caffeineIntake: 100,
    fatigueLevel: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <h2>Caffeine Efficiency Tracker</h2>
      <form onSubmit={handleSubmit} className="input-form">
        <div className="form-group">
          <label htmlFor="sleepHours">Sleep Hours (Last Night)</label>
          <div className="input-container">
            <input
              type="range"
              id="sleepHours"
              name="sleepHours"
              min="3"
              max="12"
              value={formData.sleepHours}
              onChange={handleChange}
              className="slider"
            />
            <span className="value-display">{formData.sleepHours} hours</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="caffeineIntake">Caffeine Intake (mg)</label>
          <div className="input-container">
            <input
              type="range"
              id="caffeineIntake"
              name="caffeineIntake"
              min="0"
              max="400"
              step="25"
              value={formData.caffeineIntake}
              onChange={handleChange}
              className="slider"
            />
            <span className="value-display">{formData.caffeineIntake} mg</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="fatigueLevel">Current Fatigue Level</label>
          <div className="input-container">
            <input
              type="range"
              id="fatigueLevel"
              name="fatigueLevel"
              min="1"
              max="10"
              value={formData.fatigueLevel}
              onChange={handleChange}
              className="slider"
            />
            <span className="value-display">
              {formData.fatigueLevel}/10
              {formData.fatigueLevel <= 3 && " (Alert)"}
              {formData.fatigueLevel >= 4 &&
                formData.fatigueLevel <= 6 &&
                " (Moderate)"}
              {formData.fatigueLevel >= 7 && " (Tired)"}
            </span>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Analyzing..." : "Predict Focus Levels"}
        </button>
      </form>
    </div>
  );
};

export default FormInput;

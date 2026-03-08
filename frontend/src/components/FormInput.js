import React, { useState } from "react";
import "../App.css";

const PRESETS = [
  { label: "Espresso", mg: 64 },
  { label: "Coffee (8oz)", mg: 95 },
  { label: "Black Tea", mg: 47 },
  { label: "Energy Drink", mg: 160 },
  { label: "Pre-Workout", mg: 250 },
];

const FormInput = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    sleepHours: 7,
    caffeineIntake: 100,
    fatigueLevel: 5,
    tolerance: "normal",
    metabolism: "normal",
    lTheanine: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (type === "range" || type === "number" ? parseInt(value) || 0 : value),
    }));
  };

  const setPreset = (mg) => {
    setFormData((prev) => ({ ...prev, caffeineIntake: mg }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container glass-panel">
      <h2>Tracker Setup</h2>
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
              step="5"
              value={formData.caffeineIntake}
              onChange={handleChange}
              className="slider"
            />
            <span className="value-display">{formData.caffeineIntake} mg</span>
          </div>
          <div className="beverage-presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={`preset-btn ${formData.caffeineIntake === preset.mg ? 'active' : ''}`}
                onClick={() => setPreset(preset.mg)}
              >
                {preset.label}
              </button>
            ))}
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

        {/* Advanced Bio-Profile Settings */}
        <div className="advanced-settings">
          <div
            className="advanced-settings-header"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <h3>
              {showAdvanced ? "▼" : "▶"} Bio-Profile Settings
            </h3>
            <small style={{ color: "var(--text-dim)" }}>
              {showAdvanced ? "Hide" : "Customize"}
            </small>
          </div>

          {showAdvanced && (
            <div className="settings-grid">
              <div className="setting-item">
                <label htmlFor="tolerance">Caffeine Tolerance</label>
                <select
                  id="tolerance"
                  name="tolerance"
                  value={formData.tolerance}
                  onChange={handleChange}
                  className="custom-select"
                >
                  <option value="low">Low (Naive)</option>
                  <option value="normal">Normal (Daily Drinker)</option>
                  <option value="high">High (Tolerant)</option>
                </select>
              </div>

              <div className="setting-item">
                <label htmlFor="metabolism">Metabolism Rate</label>
                <select
                  id="metabolism"
                  name="metabolism"
                  value={formData.metabolism}
                  onChange={handleChange}
                  className="custom-select"
                >
                  <option value="slow">Slow (CYP1A2 C/C)</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast (CYP1A2 A/A)</option>
                </select>
              </div>

              <div className="setting-item" style={{ gridColumn: "1 / -1" }}>
                <label>Supplementation</label>
                <div className="toggle-container">
                  <span>Included L-Theanine?</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="lTheanine"
                      checked={formData.lTheanine}
                      onChange={handleChange}
                    />
                    <span className="slider-toggle"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Calculating Physics..." : "Analyze Bio-Profile"}
        </button>
      </form>
    </div>
  );
};

export default FormInput;

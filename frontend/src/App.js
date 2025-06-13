import React, { useState } from "react";
import FormInput from "./components/FormInput";
import FocusGraph from "./components/FocusGraph";
import AlertBox from "./components/AlertBox";
import "./App.css";

function App() {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to get predictions");
      }

      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      setError(
        "Unable to connect to prediction service. Make sure the API is running on port 5000."
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>☕ Caffeine Efficiency Tracker</h1>
        <p>Optimize your caffeine intake based on sleep and fatigue levels</p>
      </header>

      <main className="main-content">
        <div className="container">
          <FormInput onSubmit={handleFormSubmit} loading={loading} />

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {predictions && (
            <div className="results-section">
              <AlertBox
                optimalTime={predictions.optimalCaffeineTime}
                crashTime={predictions.crashTimeAlert}
              />
              <FocusGraph data={predictions.focusGraph} />
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Track your caffeine efficiency and optimize your daily performance
        </p>
      </footer>
    </div>
  );
}

export default App;

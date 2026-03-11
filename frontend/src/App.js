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
      // Add the user's current local time and timezone offset to the payload
      const payload = {
        ...formData,
        currentTime: new Date().toISOString(),
        timezoneOffset: new Date().getTimezoneOffset()
      };

      // Use environment variable for API URL or fallback to localhost
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to get predictions");
      }

      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      setError(
        "Unable to connect to prediction service. Please ensure the backend is running."
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="bg-image"></div>
      <div className="bg-overlay"></div>

      <div className="App">
        <header className="app-header">
          <h1>☕ Caffeine Catalyst</h1>
          <p>Supercharge your focus with precision timing</p>
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
            Track your caffeine efficiency and optimize your daily performance 🚀
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

import React from "react";
import "./App.css";

const AlertBox = ({ optimalTime, crashTime }) => {
  if (!optimalTime && !crashTime) return null;

  return (
    <div className="alert-container">
      {optimalTime && (
        <div className="alert-box optimal">
          <div className="alert-icon">⚡</div>
          <div className="alert-content">
            <h3>Optimal Caffeine Time</h3>
            <p>
              Best time to consume caffeine: <strong>{optimalTime}</strong>
            </p>
          </div>
        </div>
      )}

      {crashTime && (
        <div className="alert-box warning">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <h3>Crash Alert</h3>
            <p>
              Expect energy crash around: <strong>{crashTime}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertBox;

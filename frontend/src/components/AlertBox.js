import React from "react";
import "../App.css";

const AlertBox = ({ optimalTime, crashTime, actionableAdvice }) => {
  if (!optimalTime && !crashTime && !actionableAdvice) return null;

  return (
    <div className="alert-container">

      {/* Actionable Advice Display Panel */}
      {actionableAdvice && (
        <div className="alert-box" style={{ background: "rgba(157, 78, 221, 0.15)", borderColor: "rgba(157, 78, 221, 0.4)" }}>
          <div className="alert-icon">💡</div>
          <div className="alert-content">
            <h3>Bio-Profile Intelligence</h3>
            <p>{actionableAdvice}</p>
          </div>
        </div>
      )}

      {optimalTime && (
        <div className="alert-box optimal">
          <div className="alert-icon">⚡</div>
          <div className="alert-content">
            <h3>Peak Performance Window</h3>
            <p>
              Optimal caffeine consumption at: <strong>{optimalTime}</strong>
            </p>
          </div>
        </div>
      )}

      {crashTime && (
        <div className="alert-box warning">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <h3>Energy Crash Warning</h3>
            <p>
              Anticipated fatigue onset around: <strong>{crashTime}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertBox;

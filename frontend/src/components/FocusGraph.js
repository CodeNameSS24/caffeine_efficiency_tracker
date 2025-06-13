import React from "react";
import "./App.css";

const FocusGraph = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxFocus = Math.max(...data.map((d) => d.focusLevel));
  const minFocus = Math.min(...data.map((d) => d.focusLevel));
  const range = maxFocus - minFocus;

  return (
    <div className="focus-graph">
      <h3>Focus Level Prediction</h3>
      <div className="graph-container">
        <div className="y-axis">
          <span className="y-label high">{Math.round(maxFocus)}</span>
          <span className="y-label mid">
            {Math.round((maxFocus + minFocus) / 2)}
          </span>
          <span className="y-label low">{Math.round(minFocus)}</span>
        </div>

        <div className="graph-area">
          <svg width="100%" height="200" viewBox="0 0 400 200">
            <defs>
              <linearGradient
                id="focusGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 40}
                x2="400"
                y2={i * 40}
                stroke="#e0e0e0"
                strokeWidth="1"
              />
            ))}

            {/* Focus level path */}
            <path
              d={`M ${data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 380 + 20},${
                      200 - ((d.focusLevel - minFocus) / range) * 160 - 20
                    }`
                )
                .join(" L ")}`}
              stroke="#4CAF50"
              strokeWidth="3"
              fill="none"
            />

            {/* Area under curve */}
            <path
              d={`M 20,180 L ${data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 380 + 20},${
                      200 - ((d.focusLevel - minFocus) / range) * 160 - 20
                    }`
                )
                .join(" L ")} L 400,180 Z`}
              fill="url(#focusGradient)"
            />

            {/* Data points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={(i / (data.length - 1)) * 380 + 20}
                cy={200 - ((d.focusLevel - minFocus) / range) * 160 - 20}
                r="4"
                fill="#2E7D32"
                stroke="#fff"
                strokeWidth="2"
              />
            ))}
          </svg>

          <div className="x-axis">
            {data.map((d, i) => (
              <span key={i} className="x-label">
                {d.time}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusGraph;

import React from "react";
import "../App.css";

const FocusGraph = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxFocus = Math.max(...data.map((d) => d.focusLevel));
  const minFocus = Math.min(...data.map((d) => d.focusLevel));
  const range = maxFocus - minFocus || 1; // Prevent division by zero
  const peak_index = data.findIndex(d => d.focusLevel === maxFocus);

  return (
    <div className="focus-graph glass-panel">
      <h3>Predicted Focus Trajectory</h3>
      <div className="graph-container">
        <div className="y-axis">
          <span className="y-label high">{Math.round(maxFocus)}%</span>
          <span className="y-label mid">
            {Math.round((maxFocus + minFocus) / 2)}%
          </span>
          <span className="y-label low">{Math.round(minFocus)}%</span>
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
                <stop offset="0%" stopColor="#c77dff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c77dff" stopOpacity="0.0" />
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
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
              />
            ))}

            {/* Focus level path */}
            <path
              d={`M ${data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 380 + 20},${200 - ((d.focusLevel - minFocus) / range) * 160 - 20
                    }`
                )
                .join(" L ")}`}
              stroke="#e0aaff"
              strokeWidth="4"
              fill="none"
              style={{ filter: "drop-shadow(0px 0px 8px rgba(224, 170, 255, 0.5))" }}
            />

            {/* Area under curve */}
            <path
              d={`M 20,180 L ${data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 380 + 20},${200 - ((d.focusLevel - minFocus) / range) * 160 - 20
                    }`
                )
                .join(" L ")} L 400,180 Z`}
              fill="url(#focusGradient)"
            />

            {/* Peak indicator line */}
            <line
              x1={(peak_index / (data.length - 1)) * 380 + 20}
              y1="10"
              x2={(peak_index / (data.length - 1)) * 380 + 20}
              y2="180"
              stroke="#00f5d4"
              strokeWidth="2"
              strokeDasharray="6,4"
              style={{ filter: "drop-shadow(0px 0px 4px rgba(0, 245, 212, 0.5))" }}
            />

            {/* Data points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={(i / (data.length - 1)) * 380 + 20}
                cy={200 - ((d.focusLevel - minFocus) / range) * 160 - 20}
                r={i === peak_index ? "6" : "4"}
                fill={i === peak_index ? "#00f5d4" : "#10002b"}
                stroke={i === peak_index ? "#ffffff" : "#c77dff"}
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

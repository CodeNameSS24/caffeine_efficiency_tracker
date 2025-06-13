from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime, timedelta

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for frontend access
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "file://"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# ---------------------------------------------------------
# 🧠 Dummy Data & Model Training
# ---------------------------------------------------------

# Set random seed for reproducibility
np.random.seed(42)

# Generate dummy dataset
data = pd.DataFrame({
    'sleep_hours': np.random.randint(4, 10, 100),
    'caffeine_intake': np.random.randint(50, 300, 100),
    'fatigue_level': np.random.randint(1, 10, 100),
    'focus_level': np.random.randint(40, 100, 100)
})

# Prepare training data
X = data[['sleep_hours', 'caffeine_intake', 'fatigue_level']]
y = data['focus_level']

# Train a simple RandomForestRegressor
model = RandomForestRegressor()
model.fit(X, y)

# ---------------------------------------------------------
# 🚀 Routes
# ---------------------------------------------------------

@app.route('/')
@cross_origin()
def home():
    return jsonify({'message': '🎉 Welcome to the Caffeine Efficiency API!'})

@app.route('/predict', methods=['POST', 'OPTIONS'])
@cross_origin()
def predict_focus():
    try:
        input_data = request.get_json()
        sleep = input_data['sleepHours']
        caffeine = input_data['caffeineIntake']
        fatigue = input_data['fatigueLevel']

        # Time intervals for the next 10 hours
        time_intervals = [datetime.now() + timedelta(hours=i) for i in range(10)]

        # Base prediction
        base_prediction = model.predict([[sleep, caffeine, fatigue]])[0]

        # Simulate hourly focus levels
        focus_levels = []
        for i in range(10):
            caffeine_effect = max(0, 1 - (i * 0.1)) if i < 6 else max(0, 0.4 - (i * 0.05))
            noise = np.random.normal(0, 2)
            focus = max(20, min(100, base_prediction * caffeine_effect + noise))
            focus_levels.append(focus)

        # Calculate peak focus time
        peak_index = np.argmax(focus_levels)
        optimal_time = time_intervals[peak_index]

        # Detect crash (30% drop from peak)
        crash_index = None
        peak_focus = focus_levels[peak_index]

        for i in range(peak_index + 1, len(focus_levels)):
            if focus_levels[i] < peak_focus * 0.7:
                crash_index = i
                break

        crash_time = time_intervals[crash_index] if crash_index is not None else None

        # Prepare JSON response
        response = {
            'focusGraph': [
                {'time': t.strftime('%H:%M'), 'focusLevel': round(f, 1)}
                for t, f in zip(time_intervals, focus_levels)
            ],
            'optimalCaffeineTime': optimal_time.strftime('%H:%M'),
            'crashTimeAlert': crash_time.strftime('%H:%M') if crash_time else None
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
@cross_origin()
def health_check():
    return jsonify({
        'status': '✅ API is running',
        'timestamp': datetime.now().isoformat()
    })

# ---------------------------------------------------------
# 🔥 Run Server
# ---------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime, timedelta
import os
import joblib

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for frontend access
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# ---------------------------------------------------------
# 🧠 Model Loading (Professional Workflow)
# ---------------------------------------------------------

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'caffeine_model.pkl')

def load_prediction_model():
    """Loads the pre-trained model from disk."""
    if not os.path.exists(MODEL_PATH):
        print("⚠️ Warning: Model file not found. Run 'python train_model.py' first.")
        return None
    try:
        return joblib.load(MODEL_PATH)
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None

# Load model on startup
model = load_prediction_model()

def validate_input(data):
    """Basic validation for prediction inputs."""
    required_fields = ['sleepHours', 'caffeineIntake', 'fatigueLevel']
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    # Range validation
    if not (0 <= data['sleepHours'] <= 24):
        return False, "Sleep hours must be between 0 and 24"
    if not (0 <= data['caffeineIntake'] <= 1000):
        return False, "Caffeine intake must be between 0 and 1000mg"
    if not (1 <= data['fatigueLevel'] <= 10):
        return False, "Fatigue level must be between 1 and 10"
        
    return True, None

def generate_actionable_advice(peak_time, crash_time, tolerance, l_theanine):
    if not crash_time:
        return "Your profile indicates a stable energy curve today. Keep hydrated!"
    
    advice = f"Your energy will peak around {peak_time.strftime('%H:%M')}. "
    if l_theanine:
        advice += "The L-Theanine you took should help smooth out the jitters. "
    
    if tolerance == "low":
        advice += f"Since you have low tolerance, be prepared for a noticeable drop around {crash_time.strftime('%H:%M')}. Consider a 10-minute walk then."
    else:
        advice += f"Plan your deep work before the anticipated dip at {crash_time.strftime('%H:%M')}."
        
    return advice

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
    if model is None:
        return jsonify({'error': 'Model not loaded on server. Please check backend logs.'}), 500
        
    try:
        input_data = request.get_json()
        
        # Validation
        is_valid, error_msg = validate_input(input_data)
        if not is_valid:
            return jsonify({'error': error_msg}), 400

        sleep = input_data['sleepHours']
        caffeine = input_data['caffeineIntake']
        fatigue = input_data['fatigueLevel']
        
        # Advanced Profile Settings (with defaults)
        tolerance = input_data.get('tolerance', 'normal')
        metabolism = input_data.get('metabolism', 'normal')
        l_theanine = input_data.get('lTheanine', False)

        # Handle timezone gracefully by accepting client's local time if available
        # Fallback to server's datetime.now() if not provided (e.g. direct API usage)
        client_time_str = input_data.get('currentTime')
        if client_time_str:
            try:
                # Replace 'Z' with +00:00 to handle standard JS ISO strings
                base_time = datetime.fromisoformat(client_time_str.replace('Z', '+00:00'))
            except ValueError:
                base_time = datetime.now()
        else:
            base_time = datetime.now()

        # Time intervals for the next 10 hours based on client's local time
        time_intervals = [base_time + timedelta(hours=i) for i in range(10)]

        # Base prediction
        base_prediction = model.predict([[sleep, caffeine, fatigue]])[0]

        # Apply Bio-Profile Multipliers
        # 1. Tolerance affects peak height (High tolerance = lower peak for same caffeine)
        peak_multiplier = 1.0
        if tolerance == "low": peak_multiplier = 1.2
        elif tolerance == "high": peak_multiplier = 0.8
        
        # 2. Metabolism affects decay rate
        decay_rate = 0.1
        if metabolism == "fast": decay_rate = 0.15
        elif metabolism == "slow": decay_rate = 0.07

        # Simulate hourly focus levels
        focus_levels = []
        for i in range(10):
            # Calculate dynamic effect
            caffeine_effect = max(0, 1 - (i * decay_rate))
            
            # L-Theanine smooths the curve (slightly lower peak, but sustained longer)
            if l_theanine:
                caffeine_effect = max(0.2, caffeine_effect * 0.9) 
                
            noise = np.random.normal(0, 2)
            focus = max(20, min(100, (base_prediction * peak_multiplier) * caffeine_effect + noise))
            focus_levels.append(focus)

        # Calculate peak focus time
        peak_index = np.argmax(focus_levels)
        optimal_time = time_intervals[peak_index]

        # Detect crash (Dynamic tolerance to drop)
        crash_index = None
        peak_focus = focus_levels[peak_index]
        
        # L-Theanine prevents steep crashes, changing the threshold
        crash_threshold = 0.8 if l_theanine else 0.7

        for i in range(peak_index + 1, len(focus_levels)):
            if focus_levels[i] < peak_focus * crash_threshold:
                crash_index = i
                break

        crash_time = time_intervals[crash_index] if crash_index is not None else None
        
        # Generate Actionable Advice
        advice = generate_actionable_advice(optimal_time, crash_time, tolerance, l_theanine)

        # Prepare JSON response
        response = {
            'focusGraph': [
                {'time': t.strftime('%H:%M'), 'focusLevel': round(f, 1)}
                for t, f in zip(time_intervals, focus_levels)
            ],
            'optimalCaffeineTime': optimal_time.strftime('%H:%M'),
            'crashTimeAlert': crash_time.strftime('%H:%M') if crash_time else None,
            'actionableAdvice': advice
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
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)

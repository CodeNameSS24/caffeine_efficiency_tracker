import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

def train_and_save_model():
    print("🧠 Starting model training...")
    
    # Generate more representative dummy data for a professional look
    # In a real scenario, this would load a CSV
    np.random.seed(42)
    n_samples = 500
    
    data = pd.DataFrame({
        'sleep_hours': np.random.uniform(4, 10, n_samples),
        'caffeine_intake': np.random.uniform(0, 400, n_samples),
        'fatigue_level': np.random.uniform(1, 10, n_samples)
    })
    
    # Focus formula: sleep helps, caffeine helps (up to a point), fatigue hurts
    data['focus_level'] = (
        (data['sleep_hours'] * 8) + 
        (data['caffeine_intake'] * 0.1) - 
        (data['fatigue_level'] * 5) + 
        np.random.normal(20, 5, n_samples)
    )
    data['focus_level'] = data['focus_level'].clip(10, 100)

    X = data[['sleep_hours', 'caffeine_intake', 'fatigue_level']]
    y = data['focus_level']

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Ensure backend directory exists
    model_path = os.path.join(os.path.dirname(__file__), 'caffeine_model.pkl')
    joblib.dump(model, model_path)
    
    print(f"✅ Model trained and saved to: {model_path}")

if __name__ == "__main__":
    train_and_save_model()

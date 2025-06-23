# ☕ Caffeine Efficiency Tracker

A smart and interactive web application that helps users **optimize caffeine consumption** by predicting their **focus levels** based on **sleep duration**, **caffeine intake**, and **fatigue level**.

---

## 🚀 Live Demo

> [COMING SOON: Deployed URL Here]

---

## 🧠 What It Does

Using a trained Machine Learning model, this tracker predicts:
- 🔥 Your **focus level over the next 10 hours**
- ⚡ **Best time to consume caffeine** for peak productivity
- ⚠️ A **crash alert** if your focus is expected to dip significantly
- 📊 A dynamic graph showing your **hourly focus variation**

---

## 🛠️ Tech Stack

| Layer        | Technologies              |
|--------------|---------------------------|
| **Frontend** | React.js, HTML, CSS       |
| **Backend**  | Flask (Python)            |
| **Styling**  | Custom CSS (with gradient design, blur effects) |
| **Extras**   | Flask-CORS, REST APIs, Responsive UI |

---

## 📸 Screenshots

![Screenshot 2025-06-23 205926](https://github.com/user-attachments/assets/d36a5576-504b-4326-9b48-dc152f4d7d23)
![Screenshot 2025-06-23 210030](https://github.com/user-attachments/assets/3a9e3fad-163e-4b01-8743-5d9394031824)
![Screenshot 2025-06-23 210108](https://github.com/user-attachments/assets/50da02df-5ac9-479c-bd11-bc7095238af5)
![Screenshot 2025-06-23 210141](https://github.com/user-attachments/assets/bbfe06b6-e559-4f1c-bb59-a9bed45417ec)



---

## 📦 Features

- 🎯 **Fully responsive interface** for desktop and mobile devices
- ⚡ Real-time **optimal caffeine time** predictor
- 📉 **Crash alert** warning when energy is expected to dip
- 📈 **Focus graph** visualization for the next 10 hours
- 🌐 Clean, smooth graph with **hour-by-hour focus prediction**.
-  Intuitive and easy to interpret at a glance.

---

## 📘 Prediction Terms Explained

### ⚡ Optimal Caffeine Time
- The **time when your predicted focus level is the highest** after caffeine intake.
- This is the **best time to consume coffee** to maximize productivity.
- Based on your unique input of sleep, fatigue, and caffeine.

### 🔺 Peak Focus
- The **maximum focus level** predicted in the 10-hour window.
- Used to calculate both the optimal time and crash risk.

### ⚠️ Crash Alert Time
- If your predicted focus **drops by more than 30%** after the peak, the app flags a **crash time**.
- Helps users prepare for a dip in energy and plan breaks accordingly.

### 📊 Average Focus
- The **mean focus level** across the 10-hour period.
- Gives an overall picture of your **day’s energy quality**.
- *Coming soon*: Visible on dashboard for deeper insight.

---

## 🛠️ How It Works

1. User inputs:
   - Hours of sleep last night
   - Current fatigue level
   - Amount of caffeine intake (mg)

2. Backend (`/predict`) uses trained ML model to:
   - Predict a **base focus level**
   - Simulate hourly variations over 10 hours
   - Compute **optimal time** and **potential crash**

3. Frontend displays:
   - Focus graph
   - Optimal & crash alert cards
   - Loading spinner

---

## 🧾 Installation & Local Setup

```bash
# Clone repo
git clone https://github.com/yourusername/caffeine-efficiency-tracker.git
cd caffeine-efficiency-tracker

# Install Python backend dependencies
cd backend
pip install -r requirements.txt

# Train & save model (first time only)
python train_model.py

# Start Flask API
python caffeine_efficiency_api.py

# Open new terminal for frontend
cd ../frontend
npm install
npm start

Calorie Tracker App
A web-based calorie tracking app built with React.js (frontend), Node.js (backend), and Chart.js for visualizing daily calorie intake.

Features
Track daily calorie intake for Breakfast, Lunch, and Dinner.

Add quantities for predefined food items (e.g., Banana, Bread, Egg).

Calculate total calories consumed in a day.

View graphs for daily calorie consumption.

Simple and intuitive user interface with a black and white theme.

Technologies Used
Frontend: React.js, Chart.js, Axios

Backend: Node.js, Express.js

Styling: CSS

Folder Structure
Here’s the complete folder structure of the project:

Copy
calorie-tracker/
├── backend/
│   ├── package.json          # Backend dependencies and scripts
│   ├── server.js             # Backend server code
│   ├── data/
│   │   └── foodData.js       # Predefined food data with calories
├── frontend/
│   ├── public/
│   │   └── index.html        # HTML template for React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js     # Header component
│   │   │   ├── MealSection.js # Meal section component (Breakfast, Lunch, Dinner)
│   │   │   ├── Summary.js    # Summary component (total calories)
│   │   │   ├── Graphs.js     # Graphs component (Chart.js integration)
│   │   │   └── DailyIntake.js # Daily intake component
│   │   ├── pages/
│   │   │   ├── Home.js       # Home page (main page)
│   │   │   └── DailyIntakePage.js # Daily intake page
│   │   ├── App.js            # Main App component
│   │   ├── index.js          # Entry point for React app
│   │   ├── styles/
│   │   │   └── App.css       # CSS styles for the app
│   ├── package.json          # Frontend dependencies and scripts
├── README.md                 # Project documentation
Detailed Explanation of Code
Backend
1. backend/server.js
This is the backend server built with Node.js and Express.js. It serves the food data and calculates total calories.

javascript
Copy
const express = require('express');
const cors = require('cors');
const foodData = require('./data/foodData'); // Import food data

const app = express();
const PORT = 5000;

app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json()); // Parse JSON request bodies

// API to get food data
app.get('/api/foods', (req, res) => {
    res.json(foodData); // Send food data to the frontend
});

// API to calculate total calories
app.post('/api/calculate', (req, res) => {
    const { selectedFoods } = req.body; // Get selected foods from the frontend
    let totalCalories = 0;

    // Calculate total calories based on selected foods and quantities
    selectedFoods.forEach(item => {
        const food = foodData.find(f => f.name === item.name);
        if (food) {
            totalCalories += food.calories * item.quantity;
        }
    });

    res.json({ totalCalories }); // Send total calories back to the frontend
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
2. backend/data/foodData.js
This file contains predefined food data with their calorie values.

javascript
Copy
const foodData = [
    { name: 'Banana', calories: 105 },
    { name: 'Bread', calories: 79 },
    { name: 'Egg', calories: 78 },
    { name: 'Apple', calories: 95 },
    { name: 'Rice', calories: 206 },
    { name: 'Chicken', calories: 335 },
];

module.exports = foodData; // Export food data for use in server.js
Frontend
1. frontend/src/App.js
This is the main component of the React app. It manages the state and routes.

javascript
Copy
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import DailyIntakePage from './pages/DailyIntakePage';
import './styles/App.css';

const App = () => {
    const [foods, setFoods] = useState([]); // State for food data
    const [selectedFoods, setSelectedFoods] = useState([]); // State for selected foods
    const [totalCalories, setTotalCalories] = useState(0); // State for total calories
    const [dailyIntake, setDailyIntake] = useState([]); // State for daily intake history

    // Fetch food data from the backend
    useEffect(() => {
        axios.get('http://localhost:5000/api/foods')
            .then(response => setFoods(response.data))
            .catch(error => console.error(error));
    }, []);

    // Handle food selection (quantity input)
    const handleFoodSelection = (meal, food, quantity) => {
        const updatedSelection = [...selectedFoods];
        const existingItemIndex = updatedSelection.findIndex(
            item => item.name === food.name && item.meal === meal
        );

        if (existingItemIndex !== -1) {
            updatedSelection[existingItemIndex].quantity = quantity;
        } else {
            updatedSelection.push({ meal, name: food.name, quantity, calories: food.calories });
        }

        setSelectedFoods(updatedSelection);
    };

    // Calculate total calories
    const calculateTotalCalories = () => {
        let total = 0;
        selectedFoods.forEach(item => {
            total += item.calories * item.quantity;
        });
        setTotalCalories(total);

        // Save daily intake
        const today = new Date().toLocaleDateString();
        const breakfast = selectedFoods.filter(item => item.meal === 'Breakfast').reduce((sum, item) => sum + item.calories * item.quantity, 0);
        const lunch = selectedFoods.filter(item => item.meal === 'Lunch').reduce((sum, item) => sum + item.calories * item.quantity, 0);
        const dinner = selectedFoods.filter(item => item.meal === 'Dinner').reduce((sum, item) => sum + item.calories * item.quantity, 0);

        setDailyIntake([...dailyIntake, { date: today, breakfast, lunch, dinner }]);
    };

    return (
        <Router>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/daily-intake">Daily Intake</Link>
            </nav>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            onCalculate={calculateTotalCalories}
                            totalCalories={totalCalories}
                        />
                    }
                />
                <Route
                    path="/daily-intake"
                    element={<DailyIntakePage dailyIntake={dailyIntake} />}
                />
            </Routes>
        </Router>
    );
};

export default App;
2. frontend/src/components/MealSection.js
This component allows users to input quantities for food items.

javascript
Copy
import React from 'react';

const MealSection = ({ meal, foods, onSelect }) => {
    const handleQuantityChange = (food, e) => {
        const quantity = parseInt(e.target.value) || 0; // Get quantity from input
        onSelect(meal, food, quantity); // Pass meal, food, and quantity to parent
    };

    return (
        <div className="meal-section">
            <h2>{meal}</h2>
            {foods.map(food => (
                <div key={food.name} className="food-item">
                    <span>{food.name} ({food.calories} cal)</span>
                    <input
                        type="number"
                        min="0"
                        placeholder="Qty"
                        onChange={(e) => handleQuantityChange(food, e)}
                    />
                </div>
            ))}
        </div>
    );
};

export default MealSection;
3. frontend/src/components/Graphs.js
This component uses Chart.js to display graphs for daily calorie intake.

javascript
Copy
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Graphs = ({ dailyIntake }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (dailyIntake.length === 0) return;

        const labels = dailyIntake.map(entry => entry.date); // Dates for the X-axis
        const breakfastData = dailyIntake.map(entry => entry.breakfast); // Breakfast calories
        const lunchData = dailyIntake.map(entry => entry.lunch); // Lunch calories
        const dinnerData = dailyIntake.map(entry => entry.dinner); // Dinner calories

        const ctx = chartRef.current.getContext('2d');

        new Chart(ctx, {
            type: 'line', // Line chart
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Breakfast',
                        data: breakfastData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    },
                    {
                        label: 'Lunch',
                        data: lunchData,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    },
                    {
                        label: 'Dinner',
                        data: dinnerData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true, // Start Y-axis from 0
                    },
                },
            },
        });
    }, [dailyIntake]);

    return <canvas ref={chartRef} />; // Render the chart
};

export default Graphs;
How to Run
Clone the repository:

bash
Copy
git clone https://github.com/Toodlepoodle/CALORIE_COUNTER_WEB.git
Navigate to the project folder:

bash
Copy
cd CALORIE_COUNTER_WEB
Start the backend server:

bash
Copy
cd backend
npm install
node server.js
Start the frontend development server:

bash
Copy
cd ../frontend
npm install
npm start
Open your browser and go to http://localhost:3000.


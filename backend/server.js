const express = require('express');
const cors = require('cors');
const foodData = require('./data/foodData');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// API to get food data
app.get('/api/foods', (req, res) => {
    res.json(foodData);
});

// API to calculate total calories
app.post('/api/calculate', (req, res) => {
    const { selectedFoods } = req.body;
    let totalCalories = 0;

    selectedFoods.forEach(item => {
        const food = foodData.find(f => f.name === item.name);
        if (food) {
            totalCalories += food.calories * item.quantity;
        }
    });

    res.json({ totalCalories });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
import React from 'react';
import './MealPlanBox.css';

const MealPlanBox = () => {
  const meals = {
    breakfast: 'Oatmeal with banana',
    lunch: 'Grilled chicken salad',
    dinner: 'Steamed salmon with veggies',
    snack: 'Apple Slices with Almond Butter'
  };

  return (
    <div className="mealplan" style={{ gridArea: 'mealplan' }}>
      <h2>Meal Plan</h2>
      <p className="day-label">Monday</p>
      <div className="meal-box">
        <strong>Breakfast:</strong> <span>{meals.breakfast}</span>
      </div>
      <div className="meal-box">
        <strong>Lunch:</strong> <span>{meals.lunch}</span>
      </div>
      <div className="meal-box">
        <strong>Dinner:</strong> <span>{meals.dinner}</span>
      </div>
      <div className="meal-box">
        <strong>Snack:</strong> <span>{meals.snack}</span>
      </div>
    </div>
  );
};

export default MealPlanBox;

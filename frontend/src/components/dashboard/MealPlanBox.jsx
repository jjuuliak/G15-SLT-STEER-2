import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import './MealPlanBox.css';
import { getCurrentDayIndex } from '../../pages/mealPlan/mealPlanFunctions';

const MealPlanBox = () => {
  const mealPlanData = useSelector((state) => state.mealPlan?.mealPlanResponse);
  const [mealIndex, setMealIndex] = useState(0);
  const [days, setDays] = useState(null);

  useEffect(() => {
    if (mealPlanData) {
      const index = mealPlanData?.created ? getCurrentDayIndex(mealPlanData?.created) : 0;
      setMealIndex(index);
      setDays(typeof mealPlanData?.meal_plan === 'string' ? JSON.parse(mealPlanData.meal_plan).days : mealPlanData?.meal_plan.days);
    }
  }, [mealPlanData]);

  const currentDay = days?.[mealIndex];
  const meals = currentDay?.daily_meals || [];

  const getMealContent = (type) => {
    const meal = meals.find(m => m.meal.toLowerCase() === type);
    return meal ? (
      <>
        <span className="meal-description">{meal.meal_description}</span>
        <ul className="meal-content">
          {meal.meal_content.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </>
    ) : <span>Not available</span>;
  };

  return (
    <div className="mealplan" style={{ gridArea: 'mealplan' }}>
      <h2>Meal Plan</h2>

      <div className="meal-box">
        <strong>Breakfast:</strong>
        {getMealContent("breakfast")}
      </div>
      <div className="meal-box">
        <strong>Lunch:</strong>
        {getMealContent("lunch")}
      </div>
      <div className="meal-box">
        <strong>Dinner:</strong>
        {getMealContent("dinner")}
      </div>
      <div className="meal-box">
        <strong>Snack:</strong>
        {getMealContent("snack")}
      </div>
    </div>
  );
};

export default MealPlanBox;

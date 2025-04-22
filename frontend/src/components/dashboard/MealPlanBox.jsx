import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import './MealPlanBox.css';
import { getCurrentDayIndex } from '../../pages/mealPlan/mealPlanFunctions';

const MealPlanBox = () => {
  const { t } = useTranslation();
  const mealPlanData = useSelector((state) => state.mealPlan?.mealPlanResponse);
  const [mealIndex, setMealIndex] = useState(0);
  const [days, setDays] = useState(null);

  useEffect(() => {
    if (mealPlanData && mealPlanData.meal_plan) {
      const index = mealPlanData?.created ? getCurrentDayIndex(mealPlanData?.created) : 0;
      setMealIndex(index);
      setDays(typeof mealPlanData?.meal_plan === 'string' ? JSON.parse(mealPlanData?.meal_plan)?.days : mealPlanData?.meal_plan?.days);
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
    ) : <span className="meal-description">{t('NotAvailable')}</span>;
  };

  const mealsTranslation = t('Meals');

  return (
    <div className="mealplan" style={{ gridArea: 'mealplan' }}>
      <h2>{t('meal-plan')}</h2>

      <div className="meal-box">
        <strong>{mealsTranslation.Breakfast}</strong>
        {getMealContent("breakfast")}
      </div>
      <div className="meal-box">
        <strong>{mealsTranslation.Lunch}</strong>
        {getMealContent("lunch")}
      </div>
      <div className="meal-box">
        <strong>{mealsTranslation.Dinner}</strong>
        {getMealContent("dinner")}
      </div>
      <div className="meal-box">
        <strong>{mealsTranslation.Snack}</strong>
        {getMealContent("snack")}
      </div>
    </div>
  );
};

export default MealPlanBox;

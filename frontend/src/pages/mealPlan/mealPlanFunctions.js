export const parseMealPlanData = (data) => {
  return parseStructuredMealPlan(data);
};

function parseStructuredMealPlan(jsonData) {
  let mealPlan = {};
  if (!jsonData?.days || !Array.isArray(jsonData.days)) return mealPlan;

  jsonData.days.forEach((day, index) => {
    let dayKey = `Day ${index + 1}`;
    let meals = {};

    day.daily_meals.forEach(meal => {
      meals[meal.meal.toLowerCase()] = {
        description: meal.meal_description,
        content: meal.meal_content
      };
    });

    mealPlan[dayKey] = meals;
  });

  return mealPlan;
}
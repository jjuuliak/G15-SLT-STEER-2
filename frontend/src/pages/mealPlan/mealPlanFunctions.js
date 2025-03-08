
export const parseMealPlanData = (data) => {
  const mealPlan1 = parseMealPlan1(data);
  if (Object.keys(mealPlan1).length > 0) {
    return mealPlan1;
  }

  const mealPlan2 = parseMealPlan2(data);
  if (Object.keys(mealPlan2).length > 0) {
    return mealPlan2;
  }

  return {};
};

function parseMealPlan1(responseText) {
  const days = responseText.split(/\n\nDay \d+:/); // Split by each day's section
  let mealPlan = {};

  days.forEach((daySection, index) => {
    if (index === 0) return; // Skip introduction part before "Day 1"

    let dayName = `Day ${index}`;
    let meals = {};

    // Extract individual meals
    const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];
    mealTypes.forEach(meal => {
      const regex = new RegExp(`${meal} \\(approx\\. (\\d+) calories\\): (.+?)(?=\\n\\*? ?(?:Breakfast|Lunch|Dinner|Snacks|$))`, "s");
      const match = daySection.match(regex);

      if (match) {
        meals[meal.toLowerCase()] = {
          description: match[2].trim(),
          calories: parseInt(match[1])
        };
      }
    });

    mealPlan[dayName] = meals;
  });

  return mealPlan;
}

function parseMealPlan2(responseText) {
  let mealPlan = {};
  let daySections = responseText.split(/Day \d+:/g); // Split by "Day X:"

  let dayIndex = 1;
  daySections.forEach(section => {
    let dayKey = `Day ${dayIndex}`;

    // Ensure it's a valid day (ignoring introductory text)
    if (dayIndex > 1 || section.includes("Breakfast")) {
      let meals = {};

      const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];
      mealTypes.forEach(meal => {
        // Match meal entry with calories and description
        const regex = new RegExp(`${meal} \\(approx\\. (\\d+) calories\\): (.*?)(?=\\*? ?(?:Breakfast|Lunch|Dinner|Snacks|$))`, "s");
        const match = section.match(regex);

        if (match) {
          meals[meal.toLowerCase()] = {
            description: match[2].trim(),
            calories: parseInt(match[1])
          };
        }
      });

      mealPlan[dayKey] = meals;
    }
    dayIndex++;
  });

  return mealPlan;
}
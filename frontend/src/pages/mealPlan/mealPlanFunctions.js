export const parseMealPlanData = (rawData) => {
  try {
    // Check that rawData is a valid object.
    if (!rawData || typeof rawData !== "object") {
      console.error("Invalid meal plan data:", rawData);
      return { days: [], explanation: "" };
    }

    // Ensure days is an array; if not, default to an empty array.
    const days = Array.isArray(rawData.days) ? rawData.days : [];
    
    // Validate each day has a daily_meals array.
    const parsedDays = days.map((day, index) => {
      if (!Array.isArray(day.daily_meals)) {
        console.warn(`Day ${index} is missing a valid 'daily_meals' array:`, day);
        return { daily_meals: [] };
      }
      return day;
    });
    
    // Ensure explanation is a string, or default to an empty string.
    const explanation =
      typeof rawData.explanation === "string" ? rawData.explanation : "";

    return { days: parsedDays, explanation };
  } catch (error) {
    console.error("Error parsing meal plan data:", error);
    return { days: [], explanation: "" };
  }
};

export const getCurrentDayIndex = (createdTimestamp) => {
  const createdDate = new Date(createdTimestamp * 1000); // Convert from seconds
  const now = new Date();

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysPassed = Math.floor((now - createdDate) / msPerDay);

  return daysPassed; // 0 = Day 1, 1 = Day 2, etc.
};

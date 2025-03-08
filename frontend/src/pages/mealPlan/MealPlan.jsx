import React from "react";
import { useSelector } from "react-redux";
import { 
  Typography, 
  Container, 
  Grid2 as Grid,
  Box,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import "./MealPlan.css";
import TopBar from "../../components/TopBar";
import { parseMealPlanData } from "./mealPlanFunctions";

const MealPlan = () => {
  const mealPlanData = useSelector((state) => state.mealPlan.mealPlanResponse);
  console.log(mealPlanData)

    // Split response into lines for easier extraction
    const lines = mealPlanData?.split("\n").map((line) => line.trim()).filter(line => line);

    const parsedMealPlan = [];
    let currentDay = null;
  
    lines?.forEach((line) => {
      if (line.startsWith("Day")) {
        currentDay = { day: line, meals: [] };
        parsedMealPlan.push(currentDay);
      } else if (currentDay && line.includes("calories):")) {
        const [mealType, mealDetails] = line.split(": ");
        const mealName = mealDetails.split("(")[0].trim();
        const caloriesMatch = mealDetails.match(/(\d+) calories/);
        const calories = caloriesMatch ? parseInt(caloriesMatch[1], 10) : 0;
  
        currentDay.meals.push({
          type: mealType.replace("*", "").trim(),
          name: mealName,
          calories,
          details: mealDetails
        });
      }
    });

  // Example Usage:
  const rawResponse = `Okay, here's a sample lacto-ovo vegetarian meal plan...` // (your backend response text)
  const structuredData = parseMealPlanData(mealPlanData);
  console.log(structuredData);
  console.log(parseMealPlanData("Okay, here's a sample lacto-ovo vegetarian meal plan designed for someone very active and aiming to maintain their current weight. It emphasizes easy and quick recipes. Remember, this is just a sample, and calorie counts are estimates. You should adjust portion sizes based on your individual needs and hunger levels. Consulting a registered dietitian or nutritionist for personalized advice is always recommended.Because you're very active, your calorie needs will be higher than someone less active. I'll aim for approximately 2800-3000 calories per day, but this is a rough estimate and may need adjustment based on your individual metabolism and weight.Sample Meal Plan:Day 1: Breakfast (approx. 450 calories): Greek yogurt (1 cup) with berries (½ cup) and a sprinkle of granola (¼ cup). High protein and quick. Lunch (approx. 700 calories): Large salad with 4 oz chickpeas, mixed greens, ½ avocado, cucumber, tomatoes, and a light vinaigrette. Add feta cheese for extra protein. Dinner (approx. 800 calories): Black bean burgers (store-bought or easily made from canned beans) on whole-wheat buns with lettuce, tomato, and avocado. Serve with a side of baked sweet potato fries. Snacks (approx. 850 calories): Apple slices with 2 tablespoons of peanut butter, a handful of almonds, a hard-boiled egg.Day 2:* Breakfast (approx. 400 calories): Scrambled eggs (2) with whole-wheat toast and avocado.* Lunch (approx. 750 calories): Leftover black bean burgers.* Dinner (approx. 800 calories): Pasta with marinara sauce and lots of vegetables (e.g., zucchini, bell peppers, spinach). Add lentils or chickpeas for extra protein.* Snacks (approx. 900 calories): Cottage cheese with fruit, a quick smoothie with protein powder (whey or plant-based), banana, and spinach.Day 3:* Breakfast (approx. 450 calories): Oatmeal (½ cup dry) with milk, berries, and a sprinkle of nuts.* Lunch (approx. 700 calories): Whole-wheat pita bread with hummus, cucumber, tomatoes, and feta cheese.* Dinner (approx. 750 calories): Vegetarian chili (using canned beans for convenience) with a dollop of plain yogurt or sour cream and whole-wheat bread.* Snacks (approx. 900 calories): Trail mix (nuts, seeds, dried fruit), rice cakes with peanut butter, popcorn.Important Considerations:* Hydration: Drink plenty of water throughout the day.* Variety: This is a sample plan; vary your choices for optimal nutrition.* Listen to your body: Adjust portions based on your hunger and energy levels.* Professional Advice: Consult a registered dietitian or nutritionist for personalized recommendations.This plan focuses on quick and easy recipes. Remember to adjust portion sizes to meet your individual needs and activity levels. Let me know if you'd like specific recipe ideas or modifications!"))

  return (
    <Container
      id='meal-plan-container'
      className="meal-plan-container"
      >
      <TopBar />
      {!mealPlanData ? (
        <Typography variant="h6" align="center">No meal plan created yet</Typography>
      ) : (
        <Grid>
            {parsedMealPlan.map((dayPlan, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
                  {dayPlan.day}
                </Typography>
                {dayPlan.meals.map((meal, i) => (
                  <Card key={i} sx={{ mb: 2, backgroundColor: "#f9f9f9" }}>
                    <CardContent>
                      <Typography variant="h6" color="secondary">
                        {meal.type}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {meal.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {meal.details}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                        Calories: {meal.calories} kcal
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                {index < parsedMealPlan.length - 1 && <Divider sx={{ my: 3 }} />}
              </Box>
            ))}
        </Grid>
      )}
    </Container>
  );
};

export default MealPlan;
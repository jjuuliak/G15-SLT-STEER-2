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
import TopBar from "../components/TopBar";

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
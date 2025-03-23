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

  // Example Usage:
  const rawResponse = { "explanation": "This meal plan is designed to support cardiovascular health by focusing on fruits, vegetables, lean proteins, and healthy fats, while limiting saturated and trans fats, sodium, and added sugars. It is based on principles from the DASH eating plan and the Mediterranean diet.", "days": [ { "daily_meals": [ { "meal": "Breakfast", "meal_description": "Oatmeal with berries and nuts", "meal_content": [ "1/2 cup rolled oats cooked with water or low-fat milk", "1/2 cup mixed berries (strawberries, blueberries, raspberries)", "1/4 cup chopped walnuts or almonds" ] }, { "meal": "Lunch", "meal_description": "Large salad with grilled chicken or fish", "meal_content": [ "Mixed greens (lettuce, spinach, kale)", "4 oz grilled chicken breast or baked fish", "1/2 cup assorted vegetables (cucumber, tomatoes, bell peppers)", "2 tablespoons olive oil and vinegar dressing" ] }, { "meal": "Dinner", "meal_description": "Baked salmon with roasted vegetables", "meal_content": [ "4 oz baked salmon", "1 cup roasted vegetables (broccoli, carrots, sweet potatoes) tossed with olive oil and herbs", "1/2 cup quinoa" ] }, { "meal": "Snack", "meal_description": "Apple slices with almond butter", "meal_content": [ "1 medium apple, sliced", "2 tablespoons almond butter" ] } ] } ] } 
  const structuredData = parseMealPlanData(mealPlanData);
  console.log(structuredData);
  console.log(Object.entries(structuredData))

  return (
    <Container
      id='meal-plan-container'
      className="meal-plan-container"
      >
      <TopBar />
      {Object.entries(structuredData)?.length <= 0? (
        <Typography variant="h6" align="center" sx={{ mt: '20px'}}>No meal plan created yet</Typography>
      ) : (
          <Grid sx={{ mt: '20px' }}>
            {Object.entries(structuredData).map(([day, meals], index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
                  {day}
                </Typography>
                {Object.entries(meals).map(([mealType, meal], i) => (
                  <Card key={i} sx={{ mb: 2, backgroundColor: "#f9f9f9" }}>
                    <CardContent>
                      <Typography variant="h6" color="secondary">
                        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {meal.description}
                      </Typography>
                      {meal.content && (
                        <ul>
                          {meal.content.map((item, idx) => (
                            <li key={idx}>
                              <Typography variant="body2" color="text.secondary">
                                {item}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {index < structuredData.length - 1 && <Divider sx={{ my: 3 }} />}
              </Box>
            ))}
          </Grid>
      )}
    </Container>
  );
};

export default MealPlan;
import React, { useEffect, useState } from "react";
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
  const accessToken = useSelector((state) => state.auth?.access_token);

  const [days, setDays] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [explanation, setExplanation] = useState("");
  

  useEffect(() => {
    if (accessToken) {
      fetch("http://localhost:8000/last-meal-plan", {
        method: "POST",
        headers: { 
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch profile data");
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.meal_plan) {
            console.log(JSON.parse(data.meal_plan))
            const parsedData = parseMealPlanData(JSON.parse(data.meal_plan));
            setDays(parsedData.days);
            setExplanation(parsedData.explanation);
            console.log(parsedData)
          }
        })
        .catch((error) => {
          console.error("Error fetching meal plans:", error);
        });
    }
  }, []);

  // Update selectedDay when days are updated from fetch
  useEffect(() => {
    if (days?.length > 0 && !selectedDay) {
      setSelectedDay(days[0]);
    }
  }, [days, selectedDay]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  console.log(selectedDay)

  return (
    <Container
      id='meal-plan-container'
      className="meal-plan-container"
      maxWidth={true}
    >
      <TopBar />
      {days?.length <= 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: '20px' }}>No meal plan created yet</Typography>
      ) : (
        <Grid sx={{ mt: '20px' }}>

          {/* Title or header for Meal Plan */}
          <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
            Meal plan
          </Typography>

          {/* Row of day "tabs" */}
          <Grid container spacing={2}>
            {days?.map((day, index) => {
              const isSelected = day === selectedDay;
              console.log(day)
              return (
                <Grid item key={index}>
                  <Box
                    onClick={() => handleDayClick(day)}
                    sx={{
                      cursor: "pointer",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textAlign: "center",
                      backgroundColor: isSelected ? "green" : "#d2ead2",
                      color: isSelected ? "white" : "black",
                      minWidth: 120
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Day {index + 1}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Display the meals for the currently selected day */}
          {selectedDay && (
            <Grid container spacing={2}>
              {selectedDay.daily_meals?.map((meal, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card sx={{ backgroundColor: "#f9f9f9" }}>
                    <CardContent>
                      <Typography variant="h6" color="secondary">
                        {meal.meal}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                        {meal.meal_description}
                      </Typography>
                      {meal.meal_content && (
                        <ul style={{ marginTop: 8 }}>
                          {meal.meal_content?.map((item, idx) => (
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
                </Grid>
              ))}
            </Grid>
          )}

          {/* Display the explanation if available */}
          {explanation && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, pt: 3 }}>
              {explanation}
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default MealPlan;
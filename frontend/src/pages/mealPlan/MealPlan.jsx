import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  Typography, 
  Grid2 as Grid,
  Box,
  Card,
  CardContent,
  Divider,
  useTheme
} from "@mui/material";
import "./MealPlan.css";
import TopBar from "../../components/TopBar";
import { parseMealPlanData, getCurrentDayIndex } from "./mealPlanFunctions";
import { useTranslation } from 'react-i18next';

const MealPlan = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const mealPlanData = useSelector((state) => state.mealPlan?.mealPlanResponse);

  const [days, setDays] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [explanation, setExplanation] = useState("");
  const [createdTimestamp, setCreatedTimestamp] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  

  useEffect(() => {
    if (mealPlanData?.meal_plan) {
      const parsedData = JSON.parse(mealPlanData.meal_plan);
      const parsedMealPlan = parseMealPlanData(parsedData);
      setDays(parsedMealPlan?.days);
      setExplanation(parsedMealPlan?.explanation);
      setCreatedTimestamp(parsedData?.created);
    }
  }, [mealPlanData]);

  // Update selectedDay when days are updated from fetch
  useEffect(() => {
    if (days?.length > 0 && !selectedDay) {
      const index = createdTimestamp ? getCurrentDayIndex(createdTimestamp) : 0;

      setSelectedDay(days[index]);
      setSelectedIndex(index);
    }
  }, [days, createdTimestamp]);

  const formatDateFromCreated = (index) => {
    if (!createdTimestamp) return `Day ${index + 1}`;
    
    const date = new Date(createdTimestamp * 1000); // seconds to ms
    date.setDate(date.getDate() + index);
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleDayClick = (day, index) => {
    setSelectedDay(day);
    setSelectedIndex(index);
  };

  return (
    <Grid
      id='meal-plan-container'
      className="meal-plan-container"
      maxWidth={true}
    >
      <TopBar />
      {days?.length <= 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: '20px', ml: '20px' }}>{t('MealPlanNotCreated')}</Typography>
      ) : (
        <Grid sx={{ mt: '20px', ml: '20px', mr: '20px' }}>

          {/* Title or header for Meal Plan */}
          <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: "bold" }}>
            {t('meal-plan')}
          </Typography>

          {/* Row of day "tabs" */}
          <Grid container spacing={2}>
            {days?.map((day, index) => {
              const isSelected = index === selectedIndex;
              return (
                <Grid item key={index}>
                  <Box
                    onClick={() => handleDayClick(day, index)}
                    sx={{
                      cursor: "pointer",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textAlign: "center",
                      backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.primary.secondary,
                      color: isSelected ? "white" : "black",
                      minWidth: 120
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {formatDateFromCreated(index)}
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
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card sx={{ backgroundColor: theme.palette.primary.light }}>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {t(meal.meal)}
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
    </Grid>
  );
};

export default MealPlan;
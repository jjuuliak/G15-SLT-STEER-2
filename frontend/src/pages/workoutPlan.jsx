import React, { useEffect, useMemo } from "react";
import { Container, Typography, Box, Card, CardContent } from "@mui/material";
import { useSelector } from "react-redux";
import TopBar from "../components/TopBar";
import { useDispatch } from "react-redux";
import { useState } from "react";

const WorkoutPlan = () => {
    //const workoutPlanData = useSelector((state) => state.workoutPlan.workoutPlan);
    const [workoutPlan, setWorkoutPlan] = useState(null);
    
    const accessToken = useSelector((state) => state.auth?.access_token);
    const dispatch = useDispatch();

    // Function to parse the workout plan JSON
    const parseWorkoutPlan = (workoutPlan) => {
        if (!workoutPlan) return { days: [], explanation: "" };
        
        const parsedData = JSON.parse(workoutPlan.workout_plan);
        return { days: parsedData.days, explanation: parsedData.explanation };
    };

    const { days, explanation } = useMemo(() => parseWorkoutPlan(workoutPlan), [workoutPlan]);

    useEffect(() => {
        if (accessToken) {
            console.log("Fetching workout plan");
            fetch("http://localhost:8000/last-workout-plan", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            })  
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch workout plan");
                }
                return response.json();
            })
            .then((data) => {
                if (data) {
                    setWorkoutPlan(data);
                }
            })
            .catch((error) => {
                console.error("Error fetching workout plan:", error);
            });
        }
    }, []);

    return ( 
        <Container>
            <TopBar />
            <Typography variant="h1" align="center" gutterBottom>Workout Plan</Typography>
            {days.map((day, index) => (
                <Card key={index} variant="outlined" sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h2">Day {index + 1}</Typography>
                        {day.daily_workouts.map((workout, workoutIndex) => (
                            <Box key={workoutIndex} sx={{ marginBottom: 1 }}>
                                <Typography variant="h3">{workout.workout_description}</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {workout.workout_each_step_and_how_long.join(", ")}
                                </Typography>
                            </Box>
                        ))}
                    </CardContent>
                </Card>
            ))}
            <Box sx={{ marginTop: 3, padding: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                <Typography variant="h4">Explanation</Typography>
                <Typography variant="body1">{explanation}</Typography>
            </Box>
        </Container>
    );
}
 
export default WorkoutPlan;
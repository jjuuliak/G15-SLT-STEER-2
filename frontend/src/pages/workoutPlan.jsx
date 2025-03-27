import React, { useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const WorkoutPlan = () => {
    const workoutPlan = useSelector((state) => state.workoutPlan.workoutPlan);
    const accessToken = useSelector((state) => state.auth?.access_token);

    useEffect(() => {
        if (workoutPlan) {
            console.log(workoutPlan);
        }
    }, [workoutPlan]);

    useEffect(() => {
        if (accessToken) {
            fetchWorkoutPlan();
        }
    }, [accessToken]);

    const fetchWorkoutPlan = async () => {
        const response = await fetch("http://localhost:8000/last-workout-plan", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
        });
        const data = await response.json();
        console.log(data);

    };

    return ( 
        <Container>
            <Typography variant="h1">Workout Plan</Typography>
        </Container>
     );
}
 
export default WorkoutPlan;
import React, { useEffect, useMemo } from "react";
import { Container, Typography, Box, Card, CardContent, Grid2 as Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router';
import TopBar from "../components/TopBar";
import { useTranslation } from 'react-i18next';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import { setWorkoutPlan } from "../redux/actionCreators/workoutPlanActions";
import { fetchWithAuth } from '../services/authService';

const WorkoutPlan = () => {
    const workoutPlanData = useSelector((state) => state.workoutPlan.workoutPlan);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.auth?.access_token);
    const refreshToken = useSelector((state) => state.auth?.refresh_token);
    const {t} = useTranslation();
    const pageTranslations = t("workoutPageTranslations")

    // Function to parse the workout plan JSON
    const parseWorkoutPlan = (workoutPlan) => {
        if (!workoutPlan) return { days: [], explanation: "" };
    
        if (typeof workoutPlan === 'string') {
            try {
                const parsed = JSON.parse(workoutPlan);
                return {
                    days: parsed.days || [],
                    explanation: parsed.explanation || ""
                };
            } catch (err) {
                console.error("Failed to parse workout plan string:", err);
                return { days: [], explanation: "" };
            }
        } 
    };


    const { days, explanation } = useMemo(() => parseWorkoutPlan(workoutPlanData), [workoutPlanData]);

    useEffect(() => {
        // Fetch workout plan only if it's not already in Redux
        if (!workoutPlanData && accessToken) {
            console.log("Fetching workout plan");
            fetchWithAuth("http://localhost:8000/last-workout-plan", {
                method: "POST",
                headers: null, // Default set in fetchWithAuth
            }, accessToken, refreshToken, dispatch, navigate)  
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch workout plan");
                }
                return response.json();
            })
            .then((data) => {
                if (data) {
                    dispatch(setWorkoutPlan(data.workout_plan)); // Dispatch action to store in Redux
                }
            })
            .catch((error) => {
                console.error("Error fetching workout plan:", error);
            });
        }
    }, [workoutPlanData, accessToken, dispatch]);

    

    return ( 
        <Container maxWidth={false} sx={{height: "100vh", width: "100vw", padding: 0, backgroundColor: '#F5F7FA'}}>
            <TopBar />
            
            <Grid container spacing={2} justifyContent="space-around" alignItems="center" my={4}>
                <Grid item xs={12} sm={8}>
                    <Card variant="outlined" sx={{ 
                        backgroundColor: '#FFFFFF', 
                        borderRadius: 4, 
                        marginX: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2D3748' }}>{pageTranslations.today}</Typography>
                            <Box display="flex" flexDirection={{xs: 'column', md: 'row'}} justifyContent="space-around" alignItems="center">
                                <Box>
                                    <Box
                                        sx={{
                                            width: '120px',
                                            height: '120px',
                                            borderRadius: '50%',
                                            backgroundColor: '#EDF2F7',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <DirectionsRunIcon sx={{ fontSize: 60, color: '#4A5568' }} />
                                    </Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2D3748' }}>{pageTranslations.steps}</Typography>
                                    <Typography variant="subtitle2" sx={{ color: '#4A5568' }}>1240 steps (placeholder)</Typography>
                                </Box>
                                <Box marginX={2}>
                                    <Box 
                                        backgroundColor={'#EDF2F7'}
                                        sx={{
                                            width: '300px', 
                                            height: '160px', 
                                            borderRadius: 2,
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            justifyContent: 'center', 
                                            alignItems: 'center', 
                                            paddingX: 2
                                        }}
                                    >
                                        <Typography align="left" marginLeft={2} paddingY={1} sx={{ color: '#2D3748' }}>{pageTranslations.stepGoal}</Typography>
                                        <Typography align="left" marginLeft={2} paddingY={1} sx={{ color: '#4A5568' }}>Placeholder for progress bar</Typography>
                                        <Box sx={{ 
                                            backgroundColor: "#FFFFFF",
                                            width: '100%',
                                            height: '120px',
                                            border: 1, 
                                            borderRadius: 4,
                                            borderColor: '#E2E8F0',
                                            margin: 1,
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                        }}>
                                            <Typography align="center" marginLeft={2} paddingY={1} sx={{ color: '#4A5568' }}>Placeholder for today's workout</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4} sx={{width: "300px"}}>
                    <Card variant="outlined" sx={{ 
                        backgroundColor: '#FFFFFF',                      
                        borderRadius: 4,
                        padding: 4,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}>
                        <CardContent>
                            <Typography variant="subtitle1" display="flex" justifyContent="center" alignItems="center" sx={{ color: '#2D3748' }}>{pageTranslations.weeklyProgress}</Typography>
                            <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                                <DataUsageIcon sx={{ fontSize: 60, color: '#4A5568' }} /> 
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card variant="outlined" sx={{
                        marginX: 2,
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        borderRadius: 4,
                    }}>
                        <CardContent>
                            <Box sx={{p: 5, m:5}}>
                                <Typography variant="h6" sx={{ color: '#2D3748' }}>Placeholder for hamster</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            <Box backgroundColor="#FFFFFF" sx={{ 
                marginTop: 3, 
                marginX: 6,
                padding: 2, 
                border: '1px solid #E2E8F0', 
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <Typography variant="h4" sx={{ color: '#2D3748' }}>{pageTranslations.recommendedExercises}</Typography>
                <Typography variant="body1" sx={{ color: '#4A5568' }}>{explanation}</Typography>
            </Box>
            
            <Grid container
            spacing={2}
                sx={{ 
                    marginY: 2,
                    backgroundColor: '#F5F7FA',
                    borderRadius: 3,
                    padding: 2
                }}
                justifyContent="center"
            >
                {days.map((day, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }} >
                        <Card
                            variant="outlined"
                            sx={{
                                marginY: 2,
                                marginX: "8px",
                                width: "220px",
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                borderRadius: 2,
                                backgroundColor: '#FFFFFF',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ color: '#2D3748' }}>Day {index + 1}</Typography>
                                {day.daily_workouts.map((workout, workoutIndex) => (
                                    <Box key={workoutIndex} sx={{ marginBottom: 1 }}>
                                        <Typography variant="body1" sx={{ color: '#2D3748' }}>
                                            {workout.workout_description}
                                        </Typography>
                                        <Typography variant="body2" sx={{ maxWidth: '220px', color: '#4A5568' }}>
                                            {workout.workout_each_step_and_how_long.join(", ")}
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
 
export default WorkoutPlan;
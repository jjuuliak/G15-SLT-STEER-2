import TopBar from "../components/TopBar";
import {  Typography, Tooltip, Box, Grid2 as Grid, LinearProgress, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router';
import { fetchWithAuth } from '../services/authService';
import { useTranslation } from 'react-i18next';

//pic imports
import emptyHamster from "../images/hamsters/locked.png"

//messages
import doctorBronze from "../images/hamsters/doctorBronze.png"
import doctorSilver from "../images/hamsters/doctorSilver.png"
import doctorGold from "../images/hamsters/doctorGold.png"
import doctorDiamond from "../images/hamsters/doctorDiamond.png"

//meal plans
import mealPlanBronze from "../images/hamsters/mealPlanBronze.png"

//meals
import mealBronze from "../images/hamsters/mealBronze.png"
import mealSilver from "../images/hamsters/mealSilver.png"
import mealGold from "../images/hamsters/mealGold.png"

//workout plans
import workoutPlanBronze from "../images/hamsters/workoutPlanBronze.png"

//workouts
import workoutBronze from "../images/hamsters/workoutBronze.png"
import workoutSilver from "../images/hamsters/workoutSilver.png"
import workoutGold from "../images/hamsters/workoutGold.png"

const HamsterCollection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { t } = useTranslation();

    const hamsterImageMap = {
        messages: {
            0: emptyHamster,
            1: doctorBronze,
            2: doctorSilver,
            3: doctorGold,
            4: doctorDiamond
        },
        meal_plans: {
            0: emptyHamster,
            1: mealPlanBronze
        },
        meals: {
            0: emptyHamster,
            1: mealBronze,
            2: mealSilver,
            3: mealGold
        },
        workout_plans: {
            0: emptyHamster,
            1: workoutPlanBronze
        },
        workouts: {
            0: emptyHamster,
            1: workoutBronze,
            2: workoutSilver,
            3: workoutGold
        }
    };

    const statsLevelsTranslation = t('StatsLevels');

    const levelLabels = {
        0: `${statsLevelsTranslation.locked}`,
        1: `${statsLevelsTranslation.bronze}`,
        2: `${statsLevelsTranslation.silver}`,
        3: `${statsLevelsTranslation.gold}`,
        4: `${statsLevelsTranslation.diamond}`
    };

    const levelColors = {
        0: "rgb(0, 0, 0)",
        1: "rgb(205, 127, 50)",
        2: "rgb(132, 132, 132)",
        3: "rgb(255, 174, 0)",
        4: "rgb(0, 200, 255)"
    };

    const statsNamesTranslation = t('StatsNames');

    const hamsters = [
        {
            img: emptyHamster,
            title: `${statsNamesTranslation.messages}`,
            stat: 'messages'
        },
        {
            img: emptyHamster,
            title: `${statsNamesTranslation.meal_plans}`,
            stat: 'meal_plans'
        },
        {
            img: emptyHamster,
            title: `${statsNamesTranslation.meals}`,
            stat: 'meals'
        },
        {
            img: emptyHamster,
            title: `${statsNamesTranslation.workout_plans}`,
            stat: 'workout_plans'
        },
        {
            img: emptyHamster,
            title: `${statsNamesTranslation.workouts}`,
            stat: 'workouts'
        }
    ];

    const accessToken = useSelector((state) => state.auth?.access_token);
    const refreshToken = useSelector((state) => state.auth?.refresh_token);

    // States for the progress bar under master hamster
    const [currentStat, setCurrentStat] = useState(null);
    const [nextLevel, setNextLevel] = useState(null);

    const [userStats, setUserStats] = useState([]);
    const [masterHamsterPic, setMasterHamsterPic] = useState(null);


    const fillHamsters = (data) => {
        const stats = data.user_stats;
        setUserStats(stats);
        const messagesStat = stats.find(stat => stat.stat === 'messages');
        if (messagesStat) {
            setCurrentStat(messagesStat.counter);
            setNextLevel(messagesStat.next_level);
        }
    };

    // Set a pic to use on the left hand side of the screen on Master Hamster pic once we have userStats
    // Master hamster pic currently correspondes to the level of messages stats
    useEffect(() => {
        const userStat = userStats.find(stat => stat.stat === 'messages');
        const level = userStat?.level || 0;
        const image = hamsterImageMap['messages']?.[level] || emptyHamster;
        setMasterHamsterPic(image);
    }, [userStats])


    useEffect(() => {
        // Fetch user stats
            fetchWithAuth("http://localhost:8000/get-stats", {
                method: "POST",
                headers: null, // Default set in fetchWithAuth
            }, accessToken, refreshToken, dispatch, navigate)  
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user stats");
                }
                return response.json();
            })
            .then((data) => {
                if (data) {
                    fillHamsters(data)

                }
            })
            .catch((error) => {
                console.error("Error fetching workout plan:", error);
            });

    }, [accessToken]);

    return (
        <div>
            <TopBar />
            <Grid
                container
                spacing={2}
                textAlign="center"
                justifyContent="center"
                sx={{ marginTop: 5 }}
            >
                <Grid
                    size={{ xs: 12, md: 5 }}
                >
                    <Typography variant="h3">{t('StatsMasterHamster')}</Typography>
                    <Box sx={{
                        maxWidth: 250,
                        mx: "auto"
                    }}>
                        <img
                            src={masterHamsterPic}
                            alt=""
                            style={{ width: "100%", height: "auto" }}
                        /></Box>
                    <Typography variant="h4"> {currentStat >= nextLevel ? "" : t('StatsNextMaster')} </Typography>
                    <Typography variant="h4"> {currentStat} / {nextLevel} </Typography>
                    <Tooltip title={`${currentStat} / ${nextLevel}`} arrow>
                        <LinearProgress
                            variant="determinate"
                            value={(currentStat / nextLevel) * 100} // Calculate the progress towards next level in percentage
                            sx={{ height: 40, width: 320, borderRadius: 5, marginTop: 2, marginX: 'auto' }}>
                        </LinearProgress>
                    </Tooltip>
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper elevation={2} sx={{ marginX: 2 }}>
                        <Grid container spacing={1} >
                            {hamsters.map((item) => {
                                const userStat = userStats.find(stat => stat.stat === item.stat);
                                const level = userStat?.level || 0;
                                const currentStat = userStat?.counter || 0;
                                const nextLevel = userStat?.next_level || 0;
                                const image = hamsterImageMap[item.stat]?.[level] || emptyHamster;

                                return (
                                    <Grid
                                        size={{ xs: 6, md: 4 }}
                                        sx={{
                                            marginX: 'auto',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'

                                        }}
                                        key={item.title}
                                    >
                                        <img
                                            src={image}
                                            alt={`${item.title} level ${level}`}
                                            loading="lazy"
                                            style={{ width: "100%", height: "100%", objectFit: "contain", maxWidth: 250 }}
                                        />
                                        <Tooltip title={`${currentStat} / ${nextLevel}`} arrow>
                                            <Box sx={{ textAlign: "center" }}>
                                                <Typography variant="h6">{item.title}</Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={Math.min((currentStat / nextLevel) * 100, 100)}
                                                        sx={{ height: 10, width: 80, borderRadius: 2, marginTop: 1, marginX: 'auto' }}>
                                                    </LinearProgress>
                                                <Typography variant="subtitle1" style={{color: levelColors[level]}}>{levelLabels[level]}</Typography>
                                            </Box>
                                        </Tooltip>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default HamsterCollection;
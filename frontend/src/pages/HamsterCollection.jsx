import TopBar from "../components/TopBar";
import { Container, Typography, Box, Grid2 as Grid , LinearProgress, Paper} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

//pic imports
import emptyHamster from "../images/hamsters/empty-hamster.png"

//messages
import doctorBronze from "../images/hamsters/doctor-bronze.png"

import doctorSilver from "../images/hamsters/workoutSilver.png" // Change to actual picture, this is for testing
import doctorGold from "../images/hamsters/workoutSilver.png" // Change to actual picture, this is for testing

import doctorDiamond from "../images/hamsters/doctor-diamond.png"

//meal plans
import mealPlanBronze from "../images/hamsters/mealBronze.png" // Same as mealbronze for now

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
    meal: {
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

  const levelLabels = {
    0: "Hidden",
    1: "Bronze",
    2: "Silver",
    3: "Gold",
    4: "Diamond"
  };


const HamsterCollection = () => {
    const accessToken = useSelector((state) => state.auth?.access_token);
    const [currentStat, setCurrentStat] = useState(null);
    const [nextLevel, setNextLevel] = useState(null);
    const [userStats, setUserStats] = useState([]);

     const fillHamsters = (data) => {
        
        setUserStats(data.user_stats);

        data.user_stats.map((category) => {
            if (category.level > 0) {
                console.log(category.stat)
            }
            if (category.stat === 'messages'){
                setCurrentStat(category.counter);
                setNextLevel(category.next_level);

            }
        })
      };

    
      

    useEffect(() => {
        // Fetch user statis
        
            console.log("Fetching user stats plan");
            fetch("http://localhost:8000/get-stats", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            })  
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
            <TopBar/>
            <Grid 
            container 
            spacing={2}
            textAlign="center"
            justifyContent="center"
            alignItems="center"
            sx={{minHeight: "100vh"}}
            >
                <Grid 
                size={{xs: 12, md: 5}}
                >
                    <Typography variant="h3">Master Hamster</Typography>
                    <Box sx={{maxWidth: 250,
                        mx: "auto"
                    }}>
                        <img 
                        src={doctorBronze} 
                        alt="Hamster picture"
                        style={{ width: "100%", height: "auto" }} 
                        /></Box>
                    <Typography variant="h4"> Progress towards next Master Hamster: </Typography>
                    <Typography variant="h4"> {currentStat} / {nextLevel} </Typography>
                    <LinearProgress
                    variant="determinate"
                    value={(currentStat / nextLevel) * 100} // Calculate the progress towards next level in percentage
                    sx={{height: 40, width: 320, borderRadius: 5, marginTop: 2, marginX: 'auto' }}>
                    </LinearProgress>
                </Grid>
                <Grid size={{xs: 12, md: 7}}>
                    <Paper elevation={2} sx={{marginX: 2}}>
                    <Grid container spacing={1} >
                    {hamsters.map((item) => {
                        const userStat = userStats.find(stat => stat.stat === item.stat);
                        const level = userStat?.level || 0;
                        
                        const image = hamsterImageMap[item.stat]?.[level] || emptyHamster;

                        return (
                            <Grid 
                                size={{ xs: 6, md: 4 }}
                                sx={{ marginX: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',}}
                                    key={item.title}
                            >
                                <img
                                    src={image}
                                    alt={`${item.title} level ${level}`}
                                    loading="lazy"
                                    style={{ width: "100%", height: "100%", objectFit: "contain", maxWidth: 250 }}
                                />
                                <Box sx={{ textAlign: "center"}}>
                                    <Typography variant="h5">{item.title}</Typography>
                                    <Typography variant="subtitle1">{levelLabels[level]}</Typography>
                                </Box>
                                
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


const hamsters = [
    {
      img: emptyHamster,
      title: 'messageHamster',
      stat: 'messages'
    },
    {
      img: emptyHamster,
      title: 'mealPlanHamster',
      stat: 'meal_plans'
    },
    {
      img: emptyHamster,
      title: 'mealHamster',
      stat: 'meals'
    },

    {
      img: emptyHamster,
      title: 'workoutPlanHamster',
      stat: 'workout_plans'
    },
    {
      img: emptyHamster,
      title: 'workoutHamster',
      stat: 'workouts'
    }
  ];

 
export default HamsterCollection;
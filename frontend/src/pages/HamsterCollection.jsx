import TopBar from "../components/TopBar";
import { Container, Typography, Box, Grid2 as Grid } from "@mui/material";
import doctorBronze from "../images/hamsters/doctor-bronze.png"
import emptyHamster from "../images/hamsters/empty-hamster.png"
import { useEffect } from "react";
import { useSelector } from "react-redux";


const HamsterCollection = () => {
    const accessToken = useSelector((state) => state.auth?.access_token);

     const fillHamsters = (data) => {
        console.log(data.user_stats)
        data.user_stats.map((category) => {
            if (category.level > 0) {
                console.log(category.stat)
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
                size={5}
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
                </Grid>
                <Grid size={7}>
                    <Grid container spacing={2} >
                    {hamsters.map((item) => (
                            <Grid size={4}
                            key={item.title}
                            >
                            <img
                                
                                src={item.img}
                                alt={item.title}
                                loading="lazy"
                                style={{width: "80%", height: "auto" }} 
                            />
                            </Grid>
                        ))}
                    </Grid>
                    
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
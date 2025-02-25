
import {
  Typography,
  Box,
} from "@mui/material";


const ProfileView = () => {
  return (
    <Box>
        <Typography variant="body1" gutterBottom>
            This dialog can display user details, account info, or allow
            editing profile data. For example:
          </Typography>

          <ul>
            <li>Name</li>
            <li>Email</li>
            <li>Medical Records/Preferences</li>
            {/* Add forms and logic for updating data here */}
          </ul>
    </Box>
  );
};

export default ProfileView;
import React, {useState, useEffect} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useTranslation } from 'react-i18next';

const UserProfile = ({ open, handleClose }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        weight: "",
        height: "",
        gender: "",
        systolic_blood_pressure: "",
        diastolic_blood_pressure: "",
        heart_rate: "",
        total_cholesterol: "",
        low_density_lipoprotein: "",
        high_density_lipoprotein: "",
        triglycerides: "",
        smoking: false,
        alcohol_consumption: "",
        amount_of_sleep: "",
        other_medical_conditions: "",
      });

      const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      };

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        >
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
            {/* You can replace this Typography/ContentText with real data or forms */}
            <DialogContentText>
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
            </DialogContentText>

        <TextField
          label={t("Name")}
          name="name"
          type="text"
          fullWidth
          margin="dense"
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          label={t("Email")}
          name="email"
          type="email"
          fullWidth
          margin="dense"
          value={formData.email}
          onChange={handleChange}
        />


            <TextField
          label={t("Age")}
          name="age"
          type="text"
          fullWidth
          margin="dense"
          value={formData.age}
          onChange={handleChange}
        />
        <TextField
          label={t("Weight (kg)")}
          name="weight"
          type="text"
          fullWidth
          margin="dense"
          value={formData.weight}
          onChange={handleChange}
        />
        <TextField
          label={t("Height (cm)")}
          name="height"
          type="text"
          fullWidth
          margin="dense"
          value={formData.height}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="none">
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
          labelId="gender-label"
          id="gender-select"
          name="gender"
          label="gender"
          value={formData.gender}
          onChange={handleChange}>
            <MenuItem value="">{t("None")}</MenuItem>
            <MenuItem value="male">{t("Male")}</MenuItem>
            <MenuItem value="female">{t("Female")}</MenuItem>
            <MenuItem value="other">{t("Other")}</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={<Checkbox checked={formData.smoking} onChange={handleChange} name="smoking" />}
          label={t("Smoking")}
        />
        <TextField
          label={t("Alcohol Consumption (per week)")}
          name="alcohol_consumption"
          type="text"
          fullWidth
          margin="dense"
          value={formData.alcohol_consumption}
          onChange={handleChange}
        />
        <TextField
          label={t("Amount of Sleep (hours)")}
          name="amount_of_sleep"
          type="text"
          fullWidth
          margin="dense"
          value={formData.amount_of_sleep}
          onChange={handleChange}
        />
        <TextField label={t("Systolic Blood Pressure") } name="systolic_blood_pressure" type="text" fullWidth margin="dense" value={formData.systolic_blood_pressure} onChange={handleChange} />
        <TextField label={t("Diastolic Blood Pressure")} name="diastolic_blood_pressure" type="text" fullWidth margin="dense" value={formData.diastolic_blood_pressure} onChange={handleChange} />
        <TextField label={t("Resting heart Rate")} name="heart_rate" type="text" fullWidth margin="dense" value={formData.heart_rate} onChange={handleChange} />
        <TextField label={t("Total Cholesterol")} name="total_cholesterol" type="text" fullWidth margin="dense" value={formData.total_cholesterol} onChange={handleChange} />
        <TextField label={t("Low-Density Lipoprotein") } name="low_density_lipoprotein" type="text" fullWidth margin="dense" value={formData.low_density_lipoprotein} onChange={handleChange} />
        <TextField label={t("High-Density Lipoprotein") } name="high_density_lipoprotein" type="text" fullWidth margin="dense" value={formData.high_density_lipoprotein} onChange={handleChange} />
        <TextField label={t("Triglycerides")} name="triglycerides" type="text" fullWidth margin="dense" value={formData.triglycerides} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>{t("close")}</Button>
        </DialogActions>
        </Dialog>
    );
};

export default UserProfile;
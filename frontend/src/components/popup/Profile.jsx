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
import { useSelector } from "react-redux";

const UserProfile = ({ open, handleClose }) => {
    const { t } = useTranslation();
    const profileTranslation = t('ProfilePopUp');
    const accessToken = useSelector((state) => state.auth?.access_token);

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

      // Get profile data upon mounting
      useEffect(() => {
        /*
        fetch("/get-profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((response) => response.json())
          .then((data) => setFormData(data))
          .catch((error) => console.error("Error fetching profile data:", error));
          */
      }, [accessToken]);

      const handleSubmit = async () => {
        try {
          const response = await fetch("/update-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(formData),
          });
          if (!response.ok) {
            throw new Error("Failed to update profile");
          }
          handleClose();
        } catch (error) {
          console.error("Error updating profile:", error);
        }
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
                This dialog can display user details, account info, or allow
                editing profile data. For example:
            </DialogContentText>

        <TextField
          label={profileTranslation.name}
          name="name"
          type="text"
          fullWidth
          margin="dense"
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          label={profileTranslation.email}
          name="email"
          type="email"
          fullWidth
          margin="dense"
          value={formData.email}
          onChange={handleChange}
        />


            <TextField
          label={profileTranslation.age}
          name="age"
          type="text"
          fullWidth
          margin="dense"
          value={formData.age}
          onChange={handleChange}
        />
        <TextField
          label={profileTranslation.weight}
          name="weight"
          type="text"
          fullWidth
          margin="dense"
          value={formData.weight}
          onChange={handleChange}
        />
        <TextField
          label={profileTranslation.height}
          name="height"
          type="text"
          fullWidth
          margin="dense"
          value={formData.height}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="none">
          <InputLabel id="gender-label">{profileTranslation.gender}</InputLabel>
          <Select
          labelId="gender-label"
          id="gender-select"
          name="gender"
          label="gender"
          value={formData.gender}
          onChange={handleChange}>
            <MenuItem value="">{profileTranslation.none}</MenuItem>
            <MenuItem value="male">{profileTranslation.male}</MenuItem>
            <MenuItem value="female">{profileTranslation.female}</MenuItem>
            <MenuItem value="other">{profileTranslation.other}</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={<Checkbox checked={formData.smoking} onChange={handleChange} name="smoking" />}
          label={profileTranslation.smoking}
        />
        <TextField
          label={profileTranslation.weeklyAlcoholConsumption}
          name="alcohol_consumption"
          type="text"
          fullWidth
          margin="dense"
          value={formData.alcohol_consumption}
          onChange={handleChange}
        />
        <TextField
          label={profileTranslation.sleepQuantityHours}
          name="amount_of_sleep"
          type="text"
          fullWidth
          margin="dense"
          value={formData.amount_of_sleep}
          onChange={handleChange}
        />
        <TextField label={profileTranslation.systolicBloodPressure} name="systolic_blood_pressure" type="text" fullWidth margin="dense" value={formData.systolic_blood_pressure} onChange={handleChange} />
        <TextField label={profileTranslation.diastolicBloodPressure} name="diastolic_blood_pressure" type="text" fullWidth margin="dense" value={formData.diastolic_blood_pressure} onChange={handleChange} />
        <TextField label={profileTranslation.heartRate} name="heart_rate" type="text" fullWidth margin="dense" value={formData.heart_rate} onChange={handleChange} />
        <TextField label={profileTranslation.cholesterol} name="total_cholesterol" type="text" fullWidth margin="dense" value={formData.total_cholesterol} onChange={handleChange} />
        <TextField label={profileTranslation.ldLipoprotein} name="low_density_lipoprotein" type="text" fullWidth margin="dense" value={formData.low_density_lipoprotein} onChange={handleChange} />
        <TextField label={profileTranslation.hdLipoprotein} name="high_density_lipoprotein" type="text" fullWidth margin="dense" value={formData.high_density_lipoprotein} onChange={handleChange} />
        <TextField label={profileTranslation.triglycerides} name="triglycerides" type="text" fullWidth margin="dense" value={formData.triglycerides} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>{t("close")}</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
          {profileTranslation.save}
        </Button>
        </DialogActions>
        </Dialog>
    );
};

export default UserProfile;
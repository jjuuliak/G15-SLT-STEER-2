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
  Snackbar,
  Alert,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

const UserProfile = ({ open, handleClose }) => {
    const { t } = useTranslation();
    const profileTranslation = t('ProfilePopUp');
    const accessToken = useSelector((state) => state.auth?.access_token);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [formData, setFormData] = useState({
      age: "",
      weight: "",
      height: "",
      gender: "",
      systolic_blood_pressure: [],
      diastolic_blood_pressure: [],
      heart_rate: [],
      total_cholesterol: [],
      low_density_lipoprotein: [],
      high_density_lipoprotein: [],
      triglycerides: [],
      smoking: false,
      alcohol_consumption: "",
      sleep: "",
      other_past_medical_conditions: [],
      other_current_medical_conditions: [],
      exercise: "",
      medication: [],
      pregnancy: false,
      waist_measurement: "",
      family_history_with_heart_disease: false
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked :
                // Handle multiline text fields that should be arrays
                ["other_past_medical_conditions", "other_current_medical_conditions", "medication"].includes(name) ?
                value.split('\n').filter(item => item.trim() !== '') :
                // Handle numeric array fields (measurements)
                ["systolic_blood_pressure", "diastolic_blood_pressure", "heart_rate"].includes(name) ? 
                value ? [parseInt(value)] : [] :
                ["total_cholesterol", "low_density_lipoprotein", "high_density_lipoprotein", "triglycerides"].includes(name) ?
                value ? [parseFloat(value)] : [] :
                // Handle integer fields
                ["age", "weight", "waist_measurement", "alcohol_consumption"].includes(name) ?
                value ? parseInt(value) || value : "" :
                // Handle float fields
                ["height", "sleep"].includes(name) ?
                value ? parseFloat(value) || value : "" :
                // Handle all other fields as is
                value
    }));
};

    // Get profile data upon mounting
    useEffect(() => {
        if (open && accessToken) {
            fetch("http://localhost:8000/get-profile", {
                method: "POST",
                headers: { 
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch profile data");
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.user_data) {
                        setFormData(prevData => ({
                            ...prevData,
                            ...data.user_data
                        }));
                    }
                })
                .catch((error) => {
                    console.error("Error fetching profile data:", error);
                    setSnackbar({
                        open: true,
                        message: profileTranslation.fetchErrorMessage || "Failed to fetch profile data",
                        severity: 'error'
                    });
                });
        }
    }, [accessToken, open]);

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSubmit = async () => {
      try {
        // Format the data according to the backend model requirements
        const dataToSend = {};

        // Handle numeric fields - convert empty strings to null
        if (formData.age !== "") dataToSend.age = parseInt(formData.age) || null;
        if (formData.weight !== "") dataToSend.weight = parseInt(formData.weight) || null;
        if (formData.height !== "") dataToSend.height = parseFloat(formData.height) || null;
        if (formData.waist_measurement !== "") dataToSend.waist_measurement = parseInt(formData.waist_measurement) || null;
        if (formData.alcohol_consumption !== "") dataToSend.alcohol_consumption = parseInt(formData.alcohol_consumption) || null;
        if (formData.sleep !== "") dataToSend.sleep = parseFloat(formData.sleep) || null;

        // Handle measurement arrays - ensure they're valid numbers
        const intArrayFields = ['systolic_blood_pressure', 'diastolic_blood_pressure', 'heart_rate'];
        const floatArrayFields = ['total_cholesterol', 'low_density_lipoprotein', 'high_density_lipoprotein', 'triglycerides'];

        intArrayFields.forEach(field => {
          const value = formData[field][0];
          if (value !== undefined && value !== "") {
            const parsedValue = parseInt(value);
            if (!isNaN(parsedValue)) {
              dataToSend[field] = [parsedValue];
            }
          }
        });

        floatArrayFields.forEach(field => {
          const value = formData[field][0];
          if (value !== undefined && value !== "") {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue)) {
              dataToSend[field] = [parsedValue];
            }
          }
        });

        // Handle string arrays - filter out empty strings
        const stringArrayFields = ['other_past_medical_conditions', 'other_current_medical_conditions', 'medication'];
        stringArrayFields.forEach(field => {
          if (formData[field] && Array.isArray(formData[field])) {
            const filteredArray = formData[field].filter(item => item && item.trim() !== '');
            if (filteredArray.length > 0) {
              dataToSend[field] = filteredArray;
            }
          }
        });

        // Handle boolean fields - always include them
        dataToSend.smoking = Boolean(formData.smoking);
        dataToSend.pregnancy = Boolean(formData.pregnancy);
        dataToSend.family_history_with_heart_disease = Boolean(formData.family_history_with_heart_disease);

        // Handle enum fields - only include if they have valid values
        if (formData.gender && ['male', 'female', 'other'].includes(formData.gender)) {
          dataToSend.gender = formData.gender;
        }
        if (formData.exercise && ['sedentary', 'lightly active', 'moderately active', 'very active', 'athlete'].includes(formData.exercise)) {
          dataToSend.exercise = formData.exercise;
        }

        const response = await fetch("http://localhost:8000/update-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(dataToSend),
        });
            
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || profileTranslation.errorMessage);
        }
            
        setSnackbar({
            open: true,
            message: profileTranslation.successMessage,
            severity: 'success'
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        setSnackbar({
            open: true,
            message: profileTranslation.errorMessage,
            severity: 'error'
        });
      }
    };

    return (
        <>
        <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        >
        <DialogTitle>{profileTranslation.title || "Medical Profile"}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {profileTranslation.description || "Please fill in your medical information below:"}
            </DialogContentText>

            {/* Basic Information */}
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
            <TextField
                label={profileTranslation.waistMeasurement || "Waist Measurement (cm)"}
                name="waist_measurement"
                type="text"
                fullWidth
                margin="dense"
                value={formData.waist_measurement}
                onChange={handleChange}
            />

            {/* Gender and Pregnancy */}
            <FormControl fullWidth margin="dense">
                <InputLabel id="gender-label">{profileTranslation.gender}</InputLabel>
                <Select
                    labelId="gender-label"
                    id="gender-select"
                    name="gender"
                    label={profileTranslation.gender}
                    value={formData.gender || ""}
                    onChange={handleChange}
                >
                    <MenuItem value="">{profileTranslation.none}</MenuItem>
                    <MenuItem value="male">{profileTranslation.male}</MenuItem>
                    <MenuItem value="female">{profileTranslation.female}</MenuItem>
                    <MenuItem value="other">{profileTranslation.other}</MenuItem>
                </Select>
            </FormControl>

            <FormControlLabel
                control={<Checkbox checked={formData.pregnancy} onChange={handleChange} name="pregnancy" />}
                label={profileTranslation.pregnancy || "Pregnancy"}
            />

            {/* Vital Signs */}
            <TextField 
                label={profileTranslation.systolicBloodPressure} 
                name="systolic_blood_pressure" 
                type="text"
                fullWidth
                margin="dense" 
                value={formData.systolic_blood_pressure[0] || ""} 
                onChange={handleChange} 
                helperText={profileTranslation.latestMeasurement}
            />

            <TextField 
                label={profileTranslation.diastolicBloodPressure} 
                name="diastolic_blood_pressure"
                type="text"
                fullWidth
                margin="dense" 
                value={formData.diastolic_blood_pressure[0] || ""} 
                onChange={handleChange} 
                helperText={profileTranslation.latestMeasurement}
            />

            <TextField 
                label={profileTranslation.heartRate} 
                name="heart_rate" 
                type="text"
                fullWidth 
                margin="dense" 
                value={formData.heart_rate[0] || ""} 
                onChange={handleChange} 
                helperText={profileTranslation.latestMeasurement}
            />

            {/* Cholesterol Measurements */}
            <TextField 
                label={profileTranslation.cholesterol} 
                name="total_cholesterol"
                type="text"
                fullWidth
                margin="dense" 
                value={formData.total_cholesterol[0] || ""} 
                onChange={handleChange} 
                helperText={profileTranslation.latestMeasurement}
            />
            <TextField 
                label={profileTranslation.ldLipoprotein} 
                name="low_density_lipoprotein" 
                type="text"
                fullWidth
                margin="dense" 
                value={formData.low_density_lipoprotein[0] || ""} 
                onChange={handleChange} 
                helperText={profileTranslation.latestMeasurement}
            />
            <TextField 
                label={profileTranslation.hdLipoprotein} 
                name="high_density_lipoprotein" 
                type="text"
                fullWidth 
                margin="dense" 
                value={formData.high_density_lipoprotein[0] || ""} 
                onChange={handleChange} 
                helperText={profileTranslation.latestMeasurement}
            />
            <TextField 
                label={profileTranslation.triglycerides} 
                name="triglycerides" 
                type="text"
                fullWidth 
                margin="dense" 
                value={formData.triglycerides[0] || ""} 
                onChange={handleChange} 
                helperText={profileTranslation.latestMeasurement}
            />

            {/* Lifestyle Factors */}
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
                helperText={profileTranslation.UnitsPerWeek}
            />
            <TextField
                label={profileTranslation.sleepQuantityHours}
                name="sleep"
                type="text"
                fullWidth
                margin="dense"
                value={formData.sleep}
                onChange={handleChange}
                helperText={profileTranslation.hoursPerDay}
            />

            <FormControl fullWidth margin="dense">
                <InputLabel id="exercise-label">{profileTranslation.exercise || "Physical Activity Level"}</InputLabel>
                <Select
                    labelId="exercise-label"
                    id="exercise-select"
                    name="exercise"
                    label={profileTranslation.exercise || "Physical Activity Level"}
                    value={formData.exercise || ""}
                    onChange={handleChange}
                >
                    <MenuItem value="">{profileTranslation.none}</MenuItem>
                    <MenuItem value="sedentary">{profileTranslation.sedentary || "Sedentary"}</MenuItem>
                    <MenuItem value="lightly active">{profileTranslation.lightlyActive || "Lightly Active"}</MenuItem>
                    <MenuItem value="moderately active">{profileTranslation.moderatelyActive || "Moderately Active"}</MenuItem>
                    <MenuItem value="very active">{profileTranslation.veryActive || "Very Active"}</MenuItem>
                    <MenuItem value="athlete">{profileTranslation.athlete || "Athlete"}</MenuItem>
                </Select>
            </FormControl>

            {/* Medical History */}
            <FormControlLabel
                control={<Checkbox checked={formData.family_history_with_heart_disease} onChange={handleChange} name="family_history_with_heart_disease" />}
                label={profileTranslation.familyHistoryHeartDisease || "Family History of Heart Disease"}
            />

            <TextField 
                label={profileTranslation.pastMedicalConditions || "Past Medical Conditions"} 
                name="other_past_medical_conditions" 
                type="text" 
                fullWidth 
                margin="dense" 
                multiline
                rows={3} 
                value={formData.other_past_medical_conditions.join("\n")} 
                onChange={handleChange}
                helperText={profileTranslation.enterEachConditionOnNewLine} 
            />

            <TextField 
                label={profileTranslation.currentMedicalConditions || "Current Medical Conditions"} 
                name="other_current_medical_conditions" 
                type="text" 
                fullWidth 
                margin="dense" 
                multiline
                rows={3} 
                value={formData.other_current_medical_conditions.join("\n")} 
                onChange={handleChange}
                helperText={profileTranslation.enterEachConditionOnNewLine} 
            />

            <TextField 
                label={profileTranslation.medication || "Current Medications"} 
                name="medication" 
                type="text" 
                fullWidth 
                margin="dense" 
                multiline
                rows={3} 
                value={formData.medication.join("\n")} 
                onChange={handleChange}
                helperText={profileTranslation.enterEachMedicationOnNewLine} 
            />

        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>{t("close")}</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
                {profileTranslation.save}
            </Button>
        </DialogActions>
        </Dialog>
        <Snackbar 
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert 
                onClose={handleSnackbarClose} 
                severity={snackbar.severity}
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
        </>
    );
};

export default UserProfile;
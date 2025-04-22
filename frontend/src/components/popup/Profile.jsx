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
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router';
import { fetchWithAuth } from '../../services/authService';

const UserProfile = ({ open, handleClose }) => {
    const { t } = useTranslation();
    const profileTranslation = t('ProfilePopUp');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.auth?.access_token);
    const refreshToken = useSelector((state) => state.auth?.refresh_token);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [formData, setFormData] = useState({
      name: "",
      age: "",
      weight_kg: "",
      height_cm: "",
      gender: "",
      systolic_blood_pressure_mmhg: [],
      diastolic_blood_pressure_mmhg: [],
      heart_rate_resting_bpm: [],
      total_cholesterol_mmoll: [],
      low_density_lipoprotein_mmoll: [],
      high_density_lipoprotein_mmoll: [],
      triglycerides_mmoll: [],
      smoking: false,
      alcohol_consumption_drinks_per_week: "",
      sleep_daily_avg: "",
      other_past_medical_conditions: [],
      other_current_medical_conditions: [],
      exercise_level: "",
      medication: [],
      pregnancy: false,
      waist_measurement_cm: "",
      family_history_with_heart_disease: false
  });

  // Track initial form data
  const [initialFormData, setInitialFormData] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked :
                // Handle multiline text fields that should be arrays
                ["other_past_medical_conditions", "other_current_medical_conditions", "medication"].includes(name) ?
                value.split('\n') :  // Remove the filter to allow empty lines
                // Handle numeric array fields (measurements)
                ["systolic_blood_pressure_mmhg", "diastolic_blood_pressure_mmhg", "heart_rate_resting_bpm"].includes(name) ?  
                value ? [parseInt(value)] : [] :
                ["total_cholesterol_mmoll", "low_density_lipoprotein_mmoll", "high_density_lipoprotein_mmoll", "triglycerides_mmoll"].includes(name) ?
                value ? [parseFloat(value)] : [] :
                // Handle integer fields
                ["age", "weight_kg", "waist_measurement_cm", "alcohol_consumption_drinks_per_week"].includes(name) ?
                value ? parseInt(value) || value : "" :
                // Handle float fields
                ["height_cm", "sleep_daily_avg"].includes(name) ?
                value ? parseFloat(value) || value : "" :
                // Handle all other fields as is
                value
    }));
};

    // Update initial form data when profile is loaded
    useEffect(() => {
        if (open && accessToken) {
            fetchWithAuth("http://localhost:8000/get-profile", {
                method: "POST",
                headers: null, // Default set in fetchWithAuth
            }, accessToken, refreshToken, dispatch, navigate)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch profile data");
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.user_data) {
                        const newData = {
                            ...formData,
                            ...data.user_data
                        };
                        setFormData(newData);
                        setInitialFormData(newData); // Store initial data
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
        // Only include fields that have changed from their initial values
        const changedFields = {};
        
        // Helper function to check if a value has changed
        const hasChanged = (key, value) => {
            if (!initialFormData) return true; // If no initial data, consider all fields changed
            if (Array.isArray(value)) {
                return JSON.stringify(value) !== JSON.stringify(initialFormData[key]);
            }
            return value !== initialFormData[key];
        };

        // Check each field and only include if changed
        Object.entries(formData).forEach(([key, value]) => {
            if (hasChanged(key, value)) {
                // Format the value according to the backend model requirements
                if (key === 'age' || key === 'weight_kg' || key === 'waist_measurement_cm' || key === 'alcohol_consumption_drinks_per_week') {
                    changedFields[key] = value !== "" ? parseInt(value) || null : null;
                } else if (key === 'height_cm' || key === 'sleep_daily_avg') {
                    changedFields[key] = value !== "" ? parseFloat(value) || null : null;
                } else if (key === 'gender' || key === 'exercise_level' || key === 'name') {
                    changedFields[key] = value || null;
                } else if (['systolic_blood_pressure_mmhg', 'diastolic_blood_pressure_mmhg', 'heart_rate_resting_bpm'].includes(key)) {
                    changedFields[key] = value[0] ? [parseInt(value[0])] : null;
                } else if (['total_cholesterol_mmoll', 'low_density_lipoprotein_mmoll', 'high_density_lipoprotein_mmoll', 'triglycerides_mmoll'].includes(key)) {
                    changedFields[key] = value[0] ? [parseFloat(value[0])] : null;
                } else if (['other_past_medical_conditions', 'other_current_medical_conditions', 'medication'].includes(key)) {
                    changedFields[key] = value?.length > 0 ? value : null;
                } else if (['smoking', 'pregnancy', 'family_history_with_heart_disease'].includes(key)) {
                    changedFields[key] = value ?? null;
                }
            }
        });

        // If no fields have changed, show a message and return
        if (Object.keys(changedFields).length === 0) {
            setSnackbar({
                open: true,
                message: profileTranslation.noChanges || "No changes to save",
                severity: 'info'
            });
            return;
        }


        const response = await fetchWithAuth("http://localhost:8000/update-profile", {
          method: "POST",
          headers: null, // Default set in fetchWithAuth
          body: JSON.stringify(changedFields),
        }, accessToken, refreshToken, dispatch, navigate);
            
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || profileTranslation.errorMessage);
        }
            
        // After successful save, update initialFormData to match current formData
        setInitialFormData({...formData});
            
        setSnackbar({
            open: true,
            message: profileTranslation.successMessage,
            severity: 'success'
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        setSnackbar({
            open: true,
            message: error.message || profileTranslation.errorMessage,
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
        PaperProps={{
            sx: {
                borderRadius: 2,
                maxHeight: '90vh'
            }
        }}
        >
        <DialogTitle sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: 'primary.main',
            color: 'white',
            py: 2
        }}>
            <Typography variant="h5" component="div">
                {profileTranslation.title || "Medical Profile"}
            </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
            <DialogContentText sx={{ my: 3 }}>
                {profileTranslation.description || "Please fill in your medical information below:"}
            </DialogContentText>

            {/* Basic Information Section */}
            <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>
                {profileTranslation.basicInfo || "Basic Information"}
            </Typography>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <TextField
                    label={profileTranslation.name}
                    name="name"
                    type="text"
                    margin="dense"
                    value={formData.name}
                    onChange={handleChange}
                />
                <TextField
                    label={profileTranslation.age}
                    name="age"
                    type="text"
                    margin="dense"
                    value={formData.age}
                    onChange={handleChange}
                />
                <TextField
                    label={profileTranslation.weight}
                    name="weight_kg"
                    type="text"
                    margin="dense"
                    value={formData.weight_kg}
                    onChange={handleChange}
                />
                <TextField
                    label={profileTranslation.height}
                    name="height_cm"
                    type="text"
                    margin="dense"
                    value={formData.height_cm}
                    onChange={handleChange}
                />
                <TextField
                    label={profileTranslation.waistMeasurement || "Waist Measurement (cm)"}
                    name="waist_measurement_cm"
                    type="text"
                    margin="dense"
                    value={formData.waist_measurement_cm}
                    onChange={handleChange}
                />
                <FormControl margin="dense">
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
                    sx={{ mt: 1 }}
                />
            </div>

            {/* Vital Signs Section */}
            <Typography variant="h6" color="primary" sx={{ mt: 4, mb: 1, fontWeight: 'medium' }}>
                {profileTranslation.vitalSigns || "Vital Signs"}
            </Typography>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <TextField 
                    label={profileTranslation.systolicBloodPressure} 
                    name="systolic_blood_pressure_mmhg" 
                    type="text"
                    margin="dense" 
                    value={formData.systolic_blood_pressure_mmhg[0] || ""} 
                    onChange={handleChange} 
                    helperText={profileTranslation.latestMeasurement}
                />
                <TextField 
                    label={profileTranslation.diastolicBloodPressure} 
                    name="diastolic_blood_pressure_mmhg"
                    type="text"
                    margin="dense" 
                    value={formData.diastolic_blood_pressure_mmhg[0] || ""} 
                    onChange={handleChange} 
                    helperText={profileTranslation.latestMeasurement}
                />
                <TextField 
                    label={profileTranslation.heartRate} 
                    name="heart_rate_resting_bpm" 
                    type="text"
                    margin="dense" 
                    value={formData.heart_rate_resting_bpm[0] || ""} 
                    onChange={handleChange} 
                    helperText={profileTranslation.latestMeasurement}
                />
            </div>

            {/* Cholesterol Section */}
            <Typography variant="h6" color="primary" sx={{ mt: 4, mb: 1, fontWeight: 'medium' }}>
                {profileTranslation.cholesterolMeasurements || "Cholesterol Measurements"}
            </Typography>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <TextField 
                    label={profileTranslation.cholesterol} 
                    name="total_cholesterol_mmoll"
                    type="text"
                    margin="dense" 
                    value={formData.total_cholesterol_mmoll[0] || ""} 
                    onChange={handleChange} 
                    helperText={profileTranslation.latestMeasurement}
                />
                <TextField 
                    label={profileTranslation.ldLipoprotein} 
                    name="low_density_lipoprotein_mmoll" 
                    type="text"
                    margin="dense" 
                    value={formData.low_density_lipoprotein_mmoll[0] || ""} 
                    onChange={handleChange} 
                    helperText={profileTranslation.latestMeasurement}
                />
                <TextField 
                    label={profileTranslation.hdLipoprotein} 
                    name="high_density_lipoprotein_mmoll" 
                    type="text"
                    margin="dense" 
                    value={formData.high_density_lipoprotein_mmoll[0] || ""} 
                    onChange={handleChange} 
                    helperText={profileTranslation.latestMeasurement}
                />
                <TextField 
                    label={profileTranslation.triglycerides} 
                    name="triglycerides_mmoll" 
                    type="text"
                    margin="dense" 
                    value={formData.triglycerides_mmoll[0] || ""} 
                    onChange={handleChange} 
                    helperText={profileTranslation.latestMeasurement}
                />
            </div>

            {/* Lifestyle Section */}
            <Typography variant="h6" color="primary" sx={{ mt: 4, mb: 1, fontWeight: 'medium' }}>
                {profileTranslation.lifestyle || "Lifestyle Factors"}
            </Typography>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                
                <TextField
                    label={profileTranslation.weeklyAlcoholConsumption}
                    name="alcohol_consumption_drinks_per_week"
                    type="text"
                    margin="dense"
                    value={formData.alcohol_consumption_drinks_per_week}
                    onChange={handleChange}
                    helperText={profileTranslation.UnitsPerWeek}
                />
                <TextField
                    label={profileTranslation.sleepQuantityHours}
                    name="sleep_daily_avg"
                    type="text"
                    margin="dense"
                    value={formData.sleep_daily_avg}
                    onChange={handleChange}
                    helperText={profileTranslation.hoursPerDay}
                />
                <FormControl margin="dense">
                    <InputLabel id="exercise-label">{profileTranslation.exercise || "Physical Activity Level"}</InputLabel>
                    <Select
                        labelId="exercise-label"
                        id="exercise-select"
                        name="exercise_level"
                        label={profileTranslation.exercise || "Physical Activity Level"}
                        value={formData.exercise_level || ""}
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
                <FormControlLabel
                    control={<Checkbox checked={formData.smoking} onChange={handleChange} name="smoking" />}
                    label={profileTranslation.smoking}
                />
            </div>

            {/* Medical History Section */}
            <Typography variant="h6" color="primary" sx={{ mt: 4, mb: 1, fontWeight: 'medium' }}>
                {profileTranslation.medicalHistory || "Medical History"}
            </Typography>
            <FormControlLabel
                control={<Checkbox checked={formData.family_history_with_heart_disease} onChange={handleChange} name="family_history_with_heart_disease" />}
                label={profileTranslation.familyHistoryHeartDisease || "Family History of Heart Disease"}
                sx={{ mb: 2 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <TextField 
                    label={profileTranslation.pastMedicalConditions || "Past Medical Conditions"} 
                    name="other_past_medical_conditions" 
                    type="text"
                    multiline
                    rows={3} 
                    value={formData.other_past_medical_conditions ? formData.other_past_medical_conditions.join("\n") : ""} 
                    onChange={handleChange}
                    helperText={profileTranslation.enterEachConditionOnNewLine}
                />
                <TextField 
                    label={profileTranslation.currentMedicalConditions || "Current Medical Conditions"} 
                    name="other_current_medical_conditions" 
                    type="text"
                    multiline
                    rows={3} 
                    value={formData.other_current_medical_conditions ? formData.other_current_medical_conditions.join("\n") : ""} 
                    onChange={handleChange}
                    helperText={profileTranslation.enterEachConditionOnNewLine}
                />
                <TextField 
                    label={profileTranslation.currentMedications || "Current Medications"} 
                    name="medication" 
                    type="text"
                    multiline
                    rows={3} 
                    value={formData.medication ? formData.medication.join("\n") : ""} 
                    onChange={handleChange}
                    helperText={profileTranslation.enterEachMedicationOnNewLine}
                />
            </div>
        </DialogContent>
        <DialogActions sx={{ 
            borderTop: 1, 
            borderColor: 'divider',
            px: 3,
            py: 2
        }}>
            <Button 
                onClick={handleClose}
                variant="outlined"
                sx={{ mr: 1 }}
            >
                {t("close")}
            </Button>
            <Button 
                onClick={handleSubmit} 
                variant="contained" 
                color="primary"
            >
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
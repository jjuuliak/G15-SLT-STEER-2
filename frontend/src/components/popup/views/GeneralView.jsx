import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router';
import { fetchWithAuth } from '../../../services/authService';

const GeneralView = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = useSelector((state) => state.auth?.access_token);
  const refreshToken = useSelector((state) => state.auth?.refresh_token);

  const [cleared, setCleared] = useState(false);

  const clearHistory = () => {
    if (cleared) {
      return;
    }

    setCleared(true);

    fetchWithAuth("http://localhost:8000/clear-history", {
      method: "POST",
      headers: null // Default set in fetchWithAuth
    }, accessToken, refreshToken, dispatch, navigate);
  };

  return (
    <Box>
      <Typography sx={{margin: 2}}> {t("generalSettings")} </Typography>
      <Box sx={{ display: "flex", gap: 2, p: 2 }}> 
      <Button 
        variant={cleared ? "outlined" : "contained"} 
        onClick={() => clearHistory()}
      >
        {cleared ? t("ClearHistoryButtonClicked") : t("ClearHistoryButton")}
      </Button>
    </Box>
    </Box>
  );
};

export default GeneralView;

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n"; 
import { Button, Box, Typography } from "@mui/material";

const LanguageView = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem("i18nextLng") || "en");


  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  // Make sure a valid language is applied on load if localstorage item already has some unsupported language
  useEffect(() => {
    if (!["en", "fi"].includes(language)) {
      changeLanguage("en");
    }
  }, []);

  return (
    <Box>
      <Typography sx={{margin: 2}}> {t("languageSettings")} </Typography>
      <Box sx={{ display: "flex", gap: 2, p: 2 }}>
      
      <Button 
        variant={language === "en" ? "contained" : "outlined"} 
        onClick={() => changeLanguage("en")}
      >
        🇺🇸 English
      </Button>
      <Button 
        variant={language === "fi" ? "contained" : "outlined"} 
        onClick={() => changeLanguage("fi")}
      >
        🇫🇮 Suomi
      </Button>
    </Box>
    </Box>
    
  );
};

export default LanguageView;
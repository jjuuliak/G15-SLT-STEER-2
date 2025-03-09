import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Button,
} from "@mui/material";

import { useTranslation } from 'react-i18next';

// Import the separate views
import GeneralView from "./views/GeneralView";

import LanguageView from "./views/LanguageView";
import AppearanceView from "./views/AppearanceView";
import SecurityView from "./views/SecurityView";

const PopupWithTabs = ({ open, handleClose }) => {
  const [activeTab, setActiveTab] = useState("General");
  const { t } = useTranslation();
  const settingsTabs = t("settingsTabs")

  const tabs = [
    { name: settingsTabs.general, component: <GeneralView /> },

    { name: settingsTabs.appearance, component: <AppearanceView /> },
    { name: settingsTabs.language, component: <LanguageView /> },
    { name: settingsTabs.security, component: <SecurityView /> }
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{t("settings")}</DialogTitle>
      <DialogContent>
        <Box display="flex">
          {/* Sidebar Navigation */}
          <List sx={{ minWidth: 150, borderRight: "1px solid #ccc" }}>
            {tabs.map((tab) => (
              <ListItem key={tab.name} disablePadding>
                <ListItemButton
                  selected={activeTab === tab.name}
                  onClick={() => setActiveTab(tab.name)}
                >
                  <ListItemText primary={tab.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Content Area */}
          <Box sx={{ flex: 1, padding: 2 }}>
            {tabs.find((tab) => tab.name === activeTab)?.component}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("close")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupWithTabs;




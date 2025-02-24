



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

// Import the separate views
import GeneralView from "./views/GeneralView";
import ProfileView from "./views/ProfileView";
import LanguageView from "./views/LanguageView";
import AppearanceView from "./views/AppearanceView";
import SecurityView from "./views/SecurityView";

const PopupWithTabs = ({ open, handleClose }) => {
  const [activeTab, setActiveTab] = useState("General");

  const tabs = [
    { name: "General", component: <GeneralView /> },
    { name: "Profile", component: <ProfileView /> },
    { name: "Appearance", component: <AppearanceView /> },
    { name: "Language", component: <LanguageView /> },
    { name: "SecurityView", component: <SecurityView /> }
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Settings</DialogTitle>
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
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupWithTabs;




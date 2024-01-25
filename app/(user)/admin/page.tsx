"use client";

import { Box, Tab, Tabs, Typography } from "@mui/material";

import AddGameForm from "./add-game";
import AddTeamForm from "./add-team";
import { AuthContext } from "@/app/context/Auth.context";
import React from "react";
import { useContext } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AdminPage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { user } = useContext(AuthContext);
  if (!user?.isAdmin) {
    return (
      <main>
        <div>Not an admin. Log in with a different account?</div>
      </main>
    );
  } else {
    return (
      <Box sx={{ p: 2 }} maxWidth={800}>
        <Typography variant="h4" sx={{ px: 2, my: 4 }}>
          Admin panel
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="admin panel tabs"
          >
            <Tab label="Add Team" {...a11yProps(0)} />
            <Tab label="Add Game" {...a11yProps(1)} />
            <Tab label="Edit Team" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <AddTeamForm />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <AddGameForm />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          To be implemented
        </CustomTabPanel>
      </Box>
    );
  }
}

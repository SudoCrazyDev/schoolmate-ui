import React, { useState } from 'react';
import { Avatar, Tabs, Tab, Box, Card } from "@mui/material";
import Trainings from './components/Trainings'; // Import the Trainings component

// Placeholder components for other tabs
const PersonalTabContent = () => <Box p={2}>Personal Information Content</Box>;
const EducationTabContent = () => <Box p={2}>Education History Content</Box>;
const AdvisoriesTabContent = () => <Box p={2}>Advisory Classes Content</Box>;
const MOVsTabContent = () => <Box p={2}>MOVs Content</Box>;


export default function TeacherProfile() {
    const [selectedTab, setSelectedTab] = useState(0); // 0 for Personal, 1 for Education, etc.

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <div className="d-flex flex-column">
            {/* Teacher basic info section - remains unchanged */}
            <div className="d-flex flex-row mb-3">
                <div className="col-4 p-2">
                    <Card className="p-3 shadow d-flex flex-column align-items-center h-100">
                        <Avatar
                            alt="Philip Louis Calub" // This should ideally be dynamic
                            sx={{
                                width: 150,
                                height: 150,
                                mb: 2
                            }}
                        />
                        <h4 className="m-0 fw-bold text-center">Philip Louis Calub</h4> {/* This should ideally be dynamic */}
                        <h5 className="badge rounded-pill text-bg-dark m-0 mt-1 fw-normal">Teacher</h5> {/* This should ideally be dynamic */}
                    </Card>
                </div>
                <div className="col-8 d-flex flex-column p-2">
                     {/* Tabs should be outside the card that might contain tab content, or structure differently */}
                    <Card className="shadow-sm">
                        <Tabs value={selectedTab} onChange={handleChange} aria-label="teacher profile tabs" variant="scrollable" scrollButtons="auto">
                            <Tab label="Personal" className="fw-bold text-dark" />
                            <Tab label="Education" className="fw-bold text-dark" />
                            <Tab label="Advisories" className="fw-bold text-dark" />
                            <Tab label="MOVs" className="fw-bold text-dark" />
                            <Tab label="Trainings" className="fw-bold text-dark" /> {/* New Trainings Tab */}
                        </Tabs>
                    </Card>
                     {/* Tab Content Area - Placed below the tabs card for clarity */}
                     <Box mt={2}> {/* Added Box for spacing and to contain tab panels */}
                        {selectedTab === 0 && <PersonalTabContent />}
                        {selectedTab === 1 && <EducationTabContent />}
                        {selectedTab === 2 && <AdvisoriesTabContent />}
                        {selectedTab === 3 && <MOVsTabContent />}
                        {selectedTab === 4 && <Trainings />} {/* Render Trainings component */}
                    </Box>
                </div>
            </div>
        </div>
    );
};
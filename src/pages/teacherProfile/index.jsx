import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import PersonalTab from './PersonalTab';
import EducationTab from './EducationTab';
import TrainingsTab from './TrainingsTab';
import AwardsTab from './AwardsTab';
import { fetchUserProfileAPI, userProfileShape } from './utils'; // Import new items

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {/* Removed Typography wrapper from here as children will be components */}
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TeacherProfile = () => {
  const [value, setValue] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        setErrorProfile(null);
        const data = await fetchUserProfileAPI();
        setProfileData(data);
      } catch (err) {
        setErrorProfile(err.message || 'Failed to load user profile.');
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loadingProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading profile...</Typography>
      </Box>
    );
  }

  if (errorProfile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading profile: {errorProfile} Please try refreshing the page.
        </Alert>
      </Box>
    );
  }

  const userName = profileData && profileData.personalInfo
    ? `${profileData.personalInfo.firstName || ''} ${profileData.personalInfo.lastName || ''}`.trim()
    : "Teacher Profile";


  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ m: 2, textAlign: 'center' }}>
        {userName}
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="teacher profile tabs" centered>
          <Tab label="PERSONAL" {...a11yProps(0)} />
          <Tab label="EDUCATION" {...a11yProps(1)} />
          <Tab label="TRAININGS" {...a11yProps(2)} />
          <Tab label="AWARDS & RECOGNITION" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <PersonalTab initialData={profileData?.personalInfo} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <EducationTab initialEntries={profileData?.educationEntries} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/* TrainingsTab already handles its own sample data if prop is not provided or empty */}
        <TrainingsTab trainings={profileData?.trainings} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AwardsTab initialEntries={profileData?.awards} />
      </TabPanel>
    </Box>
  );
};

TeacherProfile.propTypes = {
  // This component fetches its own data, so no external props needed for data loading.
  // It's a top-level page component in this context.
};

export default TeacherProfile;

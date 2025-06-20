import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import { sampleTrainingsData, trainingEntryShape } from './utils'; // Import shape

const TrainingsTab = ({ trainings }) => {
  // Use trainings prop if it's a non-empty array, otherwise fall back to sampleTrainingsData
  const displayData = trainings && trainings.length > 0 ? trainings : sampleTrainingsData;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Trainings and Seminars Attended
      </Typography>
      {displayData.length === 0 ? (
        <Typography sx={{textAlign: 'center', color: 'text.secondary'}}>No training information available.</Typography>
      ) : (
        <List>
          {displayData.map((training, index) => (
            // Ensure training.id is present and unique, falling back to index if necessary (though IDs are preferred)
            <React.Fragment key={training.id || index}>
              <Paper elevation={2} sx={{ mb: 2, p: 2 }}>
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                        {training.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'block' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Organized by: {training.organizer}
                        </Typography>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              Date Completed: {training.dateCompleted ? new Date(training.dateCompleted).toLocaleDateString() : 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              Hours: {training.hours || 'N/A'}
                            </Typography>
                          </Grid>
                        </Grid>
                        {training.type && (
                          <Chip label={training.type} size="small" sx={{ mt: 1, backgroundColor: '#e0e0e0' }} />
                        )}
                      </>
                    }
                  />
                </ListItem>
              </Paper>
              {/* Divider is less necessary due to Paper separation, can be removed or kept based on style preference */}
              {/* {index < displayData.length - 1 && <Divider sx={{ mb: 2 }} />} */}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

TrainingsTab.propTypes = {
  /**
   * Optional array of training objects to display.
   * If not provided or empty, sample data will be used.
   */
  trainings: PropTypes.arrayOf(trainingEntryShape),
};

TrainingsTab.defaultProps = {
  // Default to empty array. The component logic will then use sampleTrainingsData.
  // This is clearer than null if the expectation is "an array of trainings or fallback".
  trainings: [],
};

export default TrainingsTab;

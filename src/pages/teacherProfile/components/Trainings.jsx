import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AddTrainingForm from './AddTrainingForm';
import TrainingsList from './TrainingsList';
import { Button, Box, CircularProgress, Alert, Typography, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';

const Trainings = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingTraining, setEditingTraining] = useState(null); // Holds training data for editing

    const fetchTrainings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/trainings');
            // Assuming the API returns data in a structure like { data: [...] } or directly [...]
            setTrainings(response.data.data || response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch trainings.');
            console.error("Fetch trainings error:", err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchTrainings();
    }, [fetchTrainings]);

    const handleFormSubmitSuccess = (newTraining) => {
        if (editingTraining) {
            // If editing, replace the old training with the updated one
            setTrainings(prevTrainings =>
                prevTrainings.map(t => t.id === newTraining.id ? newTraining : t)
            );
        } else {
            // If adding new, add to the list
            setTrainings(prevTrainings => [newTraining, ...prevTrainings]);
        }
        setShowAddForm(false);
        setEditingTraining(null); // Reset editing state
        fetchTrainings(); // Refetch to ensure data consistency, can be optimized
    };

    const handleAddNewTrainingClick = () => {
        setEditingTraining(null); // Ensure form is clear for new entry
        setShowAddForm(true);
    };

    const handleEditTraining = (training) => {
        setEditingTraining(training);
        setShowAddForm(true); // Show form pre-filled for editing
    };

    const handleCancelForm = () => {
        setShowAddForm(false);
        setEditingTraining(null);
    }

    if (loading && trainings.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }


    return (
        <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                    Trainings & Seminars
                </Typography>
                {!showAddForm && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddNewTrainingClick}
                    >
                        Add New Training
                    </Button>
                )}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {showAddForm ? (
                <AddTrainingForm
                    onFormSubmit={handleFormSubmitSuccess}
                    onCancel={handleCancelForm} // Pass cancel handler
                    existingTraining={editingTraining} // Pass training data for editing
                />
            ) : (
                <>
                    {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 2}} />}
                    <TrainingsList
                        trainings={trainings}
                        setTrainings={setTrainings} // Allow list to update itself (e.g., on delete)
                        onEditTraining={handleEditTraining}
                        fetchTrainings={fetchTrainings} // Allow list to trigger refetch if needed
                    />
                </>
            )}
        </Paper>
    );
};

export default Trainings;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Grid,
    Chip
} from '@mui/material';
import { Edit, Delete, Visibility, Close } from '@mui/icons-material'; // Added Close

// Helper to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const TrainingsList = ({ trainings, setTrainings, onEditTraining }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, id: null });
    const [viewImageDialogOpen, setViewImageDialogOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');


    const openDeleteConfirmation = (id) => {
        setDeleteConfirmation({ open: true, id: id });
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({ open: false, id: null });
    };

    const handleViewImage = (imageUrl) => {
        setCurrentImage(imageUrl);
        setViewImageDialogOpen(true);
    };

    const handleCloseImageViewer = () => {
        setViewImageDialogOpen(false);
        setCurrentImage('');
    };

    const handleDeleteTraining = async () => {
        if (!deleteConfirmation.id) return;
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`trainings/${deleteConfirmation.id}`);
            setTrainings(prevTrainings => prevTrainings.filter(t => t.id !== deleteConfirmation.id));
            setLoading(false);
            closeDeleteConfirmation();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete training.');
            setLoading(false);
        }
    };

    if (loading && trainings.length === 0) { // Show main loading only if no trainings are displayed yet
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    if (trainings.length === 0) {
        return <Typography sx={{ mt: 2, textAlign: 'center' }}>No trainings added yet.</Typography>;
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>My Trainings</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2}>
                {trainings.map((training) => (
                    <Grid item xs={12} sm={6} md={4} key={training.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {training.images && training.images.length > 0 && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={training.images[0].url || training.images[0]} // Assuming images is an array of objects with url or just strings
                                    alt={training.title}
                                    onClick={() => handleViewImage(training.images[0].url || training.images[0])}
                                    sx={{ cursor: 'pointer' }}
                                />
                            )}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="div">
                                    {training.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {training.description || 'No description provided.'}
                                </Typography>
                                <Chip label={`Date: ${formatDate(training.date)}`} size="small" />
                                {training.images && training.images.length > 1 && (
                                    <Typography variant="caption" display="block" sx={{mt: 1}}>
                                        (+{training.images.length - 1} more image{training.images.length - 1 > 1 ? 's' : ''})
                                    </Typography>
                                )}
                            </CardContent>
                            <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <IconButton onClick={() => onEditTraining(training)} aria-label="edit">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => openDeleteConfirmation(training.id)} aria-label="delete">
                                    <Delete />
                                </IconButton>
                                {loading && deleteConfirmation.id === training.id && <CircularProgress size={20} sx={{ml:1}}/>}
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmation.open}
                onClose={closeDeleteConfirmation}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this training? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteConfirmation} color="primary" disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteTraining} color="error" variant="contained" disabled={loading}>
                        {loading && deleteConfirmation.open ? <CircularProgress size={20} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Image Viewer Dialog */}
            <Dialog open={viewImageDialogOpen} onClose={handleCloseImageViewer} maxWidth="md" PaperProps={{ sx: { backgroundColor: 'transparent', boxShadow: 'none', overflow: 'hidden' } }}>
                <DialogContent sx={{ p: 0, position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={currentImage} alt="Training Image" style={{ width: 'auto', height: 'auto', maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} />
                     <IconButton
                        aria-label="close image viewer"
                        onClick={handleCloseImageViewer}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.5)'
                            }
                        }}
                    >
                        <Close /> {/* Replaced Edit with Close */}
                    </IconButton>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default TrainingsList;

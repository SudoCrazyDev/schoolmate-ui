import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { TextField, Button, CircularProgress, Alert, Box, Typography, IconButton } from '@mui/material';
import { AddPhotoAlternate, Delete } from '@mui/icons-material';

// Helper to format date for input type="date"
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch (e) {
        return ''; // Handle invalid date string
    }
};

const AddTrainingForm = ({ onFormSubmit, existingTraining, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [previewImages, setPreviewImages] = useState([]);
    const isEditMode = Boolean(existingTraining);

    const validationSchema = Yup.object({
        title: Yup.string().max(255, 'Title must be 255 characters or less').required('Title is required'),
        description: Yup.string(),
        date: Yup.date().required('Date is required'),
        images: Yup.array()
            .of(
                Yup.mixed()
                    .test('fileType', 'Unsupported file format', (value) => {
                        if (!value || !(value instanceof File)) return true; // Skip validation if not a new file
                        return ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'].includes(value.type);
                    })
                    .test('fileSize', 'File too large, max 2MB', (value) => {
                        if (!value || !(value instanceof File)) return true; // Skip validation if not a new file
                        return value.size <= 2048 * 1024; // 2MB
                    })
            )
            // Images are required only if not in edit mode, or if in edit mode and new images are being added.
            // For simplicity, we'll make them optional in edit mode and user has to re-upload if they want to change.
            // A better approach might be to check if existingTraining.images exist.
            // For now, if any image is added, it must be valid. If no images are added in edit mode, it's fine.
            .test('images-required', 'At least one image is required when creating.', function (value) {
                if (!isEditMode) {
                    return value && value.length > 0;
                }
                return true; // Not strictly required in edit mode unless user adds new ones
            })
    });


    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            date: '',
            images: [], // This will hold File objects for new uploads
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('date', values.date);

            // Only append images if new ones are selected
            if (values.images && values.images.length > 0) {
                values.images.forEach((imageFile) => {
                    // Ensure we only append File objects, not URLs of existing images
                    if (imageFile instanceof File) {
                        formData.append('images[]', imageFile);
                    }
                });
            }

            // If in edit mode and no new images are uploaded, we might not want to send empty 'images[]'
            // Depending on backend: it might clear images if 'images[]' is present but empty.
            // For robustness, if isEditMode and values.images.length === 0, don't append 'images[]'.
            // However, the current logic appends 'images[]' only if values.images has File objects.

            try {
                let response;
                if (isEditMode) {
                    // For PUT with FormData, some backends prefer POST with a _method field
                    // formData.append('_method', 'PUT');
                    // response = await axios.post(`/api/trainings/${existingTraining.id}`, formData, {
                    response = await axios.put(`/api/trainings/${existingTraining.id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    setSuccess('Training updated successfully!');
                } else {
                    response = await axios.post('/api/trainings', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    setSuccess('Training added successfully!');
                }

                setLoading(false);
                // Don't reset form here if onFormSubmit handles it or navigation occurs
                if (onFormSubmit) {
                    onFormSubmit(response.data.data || response.data); // Pass new/updated training data to parent
                }
                 // Resetting form only on successful new entry, or handled by parent for edit
                if (!isEditMode) {
                    formik.resetForm();
                    setPreviewImages([]);
                }

            } catch (err) {
                setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} training.`);
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (isEditMode && existingTraining) {
            formik.setValues({
                title: existingTraining.title || '',
                description: existingTraining.description || '',
                date: existingTraining.date ? formatDateForInput(existingTraining.date) : '',
                images: [], // Start with no files selected for upload, even in edit mode
            });
            setPreviewImages(existingTraining.images ? existingTraining.images.map(img => img.url || img) : []); // Display existing image URLs
            // Note: These previewImages from existingTraining are URLs, not File objects.
            // The user will need to re-upload if they want to change images.
            // formik.values.images will only store NEW File objects.
        } else {
            formik.resetForm();
            setPreviewImages([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingTraining, isEditMode]); // Removed formik from deps to avoid loops with setValues

    const handleImageChange = (event) => {
        const files = Array.from(event.currentTarget.files);
        // If editing, new files replace existing (or add to them if desired, here we replace)
        // For simplicity, let's say new uploads always replace old previews/files for this form instance
        if (isEditMode) {
             setPreviewImages([]); // Clear old URL previews
             formik.setFieldValue('images', []); // Clear any stale File objects
        }

        const currentFiles = formik.values.images || [];
        formik.setFieldValue('images', currentFiles.concat(files));

        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => isEditMode ? newPreviewUrls : [...prev, ...newPreviewUrls]);
    };

    const handleRemoveImage = (indexToRemove) => {
        // If the image to remove is an existing one (URL string)
        if (typeof previewImages[indexToRemove] === 'string' && isEditMode) {
            // This part is tricky: we are not directly mutating existingTraining.images here.
            // We are just removing it from view. The backend needs to handle image removal if an image ID is sent, or if not present in update.
            // For now, we remove from preview. If these were IDs, we'd track removed IDs.
            // Since they are just URLs for display, removing from previewImages is enough for UI.
            // The actual files to be uploaded are in formik.values.images (File objects).
            setPreviewImages(prev => prev.filter((_, index) => index !== indexToRemove));
            // To signify that an existing image should be deleted on the backend, you'd typically:
            // 1. Not include it in the list of images to keep.
            // 2. Or, send a specific list of image IDs to delete.
            // This form currently only sends NEW images. Backend needs to handle replacement logic.
        } else {
            // This handles removal of newly added File objects
            const fileNameToRemove = formik.values.images[indexToRemove]?.name;
            formik.setFieldValue(
                'images',
                formik.values.images.filter((file, index) => {
                    if (index === indexToRemove) {
                        // Revoke object URL for this file
                        const urlToRemove = previewImages.find(url => url.endsWith(fileNameToRemove)); // This is not robust
                        // It's better to manage preview URLs and File objects in a more linked way if possible
                        // For now, assuming order is preserved or direct URL is available in previewImages for File objects.
                        // The current `previewImages` setup might mix URLs from existingTraining and new ObjectURLs.
                        // Let's simplify: if it's a new upload, its corresponding preview URL (object URL) is at the same index in `previewImages`
                        // (This assumes new uploads replace existing previews as per `handleImageChange` in edit mode)
                        URL.revokeObjectURL(previewImages[indexToRemove]); // This assumes previewImages[indexToRemove] is an ObjectURL for a new file
                        return false;
                    }
                    return true;
                })
            );
            setPreviewImages(prev => prev.filter((_, index) => index !== indexToRemove));
        }
    };


    // Clean up preview object URLs on component unmount
    useEffect(() => {
        return () => {
            previewImages.forEach(url => {
                // Only revoke if it's an object URL (from createObjectURL)
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [previewImages]);

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, p: 2, border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" gutterBottom>{isEditMode ? 'Edit Training' : 'Add New Training'}</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <TextField
                fullWidth
                id="title"
                name="title"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                margin="normal"
                multiline
                rows={3}
            />
            <TextField
                fullWidth
                id="date"
                name="date"
                label="Date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                margin="normal"
                required
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <Box sx={{ mt: 2, mb: 1 }}>
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddPhotoAlternate />}
                    sx={{ mr: 2 }}
                >
                    {isEditMode ? "Replace/Add Images" : "Upload Images"}
                    <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleImageChange}
                        accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                    />
                </Button>
                {formik.touched.images && formik.errors.images && typeof formik.errors.images === 'string' && (
                     <Typography color="error" variant="caption">{formik.errors.images}</Typography>
                )}
            </Box>

            {previewImages.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', mt: 2, mb: 2, p:1, border:'1px dashed #ccc', borderRadius:'4px' }}>
                    {previewImages.map((urlOrFile, index) => {
                        const isExistingUrl = typeof urlOrFile === 'string' && urlOrFile.startsWith('http');
                        const imageUrl = isExistingUrl ? urlOrFile : (typeof urlOrFile === 'string' ? urlOrFile : previewImages[index]);
                        // The above line needs to be careful. `previewImages` state stores all previews.
                        // `formik.values.images` stores `File` objects for new uploads.
                        // `existingTraining.images` stores {url: '...'} for old images.

                        return (
                            <Box key={index} sx={{ position: 'relative', border: '1px solid #ddd', borderRadius: '4px', p: '5px' }}>
                                <img src={imageUrl} alt={`Preview ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveImage(index)}
                                    sx={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '-10px',
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        '&:hover': { backgroundColor: 'white' }
                                    }}
                                >
                                    <Delete fontSize="small" color="error"/>
                                </IconButton>
                                {formik.errors.images && Array.isArray(formik.errors.images) && formik.errors.images[index] && (
                                    <Typography color="error" variant="caption" display="block" sx={{maxWidth: '100px'}}>
                                        {formik.errors.images[index].type || formik.errors.images[index].size || formik.errors.images[index]}
                                    </Typography>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            )}
             {formik.touched.images && typeof formik.errors.images === 'string' && (
                <Alert severity="error" sx={{ mb: 2 }}>{formik.errors.images}</Alert>
            )}


            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={loading || !formik.isValid || (!formik.dirty && !isEditMode) } // Allow submit in edit mode even if not dirty (e.g. if initial values were invalid and then corrected)
                >
                    {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update Training' : 'Add Training')}
                </Button>
                <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => {
                        formik.resetForm(); // Reset formik state
                        setPreviewImages([]); // Clear previews
                        if(onCancel) onCancel(); // Call parent cancel handler
                    }}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default AddTrainingForm;

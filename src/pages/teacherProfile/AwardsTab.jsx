import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormik, FieldArray, getIn } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  AlertTitle, // Added
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { updateAwardsInfoAPI, awardEntryShape as awardEntryPropType } from './utils'; // Import shape

const MAX_FILES_PER_AWARD = 5;
const MAX_FILE_SIZE_MB = 2; // Max file size in MB

// Renamed for clarity
const awardEntryValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().nullable(),
  date: Yup.date().required('Date is required').nullable().typeError('Invalid date format. Please use YYYY-MM-DD.'),
  // 'images' here refers to the FileList/array of File objects from the input for new uploads
  images: Yup.array()
    .of(
      Yup.mixed()
        .test(
          'fileSize',
          `File size should not exceed ${MAX_FILE_SIZE_MB}MB`,
          // value here is a File object
          (value) => !value || (value && value.size <= MAX_FILE_SIZE_MB * 1024 * 1024)
        )
        // Example: .test('fileType', 'Unsupported file format', (value) => !value || (value && ['image/jpeg', 'image/png'].includes(value.type)))
    )
    .max(MAX_FILES_PER_AWARD, `Cannot upload more than ${MAX_FILES_PER_AWARD} images per award.`),
  // If you had a field for already uploaded image metadata (e.g., from API), it would be separate:
  // existingImageUrls: Yup.array().of(PropTypes.string)
});

const AwardsTab = ({ initialEntries }) => {
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const fileInputRefs = useRef([]); // Refs for file inputs

  const formik = useFormik({
    initialValues: {
      awardEntries: initialEntries && initialEntries.length > 0
        ? initialEntries.map(e => ({
            id: e.id || Date.now().toString() + Math.random(), // Ensure id for key
            title: e.title || '',
            description: e.description || '',
            date: e.date || '',
            images: [], // For new file uploads. Existing images would be handled differently (e.g. displayed from URLs)
            // existingImageUrls: e.existingImageUrls || [] // If you were to load URLs of already uploaded images
          }))
        : [{ id: Date.now().toString(), title: '', description: '', date: '', images: [] }], // Default new entry with an ID
    },
    // enableReinitialize allows the form to update if the initialEntries prop changes.
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      awardEntries: Yup.array().of(awardEntryValidationSchema).min(1, 'At least one award entry is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setSubmitStatus(null);
      setAlertMessage('');

      // The console.log for the API call itself (which includes image handling notes) is in utils.js.
      // No need for additional console.logs here regarding FormData simulation.

      try {
        const response = await updateAwardsInfoAPI(values.awardEntries);
        setAlertMessage(response.message);
        setSubmitStatus('success');
        // Optionally reset form if successful and desired, for example:
        // if (response.data) { // Or some other condition indicating full success
        //   formik.resetForm();
        //   fileInputRefs.current.forEach(ref => { if (ref) ref.value = null; });
        // }
      } catch (error) {
        setAlertMessage(error.message || 'An unexpected error occurred.');
        setSubmitStatus('error');
      } finally {
        setLoading(false);
      }
    },
  });

  const { values, handleChange, handleBlur, touched, errors, handleSubmit, setFieldValue } = formik;

  const handleFileChange = (event, index) => {
    const files = Array.from(event.currentTarget.files); // Convert FileList to array
    const currentImages = values.awardEntries[index].images || [];
    const availableSlots = MAX_FILES_PER_AWARD - currentImages.length;

    if (files.length > availableSlots) {
      // If trying to upload more files than available slots, take only what fits
      const filesToUpload = files.slice(0, availableSlots);
      setFieldValue(`awardEntries[${index}].images`, [...currentImages, ...filesToUpload]);
      formik.setFieldError(`awardEntries[${index}].images`, `You can select a maximum of ${MAX_FILES_PER_AWARD} files. ${files.length - availableSlots} file(s) were not added.`);
    } else {
      setFieldValue(`awardEntries[${index}].images`, [...currentImages, ...files]);
      formik.setFieldError(`awardEntries[${index}].images`, undefined); // Clear previous error
    }
    formik.setFieldTouched(`awardEntries[${index}].images`, true, false); // Mark as touched

    // Store ref to the input element. This is useful if we need to programmatically clear it,
    // though direct manipulation of file input value is limited for security reasons.
    // It's more for keeping track of the input elements themselves if needed.
    if (!fileInputRefs.current[index]) {
      fileInputRefs.current[index] = event.currentTarget;
    }
  };

  // Modified to accept 'form' from FieldArray render prop
  const handleFileChangeInArray = (event, index, formInstance) => {
    const files = Array.from(event.currentTarget.files);
    const currentImages = formInstance.values.awardEntries[index].images || [];
    const availableSlots = MAX_FILES_PER_AWARD - currentImages.length;

    if (files.length > availableSlots) {
      const filesToUpload = files.slice(0, availableSlots);
      formInstance.setFieldValue(`awardEntries[${index}].images`, [...currentImages, ...filesToUpload]);
      formInstance.setFieldError(`awardEntries[${index}].images`, `You can select a maximum of ${MAX_FILES_PER_AWARD} files. ${files.length - availableSlots} file(s) were not added.`);
    } else {
      formInstance.setFieldValue(`awardEntries[${index}].images`, [...currentImages, ...files]);
      formInstance.setFieldError(`awardEntries[${index}].images`, undefined);
    }
    formInstance.setFieldTouched(`awardEntries[${index}].images`, true, false);

    if (!fileInputRefs.current[index]) {
      fileInputRefs.current[index] = event.currentTarget;
    }
  };

  // Modified to accept 'form' from FieldArray render prop
  const removeImageInArray = (entryIndex, imageIndexToRemove, formInstance) => {
    const updatedImages = formInstance.values.awardEntries[entryIndex].images.filter((_, imgIndex) => imgIndex !== imageIndexToRemove);
    formInstance.setFieldValue(`awardEntries[${entryIndex}].images`, updatedImages);

    if (updatedImages.length === 0 && fileInputRefs.current[entryIndex]) {
      fileInputRefs.current[entryIndex].value = null;
    }
  };


  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}> {/* Use main formik instance for submission */}
      <Typography variant="h6" gutterBottom>
        Awards and Recognitions
      </Typography>

      <FieldArray
        name="awardEntries"
        render={(arrayHelpers) => {
          const form = arrayHelpers.form;
          const { push, remove: removeHelper } = arrayHelpers;

          if (!form || !form.values) {
            // This case should ideally not happen if arrayHelpers.form is correct.
            console.error('Formik context (form or form.values) not available in AwardsTab FieldArray as expected via arrayHelpers.form.');
            return <Alert severity="error">Error: Form context is not properly loaded for awards entries.</Alert>;
          }

          const { values, touched, errors, handleChange, handleBlur } = form; // Use Formik context from arrayHelpers.form
          const awardEntriesArray = values?.awardEntries || []; // Safe access to the array
          return (
            <div>
              {awardEntriesArray.length > 0 ? (
                awardEntriesArray.map((entry, index) => { // entry here is from awardEntriesArray, should be safe
                  const imagesLength = entry?.images?.length || 0; // Safe access for images length
                  return (
                    <Paper key={entry.id || index} sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
                      <Grid container spacing={2} alignItems="flex-start">
                        <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name={`awardEntries[${index}].title`}
                          label="Award/Recognition Title"
                          value={entry.title} // Direct value
                          onChange={handleChange} // form.handleChange
                          onBlur={handleBlur}   // form.handleBlur
                          error={Boolean(getIn(touched, `awardEntries[${index}].title`) && getIn(errors, `awardEntries[${index}].title`))}
                          helperText={getIn(touched, `awardEntries[${index}].title`) && getIn(errors, `awardEntries[${index}].title`)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          name={`awardEntries[${index}].description`}
                          label="Brief Description (Optional)"
                          value={entry.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(getIn(touched, `awardEntries[${index}].description`) && getIn(errors, `awardEntries[${index}].description`))}
                          helperText={getIn(touched, `awardEntries[${index}].description`) && getIn(errors, `awardEntries[${index}].description`)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name={`awardEntries[${index}].date`}
                          label="Date Received"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={entry.date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(getIn(touched, `awardEntries[${index}].date`) && getIn(errors, `awardEntries[${index}].date`))}
                          helperText={getIn(touched, `awardEntries[${index}].date`) && getIn(errors, `awardEntries[${index}].date`)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<AttachFileIcon />}
                          disabled={imagesLength >= MAX_FILES_PER_AWARD}
                        >
                          {imagesLength >= MAX_FILES_PER_AWARD
                            ? `Max Files Reached (${MAX_FILES_PER_AWARD})`
                            : `Upload Images (${imagesLength}/${MAX_FILES_PER_AWARD})`
                          }
                          <input
                            type="file"
                            hidden
                            multiple
                            accept="image/jpeg, image/png, image/gif, application/pdf"
                            onChange={(event) => handleFileChangeInArray(event, index, form)} // Pass form instance
                            ref={el => fileInputRefs.current[index] = el}
                          />
                        </Button>
                        {getIn(errors, `awardEntries[${index}].images`) && (
                          <Typography color="error" variant="caption" display="block" sx={{mt:1}}>
                              { typeof getIn(errors, `awardEntries[${index}].images`) === 'string'
                                  ? getIn(errors, `awardEntries[${index}].images`)
                                  : "Error with one or more files (e.g. size)"
                              }
                          </Typography>
                        )}
                      </Grid>

                    {(entry?.images || []).length > 0 && ( // Safe access for images array map
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" sx={{mt: 1}}>Selected Files:</Typography>
                          <List dense>
                          {(entry.images || []).map((file, fileIndex) => ( // Map over safely accessed images
                              <ListItem
                              key={file.name + fileIndex} // Assuming file objects are present if array has length
                                secondaryAction={
                                  <IconButton edge="end" aria-label="delete" onClick={() => removeImageInArray(index, fileIndex, form)}> {/* Pass form instance */}
                                    <DeleteOutlineIcon />
                                  </IconButton>
                                }
                              >
                                <ListItemText
                                  primary={file.name}
                                  secondary={`(${(file.size / 1024).toFixed(2)} KB)`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      )}

                      <Grid item xs={12} sx={{ textAlign: 'right' }}>
                        <IconButton
                          onClick={() => removeHelper(index)} // Use removeHelper from render prop
                          color="error"
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                );
              }))
            : (
                  <Typography sx={{my: 2, textAlign: 'center', color: 'text.secondary'}}>No awards or recognitions added yet.</Typography>
              )}
              <Button
                type="button"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => {
                  push({ // Use push from render prop
                      id: Date.now().toString() + Math.random(),
                      title: '', description: '', date: '', images: []
                  });
                }}
                variant="outlined"
                sx={{ mt: 1, mb: 2 }}
              >
                Add Award/Recognition
              </Button>
              {typeof errors.awardEntries === 'string' && (
                   <Alert severity="error" sx={{ mb: 2 }}>
                      <AlertTitle>Error</AlertTitle>
                      {errors.awardEntries} {/* This refers to form.errors */}
                   </Alert>
              )}
            </div>
          );
        }}
      />

      <Box sx={{ mt: 3, mb: 2, position: 'relative' }}>
        {submitStatus && alertMessage && (
          <Alert severity={submitStatus} sx={{ mb: 2 }}>
             <AlertTitle>{submitStatus.charAt(0).toUpperCase() + submitStatus.slice(1)}</AlertTitle>
            {alertMessage}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !formik.dirty || !formik.isValid} // Use main formik instance for these
          sx={{ mr: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
         <Button
            type="button"
            variant="outlined"
            onClick={() => {
                formik.resetForm({ // Use main formik instance
                    values: {
                        awardEntries: initialEntries && initialEntries.length > 0
                        ? initialEntries.map(e => ({
                            id: e.id || Date.now().toString() + Math.random(),
                            title: e.title || '',
                            description: e.description || '',
                            date: e.date || '',
                            images: []
                          }))
                        : [{ id: Date.now().toString(), title: '', description: '', date: '', images: [] }]
                    }
                });
                fileInputRefs.current.forEach(ref => { if (ref) ref.value = null; });
                setSubmitStatus(null);
                setAlertMessage('');
            }}
            disabled={loading || !formik.dirty} // Use main formik instance
        >
            Reset
        </Button>
      </Box>
    </Box>
  );
};

AwardsTab.propTypes = {
  initialEntries: PropTypes.arrayOf(awardEntryPropType),
};

AwardsTab.defaultProps = {
  initialEntries: [],
};

export default AwardsTab;

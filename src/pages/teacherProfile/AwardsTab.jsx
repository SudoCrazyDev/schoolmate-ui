import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormik, getIn } from 'formik'; // Removed FieldArray
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
  // Chip, // Chip is not used here, can be removed if not planned for future
  List,
  ListItem,
  ListItemText,
  AlertTitle,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { updateAwardsInfoAPI, awardEntryShape as awardEntryPropType } from './utils';

const MAX_FILES_PER_AWARD = 5;
const MAX_FILE_SIZE_MB = 2;

const awardEntryValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().nullable(),
  date: Yup.date().required('Date is required').nullable().typeError('Invalid date format. Please use YYYY-MM-DD.'),
  images: Yup.array()
    .of(
      Yup.mixed()
        .test(
          'fileSize',
          `File size should not exceed ${MAX_FILE_SIZE_MB}MB`,
          (value) => !value || (value && value.size <= MAX_FILE_SIZE_MB * 1024 * 1024)
        )
    )
    .max(MAX_FILES_PER_AWARD, `Cannot upload more than ${MAX_FILES_PER_AWARD} images per award.`),
});

const AwardsTab = ({ initialEntries }) => {
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const fileInputRefs = useRef([]);

  const formik = useFormik({
    initialValues: {
      awardEntries: initialEntries && initialEntries.length > 0
        ? initialEntries.map(e => ({
          id: e.id || Date.now().toString() + Math.random(),
          title: e.title || '',
          description: e.description || '',
          date: e.date || '',
          images: [], // Existing images from API would be handled differently (e.g. as URLs to display)
        }))
        : [{ id: Date.now().toString(), title: '', description: '', date: '', images: [] }],
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      awardEntries: Yup.array().of(awardEntryValidationSchema).min(1, 'At least one award entry is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setSubmitStatus(null);
      setAlertMessage('');
      try {
        const response = await updateAwardsInfoAPI(values.awardEntries);
        setAlertMessage(response.message);
        setSubmitStatus('success');
      } catch (error) {
        setAlertMessage(error.message || 'An unexpected error occurred.');
        setSubmitStatus('error');
      } finally {
        setLoading(false);
      }
    },
  });

  const addAwardEntry = () => {
    const currentEntries = formik.values?.awardEntries || [];
    const newEntry = {
      id: Date.now().toString() + Math.random(),
      title: '', description: '', date: '', images: []
    };
    formik.setFieldValue('awardEntries', [...currentEntries, newEntry]);
     // Ensure refs array is long enough
    if (fileInputRefs.current.length < currentEntries.length + 1) {
        fileInputRefs.current = [...fileInputRefs.current, React.createRef()];
    }
  };

  const removeAwardEntry = (indexToRemove) => {
    const currentEntries = formik.values?.awardEntries || [];
    const updatedEntries = currentEntries.filter((_, index) => index !== indexToRemove);
    formik.setFieldValue('awardEntries', updatedEntries);
    // Adjust refs array. This simple removal might misalign refs if not careful.
    // A more robust ref management might be needed if order changes often or inputs are not always rendered.
    // For now, clearing the specific ref if it exists.
    if (fileInputRefs.current[indexToRemove]) {
        fileInputRefs.current[indexToRemove].value = null; // Clear file input
    }
    // To keep refs aligned, one might splice the refs array too, or re-index them.
    // However, direct DOM manipulation for clearing is often sufficient.
  };

  const handleFileChange = (event, entryIndex) => {
    const files = Array.from(event.currentTarget.files);
    const currentImages = formik.values.awardEntries[entryIndex]?.images || [];
    const availableSlots = MAX_FILES_PER_AWARD - currentImages.length;
    let newImagesArray = [...currentImages];
    let errorMessage = undefined;

    if (files.length > availableSlots) {
      const filesToUpload = files.slice(0, availableSlots);
      newImagesArray = [...currentImages, ...filesToUpload];
      errorMessage = `You can select a maximum of ${MAX_FILES_PER_AWARD} files. ${files.length - availableSlots} file(s) were not added.`;
    } else {
      newImagesArray = [...currentImages, ...files];
    }

    formik.setFieldValue(`awardEntries[${entryIndex}].images`, newImagesArray);
    if (errorMessage) {
        formik.setFieldError(`awardEntries[${entryIndex}].images`, errorMessage);
    } else {
        // To clear a previous error if now valid (though Yup schema handles most re-validation)
        const errors = { ...formik.errors };
        if (getIn(errors, `awardEntries[${entryIndex}].images`)) {
            delete getIn(errors, `awardEntries[${entryIndex}].images`); // This is not the direct way to clear Formik errors
                                                                // Prefer formik.setFieldError(`awardEntries[${entryIndex}].images`, undefined);
                                                                // Or let Yup handle it. For now, this line is illustrative.
             formik.setFieldError(`awardEntries[${entryIndex}].images`, undefined); // Correct way
        }
    }
    formik.setFieldTouched(`awardEntries[${entryIndex}].images`, true, false);

    // Assign ref for potential programmatic clearing, if not already assigned for this index
    // This ref assignment should ideally happen when the input is rendered, not just on change.
    // For simplicity here, ensuring the ref is current.
    fileInputRefs.current[entryIndex] = event.currentTarget;
  };

  const removeImage = (entryIndex, imageIndexToRemove) => {
    const currentImages = formik.values.awardEntries[entryIndex]?.images || [];
    const updatedImages = currentImages.filter((_, imgIndex) => imgIndex !== imageIndexToRemove);
    formik.setFieldValue(`awardEntries[${entryIndex}].images`, updatedImages);

    if (updatedImages.length === 0 && fileInputRefs.current[entryIndex]) {
      fileInputRefs.current[entryIndex].value = null; // Clear the actual file input
    }
  };

  const awardEntriesArray = formik.values?.awardEntries || [];

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Awards and Recognitions
      </Typography>

      {awardEntriesArray.length > 0 ? (
        awardEntriesArray.map((entry, index) => {
          const imagesLength = entry?.images?.length || 0;
          // Ensure ref array is populated
          if (!fileInputRefs.current[index]) {
            fileInputRefs.current[index] = null; // Placeholder, will be set by input's ref prop
          }
          return (
            <Paper key={entry.id || index} sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name={`awardEntries[${index}].title`}
                    label="Award/Recognition Title"
                    value={entry.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(
                      getIn(formik.touched, `awardEntries[${index}].title`) &&
                      getIn(formik.errors, `awardEntries[${index}].title`)
                    )}
                    helperText={
                      getIn(formik.touched, `awardEntries[${index}].title`) &&
                      getIn(formik.errors, `awardEntries[${index}].title`)
                    }
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(
                      getIn(formik.touched, `awardEntries[${index}].description`) &&
                      getIn(formik.errors, `awardEntries[${index}].description`)
                    )}
                    helperText={
                      getIn(formik.touched, `awardEntries[${index}].description`) &&
                      getIn(formik.errors, `awardEntries[${index}].description`)
                    }
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(
                      getIn(formik.touched, `awardEntries[${index}].date`) &&
                      getIn(formik.errors, `awardEntries[${index}].date`)
                    )}
                    helperText={
                      getIn(formik.touched, `awardEntries[${index}].date`) &&
                      getIn(formik.errors, `awardEntries[${index}].date`)
                    }
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
                      onChange={(event) => handleFileChange(event, index)}
                      ref={el => fileInputRefs.current[index] = el} // Assign ref to the input element
                    />
                  </Button>
                  {getIn(formik.errors, `awardEntries[${index}].images`) && (
                    <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                      {typeof getIn(formik.errors, `awardEntries[${index}].images`) === 'string'
                        ? getIn(formik.errors, `awardEntries[${index}].images`)
                        : "Error with one or more files (e.g. size)"
                      }
                    </Typography>
                  )}
                </Grid>

                {(entry?.images || []).length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Selected Files:</Typography>
                    <List dense>
                      {(entry.images || []).map((file, fileIndex) => (
                        <ListItem
                          key={file.name + fileIndex + file.size} // Added file.size for better key uniqueness
                          secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => removeImage(index, fileIndex)}>
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
                    onClick={() => removeAwardEntry(index)}
                    color="error"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          )
        })
      ) : (
        <Typography sx={{ my: 2, textAlign: 'center', color: 'text.secondary' }}>No awards or recognitions added yet.</Typography>
      )}

      <Button
        type="button"
        startIcon={<AddCircleOutlineIcon />}
        onClick={addAwardEntry}
        variant="outlined"
        sx={{ mt: 1, mb: 2 }}
      >
        Add Award/Recognition
      </Button>

      {typeof formik.errors.awardEntries === 'string' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {formik.errors.awardEntries}
        </Alert>
      )}

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
          disabled={loading || !formik.dirty || !formik.isValid}
          sx={{ mr: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => {
            formik.resetForm({
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
            // fileInputRefs.current = []; // Don't clear the array itself, just the input values
            setSubmitStatus(null);
            setAlertMessage('');
          }}
          disabled={loading || !formik.dirty}
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

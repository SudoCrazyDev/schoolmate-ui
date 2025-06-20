import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormik, getIn } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  Alert,
  AlertTitle,
  CircularProgress,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { trainingEntryShape } from './utils'; // updateTrainingsAPI will be imported later

const MAX_CERTIFICATE_SIZE_MB = 2;

const trainingEntryValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  organizer: Yup.string().required('Organizer is required'),
  dateCompleted: Yup.date().required('Date completed is required').typeError('Invalid date format. Please use YYYY-MM-DD.'),
  hours: Yup.number().positive('Hours must be a positive number').integer('Hours must be an integer.').nullable().typeError('Hours must be a number.'),
  type: Yup.string().nullable(),
  description: Yup.string().nullable(),
  certificateImage: Yup.mixed().nullable()
    .test(
        'fileSize',
        `File too large, max ${MAX_CERTIFICATE_SIZE_MB}MB`,
        (value) => !value || (value && value.size <= MAX_CERTIFICATE_SIZE_MB * 1024 * 1024)
    )
    .test(
        'fileType',
        'Unsupported file format (PNG, JPG, PDF allowed)',
        (value) => !value || (value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type))
    ),
});

const validationSchema = Yup.object().shape({
  trainingEntries: Yup.array().of(trainingEntryValidationSchema)
    // .min(1, 'At least one training entry is required'), // Optional
});

const TrainingsTab = ({ initialEntries }) => {
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const fileInputRefs = useRef([]);

  const formik = useFormik({
    initialValues: {
      trainingEntries: initialEntries && initialEntries.length > 0
        ? initialEntries.map(e => ({
          id: e.id || Date.now().toString() + Math.random(),
          title: e.title || '',
          organizer: e.organizer || '',
          dateCompleted: e.dateCompleted || '',
          hours: e.hours || '',
          type: e.type || '',
          description: e.description || '',
          certificateImage: e.certificateImage || null,
        }))
        : [{
          id: Date.now().toString() + Math.random(),
          title: '', organizer: '', dateCompleted: '', hours: '', type: '', description: '', certificateImage: null
        }],
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setSubmitStatus(null);
      setAlertMessage('');
      try {
        console.log('Submitting training entries:', values.trainingEntries);
        // TODO: Replace with actual API call:
        // const response = await updateTrainingsAPI(values.trainingEntries);
        // setAlertMessage(response.message);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAlertMessage('Training information updated successfully! (Mocked)');
        setSubmitStatus('success');
        // formik.resetForm(); // Consider if reset is desired on success
        // fileInputRefs.current.forEach(ref => { if (ref) ref.value = null; });
      } catch (error) {
        console.error("Error submitting training info:", error);
        setAlertMessage(error.message || 'An unexpected error occurred while updating trainings.');
        setSubmitStatus('error');
      } finally {
        setLoading(false);
      }
    },
  });

  const addTrainingEntry = () => {
    const currentEntries = formik.values?.trainingEntries || [];
    const newEntry = {
      id: Date.now().toString() + Math.random(),
      title: '', organizer: '', dateCompleted: '', hours: '',
      type: '', description: '', certificateImage: null
    };
    formik.setFieldValue('trainingEntries', [...currentEntries, newEntry]);
    // It's good practice to also extend the refs array if needed, though refs are assigned on render.
    // This ensures the array length matches, especially if refs are accessed by index before render.
    fileInputRefs.current = [...fileInputRefs.current, null];
  };

  const removeTrainingEntry = (indexToRemove) => {
    const currentEntries = formik.values?.trainingEntries || [];
    const updatedEntries = currentEntries.filter((_, index) => index !== indexToRemove);
    formik.setFieldValue('trainingEntries', updatedEntries);

    // Clear the specific file input ref and remove it from the array
    if (fileInputRefs.current[indexToRemove]) {
      fileInputRefs.current[indexToRemove].value = null;
    }
    fileInputRefs.current.splice(indexToRemove, 1);
  };

  const handleCertificateFileChange = (event, entryIndex) => {
    const file = event.currentTarget.files[0]; // Single file
    if (file) {
      formik.setFieldValue(`trainingEntries[${entryIndex}].certificateImage`, file);
      // Manually trigger validation for this field or let Yup do it on change/blur
      formik.validateField(`trainingEntries[${entryIndex}].certificateImage`);
    } else {
      formik.setFieldValue(`trainingEntries[${entryIndex}].certificateImage`, null);
    }
    // No need to setFieldTouched here, validateField will handle it if needed or blur will.
    // Ref assignment is done in the JSX 'ref' prop directly.
  };

  const removeCertificateFile = (entryIndex) => {
    formik.setFieldValue(`trainingEntries[${entryIndex}].certificateImage`, null);
    if (fileInputRefs.current[entryIndex]) {
      fileInputRefs.current[entryIndex].value = null;
    }
    // Manually trigger validation or re-validation for the field
    formik.setFieldTouched(`trainingEntries[${entryIndex}].certificateImage`, true, true); // Mark as touched and validate
  };

  const trainingEntriesArray = formik.values?.trainingEntries || [];

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Trainings and Seminars Attended
      </Typography>

      {trainingEntriesArray.length > 0 ? (
        trainingEntriesArray.map((entry, index) => (
          <Paper key={entry.id || index} sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  name={`trainingEntries[${index}].title`}
                  label="Training Title"
                  value={entry.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(getIn(formik.touched, `trainingEntries[${index}].title`) && getIn(formik.errors, `trainingEntries[${index}].title`))}
                  helperText={getIn(formik.touched, `trainingEntries[${index}].title`) && getIn(formik.errors, `trainingEntries[${index}].title`)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  name={`trainingEntries[${index}].organizer`}
                  label="Organizer"
                  value={entry.organizer}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(getIn(formik.touched, `trainingEntries[${index}].organizer`) && getIn(formik.errors, `trainingEntries[${index}].organizer`))}
                  helperText={getIn(formik.touched, `trainingEntries[${index}].organizer`) && getIn(formik.errors, `trainingEntries[${index}].organizer`)}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <TextField
                  fullWidth
                  name={`trainingEntries[${index}].dateCompleted`}
                  label="Date Completed"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={entry.dateCompleted}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(getIn(formik.touched, `trainingEntries[${index}].dateCompleted`) && getIn(formik.errors, `trainingEntries[${index}].dateCompleted`))}
                  helperText={getIn(formik.touched, `trainingEntries[${index}].dateCompleted`) && getIn(formik.errors, `trainingEntries[${index}].dateCompleted`)}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <TextField
                  fullWidth
                  name={`trainingEntries[${index}].hours`}
                  label="Hours"
                  type="number"
                  value={entry.hours}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(getIn(formik.touched, `trainingEntries[${index}].hours`) && getIn(formik.errors, `trainingEntries[${index}].hours`))}
                  helperText={getIn(formik.touched, `trainingEntries[${index}].hours`) && getIn(formik.errors, `trainingEntries[${index}].hours`)}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <TextField
                  fullWidth
                  name={`trainingEntries[${index}].type`}
                  label="Type (e.g., Workshop, Seminar)"
                  value={entry.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(getIn(formik.touched, `trainingEntries[${index}].type`) && getIn(formik.errors, `trainingEntries[${index}].type`))}
                  helperText={getIn(formik.touched, `trainingEntries[${index}].type`) && getIn(formik.errors, `trainingEntries[${index}].type`)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={8}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name={`trainingEntries[${index}].description`}
                  label="Description (Optional)"
                  value={entry.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(getIn(formik.touched, `trainingEntries[${index}].description`) && getIn(formik.errors, `trainingEntries[${index}].description`))}
                  helperText={getIn(formik.touched, `trainingEntries[${index}].description`) && getIn(formik.errors, `trainingEntries[${index}].description`)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} sx={{alignSelf: 'center'}}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFileIcon />}
                  disabled={!!entry.certificateImage}
                  fullWidth
                >
                  {entry.certificateImage
                    ? (typeof entry.certificateImage === 'string' ? entry.certificateImage : entry.certificateImage.name)
                    : 'Upload Certificate'}
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(event) => handleCertificateFileChange(event, index)}
                    ref={el => fileInputRefs.current[index] = el}
                  />
                </Button>
                {entry.certificateImage && (
                  <IconButton onClick={() => removeCertificateFile(index)} size="small" sx={{ ml: 1, verticalAlign: 'middle' }}>
                    <DeleteOutlineIcon />
                  </IconButton>
                )}
                {getIn(formik.errors, `trainingEntries[${index}].certificateImage`) && (
                  <Typography color="error" variant="caption" display="block" sx={{mt:0.5}}>
                      {getIn(formik.errors, `trainingEntries[${index}].certificateImage`)}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <IconButton onClick={() => removeTrainingEntry(index)} color="error">
                  <DeleteOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))
      ) : (
        <Typography sx={{my: 2, textAlign: 'center', color: 'text.secondary'}}>
          No training entries added yet.
        </Typography>
      )}

      <Button
        type="button"
        startIcon={<AddCircleOutlineIcon />}
        onClick={addTrainingEntry}
        variant="outlined"
        sx={{ mt: 1, mb: 2 }}
      >
        Add Training Entry
      </Button>

      {typeof formik.errors.trainingEntries === 'string' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {formik.errors.trainingEntries}
        </Alert>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
            type="button"
            onClick={() => {
                formik.resetForm();
                fileInputRefs.current.forEach(ref => { if (ref) ref.value = null; });
                // fileInputRefs.current = []; // Avoid clearing refs array if entries might persist with null files
                setSubmitStatus(null);
                setAlertMessage('');
            }}
            disabled={loading || !formik.dirty}
            variant="outlined"
            sx={{ mr: 1 }}
        >
            Reset
        </Button>
        <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !formik.dirty || !formik.isValid}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </Box>

      {submitStatus && alertMessage && (
        <Alert severity={submitStatus} sx={{ mt: 2 }}>
          <AlertTitle>{submitStatus.charAt(0).toUpperCase() + submitStatus.slice(1)}</AlertTitle>
          {alertMessage}
        </Alert>
      )}
    </Box>
  );
};

TrainingsTab.propTypes = {
  initialEntries: PropTypes.arrayOf(trainingEntryShape),
};

TrainingsTab.defaultProps = {
  initialEntries: [],
};

export default TrainingsTab;

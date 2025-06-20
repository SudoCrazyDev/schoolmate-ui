import React, { useState } from 'react';
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
  AlertTitle, // Added for better alert structure
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { updateEducationInfoAPI, educationEntryShape as educationEntryPropType } from './utils'; // Import shape

// Renamed for clarity, as educationEntryShape is used for PropTypes in utils.js
const educationEntryValidationSchema = Yup.object().shape({
  level: Yup.string().required('Education Level is required'),
  school: Yup.string().required('School/Institution is required'),
  degree: Yup.string().required('Degree/Course is required'),
  yearGraduated: Yup.number()
    .required('Year Graduated is required')
    .positive('Year must be positive')
    .integer('Year must be an integer')
    .min(1950, 'Year seems too early')
    .max(new Date().getFullYear() + 5, 'Year seems too far in the future')
    .typeError('Year must be a number'),
  awards: Yup.string().nullable(), // Allow awards to be initially null or empty string
});

const EducationTab = ({ initialEntries }) => {
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', or 'error'
  const [alertMessage, setAlertMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      // Use initialEntries if provided, otherwise start with one blank entry.
      // Ensure each entry has a unique 'id' for React keys, can be temporary if not from backend.
      educationEntries: initialEntries && initialEntries.length > 0
        ? initialEntries.map(e => ({ ...e, id: e.id || Date.now().toString() + Math.random() })) // Ensure existing entries have an ID for keys
        : [{ id: Date.now().toString(), level: '', school: '', degree: '', yearGraduated: '', awards: '' }], // Default new entry with an ID
    },
    // enableReinitialize allows the form to update if the initialEntries prop changes.
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      educationEntries: Yup.array().of(educationEntryValidationSchema).min(1, 'At least one education entry is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setSubmitStatus(null);
      setAlertMessage('');
      try {
        // The console.log for the API call itself is in utils.js.
        const response = await updateEducationInfoAPI(values.educationEntries);
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

  // The main formik instance from useFormik()
  // const { values, handleChange, handleBlur, touched, errors, handleSubmit } = formik;
  // We will use 'formik' directly for overall form actions like handleSubmit, dirty, isValid, resetForm.
  // For FieldArray interactions, we'll use the 'form' object from its render prop.

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Educational Background
      </Typography>

      <FieldArray
        name="educationEntries"
        render={(arrayHelpers) => {
          const form = arrayHelpers.form;
          const { push, remove: removeHelper } = arrayHelpers;

          if (!form || !form.values) {
            // This case should ideally not happen if arrayHelpers.form is correct.
            console.error('Formik context (form or form.values) not available in EducationTab FieldArray as expected via arrayHelpers.form.');
            return <Alert severity="error">Error: Form context is not properly loaded for education entries.</Alert>;
          }

          const { values, touched, errors, handleChange, handleBlur } = form; // Use Formik context from arrayHelpers.form
          const educationEntriesArray = values?.educationEntries || []; // Safe access to the array

          return (
            <div>
              {educationEntriesArray.length > 0 ? (
                educationEntriesArray.map((entry, index) => (
                  <Paper key={entry.id || index} sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
                    <Grid container spacing={2} alignItems="flex-start">
                      <Grid item xs={12} sm={2.5}>
                        <TextField
                          fullWidth
                          name={`educationEntries[${index}].level`}
                          label="Education Level"
                          value={entry.level} // Direct value for display
                          onChange={handleChange} // form.handleChange
                          onBlur={handleBlur}   // form.handleBlur
                          error={Boolean(
                              getIn(touched, `educationEntries[${index}].level`) &&
                              getIn(errors, `educationEntries[${index}].level`)
                          )}
                          helperText={
                              getIn(touched, `educationEntries[${index}].level`) &&
                              getIn(errors, `educationEntries[${index}].level`)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          name={`educationEntries[${index}].school`}
                          label="School/Institution"
                          value={entry.school}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(
                              getIn(touched, `educationEntries[${index}].school`) &&
                              getIn(errors, `educationEntries[${index}].school`)
                          )}
                          helperText={
                              getIn(touched, `educationEntries[${index}].school`) &&
                              getIn(errors, `educationEntries[${index}].school`)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={2.5}>
                        <TextField
                          fullWidth
                          name={`educationEntries[${index}].degree`}
                          label="Degree/Course"
                          value={entry.degree}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(
                              getIn(touched, `educationEntries[${index}].degree`) &&
                              getIn(errors, `educationEntries[${index}].degree`)
                          )}
                          helperText={
                              getIn(touched, `educationEntries[${index}].degree`) &&
                              getIn(errors, `educationEntries[${index}].degree`)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={1.5}>
                        <TextField
                          fullWidth
                          name={`educationEntries[${index}].yearGraduated`}
                          label="Year Graduated"
                          type="number"
                          value={entry.yearGraduated}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(
                              getIn(touched, `educationEntries[${index}].yearGraduated`) &&
                              getIn(errors, `educationEntries[${index}].yearGraduated`)
                          )}
                          helperText={
                              getIn(touched, `educationEntries[${index}].yearGraduated`) &&
                              getIn(errors, `educationEntries[${index}].yearGraduated`)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          name={`educationEntries[${index}].awards`}
                          label="Awards/Recognition"
                          value={entry.awards}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(
                              getIn(touched, `educationEntries[${index}].awards`) &&
                              getIn(errors, `educationEntries[${index}].awards`)
                          )}
                          helperText={
                              getIn(touched, `educationEntries[${index}].awards`) &&
                              getIn(errors, `educationEntries[${index}].awards`)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={0.5} sx={{ textAlign: 'right' }}>
                        <IconButton
                          onClick={() => removeHelper(index)} // Use removeHelper from render prop
                          color="error"
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))
              ) : (
                   <Typography sx={{my: 2, textAlign: 'center', color: 'text.secondary'}}>No education entries added yet.</Typography>
              )}
              <Button
                type="button"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => push({ // Use push from render prop
                  id: Date.now().toString() + Math.random(),
                  level: '', school: '', degree: '', yearGraduated: '', awards: ''
                })}
                variant="outlined"
                sx={{ mt: 1, mb: 2 }}
              >
                Add Education Entry
              </Button>
              {typeof errors.educationEntries === 'string' && (
                   <Alert severity="error" sx={{ mb: 2 }}>
                      <AlertTitle>Error</AlertTitle>
                      {errors.educationEntries} {/* This refers to form.errors */}
                   </Alert>
              )}
            </div>
          );
        }}
      />

      <Box sx={{ mt: 3, mb: 2, position: 'relative' }}>
        {/* Consolidated Alert Display */}
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
          disabled={loading || !formik.dirty || !formik.isValid} // Use main formik instance here
          sx={{ mr: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
         <Button
            type="button"
            variant="outlined"
            onClick={() => {
                formik.resetForm({ // Use main formik instance here
                    values: {
                        educationEntries: initialEntries && initialEntries.length > 0
                        ? initialEntries.map(e => ({ ...e, id: e.id || Date.now().toString() + Math.random() }))
                        : [{ id: Date.now().toString(), level: '', school: '', degree: '', yearGraduated: '', awards: '' }]
                    }
                });
                setSubmitStatus(null);
                setAlertMessage('');
            }}
            disabled={loading || !formik.dirty} // Use main formik instance here
        >
            Reset
        </Button>
      </Box>
    </Box>
  );
};

EducationTab.propTypes = {
  /**
   * Optional array of education entries to pre-fill the form.
   */
  initialEntries: PropTypes.arrayOf(educationEntryPropType),
};

EducationTab.defaultProps = {
  initialEntries: [], // Default to an empty array, form will show one blank entry.
};

export default EducationTab;

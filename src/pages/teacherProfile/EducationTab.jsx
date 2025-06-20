import React, { useState } from 'react';
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
  AlertTitle,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { updateEducationInfoAPI, educationEntryShape as educationEntryPropType } from './utils';

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
  awards: Yup.string().nullable(),
});

const EducationTab = ({ initialEntries }) => {
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      educationEntries: initialEntries && initialEntries.length > 0
        ? initialEntries.map(e => ({ ...e, id: e.id || Date.now().toString() + Math.random() }))
        : [{ id: Date.now().toString(), level: '', school: '', degree: '', yearGraduated: '', awards: '' }],
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      educationEntries: Yup.array().of(educationEntryValidationSchema).min(1, 'At least one education entry is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setSubmitStatus(null);
      setAlertMessage('');
      try {
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

  // Manually handle adding an education entry
  const addEducationEntry = () => {
    const currentEntries = formik.values?.educationEntries || [];
    const newEntry = {
      id: Date.now().toString() + Math.random(),
      level: '', school: '', degree: '', yearGraduated: '', awards: ''
    };
    formik.setFieldValue('educationEntries', [...currentEntries, newEntry]);
  };

  // Manually handle removing an education entry
  const removeEducationEntry = (indexToRemove) => {
    const currentEntries = formik.values?.educationEntries || [];
    const updatedEntries = currentEntries.filter((_, index) => index !== indexToRemove);
    formik.setFieldValue('educationEntries', updatedEntries);
  };

  const educationEntriesArray = formik.values?.educationEntries || [];

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Educational Background
      </Typography>

      {educationEntriesArray.length > 0 ? (
        educationEntriesArray.map((entry, index) => (
          <Paper key={entry.id || index} sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} sm={2.5}>
                <TextField
                  fullWidth
                  name={`educationEntries[${index}].level`}
                  label="Education Level"
                  value={entry.level} // Or formik.values.educationEntries[index]?.level || ''
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    getIn(formik.touched, `educationEntries[${index}].level`) &&
                    getIn(formik.errors, `educationEntries[${index}].level`)
                  )}
                  helperText={
                    getIn(formik.touched, `educationEntries[${index}].level`) &&
                    getIn(formik.errors, `educationEntries[${index}].level`)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  name={`educationEntries[${index}].school`}
                  label="School/Institution"
                  value={entry.school} // Or formik.values.educationEntries[index]?.school || ''
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    getIn(formik.touched, `educationEntries[${index}].school`) &&
                    getIn(formik.errors, `educationEntries[${index}].school`)
                  )}
                  helperText={
                    getIn(formik.touched, `educationEntries[${index}].school`) &&
                    getIn(formik.errors, `educationEntries[${index}].school`)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2.5}>
                <TextField
                  fullWidth
                  name={`educationEntries[${index}].degree`}
                  label="Degree/Course"
                  value={entry.degree} // Or formik.values.educationEntries[index]?.degree || ''
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    getIn(formik.touched, `educationEntries[${index}].degree`) &&
                    getIn(formik.errors, `educationEntries[${index}].degree`)
                  )}
                  helperText={
                    getIn(formik.touched, `educationEntries[${index}].degree`) &&
                    getIn(formik.errors, `educationEntries[${index}].degree`)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={1.5}>
                <TextField
                  fullWidth
                  name={`educationEntries[${index}].yearGraduated`}
                  label="Year Graduated"
                  type="number"
                  value={entry.yearGraduated} // Or formik.values.educationEntries[index]?.yearGraduated || ''
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    getIn(formik.touched, `educationEntries[${index}].yearGraduated`) &&
                    getIn(formik.errors, `educationEntries[${index}].yearGraduated`)
                  )}
                  helperText={
                    getIn(formik.touched, `educationEntries[${index}].yearGraduated`) &&
                    getIn(formik.errors, `educationEntries[${index}].yearGraduated`)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  name={`educationEntries[${index}].awards`}
                  label="Awards/Recognition"
                  value={entry.awards} // Or formik.values.educationEntries[index]?.awards || ''
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    getIn(formik.touched, `educationEntries[${index}].awards`) &&
                    getIn(formik.errors, `educationEntries[${index}].awards`)
                  )}
                  helperText={
                    getIn(formik.touched, `educationEntries[${index}].awards`) &&
                    getIn(formik.errors, `educationEntries[${index}].awards`)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={0.5} sx={{ textAlign: 'right' }}>
                <IconButton
                  onClick={() => removeEducationEntry(index)}
                  color="error"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))
      ) : (
        <Typography sx={{ my: 2, textAlign: 'center', color: 'text.secondary' }}>No education entries added yet.</Typography>
      )}

      <Button
        type="button"
        startIcon={<AddCircleOutlineIcon />}
        onClick={addEducationEntry}
        variant="outlined"
        sx={{ mt: 1, mb: 2 }}
      >
        Add Education Entry
      </Button>

      {typeof formik.errors.educationEntries === 'string' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {formik.errors.educationEntries}
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
                educationEntries: initialEntries && initialEntries.length > 0
                  ? initialEntries.map(e => ({ ...e, id: e.id || Date.now().toString() + Math.random() }))
                  : [{ id: Date.now().toString(), level: '', school: '', degree: '', yearGraduated: '', awards: '' }]
              }
            });
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

EducationTab.propTypes = {
  initialEntries: PropTypes.arrayOf(educationEntryPropType),
};

EducationTab.defaultProps = {
  initialEntries: [],
};

export default EducationTab;

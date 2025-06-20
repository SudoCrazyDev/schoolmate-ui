import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { updatePersonalInfoAPI, personalInfoShape } from './utils'; // Import shape

const PersonalTab = ({ initialData }) => {
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', or 'error'
  const [alertMessage, setAlertMessage] = useState('');

  const civilStatusOptions = ['Single', 'Married', 'Widowed', 'Separated', 'Others'];
  const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];


  const formik = useFormik({
    initialValues: {
      firstName: initialData?.firstName || '',
      middleName: initialData?.middleName || '',
      lastName: initialData?.lastName || '',
      extName: initialData?.extName || '',
      gender: initialData?.gender || '',
      birthDate: initialData?.birthDate || '', // YYYY-MM-DD
      placeOfBirth: initialData?.placeOfBirth || '',
      civilStatus: initialData?.civilStatus || '',
      height: initialData?.height || '', // cm
      weight: initialData?.weight || '', // kg
      bloodType: initialData?.bloodType || '',
      residentialAddressStreet: initialData?.residentialAddressStreet || '',
      residentialAddressCity: initialData?.residentialAddressCity || '',
      residentialAddressProvince: initialData?.residentialAddressProvince || '',
      residentialAddressZipCode: initialData?.residentialAddressZipCode || '',
      permanentAddressStreet: initialData?.permanentAddressStreet || '',
      permanentAddressCity: initialData?.permanentAddressCity || '',
      permanentAddressProvince: initialData?.permanentAddressProvince || '',
      permanentAddressZipCode: initialData?.permanentAddressZipCode || '',
      gsis: initialData?.gsis || '',
      pagibig: initialData?.pagibig || '',
      philhealth: initialData?.philhealth || '',
      sss: initialData?.sss || '',
      tin: initialData?.tin || '',
      employeeId: initialData?.employeeId || '',
    },
    // enableReinitialize allows the form to be updated when initialData prop changes.
    // This is crucial if the profile data is fetched asynchronously and passed down.
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      gender: Yup.string().required('Gender is required'),
      birthDate: Yup.date().required('Birthdate is required').nullable(),
      placeOfBirth: Yup.string().required('Place of Birth is required'),
      civilStatus: Yup.string().required('Civil Status is required'),
      height: Yup.number().positive('Height must be positive').typeError('Height must be a number'),
      weight: Yup.number().positive('Weight must be positive').typeError('Weight must be a number'),
      bloodType: Yup.string(),
      residentialAddressStreet: Yup.string().required('Street is required'),
      residentialAddressCity: Yup.string().required('City is required'),
      residentialAddressProvince: Yup.string().required('Province is required'),
      residentialAddressZipCode: Yup.string().required('Zip Code is required'),
      permanentAddressStreet: Yup.string().required('Street is required'),
      permanentAddressCity: Yup.string().required('City is required'),
      permanentAddressProvince: Yup.string().required('Province is required'),
      permanentAddressZipCode: Yup.string().required('Zip Code is required'),
      gsis: Yup.string().matches(/^[a-zA-Z0-9-]*$/, 'Invalid GSIS format').nullable(),
      pagibig: Yup.string().matches(/^[0-9-]*$/, 'Invalid Pag-ibig format').nullable(),
      philhealth: Yup.string().matches(/^[0-9-]*$/, 'Invalid PhilHealth format').nullable(),
      sss: Yup.string().matches(/^[0-9-]*$/, 'Invalid SSS format').nullable(),
      tin: Yup.string().matches(/^[0-9-]*$/, 'Invalid TIN format').nullable(),
      employeeId: Yup.string().required('Employee ID is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setSubmitStatus(null);
      setAlertMessage('');
      try {
        // The console.log for the API call itself is in utils.js, which is fine.
        const response = await updatePersonalInfoAPI(values);
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

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>

      {/* Name Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id="middleName"
            name="middleName"
            label="Middle Name"
            value={formik.values.middleName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.middleName && Boolean(formik.errors.middleName)}
            helperText={formik.touched.middleName && formik.errors.middleName}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="Last Name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id="extName"
            name="extName"
            label="Extension Name (e.g., Jr., Sr.)"
            value={formik.values.extName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.extName && Boolean(formik.errors.extName)}
            helperText={formik.touched.extName && formik.errors.extName}
          />
        </Grid>
      </Grid>

      {/* Personal Details Section */}
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
        Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="birthDate"
            name="birthDate"
            label="Birthdate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formik.values.birthDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
            helperText={formik.touched.birthDate && formik.errors.birthDate}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            id="placeOfBirth"
            name="placeOfBirth"
            label="Place of Birth"
            value={formik.values.placeOfBirth}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.placeOfBirth && Boolean(formik.errors.placeOfBirth)}
            helperText={formik.touched.placeOfBirth && formik.errors.placeOfBirth}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
           <TextField
            fullWidth
            id="gender"
            name="gender"
            label="Gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.gender && Boolean(formik.errors.gender)}
            helperText={formik.touched.gender && formik.errors.gender}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth error={formik.touched.civilStatus && Boolean(formik.errors.civilStatus)}>
            <InputLabel id="civilStatus-label">Civil Status</InputLabel>
            <Select
              labelId="civilStatus-label"
              id="civilStatus"
              name="civilStatus"
              value={formik.values.civilStatus}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Civil Status"
            >
              {civilStatusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.civilStatus && formik.errors.civilStatus && (
              <Typography color="error" variant="caption">{formik.errors.civilStatus}</Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            id="height"
            name="height"
            label="Height (cm)"
            type="number"
            value={formik.values.height}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.height && Boolean(formik.errors.height)}
            helperText={formik.touched.height && formik.errors.height}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            id="weight"
            name="weight"
            label="Weight (kg)"
            type="number"
            value={formik.values.weight}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.weight && Boolean(formik.errors.weight)}
            helperText={formik.touched.weight && formik.errors.weight}
          />
        </Grid>
         <Grid item xs={12} sm={2}>
          <FormControl fullWidth error={formik.touched.bloodType && Boolean(formik.errors.bloodType)}>
            <InputLabel id="bloodType-label">Blood Type</InputLabel>
            <Select
              labelId="bloodType-label"
              id="bloodType"
              name="bloodType"
              value={formik.values.bloodType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Blood Type"
            >
              {bloodTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.bloodType && formik.errors.bloodType && (
              <Typography color="error" variant="caption">{formik.errors.bloodType}</Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>

      {/* Residential Address Section */}
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
        Residential Address
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="residentialAddressStreet"
            name="residentialAddressStreet"
            label="Street/Barangay"
            value={formik.values.residentialAddressStreet}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.residentialAddressStreet && Boolean(formik.errors.residentialAddressStreet)}
            helperText={formik.touched.residentialAddressStreet && formik.errors.residentialAddressStreet}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="residentialAddressCity"
            name="residentialAddressCity"
            label="City/Municipality"
            value={formik.values.residentialAddressCity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.residentialAddressCity && Boolean(formik.errors.residentialAddressCity)}
            helperText={formik.touched.residentialAddressCity && formik.errors.residentialAddressCity}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="residentialAddressProvince"
            name="residentialAddressProvince"
            label="Province"
            value={formik.values.residentialAddressProvince}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.residentialAddressProvince && Boolean(formik.errors.residentialAddressProvince)}
            helperText={formik.touched.residentialAddressProvince && formik.errors.residentialAddressProvince}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="residentialAddressZipCode"
            name="residentialAddressZipCode"
            label="ZIP Code"
            value={formik.values.residentialAddressZipCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.residentialAddressZipCode && Boolean(formik.errors.residentialAddressZipCode)}
            helperText={formik.touched.residentialAddressZipCode && formik.errors.residentialAddressZipCode}
          />
        </Grid>
      </Grid>

      {/* Permanent Address Section */}
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
        Permanent Address
      </Typography>
      {/* TODO: Add a checkbox "Same as Residential Address" */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="permanentAddressStreet"
            name="permanentAddressStreet"
            label="Street/Barangay"
            value={formik.values.permanentAddressStreet}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.permanentAddressStreet && Boolean(formik.errors.permanentAddressStreet)}
            helperText={formik.touched.permanentAddressStreet && formik.errors.permanentAddressStreet}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="permanentAddressCity"
            name="permanentAddressCity"
            label="City/Municipality"
            value={formik.values.permanentAddressCity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.permanentAddressCity && Boolean(formik.errors.permanentAddressCity)}
            helperText={formik.touched.permanentAddressCity && formik.errors.permanentAddressCity}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="permanentAddressProvince"
            name="permanentAddressProvince"
            label="Province"
            value={formik.values.permanentAddressProvince}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.permanentAddressProvince && Boolean(formik.errors.permanentAddressProvince)}
            helperText={formik.touched.permanentAddressProvince && formik.errors.permanentAddressProvince}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            id="permanentAddressZipCode"
            name="permanentAddressZipCode"
            label="ZIP Code"
            value={formik.values.permanentAddressZipCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.permanentAddressZipCode && Boolean(formik.errors.permanentAddressZipCode)}
            helperText={formik.touched.permanentAddressZipCode && formik.errors.permanentAddressZipCode}
          />
        </Grid>
      </Grid>

      {/* Government IDs Section */}
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
        Government Issued IDs
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id="employeeId"
            name="employeeId"
            label="Employee ID"
            value={formik.values.employeeId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.employeeId && Boolean(formik.errors.employeeId)}
            helperText={formik.touched.employeeId && formik.errors.employeeId}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id="gsis"
            name="gsis"
            label="GSIS ID No."
            value={formik.values.gsis}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.gsis && Boolean(formik.errors.gsis)}
            helperText={formik.touched.gsis && formik.errors.gsis}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id="pagibig"
            name="pagibig"
            label="Pag-IBIG ID No."
            value={formik.values.pagibig}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pagibig && Boolean(formik.errors.pagibig)}
            helperText={formik.touched.pagibig && formik.errors.pagibig}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id="philhealth"
            name="philhealth"
            label="PhilHealth No."
            value={formik.values.philhealth}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.philhealth && Boolean(formik.errors.philhealth)}
            helperText={formik.touched.philhealth && formik.errors.philhealth}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id="sss"
            name="sss"
            label="SSS No."
            value={formik.values.sss}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.sss && Boolean(formik.errors.sss)}
            helperText={formik.touched.sss && formik.errors.sss}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            id="tin"
            name="tin"
            label="TIN"
            value={formik.values.tin}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.tin && Boolean(formik.errors.tin)}
            helperText={formik.touched.tin && formik.errors.tin}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, mb: 2, position: 'relative' }}>
        {submitStatus === 'success' && (
          <Alert severity="success" sx={{ mb: 2 }}>{alertMessage}</Alert>
        )}
        {submitStatus === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>{alertMessage}</Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !formik.dirty} // Disable if not dirty
          sx={{ mr: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
        <Button
            type="button"
            variant="outlined"
            onClick={() => {
                formik.resetForm({ values: formik.initialValues }); // Reset to initialData-based values
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

PersonalTab.propTypes = {
  initialData: personalInfoShape,
};

PersonalTab.defaultProps = {
  initialData: null,
};

export default PersonalTab;

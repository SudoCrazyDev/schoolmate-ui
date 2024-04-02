import TextField from '@mui/material/TextField';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox'

export default function BasicInfo({formik}){
    
    return(
        <div role='tabpanel' className="mt-3 d-flex flex-row flex-wrap">
                <div className="p-2 col-4">
                    <TextField
                    inputProps={{className: 'text-uppercase'}}
                    variant='outlined'
                    size='small'
                    label="PSA NO"
                    fullWidth
                    {...formik.getFieldProps('basic_information.psa')}
                    error={formik.touched.basic_information?.psa && formik.errors.basic_information?.psa}
                    helperText={formik.errors.basic_information?.psa}
                    />
                </div>
                <div className="p-2 col-4">
                    <TextField
                    inputProps={{className: 'text-uppercase'}}
                    variant='outlined'
                    size='small'
                    label="PLACE OF BIRTH"
                    fullWidth
                    placeholder='Municipality/City'
                    {...formik.getFieldProps('basic_information.place_of_birth')}
                    error={formik.touched.basic_information?.place_of_birth && formik.errors.basic_information?.place_of_birth}
                    helperText={formik.errors.basic_information?.place_of_birth}
                    />
                </div>
                <div className="p-2 col-4">
                    <FormControl fullWidth>
                        <InputLabel id="gender-label">Student Belong to Indigenous People {'(IP)'}?</InputLabel>
                        <Select labelId='gender-label' label="Student Belong to Indigenous People (IP) ?" fullWidth size='small' {...formik.getFieldProps('basic_information.is_ip')}>
                            <MenuItem value={1}>YES</MenuItem>
                            <MenuItem value={0}>NO</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="p-2 col-4">
                    <FormControl fullWidth>
                        <InputLabel id="4ps-label">A beneficiairy of 4ps?</InputLabel>
                        <Select labelId='4ps-label' label="A beneficiary of 4ps?" fullWidth size='small' {...formik.getFieldProps('basic_information.beneficiary')}>
                            <MenuItem value={1}>YES</MenuItem>
                            <MenuItem value={0}>NO</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="p-2 col-12 d-flex flex-column">
                    <div className="border-bottom border-top border-secondary py-2">
                        <h5 className="m-0 fw-bolder">Current Address</h5>
                    </div>
                    <div className="d-flex flex-row flex-wrap">
                        <div className="p-2 col-3">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="House No."
                                fullWidth
                                placeholder='House No.'
                                {...formik.getFieldProps('basic_information.address.current_house_no')}
                                error={formik.touched.basic_information?.address?.current_house_no && formik.errors.basic_information?.address?.current_house_no}
                                helperText={formik.errors.basic_information?.address?.current_house_no}
                            />
                        </div>
                        <div className="p-2 col-5">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Sitio/Street Name"
                                fullWidth
                                placeholder='Sitio/Street Name'
                                {...formik.getFieldProps('basic_information.address.current_street_name')}
                                error={formik.touched.basic_information?.address?.current_street_name && formik.errors.basic_information?.address?.current_street_name}
                                helperText={formik.errors.basic_information?.address?.current_street_name}
                            />
                        </div>
                        <div className="p-2 col-4">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Barangay"
                                fullWidth
                                placeholder='Eg. Lagao, Fatima, Calumpang'
                                {...formik.getFieldProps('basic_information.address.current_barangay')}
                                error={formik.touched.basic_information?.address?.current_barangay && formik.errors.basic_information?.address?.current_barangay}
                                helperText={formik.errors.basic_information?.address?.current_barangay}
                            />
                        </div>
                        <div className="p-2 col-4">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Municipality/City"
                                fullWidth
                                placeholder='Eg. General Santos City'
                                {...formik.getFieldProps('basic_information.address.current_municipality')}
                                error={formik.touched.basic_information?.address?.current_municipality && formik.errors.basic_information?.address?.current_municipality}
                                helperText={formik.errors.basic_information?.address?.current_municipality}
                            />
                        </div>
                        <div className="p-2 col-4">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Province"
                                fullWidth
                                placeholder='Eg. South Cotabato'
                                {...formik.getFieldProps('basic_information.address.current_province')}
                                error={formik.touched.basic_information?.address?.current_province && formik.errors.basic_information?.address?.current_province}
                                helperText={formik.errors.basic_information?.address?.current_province}
                            />
                        </div>
                        <div className="p-2 col-2">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Country"
                                fullWidth
                                placeholder='Eg. Philippines'
                                {...formik.getFieldProps('basic_information.address.current_country')}
                                error={formik.touched.basic_information?.address?.current_country && formik.errors.basic_information?.address?.current_country}
                                helperText={formik.errors.basic_information?.address?.current_country}
                            />
                        </div>
                        <div className="p-2 col-2">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Zip Code"
                                fullWidth
                                placeholder='Eg. 9500'
                                {...formik.getFieldProps('basic_information.address.current_zip_code')}
                                error={formik.touched.basic_information?.address?.current_zip_code && formik.errors.basic_information?.address?.current_zip_code}
                                helperText={formik.errors.basic_information?.address?.current_zip_code}
                            />
                        </div>
                    </div>
                    <div className="border-bottom border-top border-secondary py-2 d-flex flex-row align-items-center gap-3">
                        <h5 className="m-0 fw-bolder">Permanent Address</h5>
                        <h5 className="m-0 fw-bolder">same with current address?</h5>
                        <FormControlLabel control={<Checkbox checked={Boolean(formik.values.basic_information?.address?.same_address)} onChange={(e) => formik.setFieldValue('basic_information.address.same_address', 1)}/>} label="Yes" />
                        <FormControlLabel control={<Checkbox checked={Boolean(!formik.values.basic_information?.address?.same_address)} onChange={(e) => formik.setFieldValue('basic_information.address.same_address', 0)}/>} label="No" />
                    </div>
                    <div className="d-flex flex-row flex-wrap">
                        <div className="p-2 col-3">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="House No."
                                fullWidth
                                placeholder='House No.'
                                {...formik.getFieldProps('basic_information.address.permanent_house_no')}
                                error={formik.touched.basic_information?.address?.permanent_house_no && formik.errors.basic_information?.address?.permanent_house_no}
                                helperText={formik.errors.basic_information?.address?.permanent_house_no}
                                disabled={formik.values.basic_information?.address?.same_address}
                            />
                        </div>
                        <div className="p-2 col-5">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Sitio/Street Name"
                                fullWidth
                                placeholder='Sitio/Street Name'
                                {...formik.getFieldProps('basic_information.address.permanent_street_name')}
                                error={formik.touched.basic_information?.address?.permanent_street_name && formik.errors.basic_information?.address?.permanent_street_name}
                                helperText={formik.errors.basic_information?.address?.permanent_street_name}
                                disabled={formik.values.basic_information?.address?.same_address}
                            />
                        </div>
                        <div className="p-2 col-4">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Barangay"
                                fullWidth
                                placeholder='Eg. Lagao, Fatima, Calumpang'
                                {...formik.getFieldProps('basic_information.address.permanent_barangay')}
                                error={formik.touched.basic_information?.address?.permanent_barangay && formik.errors.basic_information?.address?.permanent_barangay}
                                helperText={formik.errors.basic_information?.address?.permanent_barangay}
                                disabled={formik.values.basic_information?.address?.same_address}
                            />
                        </div>
                        <div className="p-2 col-4">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Municipality/City"
                                fullWidth
                                placeholder='Eg. General Santos City'
                                {...formik.getFieldProps('basic_information.address.permanent_municipality')}
                                error={formik.touched.basic_information?.address?.permanent_municipality && formik.errors.basic_information?.address?.permanent_municipality}
                                helperText={formik.errors.basic_information?.address?.permanent_municipality}
                                disabled={formik.values.basic_information?.address?.same_address}
                            />
                        </div>
                        <div className="p-2 col-4">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Province"
                                fullWidth
                                placeholder='Eg. South Cotabato'
                                {...formik.getFieldProps('basic_information.address.permanent_province')}
                                error={formik.touched.basic_information?.address?.permanent_province && formik.errors.basic_information?.address?.permanent_province}
                                helperText={formik.errors.basic_information?.address?.permanent_province}
                                disabled={formik.values.basic_information?.address?.same_address}
                            />
                        </div>
                        <div className="p-2 col-2">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Country"
                                fullWidth
                                placeholder='Eg. Philippines'
                                {...formik.getFieldProps('basic_information.address.permanent_country')}
                                error={formik.touched.basic_information?.address?.permanent_country && formik.errors.basic_information?.address?.permanent_country}
                                helperText={formik.errors.basic_information?.address?.permanent_country}
                                disabled={formik.values.basic_information?.address?.same_address}
                            />
                        </div>
                        <div className="p-2 col-2">
                            <TextField
                                inputProps={{className: 'text-uppercase'}}
                                variant='outlined'
                                size='small'
                                label="Zip Code"
                                fullWidth
                                placeholder='Eg. 9500'
                                {...formik.getFieldProps('basic_information.address.permanent_zip_code')}
                                error={formik.touched.basic_information?.address?.permanent_zip_code && formik.errors.basic_information?.address?.permanent_zip_code}
                                helperText={formik.errors.basic_information?.address?.permanent_zip_code}
                                disabled={formik.values.basic_information?.address?.same_address}
                            />
                        </div>
                    </div>
                </div>
        </div>
    );
};
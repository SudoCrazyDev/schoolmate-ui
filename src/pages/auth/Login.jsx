import { TextField, Button } from "@mui/material";
import Axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useAlert } from "../../hooks/CustomHooks";
import { useDispatch } from "react-redux";
import * as auth from "../../redux/slices/UserSlice";

const validationSchema = yup.object().shape({
    email: yup.string().email('Must be a valid email'),
    password: yup.string(),
});

export default function Login(){
    const alert = useAlert();
    const dispatch = useDispatch();
    
    const handleSubmit = (values) => {
        formik.setSubmitting(true);
        Axios.post('login', values)
        .then(({data}) => {
            alert.setAlert('success', data.message);
            setTimeout(() => {
                dispatch(auth.actions.SET_TOKEN(data.token));
            }, 1500);
        })
        .catch(({response}) => {
            alert.setAlert('error', response.data.message);
        })
        .finally(() => {
            formik.setSubmitting(false);
        });
    };
    
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });
    
    return(
        <div className="d-flex flex-row justify-content-center align-items-center vh-100">
            <form onSubmit={formik.handleSubmit}>
                <div className="d-flex flex-column align-items-center gap-3">
                    <h1 className="m-0 fw-bolder">GSCNSSAT APP</h1>
                    <TextField type="email" variant="outlined" label="Email" fullWidth {...formik.getFieldProps('email')} error={formik.errors.email}/>
                    <TextField type="password" variant="outlined" label="Password" fullWidth {...formik.getFieldProps('password')} error={formik.errors.password}/>
                    <Button type="submit" variant="contained" className="fw-bolder" fullWidth disabled={formik.isSubmitting}>Login {formik.isSubmitting && <span className="ms-2 spinner-border spinner-border-sm"></span>}</Button>
                </div>
            </form>
        </div>
    );
};
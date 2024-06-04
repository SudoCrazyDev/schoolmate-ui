import { TextField, Button } from "@mui/material";
import Axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useAlert } from "../../hooks/CustomHooks";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/slices/UserSlice";
import pb from '../../global/pb';

const validationSchema = yup.object().shape({
    email: yup.string().email('Must be a valid email'),
    password: yup.string(),
});

export default function Login(){
    const alert = useAlert();
    const dispatch = useDispatch();
    
    const handleSubmit = async (values) => {
        formik.setSubmitting(true);
        try {
            const authData = await pb.collection('users').authWithPassword(values.email, values.password);
            dispatch(actions.SET_TOKEN(authData.token));
        } catch (error) {
            alert.setAlert('error', error.response.message);
        } finally {
            formik.setSubmitting(false);
        }
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
                <div className="d-flex flex-column align-items-center gap-3 align-items-center">
                    <h1 className="m-0 fw-bolder text-center" style={{letterSpacing: '3px'}}>SCHOLASTIC CLOUD</h1>
                    <p className="m-0 fw-light" style={{letterSpacing: '5px'}}>EMPOWERING EDUCATION</p>
                    <TextField id="email" type="email" variant="outlined" label="Email" fullWidth {...formik.getFieldProps('email')} error={formik.errors.email}/>
                    <TextField id="password" type="password" variant="outlined" label="Password" fullWidth {...formik.getFieldProps('password')} error={formik.errors.password}/>
                    <Button type="submit" variant="contained" className="fw-bolder" fullWidth disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? <span className="ms-2 spinner-border spinner-border-sm"></span> : "Login"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
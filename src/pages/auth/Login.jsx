import { TextField, Button } from "@mui/material";
import Axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useAlert } from "../../hooks/CustomHooks";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/slices/UserSlice";
import { actions as OrgActions } from "../../redux/slices/OrgSlice";
import pb from '../../global/pb';
import { useNavigate } from "react-router-dom";
import { axiosErrorCodeHandler } from "../../global/Helpers";

const validationSchema = yup.object().shape({
    email: yup.string().email('Must be a valid email'),
    password: yup.string(),
});

export default function Login(){
    const alert = useAlert();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleSubmit = async (values) => {
        formik.setSubmitting(true);
        await Axios.post('login', values)
        .then((res) => {
            if(res.data.is_new){
                navigate(`/new-user-password/${res.data.id}`);
            } else {
                dispatch(actions.SET_USER(res.data));
                dispatch(actions.SET_TOKEN(res.data.token));
                dispatch(actions.SET_ROLES(res.data.roles));
                dispatch(actions.SET_INSTITUTIONS(res.data.institutions));
                dispatch(OrgActions.SET_SUBSCRIPTION(res.data.institutions?.[0]?.subscriptions?.[0]?.subscription));
            }
        })
        .catch(err => {
            alert.setAlert('error', axiosErrorCodeHandler(err));
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
            <div className="col-6 p-5 d-flex flex-column align-items-center">
                <form onSubmit={formik.handleSubmit} className="d-flex flex-column justify-content-center" style={{width:'500px'}}>
                    <h1 className="m-0 fw-bolder text-center" style={{letterSpacing: '3px'}}>SCHOLASTIC CLOUD</h1>
                    <p className="m-0 fw-normal text-center mb-3" style={{letterSpacing: '5px'}}>EMPOWERING EDUCATION</p>
                    <hr />
                    <div className="py-3 px-3">
                        <div className="card-body d-flex flex-column gap-2">
                            <TextField id="email" type="email" variant="outlined" label="Email" fullWidth {...formik.getFieldProps('email')} error={formik.errors.email}/>
                            <TextField id="password" type="password" variant="outlined" label="Password" fullWidth {...formik.getFieldProps('password')} error={formik.errors.password}/>
                            <Button type="submit" size="large" variant="contained" className="fw-bolder" fullWidth disabled={formik.isSubmitting}>
                                {formik.isSubmitting ? <span className="ms-2 spinner-border spinner-border-sm"></span> : "Login"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="col-6 p-3">
                <iframe className="w-100" style={{minHeight: '95vh'}} src="https://lottie.host/embed/c00b4ad6-461f-49ba-a860-09e94fab466c/Jpi7xwkxI4.json"></iframe>
            </div>
        </div>
    );
};
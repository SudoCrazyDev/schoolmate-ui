import Axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useAlert } from "../../hooks/CustomHooks";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/slices/UserSlice";
import { actions as OrgActions } from "../../redux/slices/OrgSlice";
import { useNavigate } from "react-router-dom";
import { axiosErrorCodeHandler } from "../../global/Helpers";
import {
    BaseContainer,
    ContentContainer,
    ParentContentContainer,
    TextField,
    Button
} from "@UIComponents";
import { useState } from "react";

const validationSchema = yup.object().shape({
    email: yup.string().email('Must be a valid email'),
    password: yup.string(),
});

export default function Login(){
    const alert = useAlert();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [invalid, setInvalid] = useState(null);
    
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
            setInvalid(axiosErrorCodeHandler(err));
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
    
    setTimeout(() => {
        if(invalid){
            setTimeout(() => {
                setInvalid(null);
            }, 1500);
        }
    }, [invalid]);
    return(
        <BaseContainer>
            <ParentContentContainer>
                    <ContentContainer className="w-[100%] lg:w-[50%] items-center justify-center">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="flex flex-col items-stretch justify-stretch">
                                <h1 className="text-3xl md:text-5xl font-semibold tracking-widest text-center text-gray-800">SCHOLASTIC CLOUD</h1>
                                <h5 className="text-1xl md:text-1xl font-light sm:tracking-normal md:tracking-[10px] text-center text-gray-800">EMPOWERING EDUCATION</h5>
                                <p className="text-base font-light mt-5 md:mt-10 tracking-[-1px] text-center text-gray-800">Enter your email and password to access your account.</p>
                                {invalid && (
                                    <div className="h-20 bg-red-300/80 rounded-lg border-red-600 border-2 shadow-md mt-3 flex flex-col items-center justify-center text-white">
                                        <h3 className="text-lg text-white">{invalid}</h3>
                                    </div>
                                )}
                                <div className="flex flex-row w-100 mt-3 mb-5">
                                    <hr />
                                </div>
                                <TextField type="text" required placeholder="info@gmail.com" label="Email" value={formik.values.email} onChange={(e) => formik.setFieldValue('email', e.target.value)}/>
                                <TextField type="password" required label="Password" className="mt-2" value={formik.values.password} onChange={(e) => formik.setFieldValue('password', e.target.value)}/>
                                <Button type="submit" className="mt-3" loading={formik.isSubmitting} disabled={formik.isSubmitting}>
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </ContentContainer>
                <ContentContainer className="w-0 hidden lg:block lg:w-[50%]" style={{backgroundImage: "url(/assets/bg/login-bg.png)", backgroundSize: "cover"}}>
                </ContentContainer>
            </ParentContentContainer>
        </BaseContainer>
    );
};
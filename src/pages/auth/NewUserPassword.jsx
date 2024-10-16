import { TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../hooks/CustomHooks";
import axios from "axios";

export default function NewUserPassword(){
    const {user_id} = useParams();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    
    const alert = useAlert();
    
    const handleSubmit = async () => {
        setSubmitting(true);
        if(password !== confirmPassword){
            alert.setAlert('error', 'Password doesnt match!');
            setSubmitting(false);
            return;
        }
        await axios.post(`users/update-password`, {
            user_id,
            password
        })
        .then(() => {
            navigate('/login');
        })
        .catch(() => {
            alert.setAlert('error', 'Invalid Token!');
        })
        .finally(() => {
            setSubmitting(false);
        });
    };
    
    return(
        <div className="d-flex flex-row justify-content-center align-items-center vh-100">
            <form>
                <div className="d-flex flex-column align-items-center gap-3">
                    <h1 className="m-0 fw-bolder">PLEASE SET YOUR PASSWORD</h1>
                    <TextField type="password" variant="outlined" label="New Password" onChange={(e) => setPassword(e.target.value)} fullWidth/>
                    <TextField type="password" variant="outlined" label="Confirm Password" fullWidth onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <Button variant="contained" className="fw-bolder" fullWidth disabled={submitting} onClick={() => handleSubmit()}>Save</Button>
                </div>
            </form>
        </div>
    );
};
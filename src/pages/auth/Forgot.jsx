import { TextField, Button } from "@mui/material";

export default function Forgot(){
    return(
        <div className="d-flex flex-row justify-content-center align-items-center vh-100">
            <form>
                <div className="d-flex flex-column align-items-center gap-3">
                    <h1 className="m-0 fw-bolder">Forgot Password</h1>
                    <TextField type="email" variant="outlined" label="Email" fullWidth/>
                    <Button variant="contained" className="fw-bolder" fullWidth>Submit</Button>
                </div>
            </form>
        </div>
    );
};
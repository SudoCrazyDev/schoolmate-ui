import { TextField, Button } from "@mui/material";

export default function NewPassword(){
    return(
        <div className="d-flex flex-row justify-content-center align-items-center vh-100">
            <form>
                <div className="d-flex flex-column align-items-center gap-3">
                    <h1 className="m-0 fw-bolder">SET YOUR NEW PASSWORD</h1>
                    <TextField type="password" variant="outlined" label="New Password" fullWidth/>
                    <TextField type="password" variant="outlined" label="Confirm Password" fullWidth/>
                    <Button variant="contained" className="fw-bolder" fullWidth>Save</Button>
                </div>
            </form>
        </div>
    );
};
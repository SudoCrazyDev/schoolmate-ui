import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function InstitutionRegistration(){
    return(
        <div className="d-flex flex-row align-items-center justify-content-center vh-100">
            <div className="d-flex flex-column">
                <h1 className="m-0" style={{letterSpacing: '-1px'}}>Let's create an account.</h1>
                <p className="m-0 text-muted">
                    Schoolastic Cloud helps automate and streamline <br />
                    your institution's workload.
                </p>
                <form>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row gap-2 py-2">
                            <TextField  variant='outlined' label="First Name" />
                            <TextField variant='outlined' label="First Name" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
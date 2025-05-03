import PrintIcon from '@mui/icons-material/Print';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { useState } from 'react';
import DTRForm from './DTRForm';
import { GetActiveInstitution } from '../../../global/Helpers';

const PrintDTR = ({teacher, attendances}) => {
    const [open, setOpen] = useState(false);
    
    const handleModalState = () => {
        setOpen(!open);
    };

    return(
        <>
        <button className="btn btn-primary" onClick={handleModalState}><PrintIcon /> Print</button>
        <Dialog open={open} maxWidth="md" fullWidth style={{height: "100vh"}}>
            <DialogContent style={{height: "100vh"}}>
                <DTRForm attendances={attendances} teacher={teacher}/>
            </DialogContent>
            <hr />
            <DialogActions>
                <button className="btn btn-danger" onClick={() => handleModalState()}>Close</button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default PrintDTR;
import PrintIcon from '@mui/icons-material/Print';
import { Dialog, DialogContent } from '@mui/material';
import { useState } from 'react';
import DTRForm from './DTRForm';

const PrintDTR = ({attendances}) => {
    const [open, setOpen] = useState(false);
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    return(
        <>
        <button className="btn btn-primary" onClick={handleModalState}><PrintIcon /> Print</button>
        <Dialog open={open} maxWidth="md" fullWidth style={{height: "100vh"}}>
            <DialogContent style={{height: "100vh"}}>
                <DTRForm />
            </DialogContent>
        </Dialog>
        </>
    );
};

export default PrintDTR;
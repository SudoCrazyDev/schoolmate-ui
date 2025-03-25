import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { Dialog, DialogActions, DialogContent, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import JHSCocPrintable from './JHSCocPrintable';

export default function JHSCoc({advisory, student}){
    const [open, setOpen] = useState(false);
    
    const handleModalState = () => {
        setOpen(!open);
    };
    return(
        <>
        <Tooltip title="Print COC">
            <IconButton color="primary" size="small" onClick={() => handleModalState()}>
                <CardGiftcardIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>
        <Dialog open={open} fullScreen>
            <DialogContent>
                {open && (
                    <JHSCocPrintable advisory={advisory} student={student}/>
                )}
            </DialogContent>
            <DialogActions>
                <button className="btn btn-danger" onClick={() => handleModalState()}>Close</button>
            </DialogActions>
        </Dialog>
        </>
    );
};
import PrintIcon from '@mui/icons-material/Print';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { useState } from 'react';
import DTRForm from './DTRForm';
import { GetActiveInstitution } from '../../../global/Helpers';

const PrintDTR = ({teacher, attendances}) => {
    const [open, setOpen] = useState(false);
    const [assignatory, setAssignatory] = useState("");
    const [position, setPosition] = useState("");
    const [override, setOverride] = useState(null);
    
    const handleModalState = () => {
        setOpen(!open);
    };

    const handleOverride = () => {
        if(override){
           setOverride(null) ;
        }else {
            setOverride({assignatory: assignatory, position: position})
        }
    };
    return(
        <>
        <button className="btn btn-primary" onClick={handleModalState}><PrintIcon /> Print</button>
        <Dialog open={open} maxWidth="md" fullWidth style={{height: "100vh"}}>
            <DialogContent style={{height: "100vh"}}>
                <div className="d-flex flex-row gap-2 align-items-end mb-2">
                    <div className="d-flex flex-column">
                        <label htmlFor="">Override Assignatory</label>
                        <input type="text" className='form-control' onChange={(e) => setAssignatory(e.target.value)}/>
                    </div>
                    <div className="d-flex flex-column">
                        <label htmlFor="">Override Position</label>
                        <input type="text" className='form-control' value={position} onChange={(e) => setPosition(e.target.value)}/>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleOverride()}>
                        {override ? "Cancel" : "Override"}
                    </button>
                </div>
                <DTRForm
                    attendances={attendances}
                    teacher={teacher}
                    override={override}
                />
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
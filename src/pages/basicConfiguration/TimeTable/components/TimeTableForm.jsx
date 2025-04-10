import ModeIcon from '@mui/icons-material/Mode';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import {useFormik} from 'formik';

export default function TimeTableForm({type = "create"}){
    const [open, setOpen] = useState(false);
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    const formik = useFormik({
        initialValues:{
            start_working_time: "",
            end_working_time: "",
            early_time_in: "",
            late_time_in: "",
            
        }
    });
    return(
        <>
        {type === "create" && (
            <button className="btn btn-primary" onClick={() => handleModalState()}>New</button>
        )}
        {type === "update" && (
            <Tooltip title="Edit">
                <IconButton color='primary' size='small' onClick={() => handleModalState()}>
                    <ModeIcon />
                </IconButton>
            </Tooltip>
        )}
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>
                <h4 className='m-0 text-capitalize fw-bold'>{type} TimeTable</h4>
            </DialogTitle>
            <Divider />
            <DialogContent className='d-flex flex-column gap-4'>
                <div className="d-flex flex-column">
                    <label>Shift Title</label>
                    <input type="text" className="form-control" />
                </div>
                <div className="d-flex flex-row justify-content-between gap-3">
                    <div className="d-flex flex-column w-50">
                        <label>Start Working Time</label>
                        <input type="time" className="form-control" />
                    </div>
                    <div className="d-flex flex-column w-50">
                        <label>End Working Time</label>
                        <input type="time" className="form-control" />
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-between gap-3">
                    <div className="d-flex flex-column w-50">
                        <label>Early Time-In</label>
                        <input type="time" className="form-control" />
                    </div>
                    <div className="d-flex flex-column w-50">
                        <label>Late Time-In</label>
                        <input type="time" className="form-control" />
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-between gap-3">
                    <div className="d-flex flex-column w-50">
                        <label>Break-In Time</label>
                        <input type="time" className="form-control" />
                    </div>
                    <div className="d-flex flex-column w-50">
                        <label>Break-Out Time</label>
                        <input type="time" className="form-control" />
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-between gap-3">
                    <div className="d-flex flex-column w-50">
                        <label>Valid Check-Out Time</label>
                        <input type="time" className="form-control" />
                    </div>
                    <div className="d-flex flex-column w-50">
                        <label>Late Check-Out Time</label>
                        <input type="time" className="form-control" />
                    </div>
                </div>
                <Divider />
                <DialogActions className='d-flex flex-row justify-content-start'>
                    <button className="btn btn-primary">Save</button>
                    <button className="btn btn-danger" onClick={() => handleModalState()}>Close</button>
                </DialogActions>
            </DialogContent>
        </Dialog>
        </>
    );
};
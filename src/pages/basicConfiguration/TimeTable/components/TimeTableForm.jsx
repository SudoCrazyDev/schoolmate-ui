import ModeIcon from '@mui/icons-material/Mode';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import {useFormik} from 'formik';
import axios from 'axios';
import { useAlert } from '../../../../hooks/CustomHooks';
import { GetActiveInstitution } from '../../../../global/Helpers';

export default function TimeTableForm({refresh, timetable, isCreate = true}){
    const [open, setOpen] = useState(false);
    const institution = GetActiveInstitution();
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    const handleSubmit = async (values) => {
        await axios.post('time_schedules/add', values)
        .then(() => {
            refresh();
            handleModalState();
            alert.setAlert("success", "Timetable Created");
        })
        .catch(() => {
            alert.setAlert("error", "Unable to Create!");
        });
    };
    
    const handleUpdate = async (values) => {
        if(!isCreate){
            values['id'] = timetable.id;
        }
        await axios.post('time_schedules/update', values)
        .then(() => {
            refresh();
            handleModalState();
            alert.setAlert("success", "Timetable Updated!");
        }).catch(() => {
            alert.setAlert("error", "Unable to update!");
        });
    };
    
    const formik = useFormik({
        initialValues:{
            institution_id: institution.id,
            title: isCreate ? "" : timetable.title,
            start_working_time: isCreate ? "" : timetable.start_working_time,
            end_working_time: isCreate ? "" : timetable.end_working_time,
            early_time_in: isCreate ? "" : timetable.early_time_in,
            late_time_in: isCreate ? "" : timetable.late_time_in,
            break_in: isCreate ? "" : timetable.break_in,
            break_out: isCreate ? "" : timetable.break_out,
            valid_check_out: isCreate ? "" : timetable.valid_check_out,
            late_check_out: isCreate ? "" : timetable.late_check_out,
            color: isCreate ? "#368eec" : timetable.color
        },
        onSubmit: isCreate ? handleSubmit : handleUpdate
    });
    
    return(
        <>
        {isCreate && (
            <button className="btn btn-primary" onClick={() => handleModalState()}>New</button>
        )}
        {!isCreate && (
            <Tooltip title="Edit">
                <IconButton color='primary' size='small' onClick={() => handleModalState()}>
                    <ModeIcon />
                </IconButton>
            </Tooltip>
        )}
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle className='h4 m-0 text-capitalize fw-bold'>
                {isCreate ? "Create" : "Update"} TimeTable
            </DialogTitle>
            <Divider />
            <form onSubmit={formik.handleSubmit}>
                <DialogContent className='d-flex flex-column gap-4'>
                    <div className="d-flex flex-column">
                        <label>Shift Title</label>
                        <input type="text" className="form-control" {...formik.getFieldProps('title')}/>
                    </div>
                    <div className="d-flex flex-row justify-content-between gap-3">
                        <div className="d-flex flex-column w-50">
                            <label>Start Working Time</label>
                            <input type="time" className="form-control" {...formik.getFieldProps('start_working_time')}/>
                        </div>
                        <div className="d-flex flex-column w-50">
                            <label>End Working Time</label>
                            <input type="time" className="form-control" {...formik.getFieldProps('end_working_time')}/>
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-between gap-3">
                        <div className="d-flex flex-column w-50">
                            <label>Early Time-In</label>
                            <input type="time" className="form-control" {...formik.getFieldProps('early_time_in')}/>
                        </div>
                        <div className="d-flex flex-column w-50">
                            <label>Late Time-In</label>
                            <input type="time" className="form-control" {...formik.getFieldProps('late_time_in')}/>
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-between gap-3">
                        <div className="d-flex flex-column w-50">
                            <label>Break-In Time</label>
                            <input type="time" className="form-control" {...formik.getFieldProps('break_in')}/>
                        </div>
                        <div className="d-flex flex-column w-50">
                            <label>Break-Out Time</label>
                            <input type="time" className="form-control" {...formik.getFieldProps('break_out')}/>
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-between gap-3">
                        <div className="d-flex flex-column w-50">
                            <label>Valid Check-Out Time</label>
                            <input type="time" className="form-control" {...formik.getFieldProps('valid_check_out')}/>
                        </div>
                        <div className="d-flex flex-column w-50">
                            <label>Late Check-Out Time</label>
                            <input type="time" className="form-control" {...formik.getFieldProps('late_check_out')}/>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <label>Color</label>
                        <div className='d-flex flex-row'>
                            <input
                                type="color"
                                className="p-0 m-0 border-0 rounded border-white"
                                style={{height: "50px", width: "50px"}}
                                {...formik.getFieldProps('color')}
                            />
                        </div>
                    </div>
                </DialogContent>
                <Divider />
                <DialogActions className='d-flex flex-row justify-content-start'>
                    <button className="btn btn-primary" disabled={formik.isSubmitting}>
                        {formik.isSubmitting && <div className='spinner-border spinner-border-sm'></div>}
                        Save
                    </button>
                    <button type="reset" className="btn btn-danger" onClick={() => handleModalState()} disabled={formik.isSubmitting}>Close</button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    );
};
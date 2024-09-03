import { Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import pb from "../../../global/pb";
import {useFormik} from 'formik';
import { GetActiveInstitution } from "../../../global/Helpers";
import { useAlert } from "../../../hooks/CustomHooks";
import ReportIcon from '@mui/icons-material/Report';
import CheckIcon from '@mui/icons-material/Check';

export default function EditSubject({subject, refresh}){
    const [selectedSubject, setSelectedSubject] = subject;
    const [open, setOpen] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [validatingSchedule, setValidatingSchedule] = useState(false);
    const [isConflictSchedule, setIsConflictSchedule] = useState(false);
    const [conflictSchedule, setConflictSchedule] = useState([]);
    const {id} = GetActiveInstitution();
    const alert = useAlert();
    
    const handleModalClose = () => {
        formik.resetForm();
        setIsConflictSchedule(false);
        setSelectedSubject(null);
    };
    
    const handleSubmit = async (values) => {
        formik.setSubmitting(true);
        try {
            await pb.collection("section_subjects")
            .update(selectedSubject.id, values);
            alert.setAlert("success", "Subject Updated");
            handleModalClose();
            refresh();
        } catch (error) {
            console.log(error);
            alert.setAlert("error", "Failed to update Subject");
        } finally {
            formik.setSubmitting(false);
        }
    };
    
    const formik = useFormik({
        initialValues:{
            title: selectedSubject?.title,
            start_time: selectedSubject?.start_time,
            end_time: selectedSubject?.end_time,
            schedule: selectedSubject?.schedule,
            assigned_teacher: selectedSubject?.expand?.assigned_teacher
        },
        onSubmit: handleSubmit,
        enableReinitialize: true
    });
    
    const handleFetchTeachers = async () => {
        try {
            const records = await pb.collection("user_relationships")
            .getFullList({
                expand: 'user,personal_info,roles',
                filter: `institutions~"${id}" && roles!~"fodxbvsy6176gxd"`
            });
            setTeachers(records);
        } catch (error) {
            alert.setAlert("error", "Failed to search teacher")
        }
    };
    
    const handleStartTimeChange = (value) => {
        if(formik.values.assigned_teacher !== undefined){
            handleValidateTeacherShcedule(formik.values.assigned_teacher);
        }
        formik.setFieldValue('start_time', value)
    };
    
    const handleValidateTeacherShcedule = async (id) => {
        setIsConflictSchedule(false);
        setValidatingSchedule(true)
        try {
            const records = await pb.collection("section_subjects")
            .getFullList({
                expand: `section`,
                filter: `assigned_teacher="${id}"&&start_time="${formik.values.start_time}"`
            });
            if(records.length > 0){
                setIsConflictSchedule(true);
                setConflictSchedule(records[0]);
            }
        } catch (error) {
            alert.setAlert("error", "Error on Validating Schedule");
        } finally {
            setValidatingSchedule(false);
        }
    };
    
    useEffect(() => {
        handleFetchTeachers();
    }, []);
    
    useEffect(() => {
        if(selectedSubject){
            setOpen(true);
        }else{
            setOpen(false);
        }
    }, [selectedSubject]);
    
    return(
        <Dialog open={open} fullWidth maxWidth="sm">
            <DialogTitle>{selectedSubject?.title}</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <div className="d-flex flex-column gap-2">
                        <input type="text" className="form-control" placeholder="Subject Title" value={formik.values.title} {...formik.getFieldProps("title")} disabled={formik.isSubmitting}/>
                        <div className="d-flex flex-row gap-3">
                            <div className="d-flex flex-column w-100">
                                <label htmlFor="start-time">Start Time</label>
                                <input id="start-time" type="time" className="form-control" value={formik.values.start_time} {...formik.getFieldProps("start_time")} onChange={(e) => handleStartTimeChange(e.target.value)} disabled={formik.isSubmitting}/>
                            </div>
                            <div className="d-flex flex-column w-100">
                                <label htmlFor="end-time">End Time</label>
                                <input id="end-time" type="time" className="form-control" value={formik.values.start_time} {...formik.getFieldProps("end_time")} disabled={formik.isSubmitting}/>
                            </div>
                        </div>
                        <label htmlFor="subject-schedule">Schedule</label>
                        <select id="subject-schedule" className="form-select" value={formik.values.schedule} disabled={formik.isSubmitting}>
                            <option value={`daily`}>Daily</option>
                            <option value={`mwf`}>Monday, Wednesday, Friday</option>
                            <option value={`tth`}>Tuesday, Thursday</option>
                            <option value={`weekends`}>Weekends</option>
                        </select>
                        <label htmlFor="teachers">Subject Teacher</label>
                        <Autocomplete
                            disabled={formik.isSubmitting || validatingSchedule}
                            id="teachers"
                            options={teachers}
                            fullWidth
                            disableClearable
                            getOptionDisabled={(option) => option.id === "sample"}
                            onChange={(event, newValue) =>{
                                handleValidateTeacherShcedule(newValue.id);
                                formik.setFieldValue("assigned_teacher", newValue.id);
                            }}
                            defaultValue={selectedSubject?.expand?.assigned_teacher}
                            getOptionLabel={(option) => `${String(option.expand?.personal_info.last_name).toUpperCase()} ${String(option.expand?.personal_info.first_name).toUpperCase()}`}
                            renderInput={(params) => <TextField
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                        { isConflictSchedule ?
                                             <ReportIcon color="error" />
                                          : validatingSchedule ?
                                            <div className="spinner-border spinner-border-sm"></div>
                                          : formik.values.assigned_teacher ?
                                            <CheckIcon className="text-success"/>
                                          : params.InputProps.endAdornment
                                        }
                                        </>
                                    )
                                }}
                                />}
                        />
                        {isConflictSchedule && (
                            <p className="text-danger">Conflicting Schedule: {`${conflictSchedule.expand.section.grade_level}-${conflictSchedule.expand.section.title}`}: {conflictSchedule.title}</p>
                        )}
                    </div>
                </DialogContent>
                <DialogActions className="d-flex justify-content-start p-2">
                    <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting || validatingSchedule}>
                        {formik.isSubmitting ? <div className="spinner-border spinner-border-sm"></div> : "Update"}
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => handleModalClose()} disabled={formik.isSubmitting || validatingSchedule}>Cancel</button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
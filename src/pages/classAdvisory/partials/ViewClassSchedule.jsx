import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import pb from "../../../global/pb";
import AddSubject from "../../sections/partials/AddSubject";
import { GetActiveInstitution } from "../../../global/Helpers";
import { useAlert } from "../../../hooks/CustomHooks";
import EditIcon from '@mui/icons-material/Edit';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import EditSubject from "../../sections/partials/EditSubject";

export default function ViewClassSchedule({section, refresh}){
    const [open, setOpen] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    return(
        <>
        <Button variant="contained" className='fw-bolder me-2' onClick={() => handleModalState()}>VIEW SUBJECTS</Button>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className="fw-bolder">CLASS SCHEDULE</DialogTitle>
            <DialogContent className="d-flex flex-column" dividers>
                <div className="ms-auto mb-3">
                    <AddSubject selectedSection={section} refresh={refresh}/>
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th width={`35%`}>SUBJECT</th>
                            <th width={`15%`}>SCHEDULE</th>
                            <th width={`40%`}>TEACHER</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {section?.subjects.length > 0 && section?.subjects.map((subject, index) => (
                            <tr key={subject.id}>
                                <td className="fw-bold text-uppercase">{subject?.title}</td>
                                <td className="fw-bold text-uppercase">{subject?.start_time} - {subject?.end_time}</td>
                                <td className="fw-bold text-uppercase">
                                {subject?.subject_teacher === null ? (
                                    <div className="d-flex flex-row gap-2 align-items-center">
                                        <ReportProblemIcon color="error"/>
                                        <p className="m-0 text-danger">NO TEACHER ASSIGNED!</p>
                                    </div>
                                )
                                :
                                (<p className="m-0">{subject?.subject_teacher?.last_name}, {subject?.subject_teacher?.first_name}</p>)
                                }
                                </td>
                                <td>
                                    <EditSubject subject={subject} refresh={refresh}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DialogContent>
            <DialogActions>
                <button className="btn btn-danger" onClick={() => handleModalState()}>Close</button>
            </DialogActions>
        </Dialog>
        </>
    );
};
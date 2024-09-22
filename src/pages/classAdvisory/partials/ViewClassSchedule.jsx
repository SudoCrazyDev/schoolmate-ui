import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import pb from "../../../global/pb";
import AddSubject from "../../sections/partials/AddSubject";
import { GetActiveInstitution } from "../../../global/Helpers";
import { useAlert } from "../../../hooks/CustomHooks";
import EditIcon from '@mui/icons-material/Edit';

export default function ViewClassSchedule({section}){
    const [open, setOpen] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const {id} = GetActiveInstitution();
    const [fetching, setFetching] = useState(false);
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
                    {/* <AddSubject selectedSection={section} handleFetchSectionSubjects={handleFetchSectionSubjects}/> */}
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>SUBJECT</th>
                            <th>SCHEDULE</th>
                            <th>TEACHER</th>
                        </tr>
                    </thead>
                    <tbody>
                        {section?.subjects.length > 0 && section?.subjects.map((subject, index) => (
                            <tr key={subject.id}>
                                <td className="fw-bold text-uppercase">{subject?.title}</td>
                                <td className="fw-bold text-uppercase">{subject?.start_time} - {subject?.end_time}</td>
                                <td className="fw-bold text-uppercase">{subject?.subject_teacher?.last_name}, {subject?.subject_teacher?.first_name}</td>
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
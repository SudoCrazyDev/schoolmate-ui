import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import axios from 'axios';
import { axiosErrorCodeHandler, GetActiveInstitution } from "../../../global/Helpers";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAlert } from "../../../hooks/CustomHooks";

export default function CreateCardTemplate({refresh}){
    const [open, setOpen] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState("");
    const [newSubjectMatch, setNewSubjectMatch] = useState("");
    const [isEmpty, setIsEmpty] = useState(false);
    const [templateTitle, setTemplateTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const institution = GetActiveInstitution();
    const alert = useAlert();
    
    const handleOpenModal = () => {
        setOpen(!open);
        setSubjects([]);
    };

    const handleAddSubject = () => {
        if(newSubject == ''){
            setIsEmpty(true);
            return
        }
        setSubjects(prevState => [...prevState,
            {
                card_subject: newSubject,
                subject_to_match: newSubjectMatch,
                slug: newSubject.replaceAll(" ", "-").toLowerCase()
            }]);
        setNewSubject("");
        setNewSubjectMatch("");
    };

    const handleRemoveSubject = (slug) => {
        setSubjects(prevState => prevState.filter(subject => subject.slug != slug));
    };

    const handleAdjustSubjectPosition = (currentIndex, direction) => {
        setSubjects(prevSubjects => {
            const newIndex = currentIndex + direction;
            const newSubjects = [...prevSubjects];
            const elementToMove = newSubjects.splice(currentIndex, 1)[0];
            newSubjects.splice(newIndex, 0, elementToMove);

        return newSubjects;
        });
    };
    
    const handleSubmit = async () => {
        setSubmitting(true);
        const data = {
            institution_id: institution.id,
            title: templateTitle,
            subjects: JSON.stringify(subjects)
        };
        await axios.post('card_templates/add', data)
        .then(() => {
            handleOpenModal();
            refresh();
            alert.setAlert('success', 'Template Created');
        })
        .catch(err => {
            alert.setAlert('success', axiosErrorCodeHandler(err));
        })
        .finally(() => {
            setSubmitting(false);
        })
    };

    useEffect(() => {
        if(isEmpty){
            setTimeout(() => {
                setIsEmpty(false);
            }, 1500);
        }
    }, [isEmpty]);
    
    return(
        <>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>New Template</button>
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle className="fw-bolder">Create New Template</DialogTitle>
            <Divider />
            <DialogContent>
                <div className="d-flex flex-column">
                    <div className="d-flex flex-row gap-2 mb-5">
                        <input type="text" className={`form-control`} placeholder="Template Title/Description Eg.(Card Template for G8)" value={templateTitle} onChange={(e) => setTemplateTitle(e.target.value)}/>
                    </div>
                    <div className="d-flex flex-column gap-2 align-items-start">
                    <input type="text" className={`form-control ${isEmpty ? 'border border-danger' : ''}`} placeholder="Subject that will show on card" value={newSubject} onChange={(e) => setNewSubject(e.target.value)}/>
                    <input type="text" className={`form-control ${isEmpty ? 'border border-danger' : ''}`} placeholder="Subject that will match the teacher subject" value={newSubjectMatch} onChange={(e) => setNewSubjectMatch(e.target.value)}/>
                    <button className="btn btn-sm btn-primary w-100" onClick={() => handleAddSubject()}>Add</button>
                    <p className="m-0 text-muted fst-italic">Note: Always check for spelling, 2nd Input must be same with what the teacher encoded.</p>
                    </div>
                    <hr />
                    <div className="mt-3 d-flex flex-column align-items-center">
                        {subjects.length == 0 && (
                            <p className="fw-bolder">NO SUBJECTS</p>
                        )}
                        {subjects.map((subject, i) => (
                            <div key={i} className="py-1 d-flex flex-row gap-2 w-100 align-items-center">
                                <input type="text" className="form-control" defaultValue={`${subject.card_subject} (${subject.subject_to_match})`} disabled/>
                                <IconButton color="primary" size="small" onClick={() => handleAdjustSubjectPosition(i, -1)} disabled={i == 0}>
                                    <KeyboardArrowUpIcon fontSize="inherit"/>
                                </IconButton>
                                <IconButton color="primary" size="small" onClick={() => handleAdjustSubjectPosition(i, +1)} disabled={i == subjects.length - 1}>
                                    <KeyboardArrowDownIcon fontSize="inherit"/>
                                </IconButton>
                                <IconButton color="error" size="small" onClick={() => handleRemoveSubject(subject.slug)}>
                                    <DeleteIcon fontSize="inherit"/>
                                </IconButton>
                            </div>
                        ))}
                    </div>
                    <hr />
                </div>
            </DialogContent>
            <DialogActions className="d-flex flex-row justify-content-start">
                <button className={`btn ${submitting ? 'btn-success' : 'btn-primary'}`} onClick={() => handleSubmit()} disabled={subjects.length == 0 || submitting}>
                    {submitting && <div className="spinner-border spinner-border-sm"></div>}Submit
                </button>
                <button className="btn btn-danger" disabled={submitting} onClick={() => handleOpenModal()}>Cancel</button>
            </DialogActions>
        </Dialog>
        </>
    );
};
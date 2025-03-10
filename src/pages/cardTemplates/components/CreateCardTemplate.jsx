import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import axios from 'axios';
import { GetActiveInstitution } from "../../../global/Helpers";

export default function CreateCardTemplate({refresh}){
    const [open, setOpen] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState("");
    const [isEmpty, setIsEmpty] = useState(false);
    const [templateTitle, setTemplateTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const institution = GetActiveInstitution();
    
    const handleOpenModal = () => {
        setOpen(!open);
        setSubjects([]);
    };
    
    const handleAddSubject = () => {
        if(newSubject == ''){
            setIsEmpty(true);
            return
        }
        setSubjects(prevState => [...prevState, {title: newSubject, slug: String(newSubject).replaceAll(" ", "-").toLowerCase()}]);
        setNewSubject("");
    };
    
    const handleRemoveSubject = (slug) => {
        setSubjects(prevState => prevState.filter(subject => subject.slug != slug));
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
        })
        .catch(() => {
            
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
                <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-row gap-2">
                        <input type="text" className={`form-control`} placeholder="Template Title/Description Eg.(Card Template for G8)" value={templateTitle} onChange={(e) => setTemplateTitle(e.target.value)}/>
                    </div>
                    <div className="d-flex flex-row gap-2 align-items-start">
                        <div className="d-flex flex-column w-100">
                            <input type="text" className={`form-control ${isEmpty ? 'border border-danger' : ''}`} placeholder="Subject Title" value={newSubject} onChange={(e) => setNewSubject(e.target.value)}/>
                            <p className="fw-light fst-italic text-secondary" style={{fontSize: '12px'}}>Note: always check the spelling.</p>
                        </div>
                        <button className="btn btn-sm btn-primary" onClick={() => handleAddSubject()}>Add</button>
                    </div>
                    <div className="mt-3 d-flex flex-column align-items-center">
                        {subjects.length == 0 && (
                            <p className="fw-bolder">ADD SOME SUBJECTS</p>
                        )}
                        {subjects.map((subject, i) => (
                            <div key={i} className="py-1 d-flex flex-row gap-2 w-100">
                                <input type="text" className="form-control" value={subject.title} disabled/>
                                <button className="btn btn-sm btn-danger" onClick={() => handleRemoveSubject(subject.slug)}>X</button>
                            </div>
                        ))}
                    </div>
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
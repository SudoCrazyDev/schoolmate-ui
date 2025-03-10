import axios from "axios";
import { GetActiveInstitution } from "../../global/Helpers";
import CreateCardTemplate from "./components/CreateCardTemplate";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function CardTemplates(){
    const institution = GetActiveInstitution();
    const [cardTemplates, setCardTemplates] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [newSubject, setNewSubject] = useState("");
    const [isEmpty, setIsEmpty] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const handleFetchCardTemplates = async () => {
        setFetching(true);
        await axios.get(`card_templates/institutions/${institution.id}`)
        .then((res) => {
            setCardTemplates(res.data);
        })
        .finally(() => {
            setFetching(false);
        });
    };
    
    const handleAddSubject = () => {
        let mutableTemplate = {...selectedTemplate};
        let subjects = JSON.parse(mutableTemplate.subjects);
        if(subjects.filter(subject => String(subject.title).replaceAll(" ", "-").toLowerCase() === String(newSubject).replaceAll(" ", "-").toLowerCase()).length === 0){
            subjects.push({title: newSubject, slug: String(newSubject).replaceAll(" ", "-").toLowerCase()});
            delete mutableTemplate['subjects'];
            Object.assign(mutableTemplate, {subjects: JSON.stringify(subjects)});
            setSelectedTemplate(mutableTemplate);
            setNewSubject("");
        }
    };
    
    const handleRemoveSubject = (slug) => {
        let mutableTemplate = {...selectedTemplate};
        let subjects = JSON.parse(mutableTemplate.subjects);
        let filteredSubjects = subjects.filter(subject => subject.slug !== slug);
        Object.assign(mutableTemplate, {subjects: JSON.stringify(filteredSubjects)});
        setSelectedTemplate(mutableTemplate);
    };
    
    const handleUpdateTemplate = async () => {
        setSubmitting(true);
        const data = {
            card_template_id: selectedTemplate.id,
            title: selectedTemplate.title,
            subjects: selectedTemplate.subjects
        }
        await axios.post('card_templates/update', data)
        .then(() => {
            setSuccess(true);
        })
        .finally(() => {
            setSubmitting(false);
        });
    };
    
    useEffect(() => {
        if(success){
            setTimeout(() =>{
                setSuccess(false);
            }, 1500);
        }
    }, [success]);
    
    useEffect(() => {
        handleFetchCardTemplates();
    }, []);

    return(
        <div className="d-flex flex-column gap-3">
            <div className="card">
                <div className="card-body d-flex flex-row">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">Report Card Templates</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>view or create report card templates for sections.</p>
                    </div>
                    <div className="ms-auto">
                        <CreateCardTemplate refresh={handleFetchCardTemplates}/>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-row gap-3">
                <div className="col-4">
                    <div className="card">
                        <div className="card-body d-flex flex-column gap-2">
                            {cardTemplates.map(cardTemplate => (
                                <div key={cardTemplate.id} className="d-flex flex-row p-2 shadw-lg border rounded align-items-center">
                                    <p className="m-0 fw-bolder">{String(cardTemplate.title).toUpperCase()}</p>
                                    <div className="ms-auto">
                                        <IconButton size="small" color="primary" onClick={() => setSelectedTemplate(cardTemplate)}>
                                            <CreateIcon fontSize="inherit"/>
                                        </IconButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-8">
                    <div className="card">
                        <div className="card-body">
                            {selectedTemplate && (
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex flex-row gap-2">
                                        <input type="text" className="form-control bg-white" value={selectedTemplate.title} disabled/>
                                    </div>
                                    <div className="d-flex flex-row gap-2 align-items-start">
                                        <div className="d-flex flex-column w-100">
                                            <input type="text" className={`form-control ${isEmpty ? 'border border-danger' : ''}`} placeholder="Subject Title" value={newSubject} onChange={(e) => setNewSubject(e.target.value)}/>
                                            <p className="fw-light fst-italic text-secondary" style={{fontSize: '12px'}}>Note: always check the spelling.</p>
                                        </div>
                                        <button className="btn btn-sm btn-primary" onClick={() => handleAddSubject()}>Add</button>
                                    </div>
                                    <div className="mt-3 d-flex flex-column align-items-center">
                                        {JSON.parse(selectedTemplate.subjects).length == 0 && (
                                            <p className="fw-bolder">ADD SOME SUBJECTS</p>
                                        )}
                                        {JSON.parse(selectedTemplate.subjects).map((subject, i) => (
                                            <div key={i} className="py-1 d-flex flex-row gap-2 w-100">
                                                <input type="text" className="form-control" value={subject.title} disabled/>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleRemoveSubject(subject.slug)}>X</button>
                                            </div>
                                        ))}
                                        <button className={`btn btn-sm ${success ? 'btn-success' : 'btn-primary'} align-self-start mt-3`} onClick={() => handleUpdateTemplate()} disabled={submitting}>
                                            {submitting ? 'Submitting' : 'Update'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
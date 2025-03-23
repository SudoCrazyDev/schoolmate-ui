import axios from "axios";
import { axiosErrorCodeHandler, GetActiveInstitution } from "../../global/Helpers";
import CreateCardTemplate from "./components/CreateCardTemplate";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAlert } from "../../hooks/CustomHooks";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function CardTemplates(){
    const institution = GetActiveInstitution();
    const [cardTemplates, setCardTemplates] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedTemplateSubjects, setSelectedTemplateSubjects] = useState([]);
    const [selectedTemplateTitle, setSelectedTemplateTitle] = useState("");
    const [newSubjectMatch, setNewSubjectMatch] = useState("");
    const [newSubject, setNewSubject] = useState("");
    const [isEmpty, setIsEmpty] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const alert = useAlert();
    
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
        setSelectedTemplateSubjects(prevSubjects => {
            return [...prevSubjects, {card_subject: newSubject, subject_to_match: newSubjectMatch, slug: String(newSubject).replaceAll(" ", "-").toLowerCase()}]
        });
        setNewSubject("");
        setNewSubjectMatch("");
    };
    
    const handleRemoveSubject = (slug) => {
        setSelectedTemplateSubjects(prevSubjects => {
            const newSubjects = [...prevSubjects];
            const filteredSubjects = newSubjects.filter(subject => subject.slug !== slug);
        return filteredSubjects;
        });
    };
    
    const handleAdjustSubjectPosition = (currentIndex, direction) => {
        setSelectedTemplateSubjects(prevSubjects => {
            const newIndex = currentIndex + direction;
            const newSubjects = [...prevSubjects];
            const elementToMove = newSubjects.splice(currentIndex, 1)[0];
            newSubjects.splice(newIndex, 0, elementToMove);
        return newSubjects;
        });
    };
    
    const handleSetSelectedTemplate = (cardTemplate) => {
        setSelectedTemplateSubjects(JSON.parse(cardTemplate.subjects));
        setSelectedTemplate(cardTemplate);
        setSelectedTemplateTitle(cardTemplate.title);
    };
    
    const handleUpdateTemplate = async () => {
        setSubmitting(true);
        const data = {
            card_template_id: selectedTemplate.id,
            title: selectedTemplateTitle,
            subjects: selectedTemplateSubjects
        }
        await axios.post('card_templates/update', data)
        .then(() => {
            alert.setAlert('success', 'Card Template Updated');
            handleFetchCardTemplates();
            setSelectedTemplateSubjects([]);
            setSelectedTemplate(null);
            setSelectedTemplateTitle("");
        })
        .catch(err => {
            alert.setAlert('error', axiosErrorCodeHandler(err));
        })
        .finally(() => {
            setSubmitting(false);
        });
    };
    
    const handleDuplicateTemplate = async (template) => {
        delete template.id;
        setSubmitting(true);
        const data = {
            ...template,
            title: template.title + " (Copy)"
        }
        await axios.post('card_templates/add', data)
        .then(() => {
            alert.setAlert('success', 'Card Template Duplicated!');
            handleFetchCardTemplates();
        })
        .catch(err => {
            alert.setAlert('error', axiosErrorCodeHandler(err));
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
                                    <div className="ms-auto d-flex flex-row">
                                        <IconButton size="small" color="primary" onClick={() => handleDuplicateTemplate(cardTemplate)}>
                                            <ContentCopyIcon fontSize="inherit"/>
                                        </IconButton>
                                        <IconButton size="small" color="primary" onClick={() => handleSetSelectedTemplate(cardTemplate)}>
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
                                        <input type="text" className="form-control bg-white" value={selectedTemplateTitle} onChange={(e) => setSelectedTemplateTitle(e.target.value)}/>
                                    </div>
                                    <div className="d-flex flex-column gap-2 align-items-start">
                                    <input type="text" className={`form-control ${isEmpty ? 'border border-danger' : ''}`} placeholder="Subject that will show on card" value={newSubject} onChange={(e) => setNewSubject(e.target.value)}/>
                                    <input type="text" className={`form-control ${isEmpty ? 'border border-danger' : ''}`} placeholder="Subject that will match the teacher subject" value={newSubjectMatch} onChange={(e) => setNewSubjectMatch(e.target.value)}/>
                                    <button className="btn btn-sm btn-primary w-100" onClick={() => handleAddSubject()}>Add</button>
                                    </div>
                                    <div className="mt-3 d-flex flex-column align-items-center">
                                        {selectedTemplateSubjects.length == 0 && (
                                            <p className="fw-bolder">ADD SOME SUBJECTS</p>
                                        )}
                                        {selectedTemplateSubjects.map((subject, i) => (
                                            <div key={crypto.randomUUID()} className="py-1 d-flex flex-row gap-2 w-100">
                                                <input type="text" className="form-control" defaultValue={`${subject.card_subject} (${subject.subject_to_match})`} disabled/>
                                                <IconButton color="primary" size="small" onClick={() => handleAdjustSubjectPosition(i, -1)} disabled={i == 0}>
                                                    <KeyboardArrowUpIcon fontSize="inherit"/>
                                                </IconButton>
                                                <IconButton color="primary" size="small" onClick={() => handleAdjustSubjectPosition(i, +1)} disabled={i == selectedTemplateSubjects.length - 1}>
                                                    <KeyboardArrowDownIcon fontSize="inherit"/>
                                                </IconButton>
                                                <IconButton color="error" size="small" onClick={() => handleRemoveSubject(subject.slug)}>
                                                    <DeleteIcon fontSize="inherit"/>
                                                </IconButton>
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
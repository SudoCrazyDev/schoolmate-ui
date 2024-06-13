import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAlert } from "../../../hooks/CustomHooks";
import pb from "../../../global/pb";
import Autocomplete from '@mui/material/Autocomplete';
import { GetActiveInstitution } from "../../../global/Helpers";

export default function AutoCreateSections(){
    const [open, setOpen] = useState(false);
    const [newSubject, setNewSubject] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [sections, setSections] = useState([]);
    const [section, setSection] = useState("");
    const [selectedAdviser, setSelectedAdviser] = useState(null);
    const [fetchingTeachers, setFetchingTeachers] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [overallProgress, setOverAllProgress] = useState(0);
    const {id} = GetActiveInstitution();
    const alert = useAlert();

    const handleModalState = () => {
        setNewSubject("");
        setStartTime("");
        setEndTime("");
        setSubjects([]);
        setTeachers([]);
        setSections([]);
        setSection([]);
        setSelectedAdviser(null);
        setFetchingTeachers(false);
        setSubmitting(false);
        setOverAllProgress(0);
        setOpen(!open);
    };

    const handleAddSubject = () => {
        if(newSubject === ""){
            alert.setAlert("error", "Invalid Subject Title");
            return;
        }
        if(startTime === ""){
            alert.setAlert("error", "Start Time cannot be empty");
            return ;
        }
        if(endTime === ""){
            alert.setAlert("error", "End Time cannot be empty");
            return ;
        }
        
        setSubjects(prevState => [...prevState,
            {
                temp_id: crypto.randomUUID(),
                subject: newSubject,
                start_time: startTime,
                end_time: endTime
            }
        ]);
        setNewSubject("");
        setStartTime("");
        setEndTime("");
    };

    const handleRemoveSubject = (temp_id) => {
        setSubjects(prevState => prevState.filter(el => el.temp_id !== temp_id));
    };

    const handleFetchTeachers = async () => {
        setFetchingTeachers(true);
        try {
            const records = await pb.collection("user_relationships")
            .getFullList({
                expand: 'user,personal_info,roles',
                filter: `institutions~"${id}" && roles!~"fodxbvsy6176gxd"`
            });
            setTeachers(records);
        } catch (error) {
            alert.setAlert("error", "Failed to search teacher")
        } finally {
            setFetchingTeachers(false);
        }
    };

    const handleAddSection = () => {
        if(section === ""){
            alert.setAlert("error", 'Section cannot be empty');
            return ;
        }
        if(selectedAdviser === null){
            alert.setAlert("error", 'Adviser cannot be empty');
            return ;
        }
        setSections(prevState => [...prevState, {
            temp_id: crypto.randomUUID(),
            title: section,
            adviser: selectedAdviser
        }]);
        setSection("");
        setSelectedAdviser(null);
    };

    const handleRemoveSection = (temp_id) => {
        setSections(prevState => prevState.filter(el => el.temp_id !== temp_id));
    };

    const handleSubmitGenerate = async () => {
        if(sections.length < 1){
            alert.setAlert('error', 'No Sections');
            return ;
        }
        if(subjects.length < 1){
            alert.setAlert('error', 'No Subjects');
            return ;
        }
        setSubmitting(true);
        try {
            for(let i = 0; i < sections.length; i++){
                setOverAllProgress(i);
                const section_record = await pb.collection("institution_sections")
                .create({
                    institution: id,
                    academic_year: '2024-2025',
                    grade_level: 7,
                    title: sections[i].title,
                    class_adviser: sections[i].adviser.expand.personal_info.id,
                });
                await new Promise((resolve) => setTimeout(resolve, 1500));
                for(let j = 0; j < subjects.length; j++){
                    await pb.collection("section_subjects")
                    .create({
                        institution: id,
                        section: section_record.id,
                        title: subjects[j].subject,
                        start_time: subjects[j].start_time,
                        end_time: subjects[j].end_time
                    });
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                }
            }
            alert.setAlert('success', 'Sections with Subjects created successfully');
        } catch (error) {
            alert.setAlert("error", 'An error occured during generating')
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if(open){
            handleFetchTeachers();
        }
    }, [open]);

    return(
        <>
        <button className="fw-bolder btn btn-primary" onClick={() => handleModalState()}>Auto-Generate</button>
        <Dialog open={open} fullScreen>
            <DialogTitle className="fw-bolder text-uppercase">Auto Generate Subjects and Sections</DialogTitle>
                <DialogContent dividers>
                    <div className="d-flex flex-column">
                        {submitting && (
                            <div className="progress mb-3" role="progressbar" aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: `${(Number(overallProgress)/sections.length) * 100}%`}}>{overallProgress}/{sections.length}</div>
                            </div>
                        )}
                        <h2>Create Subjects</h2>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th width={`5%`}></th>
                                    <th>Subject</th>
                                    <th>START TIME</th>
                                    <th>END TIME</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map(subject => (
                                    <tr key={subject.temp_id}>
                                        <td>
                                            <IconButton color="error" onClick={() => handleRemoveSubject(subject.temp_id)}>
                                                <RemoveCircleIcon fontSize="medium"/>
                                            </IconButton>
                                        </td>
                                        <td style={{verticalAlign: 'middle'}}>
                                            {subject.subject}
                                        </td>
                                        <td style={{verticalAlign: 'middle'}}>
                                            {subject.start_time}
                                        </td>
                                        <td style={{verticalAlign: 'middle'}}>
                                            {subject.end_time}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>
                                        <IconButton color="primary" onClick={() => handleAddSubject()}>
                                            <AddCircleIcon fontSize="medium"/>
                                        </IconButton>
                                    </td>
                                    <td>
                                        <input type="text" className="form-control" value={newSubject} onChange={(e) => setNewSubject(e.target.value)}/>
                                    </td>
                                    <td>
                                        <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)}/>
                                    </td>
                                    <td>
                                        <input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h2>Create Sections</h2>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th width={`5%`}></th>
                                    <th>Section</th>
                                    <th>Adviser</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections.map(section => (
                                    <tr key={section.temp_id}>
                                        <td style={{verticalAlign: "middle"}}>
                                            <IconButton color="error" onClick={() => handleRemoveSection(section.temp_id)}>
                                                <RemoveCircleIcon fontSize="medium"/>
                                            </IconButton>
                                        </td>
                                        <td style={{verticalAlign: "middle"}}>
                                            {section.title}
                                        </td>
                                        <td style={{verticalAlign: "middle"}}>
                                            {section.adviser.expand.personal_info.first_name} {section.adviser.expand.personal_info.last_name}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td style={{verticalAlign: "middle"}}>
                                        <IconButton color="primary" onClick={() => handleAddSection()}>
                                            <AddCircleIcon fontSize="medium"/>
                                        </IconButton>
                                    </td>
                                    <td style={{verticalAlign: "middle"}}>
                                        <input type="text" className="form-control" value={section} onChange={(e) => setSection(e.target.value)}/>
                                    </td>
                                    <td>
                                        <Autocomplete
                                            disabled={fetchingTeachers}
                                            id="teachers"
                                            options={teachers}
                                            fullWidth
                                            disableClearable
                                            getOptionDisabled={(option) => option.id === "sample"}
                                            onChange={(event, newValue) =>{
                                                setSelectedAdviser(newValue);
                                            }}
                                            getOptionLabel={(option) => `${String(option.expand?.personal_info.last_name).toUpperCase()} ${String(option.expand?.personal_info.first_name).toUpperCase()}`}
                                            renderInput={(params) => <TextField {...params} label="Subject Teacher" />}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
                <DialogActions className="mt-auto d-flex justify-content-start">
                    <button className="btn btn-primary" onClick={() => handleSubmitGenerate()} disabled={submitting}>
                        {submitting ? <div className="spinner-border spinner-border-sm"></div> : "Generate"}
                    </button>
                    <button className="btn btn-danger" onClick={() => handleModalState()} disabled={submitting}>Cancel</button>
                </DialogActions>
        </Dialog>
        </>
    );
};
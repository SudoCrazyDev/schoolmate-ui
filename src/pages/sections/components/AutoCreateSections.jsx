import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useAlert } from "../../../hooks/CustomHooks";
import pb from "../../../global/pb";
import Autocomplete from '@mui/material/Autocomplete';
import { GetActiveInstitution } from "../../../global/Helpers";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function AutoCreateSections({allowedGradeLevel}){
    const [open, setOpen] = useState(false);
    const [newSubject, setNewSubject] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [schedule, setSchedule] = useState("daily");
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
    const [selectedGradeLevel, setSelectedGradeLevel] = useState("");
    const {roles} = useSelector(state => state.user);
    const [progressDetails, setProgressDetails] = useState("7");

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
                end_time: endTime,
                schedule: schedule
            }
        ]);
        setNewSubject("");
        setStartTime("");
        setEndTime("");
        setSchedule("daily");
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
        if(selectedGradeLevel === ""){
            alert.setAlert('error', 'No Grade Level');
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
                    grade_level: selectedGradeLevel,
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
                        end_time: subjects[j].end_time,
                        schedule: subjects[j].schedule
                    });
                    setProgressDetails(`${sections[i].title} - ${subjects[j].subject}`);
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                }
            }
            alert.setAlert('success', 'Sections with Subjects created successfully');
            handleModalState();
        } catch (error) {
            alert.setAlert("error", 'An error occured during generating')
        } finally {
            setSubmitting(false);
        }
    };

    const handleSelectedGradeLevel = () => {
        if(roles[0].title === "Curriculum Head - 7"){
            setSelectedGradeLevel("7");
        }
        if(roles[0].title === "Curriculum Head - 8"){
            setSelectedGradeLevel("8");
        }
        if(roles[0].title === "Curriculum Head - 9"){
            setSelectedGradeLevel("9");
        }
        if(roles[0].title === "Curriculum Head - 10"){
            setSelectedGradeLevel("10");
        }
        if(roles[0].title === "Curriculum Head - 11"){
            setSelectedGradeLevel("11");
        }
        if(roles[0].title === "Curriculum Head - 12"){
            setSelectedGradeLevel("12");
        }
        if(roles[0].title === "Principal"){
            // setSelectedGradeLevel("all");
        }
    };

    useEffect(() => {
        if(open){
            handleFetchTeachers();
            handleSelectedGradeLevel();
        }
    }, [open]);

    return(
        <>
        {/* <button className="fw-bolder btn btn-primary" onClick={() => handleModalState()}>Create Section</button> */}
        
        <Dialog open={open} fullScreen>
            <DialogTitle className="fw-bolder text-uppercase">Create Section and Subject</DialogTitle>
                <DialogContent dividers>
                    <div className="d-flex flex-column">
                        {submitting && (
                            <div className="d-flex flex-column">
                                <div className="progress mb-3" role="progressbar" aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: `${(Number(overallProgress)/sections.length) * 100}%`}}>{overallProgress}/{sections.length}</div>
                                </div>
                                <h5 className="fw-bolder">{progressDetails}</h5>
                            </div>
                        )}
                        {roles[0].title === "Principal" && (
                            <>
                            <h2 className="m-0 fw-bolder" style={{padding: '8px'}}>FOR: </h2>
                            <select className='form-select' onChange={(e) => setSelectedGradeLevel(e.target.value)}>
                                <option value={`7`}>Grade 7</option>
                                <option value={`8`}>Grade 8</option>
                                <option value={`9`}>Grade 9</option>
                                <option value={`10`}>Grade 10</option>
                                <option value={`11`}>Grade 11</option>
                                <option value={`12`}>Grade 12</option>
                            </select>
                            </>
                        )}
                        <h2>Create Subjects</h2>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th width={`5%`}></th>
                                    <th>Subject</th>
                                    <th>START TIME</th>
                                    <th>END TIME</th>
                                    <th>SCHEDULE</th>
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
                                        <td style={{verticalAlign: 'middle'}}>
                                            {subject.schedule}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>
                                        <IconButton id="add-subject" color="primary" onClick={() => handleAddSubject()}>
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
                                    <td>
                                        <select className="form-select" value={schedule} onChange={(e) => setSchedule(e.target.value)}>
                                            <option value={`daily`}>Daily</option>
                                            <option value={`mwf`}>Monday, Wednesday, Friday</option>
                                            <option value={`tth`}>Tuesday, Thursday</option>
                                            <option value={`weekends`}>Weekends</option>
                                            <option value={`mon`}>Monday</option>
                                            <option value={`tue`}>Tuesday</option>
                                            <option value={`wed`}>Wednesday</option>
                                            <option value={`thr`}>Thursday</option>
                                            <option value={`frd`}>Friday</option>
                                            <option value={`sat`}>Saturday</option>
                                        </select>
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
                                        <IconButton id="add-section" color="primary" onClick={() => handleAddSection()}>
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
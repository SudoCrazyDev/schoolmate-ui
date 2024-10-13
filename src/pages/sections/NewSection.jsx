import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { IconButton, TextField } from '@mui/material';
import { NavLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useAlert } from '../../hooks/CustomHooks';

export default function NewSection(){
    const [selectedGrade, setSelectedGrade] = useState("7");
    const [selectedSem, setSelectedSem] = useState("0");
    const {institutions} = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [selectedAdviser, setSelectedAdviser] = useState(null);
    const [sectionTitle, setSectionTitle] = useState("");
    const [subjectTitle, setSubjectTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    
    const alert = useAlert();

    const handleAddSection = () => {
        if(sectionTitle === ""){
            alert.setAlert("error", "Please Put Section Title");
            return ;
        }
        if(selectedAdviser === null){
            alert.setAlert("error", "Please select adviser");
            return ;
        }
        setSections([...sections, {
            section: `${selectedGrade}-${sectionTitle}`,
            adviser: `${String(selectedAdviser.first_name).toUpperCase()} ${String(selectedAdviser.last_name).toUpperCase()}`,
            class_adviser: selectedAdviser.id,
            institution_id: institutions[0].id,
            grade_level: selectedGrade,
            title: sectionTitle,
            academic_year: "2024-2025"
        }]);
        setSectionTitle("");
    };
    
    const handleAddSubject = () => {
        if(subjectTitle === ""){
            alert.setAlert("error", "Please put subjecet title");
            return ;
        }
        if(startTime === ""){
            alert.setAlert("error", "Please put start time");
            return ;
        }
        if(endTime === ""){
            alert.setAlert("error", "Please put end time");
            return ;
        }
        setSubjects([...subjects, {
            title: subjectTitle,
            start_time: startTime,
            end_time: endTime
        }]);
        setSubjectTitle("");
    };
    
    const handleRemoveSubject = (index) => {
        let new_subjects = subjects.filter((subject, i) => i !== index);
        setSubjects(new_subjects);
    };
    
    const handleRemoveSection = (index) => {
        let new_sections = sections.filter((sectioin, i) => i !== index);
        setSections(new_sections);
    };
    
    const handleFetchTeachers = async () => {
        setFetching(true);
        await axios.get(`users/all_by_institutions/${institutions[0].id}`)
        .then((res) => {
            let fetched = res.data.data;
            setUsers(fetched.sort((a,b) => a.last_name.localeCompare(b.last_name)));
        })
        .catch(err => {
            alert.setAlert('error', 'Failed to fetch Teachers');
        })
        .finally(() => {
            setFetching(false);
        });
    };

    const handleSubmit = async () => {
        if(sections.length === 0){
            alert.setAlert('error', 'No Sections!');
            return;
        }
        setSubmitting(true);
        for(let i = 0; i < sections.length; i++){
            await axios.post(`institution_sections/add_with_subjects`,{...sections[i], subjects: subjects})
            .then(res => {
                alert.setAlert('success', `${sections[i].title} Added!`)
            })
            .catch(() => {
                alert.setAlert('error', `Failed to create ${sections[i].title}!`)
            });
        }
        setSubmitting(false);
        setSections([]);
        setSubjects([]);
    };
    
    const handleGenerateSubjects = async () => {
        let defaultSubjects = [];
        if(selectedGrade === "7"){
            defaultSubjects = [
                {title: "Filipino", start_time: '07:30', end_time: '08:30'},
                {title: "English", start_time: '07:30', end_time: '08:30'},
                {title: "Mathematics", start_time: '07:30', end_time: '08:30'},
                {title: "Science", start_time: '07:30', end_time: '08:30'},
                {title: "Araling Panlipunan", start_time: '07:30', end_time: '08:30'},
                {title: "Edukasyon sa Pagpakatao", start_time: '07:30', end_time: '08:30'},
                {title: "TLE", start_time: '07:30', end_time: '08:30'},
                {title: "MAPEH", start_time: '07:30', end_time: '08:30'},
                {title: "Music & Arts", start_time: '07:30', end_time: '08:30'},
                {title: "PE & Health", start_time: '07:30', end_time: '08:30'},
            ];
        } else {
            defaultSubjects = [
                {title: "Filipino", start_time: '07:30', end_time: '08:30'},
                {title: "English", start_time: '07:30', end_time: '08:30'},
                {title: "Mathematics", start_time: '07:30', end_time: '08:30'},
                {title: "Science", start_time: '07:30', end_time: '08:30'},
                {title: "Araling Panlipunan", start_time: '07:30', end_time: '08:30'},
                {title: "Edukasyon sa Pagpakatao", start_time: '07:30', end_time: '08:30'},
                {title: "TLE", start_time: '07:30', end_time: '08:30'},
                {title: "MAPEH", start_time: '07:30', end_time: '08:30'},
                {title: "Music", start_time: '07:30', end_time: '08:30'},
                {title: "Arts", start_time: '07:30', end_time: '08:30'},
                {title: "PE", start_time: '07:30', end_time: '08:30'},
                {title: "HEALTH", start_time: '07:30', end_time: '08:30'},
            ];
        }
        setSubjects([...subjects, ...defaultSubjects]);
    };
    
    useEffect(() => {
        handleFetchTeachers();
    }, []);

    useEffect(() => {
        if(selectedGrade !== '11' || selectedGrade !== '12'){
            setSelectedSem(0);
        }
    }, [selectedGrade]);

    return(
        <div className="d-flex flex-column gap-2">
            <NavLink to={"/sections"}>
                <IconButton>
                    <KeyboardReturnIcon />
                </IconButton>
            </NavLink>
            <div className="card">
                <div className="card-body d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bold">Create Sections and Subjects</h2>
                        <p className='m-0'>Generate Multiple or Single Section along with the subjects.</p>
                    </div>
                    <div className="ms-auto">
                        <button className="btn btn-primary" onClick={() => handleSubmit()} disabled={submitting}>Create</button>
                    </div>
                </div>
            </div>
            <div className="mt-3 d-flex flex-row">
                <div className="col-6 p-2">
                    <div className="card">
                        <div className="card-body d-flex flex-column">
                            <h3 className="m-0 fw-bold">Sections</h3>
                            <hr className='m-0 mb-3 mt-2'/>
                            <div className="d-flex flex-column">
                                <h6 className="m-0">Generate For:</h6>
                                <select className='form-select' onChange={(e) => setSelectedGrade(e.target.value)}>
                                    <option value={"7"}>Grade 7</option>
                                    <option value={"8"}>Grade 8</option>
                                    <option value={"9"}>Grade 9</option>
                                    <option value={"10"}>Grade 10</option>
                                    <option value={"11"}>Grade 11</option>
                                    <option value={"12"}>Grade 12</option>
                                </select>
                                {(selectedGrade === '11' || selectedGrade === '12') && (
                                    <>
                                        <h6 className="m-0">For:</h6>
                                        <select className='form-select' onChange={(e) => setSelectedSem(e.target.value)}>
                                            <option value={"1"}>Sem 1</option>
                                            <option value={"2"}>Sem 2</option>
                                            <option value={"3"}>Sem 3</option>
                                            <option value={"4"}>Sem 4</option>
                                        </select>
                                    </>
                                )}
                            </div>
                            <form className="mt-3 d-flex flex-column gap-2">
                                <div className="d-flex flex-row gap-2">
                                <input type="text" value={sectionTitle} className="form-control text-uppercase" placeholder='Section Title' onChange={(e) => setSectionTitle(String(e.target.value).toUpperCase())} />
                                <Autocomplete
                                    disabled={fetching}
                                    id="teachers"
                                    options={users}
                                    fullWidth
                                    disableClearable
                                    onChange={(event, newValue) =>{
                                        setSelectedAdviser(newValue);
                                    }}
                                    getOptionLabel={(option) => `${String(option.last_name).toUpperCase()}, ${String(option.first_name).toUpperCase()}`}
                                    renderInput={(params) => <TextField {...params} label="Adviser" />}
                                />
                                </div>
                                <button type="button" className="w-100 btn btn-primary align-self-center" disabled={fetching || submitting} onClick={()=>handleAddSection()}>
                                    {(fetching || submitting) && <div className='spinner-border spinner-border-sm'></div>}
                                    ADD
                                </button>
                            </form>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th width={"45%"}></th>
                                        <th width={"45%"}></th>
                                        <th width={"5%"}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sections.map((section, i) => (
                                        <tr key={i}>
                                            <td style={{verticalAlign: 'middle'}}>{section.section}</td>
                                            <td style={{verticalAlign: 'middle'}}>{section.adviser}</td>
                                            <td style={{verticalAlign: 'middle'}}>
                                            <IconButton color="error" onClick={()=>handleRemoveSection(i)}>
                                                    <DeleteIcon fontSize="small" />
                                            </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-6 p-2">
                    <div className="card">
                        <div className="card-body">
                        <div className="d-flex flex-row">
                            <h3 className="m-0 fw-bold">Subjects</h3>
                            <div className="ms-auto">
                                <button className="btn btn-primary" onClick={() => handleGenerateSubjects()}>Generate</button>
                            </div>
                        </div>
                        <hr className='m-0 mb-3 mt-2'/>
                        <div className="d-flex flex-column">
                        <form className="mt-3 d-flex flex-column gap-2">
                                <div className="d-flex flex-row gap-2 align-items-end">
                                    <div className="d-flex flex-column">
                                        <label>Title</label>
                                        <input type="text" value={subjectTitle} className="form-control" onChange={(e) => setSubjectTitle(e.target.value)} />
                                    </div>
                                    <div className="d-flex flex-column">
                                        <label>Start Time</label>
                                        <input type="time" className="form-control" onChange={(e) => setStartTime(e.target.value)} />
                                    </div>
                                    <div className="d-flex flex-column">
                                        <label>End Time</label>
                                        <input type="time" className="form-control" onChange={(e) => setEndTime(e.target.value)} />
                                    </div>
                                </div>
                                <button type="button" className="w-100 btn btn-primary align-self-center" disabled={fetching} onClick={()=>handleAddSubject()}>
                                    {(fetching || submitting) && <div className='spinner-border spinner-border-sm'></div>}
                                    ADD
                                </button>
                        </form>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th width={"45%"}></th>
                                    <th width={"45%"}></th>
                                    <th width={"5%"}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((subject, i) => (
                                    <tr key={i}>
                                        <td style={{verticalAlign: 'middle'}}>{subject.title}</td>
                                        <td style={{verticalAlign: 'middle'}}>{subject.start_time} - {subject.end_time}</td>
                                        <td style={{verticalAlign: 'middle'}}>
                                        <IconButton color="error" onClick={() => handleRemoveSubject(i)}>
                                                <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
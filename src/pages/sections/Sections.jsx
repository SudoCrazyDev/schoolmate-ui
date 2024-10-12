import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import NewSection from './partials/NewSection';
import AddSubject from './partials/AddSubject';
import { useEffect, useMemo, useState } from 'react';
import EditSubject from './partials/EditSubject';
import DeleteSubject from './partials/DeleteSubject';
import EditSection from './partials/EditSection';
import { useSelector } from 'react-redux';
import SectionSubjectTemplate from './components/SectionSubjectTemplate';
import pb from '../../global/pb';
import { GetActiveInstitution, userHasRole } from '../../global/Helpers';
import { useAlert } from '../../hooks/CustomHooks';
import AutoCreateSections from './components/AutoCreateSections';
import Skeleton from '@mui/material/Skeleton';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

export default function Sections(){
    const [selectedSection, setSelectedSection] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const {id} = GetActiveInstitution();
    const { institutions } = useSelector(state => state.user);
    const alert = useAlert();
    const [sections, setSections] = useState([]);
    const [fetchingSections, setFetchingSections] = useState(false);
    const [fetchingSubjects, setFetchingsSubjects] = useState(false);
    const [gradeLevel, setGradeLevel] = useState("7");
    const handleFetchSections = async () => {
        setFetchingSections(true);
        await axios.get(`institution_sections/all_by_institutions/${institutions[0].id}`)
        .then((res) => {
            setSections(res.data.data);
        })
        .catch(() => {
            
        })
        .finally(() => {
            setFetchingSections(false);
        });
    };
    
    const filteredSections = useMemo(() => {
        return sections.filter(section => section.grade_level === gradeLevel);
    }, [sections, gradeLevel]);
    
    const handleFetchSectionSubjects = async () => {
        if(!selectedSection) return;
        await axios.get(`subjects/by_section/${selectedSection.id}`)
        .then((res) => {
            setSubjects(res.data);
        })
        .catch(err => {
            alert.setAlert("error", 'Failed to Fetch Subjects');
        })
        .finally(() => {
            setFetchingsSubjects(false);
        });
    };
    
    useEffect(() => {
        handleFetchSectionSubjects()
    }, [selectedSection]);
    
    useEffect(() => {
        handleFetchSections();
    }, []);
    
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">CLASS SECTIONS</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>add or update class sections and assign subjects.</p>
                    </div>
                    <div className="ms-auto d-flex flex-row gap-1">
                        <NavLink to={"new-section"}>
                            <button className="fw-bolder btn btn-primary">
                                Create Section
                            </button>
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="col-3 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-row align-items-center align-items-center class-section mb-3">
                        <h6 className="m-0" style={{padding: '8px'}}>FILTER: </h6>
                        <select className='form-select' onChange={(e) => setGradeLevel(e.target.value)}>
                             <option value={`7`}>Grade 7</option>
                             <option value={`8`}>Grade 8</option>
                             <option value={`9`}>Grade 9</option>
                             <option value={`10`}>Grade 10</option>
                             <option value={`11`}>Grade 11</option>
                             <option value={`12`}>Grade 12</option>
                        </select>
                    </div>
                    {fetchingSections && Array(5).fill().map((_, i) => (
                        <div key={i} className="d-flex flex-row align-items-center align-items-center class-section border my-1 rounded">
                            <Skeleton variant="rectangle" sx={{ width: '100%', height: '15px' }} />
                        </div>
                    ))}
                    {!fetchingSections && filteredSections.map(section => (
                        <div key={section.id} className="d-flex flex-row align-items-center align-items-center class-section border my-1 rounded" onClick={() => setSelectedSection(section)}>
                            <h6 className="m-0" style={{padding: '8px'}}>{section.grade_level} - {section.title}</h6>
                            {/* <EditSection section={section} /> */}
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-9 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row">
                            <div className="d-flex flex-column">
                                <h2 className="m-0 fw-bolder">{selectedSection && `${selectedSection?.grade_level} - ${selectedSection?.title}`}</h2>
                                <h6 className="m-0">{selectedSection?.class_adviser?.first_name} {selectedSection?.class_adviser?.last_name}</h6>
                            </div>
                            <div className="ms-auto">
                                {selectedSection && (
                                    <div className='d-flex flex-row gap-2'>
                                    <AddSubject selectedSection={selectedSection} refresh={handleFetchSectionSubjects}/>
                                    <NavLink to={`/advisory/new-student/${selectedSection.id}`}>
                                        <button className="btn btn-primary fw-bold">Add Student</button>
                                    </NavLink>
                                    </div>
                                    
                                )}
                            </div>
                        </div>
                        <div className="d-flex flex-column mt-1">
                            <hr />
                        </div>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th className='fw-bold'>Subject</th>
                                    <th className='fw-bold'>Start/End Time</th>
                                    <th className='fw-bold'>Teacher</th>
                                    <th className='fw-bold'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetchingSubjects && (
                                    <tr>
                                        <td colSpan={5}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></td>
                                    </tr>
                                )}
                                {!fetchingSubjects && subjects.map((subject, index) => (
                                     <tr key={index}>
                                        <td>{subject.title}</td>
                                        <td>{subject.start_time} - {subject.end_time}</td>
                                        <td className='fw-bolder'>
                                            {subject.subject_teacher === "" || subject.subject_teacher === null ?
                                                <Tooltip title="NO ASSIGNED TEACHER "><ReportGmailerrorredIcon color='error' /></Tooltip> 
                                                : 
                                                `${String(subject.subject_teacher?.last_name).toUpperCase()}, ${String(subject.subject_teacher?.first_name).toUpperCase()}`
                                            }
                                        </td>
                                        <td>
                                            <EditSubject subject={subject} refresh={handleFetchSectionSubjects}/>
                                            <DeleteSubject subject={subject} refresh={handleFetchSectionSubjects}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
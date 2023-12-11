import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import NewSection from './partials/NewSection';
import AddSubject from './partials/AddSubject';
import { useEffect, useMemo, useState } from 'react';
import Axios from "axios";

export default function Sections(){
    const [gradeLevels, setGradeLevels] = useState([]);
    const [selected, setSelected] = useState("");
    const [selectedSection, setSelectedSection] = useState(null);
    const [subjects, setSubjects] = useState([]);
    
    const filteredSections = useMemo(() => {
        return gradeLevels.filter((gradelevel) => gradelevel.id === selected)[0];
    }, [selected]);
    
    const handleGradeLevelSelect = (e) => {
        setSelected(e.target.value);
    };
    
    const handleFetchSections = () => {
        Axios.get('sections')
        .then(({data}) => {
            setGradeLevels(data);
        });
    };
    
    const handleSelectSection = (values) => {
        setSelectedSection(values);
    };
    
    const handleFetchSubjects = () => {
        if(selectedSection === null){
            return;
        }
        Axios.get(`section/subjects/${selectedSection.id}`)
        .then(({data}) => {
            setSubjects(data.subjects);
        });
    };
    
    useEffect(() => {
        handleFetchSubjects();
    }, [selectedSection]);
    
    useEffect(() => {
        handleFetchSections()
    },[]);
    
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0">CLASS SECTIONS</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>add or update class sections and assign subjects.</p>
                    </div>
                    <div className="ms-auto">
                        <NewSection />
                    </div>
                </div>
            </div>
            <div className="col-3 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-row align-items-center align-items-center class-section mb-3">
                       <h6 className="m-0" style={{padding: '8px'}}>FILTER: </h6>
                       <Select displayEmpty label="Grade Level" fullWidth size="small" defaultValue='' onChange={(e) => handleGradeLevelSelect(e)}>
                            {gradeLevels && gradeLevels.map((gradeLevel, index) => (
                            <MenuItem key={index} value={gradeLevel.id}>Grade {gradeLevel.grade_level}</MenuItem>    
                            ))}
                        </Select>
                    </div>
                    {filteredSections && filteredSections.sections.map((section, index) => (
                        <div key={index} className="d-flex flex-row align-items-center align-items-center class-section" onClick={() => handleSelectSection(section)}>
                            <h6 className="m-0" style={{padding: '8px'}}>{section.section_name}</h6>
                            <IconButton className='ms-auto'>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-9 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row">
                            <div className="d-flex flex-column">
                                <h5 className="m-0 fw-bolder">{selectedSection?.section_name} SUBJECTS</h5>
                                <p className="m-0 text-muted fw-bolder" style={{fontSize: '12px'}}>Class adviser: {selectedSection?.adviser?.details.first_name} {selectedSection?.adviser?.details.last_name}</p>
                            </div>
                            <div className="ms-auto">
                                {selectedSection && (
                                  <AddSubject selectedSection={selectedSection} setSubjects={setSubjects}/>  
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
                                    <th className='fw-bold'>Teacher</th>
                                    <th className='fw-bold'>Start/End Time</th>
                                    <th className='fw-bold'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects && subjects.map((subject, index) => (
                                     <tr>
                                        <td>{subject.subject_title}</td>
                                        <td>{subject.teacher?.details.first_name} {subject.teacher?.details.last_name}</td>
                                        <td>{subject.start_time} - {subject.end_time}</td>
                                        <td></td>
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
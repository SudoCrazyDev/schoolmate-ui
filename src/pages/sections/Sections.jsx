import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import NewSection from './partials/NewSection';
import AddSubject from './partials/AddSubject';
import { useEffect, useMemo, useState } from 'react';
import Axios from "axios";
import EditSubject from './partials/EditSubject';
import DeleteSubject from './partials/DeleteSubject';
import EditSection from './partials/EditSection';
import { useSelector } from 'react-redux';

export default function Sections(){
    const {gradeLevels} = useSelector(state => state.org);
    const [selected, setSelected] = useState("");
    const [selectedSection, setSelectedSection] = useState(null);
    const [subjects, setSubjects] = useState([]);
    
    const filteredSections = useMemo(() => {
        const filteredGL = gradeLevels.filter((gradelevel) => gradelevel.id === selected)[0];
        return filteredGL && filteredGL.sections.sort((a, b) => {
            if(a.section_name < b.section_name) return -1;
            if(a.section_name > b.section_name) return 1;
        });
    }, [selected, gradeLevels]);
    
    const handleGradeLevelSelect = (e) => {
        setSelected(e.target.value);
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
                       <Select displayEmpty fullWidth size="small" defaultValue='' onChange={(e) => handleGradeLevelSelect(e)}>
                            {gradeLevels && gradeLevels.map((gradeLevel, index) => (
                                <MenuItem key={index} value={gradeLevel.id}>Grade {gradeLevel.grade_level}</MenuItem>
                            ))}
                        </Select>
                    </div>
                    {filteredSections && filteredSections.map((section, index) => (
                        <div key={index} className="d-flex flex-row align-items-center align-items-center class-section" onClick={() => handleSelectSection(section)}>
                            <h6 className="m-0" style={{padding: '8px'}}>{section.section_name}</h6>
                            <EditSection section={section} />
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
                                     <tr key={index}>
                                        <td>{subject.subject_title}</td>
                                        <td>{subject.teacher?.details.first_name} {subject.teacher?.details.last_name}</td>
                                        <td>{subject.start_time} - {subject.end_time}</td>
                                        <td>
                                            <EditSubject subject={subject} setSubjects={setSubjects}/>
                                            <DeleteSubject subject={subject} setSubjects={setSubjects}/>
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
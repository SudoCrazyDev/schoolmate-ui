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
import SectionSubjectTemplate from './components/SectionSubjectTemplate';
import pb from '../../global/pb';
import { GetActiveInstitution, userHasRole } from '../../global/Helpers';
import { useAlert } from '../../hooks/CustomHooks';
import AutoCreateSections from './components/AutoCreateSections';
import Skeleton from '@mui/material/Skeleton';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { Tooltip } from '@mui/material';

export default function Sections(){
    const [selectedSection, setSelectedSection] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const {id} = GetActiveInstitution();
    const { roles } = useSelector(state => state.user);
    const alert = useAlert();
    const [sections, setSections] = useState([]);
    const [fetchingSections, setFetchingSections] = useState(false);
    const [fetchingSubjects, setFetchingsSubjects] = useState(false);

    const handleFilterSectionByGradeLevel = async (gl) => {
        try {
            const records = await pb.collection("institution_sections")
            .getFullList({
                sort: '+title',
                expand: 'class_adviser',
                filter: `institution="${id}"&&grade_level="${gl}"`
            });
            setSections(records);
        } catch (error) {
            alert.setAlert("error", "Failed to Filter Sections")
        }
        
    };
    
    const handleFetchSections = async () => {
        setFetchingSections(true);
        try {
            let filterField = `institution="${id}"&&grade_level="7"`
            if(roles[0].title === "Curriculum - 7"){
                filterField = `institution="${id}"&&grade_level="7"`
            }
            if(roles[0].title === "Curriculum - 8"){
                filterField = `institution="${id}"&&grade_level="8"`
            }
            if(roles[0].title === "Curriculum - 9"){
                filterField = `institution="${id}"&&grade_level="9"`
            }
            if(roles[0].title === "Curriculum - 10"){
                filterField = `institution="${id}"&&grade_level="10"`
            }
            if(roles[0].title === "Curriculum - 11"){
                filterField = `institution="${id}"&&grade_level="11"`
            }
            if(roles[0].title === "Curriculum - 12"){
                filterField = `institution="${id}"&&grade_level="12"`
            }
            const records = await pb.collection("institution_sections")
            .getFullList({
                sort: '+title',
                expand: 'class_adviser',
                filter: filterField
            });
            setSections(records);
        } catch (error) {
            alert.setAlert("error", "Failed loading sections");
        } finally {
            setFetchingSections(false);
        }
    };
    
    const handleFetchSectionSubjects = async () => {
        if(!selectedSection) return;
        try {
            setFetchingsSubjects(true);
            const records = await pb.collection("section_subjects")
            .getFullList({
                expand: 'assigned_teacher.personal_info',
                sort: 'start_time',
                filter: `section="${selectedSection.id}"`
            })
            setSubjects(records);
        } catch (error) {
            alert.setAlert("error", 'Error Getting Subjects');
        } finally{
            setFetchingsSubjects(false);
        }
        
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
                        {/* <SectionSubjectTemplate />
                        <NewSection /> */}
                        <AutoCreateSections />
                    </div>
                </div>
            </div>
            <div className="col-3 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-row align-items-center align-items-center class-section mb-3">
                       {userHasRole(['Principal']) && (
                        <>
                        <h6 className="m-0" style={{padding: '8px'}}>FILTER: </h6>
                        <select className='form-select' onChange={(e) => handleFilterSectionByGradeLevel(e.target.value)}>
                             <option value={`7`}>Grade 7</option>
                             <option value={`8`}>Grade 8</option>
                             <option value={`9`}>Grade 9</option>
                             <option value={`10`}>Grade 10</option>
                             <option value={`11`}>Grade 11</option>
                             <option value={`12`}>Grade 12</option>
                        </select>
                        </>
                       )}
                       {/* <Select displayEmpty fullWidth size="small" defaultValue='' onChange={(e) => handleGradeLevelSelect(e)} value={selected}>
                            {filteredGradeLevels && filteredGradeLevels.map((gradeLevel, index) => (
                                <MenuItem key={index} value={gradeLevel.id}>Grade {gradeLevel.grade_level}</MenuItem>
                            ))}
                        </Select> */}
                    </div>
                    {sections.map(section => (
                        <div key={section.id} className="d-flex flex-row align-items-center align-items-center class-section border my-1 rounded" onClick={() => setSelectedSection(section)}>
                            <h6 className="m-0" style={{padding: '8px'}}>{section.title}</h6>
                            {/* <EditSection section={section} /> */}
                        </div>
                    ))}
                    {/* {filteredSections && filteredSections.map((section, index) => (
                        <div key={index} className="d-flex flex-row align-items-center align-items-center class-section" onClick={() => handleSelectSection(section)}>
                            <h6 className="m-0" style={{padding: '8px'}}>{section.section_name}</h6>
                            <EditSection section={section} />
                        </div>
                    ))} */}
                </div>
            </div>
            <div className="col-9 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row">
                            <div className="d-flex flex-column">
                                <h2 className="m-0 fw-bolder">{selectedSection?.grade_level} - {selectedSection?.title}</h2>
                                <h6 className="m-0"></h6>
                                {/* <p className="m-0 text-muted fw-bolder" style={{fontSize: '12px'}}>Class adviser: {selectedSection?.adviser?.details.first_name} {selectedSection?.adviser?.details.last_name}</p> */}
                            </div>
                            <div className="ms-auto">
                                {/* {selectedSection && (
                                  <AddSubject selectedSection={selectedSection} setSubjects={setSubjects}/>  
                                )} */}
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
                                        <td colSpan={4}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></td>
                                    </tr>
                                )}
                                {!fetchingSubjects && subjects && subjects.map((subject, index) => (
                                     <tr key={index}>
                                        <td>{subject.title}</td>
                                        <td>{subject.start_time} - {subject.end_time}</td>
                                        <td className='fw-bolder'>{subject.assigned_teacher === "" ? <Tooltip title="NO ASSIGNED TEACHER"><ReportGmailerrorredIcon color='error' /></Tooltip>: `${String(subject.expand.assigned_teacher.expand.personal_info.last_name).toUpperCase()}, ${String(subject.expand.assigned_teacher.expand.personal_info.first_name).toUpperCase()}`}</td>
                                        <td>
                                            <EditSubject subject={subject} refresh={handleFetchSections}/>
                                            {/* <DeleteSubject subject={subject} setSubjects={setSubjects}/> */}
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
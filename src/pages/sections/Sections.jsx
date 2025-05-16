import AddSubject from './partials/AddSubject';
import { useEffect, useMemo, useState } from 'react';
import EditSubject from './partials/EditSubject';
import DeleteSubject from './partials/DeleteSubject';
import EditSection from './partials/EditSection';
import { useSelector } from 'react-redux';
import { useAlert } from '../../hooks/CustomHooks';
import Skeleton from '@mui/material/Skeleton';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { Tooltip } from '@mui/material';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import DeleteSection from './partials/DeleteSection';

import {
    ContentContainer,
    ParentContentContainer,
    PageHeading,
    PageContent,
    TableContainer,
    TableFunctions,
    Table,
    Button,
    SelectComponent
} from "@UIComponents";

export default function Sections(){
    const [selectedSection, setSelectedSection] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const { institutions } = useSelector(state => state.user);
    const alert = useAlert();
    const [sections, setSections] = useState([]);
    const [fetchingSections, setFetchingSections] = useState(false);
    const [fetchingSubjects, setFetchingsSubjects] = useState(false);
    const [gradeLevel, setGradeLevel] = useState("7");
    
    const handleFetchSections = async () => {
        setSelectedSection(null);
        setSubjects([]);
        setFetchingSections(true);
        await axios.get(`institution_sections/all_by_institutions/${institutions[0].id}`)
        .then((res) => {
            setSections(res.data);
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
        setFetchingsSubjects(true);
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
        <ParentContentContainer>
            <ContentContainer className="w-[100%] gap-3">
                <PageHeading title="CLASS SECTIONS" info="add or update class sections and assign subjects.">
                    <div className="lg:ml-auto">
                        <NavLink to={"new-section"}>
                            <Button type="button">
                                Create Section
                            </Button>
                        </NavLink>
                    </div>
                </PageHeading>
                <PageContent>
                    <ContentContainer className="w-1/5">
                        <p className="font-normal mb-2">Select a Grade Level</p>
                        <SelectComponent className="p-3 text-md uppercase" onChange={(e) => setGradeLevel(e.target.value)}>
                            <option value={"7"} className="text-black text-md uppercase">
                                    Grade 7
                            </option>
                            <option value={"8"} className="text-black text-md uppercase">
                                    Grade 8
                            </option>
                            <option value={"9"} className="text-black text-md uppercase">
                                    Grade 9
                            </option>
                            <option value={"10"} className="text-black text-md uppercase">
                                    Grade 10
                            </option>
                            <option value={"11"} className="text-black text-md uppercase">
                                    Grade 11
                            </option>
                            <option value={"12"} className="text-black text-md uppercase">
                                    Grade 12
                            </option>
                        </SelectComponent>
                        <hr className='my-4'/>
                    </ContentContainer>
                    <ContentContainer className="w-10/12 py-2">
                        
                    </ContentContainer>
                    {/* <TableContainer>
                        <TableFunctions>
                            
                        </TableFunctions>
                        <Table>
                            <thead>
                                <tr>
                                    <th width={'40%'} className="text-xl px-1 py-2 uppercase bg-zinc-50 border text-start border-gray-300">Email</th>
                                    <th width={'60%'} className="text-xl px-1 py-2 uppercase bg-zinc-50 border text-start border-gray-300">Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="p-1 py-2 font-bold uppercase border-y border-gray-300">{user.email}</td>
                                        <td className="p-1 py-2 font-bold uppercase border-y border-gray-300">{user.last_name}, {user.first_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableContainer> */}
                </PageContent>
            </ContentContainer>
        </ParentContentContainer>
        // <div className="d-flex flex-row flex-wrap">
        //     <div className="col-12 p-2">
        //         <div className="card p-3 d-flex flex-row align-items-center">
        //             <div className="d-flex flex-column">
        //                 <h2 className="m-0 fw-bolder">CLASS SECTIONS</h2>
        //                 <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>add or update class sections and assign subjects.</p>
        //             </div>
        //             <div className="ms-auto d-flex flex-row gap-1">
        //                 <NavLink to={"new-section"}>
        //                     <button className="fw-bolder btn btn-primary">
        //                         Create Section
        //                     </button>
        //                 </NavLink>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="col-3 p-2">
        //         <div className="card p-3">
        //             <div className="d-flex flex-row align-items-center align-items-center class-section mb-3">
        //                 <h6 className="m-0" style={{padding: '8px'}}>FILTER: </h6>
        //                 <select className='form-select' onChange={(e) => setGradeLevel(e.target.value)}>
        //                      <option value={`7`}>Grade 7</option>
        //                      <option value={`8`}>Grade 8</option>
        //                      <option value={`9`}>Grade 9</option>
        //                      <option value={`10`}>Grade 10</option>
        //                      <option value={`11`}>Grade 11</option>
        //                      <option value={`12`}>Grade 12</option>
        //                 </select>
        //             </div>
        //             {fetchingSections && Array(5).fill().map((_, i) => (
        //                 <div key={i} className="d-flex flex-row align-items-center align-items-center class-section border my-1 rounded">
        //                     <Skeleton variant="rectangle" sx={{ width: '100%', height: '15px' }} />
        //                 </div>
        //             ))}
        //             {!fetchingSections && filteredSections.map(section => (
        //                 <div key={section.id} className="d-flex flex-row align-items-center align-items-center class-section border my-1 rounded" onClick={() => setSelectedSection(section)}>
        //                     <h6 className="m-0" style={{padding: '8px'}}>{section.grade_level} - {section.title}</h6>
        //                     <EditSection section={section} refresh={handleFetchSections}/>
        //                     <DeleteSection section={section} refresh={handleFetchSections} />
        //                 </div>
        //             ))}
        //         </div>
        //     </div>
        //     <div className="col-9 p-2">
        //         <div className="card p-3">
        //             <div className="d-flex flex-column">
        //                 <div className="d-flex flex-row">
        //                     <div className="d-flex flex-column">
        //                         <h2 className="m-0 fw-bolder text-uppercase">
        //                             {fetchingSubjects && (
        //                                 <Skeleton variant='text' height={'45px'} width={`300px`}/>
        //                             )}
        //                             {!fetchingSubjects && selectedSection && `${selectedSection?.grade_level} - ${selectedSection?.title}`}
        //                         </h2>
        //                         <h6 className="m-0 text-uppercase">
        //                             {fetchingSubjects && (
        //                                 <Skeleton variant='text' height={'30px'} width={`250px`}/>
        //                             )}
        //                             {!fetchingSubjects && selectedSection?.class_adviser?.first_name} {!fetchingSubjects && selectedSection?.class_adviser?.last_name}
        //                         </h6>
        //                     </div>
        //                     <div className="ms-auto">
        //                         {selectedSection && (
        //                             <div className='d-flex flex-row gap-2'>
        //                             <AddSubject selectedSection={selectedSection} refresh={handleFetchSectionSubjects}/>
        //                             <NavLink to={`/advisory/new-student/${selectedSection.id}`}>
        //                                 <button className="btn btn-primary fw-bold">Add Student</button>
        //                             </NavLink>
        //                             <NavLink to={`/section-masterlist/${selectedSection.id}`}>
        //                                 <button className="btn btn-primary fw-bold">View Master List</button>
        //                             </NavLink>
        //                             </div>
        //                         )}
        //                     </div>
        //                 </div>
        //                 <div className="d-flex flex-column mt-1">
        //                     <hr />
        //                 </div>
        //                 <table className='table'>
        //                     <thead>
        //                         <tr>
        //                             <th className='fw-bold'>Subject</th>
        //                             <th className='fw-bold'>Start/End Time</th>
        //                             <th className='fw-bold'>Teacher</th>
        //                             <th className='fw-bold'>Action</th>
        //                         </tr>
        //                     </thead>
        //                     <tbody>
        //                         {fetchingSubjects && (
        //                             <tr>
        //                                 <td colSpan={5}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></td>
        //                             </tr>
        //                         )}
        //                         {!fetchingSubjects && subjects.map((subject, index) =>
        //                             { return !subject.parent_subject && (
        //                                 <tr key={index}>
        //                                     <td className='text-uppercase fw-bold'>{subject.title}</td>
        //                                     <td>{subject.start_time} - {subject.end_time}</td>
        //                                     <td className='fw-bolder'>
        //                                         {subject.subject_teacher === "" || subject.subject_teacher === null ?
        //                                             <Tooltip title="NO ASSIGNED TEACHER "><ReportGmailerrorredIcon color='error' /></Tooltip>
        //                                             :
        //                                             `${String(subject.subject_teacher?.last_name).toUpperCase()}, ${String(subject.subject_teacher?.first_name).toUpperCase()}`
        //                                         }
        //                                     </td>
        //                                     <td>
        //                                         <EditSubject subject={subject} refresh={handleFetchSectionSubjects}/>
        //                                         <DeleteSubject subject={subject} refresh={handleFetchSectionSubjects}/>
        //                                     </td>
        //                                 </tr>
        //                             )}
        //                         )}
        //                     </tbody>
        //                 </table>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
};
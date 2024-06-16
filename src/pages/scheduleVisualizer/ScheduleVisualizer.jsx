import { useEffect, useState } from "react";
import pb from "../../global/pb";
import { GetActiveInstitution } from "../../global/Helpers";
import { useAlert } from "../../hooks/CustomHooks";
import { Skeleton } from "@mui/material";

const tableHeaderStlyes = {
    fontSize: '20px',
    textAlign: 'center',
    whiteSpace: 'nowrap'
};

const tableBodyRowStyles = {
    verticalAlign: 'middle'
}
export default function ScheduleVisualizer(){
    const {id} = GetActiveInstitution();
    const [sections, setSections] = useState([]);
    const [fetchingSections, setFetchingSections] = useState(false);
    const alert = useAlert();

    const handleFetchSections = async () => {
        setFetchingSections(true)
        try {
            const records = await pb.collection('institution_sections')
            .getFullList({
                filter: `institution="${id}"`,
                fields: `academic_year,expand,grade_level,title`,
                expand: `section_subjects(section).assigned_teacher.personal_info`
            });
            setSections(records);    
        } catch (error) {
            alert.setAlert("error", 'Error Fetching Sections');
        } finally {
            setFetchingSections(false)
        }
        
    };

    useEffect(() => {
        handleFetchSections();
    },[]);

    return(
        <div className="d-flex flex-column">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center shadow">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">SCHEDULE VISUALIZER</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>add or update class sections and assign subjects.</p>
                    </div>
                    <div className="ms-auto d-flex flex-row gap-1">
                        
                    </div>
                </div>
            </div>
            <div className="d-flex flex-row p-2" style={{overflowX: 'scroll'}}>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th style={tableHeaderStlyes}>SECTION</th>
                            <th style={tableHeaderStlyes}>8AM - 9AM</th>
                            <th style={tableHeaderStlyes}>9AM - 10AM</th>
                            <th style={tableHeaderStlyes}>10AM - 11AM</th>
                            <th style={tableHeaderStlyes}>11AM - 12NN</th>
                            <th style={tableHeaderStlyes}>12NN - 1PM</th>
                            <th style={tableHeaderStlyes}>1PM - 2PM</th>
                            <th style={tableHeaderStlyes}>2PM - 3PM</th>
                            <th style={tableHeaderStlyes}>3PM - 4PM</th>
                            <th style={tableHeaderStlyes}>4PM - 5PM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fetchingSections && Array(5).fill().map((_,i) => (
                            <tr key={i}>    
                                <td colSpan={10}>
                                    <Skeleton variant="text" />
                                </td>
                            </tr>
                        ))}
                        {!fetchingSections && sections.map(section => (
                            <tr key={section.id}>
                                <td style={tableBodyRowStyles}>
                                    <h6 className="m-0 fw-bolder">
                                        {section.grade_level} - {section.title}
                                    </h6>
                                </td>
                                {section.expand?.['section_subjects(section)'].map(subject => (
                                <td key={subject.id} className="text-white">
                                    <div className="bg-success d-flex flex-column p-2 rounded shadow">
                                        <h5 className="m-0">{subject.title}</h5>
                                        <p className="m-0">{subject.expand?.assigned_teacher?.expand?.personal_info ? `${subject.expand?.assigned_teacher?.expand?.personal_info?.last_name}, ${subject.expand?.assigned_teacher?.expand?.personal_info?.first_name}` : 'No Teacher'}</p>
                                        <p className="m-0 text-capitalize">{subject.schedule ? subject.schedule : 'No Schedule'}</p>
                                    </div>
                                </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
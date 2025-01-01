import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
export default function ConsolidatedGrades(){
    const { institutions } = useSelector(state => state.user);
    const [sections, setSections] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [gradeLevel, setGradeLevel] = useState("");
    
    const handleFetchSections = async () => {
        setFetching(true);
        await axios.get(`institution_sections/all_by_institutions/${institutions[0].id}`)
        .then((res) => {
            setSections(res.data);
        })
        .finally(() => {
            setFetching(false);
        });
    };
    
    const filteredSections = useMemo(() => {
        if(gradeLevel === '') return sections;
        return sections.filter(section => section.grade_level === gradeLevel);
    }, [gradeLevel, sections]);
    
    useEffect(() => {
        handleFetchSections();
    }, []);
    
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card">
                    <div className="card-body d-flex flex-row">
                        <div className="d-flex flex-column">
                            <h2 className="m-0 fw-bolder">Consolidated Grades</h2>
                            <p className="m-0 fw-light" style={{fontSize: '12px'}}>View consolidated grades from sections.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 p-2 d-flex flex-row">
                <div className="d-flex flex-row gap-2">
                    <select className='form-select' onChange={(e) => setGradeLevel(e.target.value)}>
                            <option value={``}>All</option>
                            <option value={`7`}>Grade 7</option>
                            <option value={`8`}>Grade 8</option>
                            <option value={`9`}>Grade 9</option>
                            <option value={`10`}>Grade 10</option>
                            <option value={`11`}>Grade 11</option>
                            <option value={`12`}>Grade 12</option>
                    </select>
                </div>
            </div>
            <div className="col-12 p-2">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Section</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!fetching && filteredSections.map((section, i) => (
                            <tr key={section.id}>
                                <td className='fw-bolder'>{section.grade_level} - {section.title}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
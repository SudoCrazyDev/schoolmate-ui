import { useState } from "react";

export default function Gpa(){
    const [fetchingSections, setFetchingSections] = useState(false);
    const [fetchingGrades, setFetchingGrades] = useState(false);
    const [fetchingSubjects, setFetchingSubjects] = useState(false);
    
    const handleFetchSections = () => {
        
    };
    
    return(
        <div className="d-flex flex-column gap-2">
            <div className="card">
                <div className="card-body d-flex flex-column">
                    <h2 className="m-0 fw-bolder">GPA</h2>
                    <p className="m-0 fst-italic" style={{fontSize: '12px'}}>Reports for GPA</p>
                </div>
            </div>
            <div className="card">
                <div className="card-body d-flex flex-column gap-1">
                    <h5 className="m-0 fw-bold">Generate by:</h5>
                    <div className="d-flex flex-row gap-2">
                        <button className="btn btn-primary">Grade Level</button>
                        <button className="btn btn-primary">Section</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
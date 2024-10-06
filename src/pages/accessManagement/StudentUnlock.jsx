import { useState } from "react";
import { useAlert } from "../../hooks/CustomHooks";
import axios from "axios";

export default function UnlockStudentGrade({grade, section, refresh}){
    const [submitting, setSubmitting] = useState(false);
    
    const alert = useAlert();
    
    const handleChangeGradeState = async () => {
        setSubmitting(true);
        await axios.put(`students/unlock_grade/${grade.id}`, {state: !grade.is_locked})
        .then(() => {
            alert.setAlert('success', `Grade ${grade.is_locked ? 'Unlocked!' : 'Locked!'}`);
            refresh(section, grade.subject_id);
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to unlock grade');
        });
    };
    
    return(
        <>
        <button className={`btn btn-sm ${grade.is_locked ? 'btn-secondary' : 'btn-primary'} shadow`} onClick={() => handleChangeGradeState()}>{Number(grade.grade).toFixed()}</button>
        </>
    );
};
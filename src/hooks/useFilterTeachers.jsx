import { useMemo, useState } from "react";
import { objectToString } from "../global/Helpers";
import { useSelector } from "react-redux";

/**
 * A hook that filtered out teachers.
 */
const useFilterTeacher = () => {
    const [text, setText] = useState("");
    const { teachers } = useSelector(state => state.org);
    
    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher => objectToString(teacher).includes(String(text).toLowerCase()))
    }, [text, teachers]);
    
    return {
        teachers: filteredTeachers,
        setText,
        text
    };
};

export default useFilterTeacher;
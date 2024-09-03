import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import pb from "../../../global/pb";
import { useAlert } from "../../../hooks/CustomHooks";
import CreateIcon from '@mui/icons-material/Create';

export default function ViewGrades({student, subject}){
    const [open, setOpen] = useState(false);
    const [studentGrades, setStudentGrades] = useState([]);
    const alert = useAlert();
    
    const handleStudentGrade = async () => {
        try {
            const grades = await pb.collection("student_grades").getFullList({
                filter: `student="${student.id}"&&subject="${subject.id}"`
            });
            setStudentGrades(grades);
            if(grades.length > 0){
                formik.setFieldValue("quarter_one", grades[0].quarter_one);
                formik.setFieldValue("quarter_two", grades[0].quarter_two);
                formik.setFieldValue("quarter_three", grades[0].quarter_three);
                formik.setFieldValue("quarter_four", grades[0].quarter_four);
            }
        } catch (error) {
            
        }
    };
    
    const handleSubmit = async (values) => {
        formik.setSubmitting(true);
        if(studentGrades.length === 0){
            try {
                await pb.collection("student_grades")
                .create({
                    student: student.id,
                    subject: subject.id,
                    quarter_one: values.quarter_one,
                    quarter_two: values.quarter_two,
                    quarter_three: values.quarter_three,
                    quarter_four: values.quarter_four,
                });
                alert.setAlert("success", "Student Grades Updated");
            } catch (error) {
                alert.setAlert("error", "Failed to update Student Grades");
            }
        }
        if(studentGrades.length > 0){
            try {
                await pb.collection("student_grades").update(studentGrades.id, {
                    quarter_one: values.quarter_one,
                    quarter_two: values.quarter_two,
                    quarter_three: values.quarter_three,
                    quarter_four: values.quarter_four,
                });
                alert.setAlert("success", "Student Grades Updated");
            } catch (error) {
                alert.setAlert("error", "Failed to update Student Grades");
            }
        }
        handleModalState();
    };
    
    const handleModalState = () => {
        setOpen(!open);
        formik.resetForm();
    };
    
    const formik = useFormik({
        initialValues:{
            student_id: "",
            subject_id: "",
            quarter_one: 0,
            quarter_two: 0,
            quarter_three: 0,
            quarter_four: 0
        },
        onSubmit: handleSubmit
    });
    
    useEffect(() => {
        if(open){
            handleStudentGrade();
        }
    }, [open]);
    
    return(
        <>
        <Tooltip title="View Grades">
            <IconButton size="small" onClick={() => handleModalState()} color="primary">
                <CreateIcon fontSize="small" />
            </IconButton>
        </Tooltip>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className="fw-bolder">
                {student?.expand?.student_personal_data_via_student?.[0]?.last_name}, {student?.expand?.student_personal_data_via_student?.[0]?.first_name} - {subject?.title}
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
            <DialogContent dividers>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Q1</th>
                            <th>Q2</th>
                            <th>Q3</th>
                            <th>Q4</th>
                            <th>FINAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentGrades.length == 0 && (
                            <tr>
                               <td>
                                <input type="text" className="form-control" {...formik.getFieldProps("quarter_one")} disabled={formik.isSubmitting}/>
                               </td>
                               <td>
                               <input type="text" className="form-control" {...formik.getFieldProps("quarter_two")} disabled={formik.isSubmitting}/>
                               </td>
                               <td>
                               <input type="text" className="form-control" {...formik.getFieldProps("quarter_three")} disabled={formik.isSubmitting}/>
                               </td>
                               <td>
                               <input type="text" className="form-control" {...formik.getFieldProps("quarter_four")} disabled={formik.isSubmitting}/>
                               </td>
                               <td>
                                
                               </td>
                            </tr>
                        )}
                        {studentGrades.length > 0 && (
                            <tr>
                                <td>
                                <input type="text" className="form-control" {...formik.getFieldProps("quarter_one")} disabled={formik.isSubmitting || studentGrades[0].quarter_one}/>
                                </td>
                                <td>
                                <input type="text" className="form-control" {...formik.getFieldProps("quarter_two")} disabled={formik.isSubmitting || studentGrades[0].quarter_two}/>
                                </td>
                                <td>
                                <input type="text" className="form-control" {...formik.getFieldProps("quarter_three")} disabled={formik.isSubmitting || studentGrades[0].quarter_three}/>
                                </td>
                                <td>
                                <input type="text" className="form-control" {...formik.getFieldProps("quarter_four")} disabled={formik.isSubmitting || studentGrades[0].quarter_four}/>
                                </td>
                                <td>
                                
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </DialogContent>
            <DialogActions className="d-flex flex-row justify-content-start p-3">
                <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? <div className="spinner-border spinner-border-sm"></div> : "Submit"}
                </button>
                <button type="button" className="btn btn-danger" disabled={formik.isSubmitting} onClick={() => handleModalState()}>Cancel</button>
            </DialogActions>
            </form>
        </Dialog>
        </>
    );
};
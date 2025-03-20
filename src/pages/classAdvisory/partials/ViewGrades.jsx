import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useState } from 'react';
import { Page, Text, View, Document, PDFViewer, Image  } from '@react-pdf/renderer';
import PrintIcon from '@mui/icons-material/Print';
import { IconButton, Tooltip } from '@mui/material';
import { calculateAge } from '../../../global/Helpers';

const spa = [
    {title: "Filipino"},
    {title: "English"},
    {title: "Mathematics"},
    {title: "Science"},
    {title: "Araling Panlipunan"},
    {title: "Edukasyon sa Pagpapakatao"},
    {title: "Specialization"},
    {title: "MAPEH", sub_subjects: [
        {title: "Music"},
        {title: "Arts"},
        {title: "PE"},
        {title: "Health"}
    ]}
];

const spaG7 = [
    {title: "Filipino"},
    {title: "English"},
    {title: "Mathematics"},
    {title: "Science"},
    {title: "Araling Panlipunan"},
    {title: "Edukasyon sa Pagpapakatao"},
    {title: "Specialization"},
    {title: "MAPEH", sub_subjects: [
        {title: "Music & Arts"},
        {title: "PE & Health"}
    ]}
];

const spj = [
    {title: "Filipino"},
    {title: "English"},
    {title: "Mathematics"},
    {title: "Science"},
    {title: "Araling Panlipunan"},
    {title: "Edukasyon sa Pagpapakatao"},
    {title: "Fil. Journ"},
    {title: "Eng. Journ"},
    {title: "MAPEH", sub_subjects: [
        {title: "Music"},
        {title: "Arts"},
        {title: "PE"},
        {title: "Health"}
    ]}
];

const spjG7 = [
    {title: "Filipino"},
    {title: "English"},
    {title: "Mathematics"},
    {title: "Science"},
    {title: "Araling Panlipunan"},
    {title: "Edukasyon sa Pagpapakatao"},
    {title: "Fil. Journ"},
    {title: "Eng. Journ"},
    {title: "MAPEH", sub_subjects: [
        {title: "Music & Arts"},
        {title: "PE & Health"}
    ]}
];

const steG7 = [
    {title: "Filipino"},
    {title: "English"},
    {title: "Mathematics"},
    {title: "Science"},
    {title: "Araling Panlipunan"},
    {title: "Edukasyon sa Pagpapakatao"},
    {title: "Research"},
    {title: "Math Electives"},
    {title: "ICT/Robotics"},
    {title: "MAPEH", sub_subjects: [
        {title: "Music & Arts"},
        {title: "PE & Health"}
    ]}
];

const ste = [
    {title: "Filipino"},
    {title: "English"},
    {title: "Mathematics"},
    {title: "Science"},
    {title: "Araling Panlipunan"},
    {title: "Edukasyon sa Pagpapakatao"},
    {title: "Research"},
    {title: "Math Electives"},
    {title: "ICT/Robotics"},
    {title: "MAPEH", sub_subjects: [
        {title: "Music"},
        {title: "Arts"},
        {title: "PE"},
        {title: "Health"}
    ]}
];

const grade7Subjects = [
    {title: "Filipino"},
    {title: "English"},
    {title: "Mathematics"},
    {title: "Science"},
    {title: "Araling Panlipunan"},
    {title: "Values Education"},
    {title: "TLE"},
    {title: "TVE"},
    {title: "Technical Drawing"},
    {title: "MAPEH", sub_subjects: [
        {title: "Music & Arts"},
        {title: "PE & Health"}
    ]}
];

const generalSubjects = [
    {title: "Filipino"},
    {title: "English"},
    {title: "Mathematics"},
    {title: "Science"},
    {title: "Araling Panlipunan"},
    {title: "Edukasyon sa Pagpapakatao"},
    {title: "TLE"},
    {title: "MAPEH", sub_subjects: [
        {title: "Music"},
        {title: "Arts"},
        {title: "PE"},
        {title: "Health"}
    ]}
];

export default function ViewGrades({student, subjects, advisory}){
    const [open ,setOpen] = useState(false);
    const default_academic_year = "2024-2025";
    const handleModalState = () => {
        setOpen(!open);
    };
    const handleGetStudentAttendance = (month) => {
        let attendance_records = student?.attendance?.filter(record => record.academic_year === default_academic_year)?.[0] || [];
        let default_school_days = advisory?.institution?.school_days.filter(schoolDay => schoolDay.academic_year === default_academic_year)?.[0] || [];
        let month_days = month !== "" ? default_school_days[month] : "";
        const months = ["jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        let total_school_days = 0;
        let total_present = 0;
        for (const school_month of months) {
            total_school_days += parseInt(default_school_days[school_month]);
        }
        for (const attendance_month of months) {
            total_present += parseInt(attendance_records[attendance_month]);
        }
        return {
            school_days: month_days,
            present: parseInt(attendance_records[month]),
            absent:  parseInt(default_school_days[month]) - parseInt(attendance_records[month]),
            total_school_days: total_school_days,
            total_present: total_present,
            total_absent: total_school_days - total_present
        };
        
    };
    const isNameTooLong = (Tname) => {
        if(String(Tname).length >= 25){
            return true;
        }
        return false;
    };
    
    const checkIfStudentHasSpecialSubject = (student, subject) => {
        let filtered_subject = student?.grades?.filter(grade => String(grade.subject.title).toLowerCase() == String(subject).toLowerCase());
        return filtered_subject.length > 0 ? true : false;
    };

    const handleFindStudentGrade = (student, subject, quarter) => {
        let grade_subject = subjects?.filter(advSubject => String(advSubject.title).replaceAll(" ", '').toLowerCase() === String(subject).replaceAll(" ", "").toLowerCase())?.[0];
        let student_grade = student?.grades?.filter(grade => grade.subject_id === grade_subject?.id && grade.quarter === quarter)?.[0]?.grade || 0;
        
        //For Multiple Same Subject with Different Teachers
        if(subjects?.filter(advSubject => String(advSubject.title).replaceAll(" ", '').toLowerCase() === String(subject).replaceAll(" ", "").toLowerCase()).length > 1){
            //Search Instead Student Grades by Subject
            student_grade = student?.grades?.filter(grade => String(grade.subject?.title).replaceAll(" ", '').toLowerCase() === String(subject).replaceAll(" ", "").toLowerCase() && grade.quarter === quarter)?.[0]?.grade;
        }
        if(String(subject).replaceAll(" ", "").toLowerCase() === 'specialization'){
            let test_grade_subjects = subjects?.filter(advSubject => String(advSubject.title).replaceAll(" ", '').toLowerCase() === String(subject).replaceAll(" ", "").toLowerCase());
            for(let i = 0; i < test_grade_subjects.length; i++){
                if(student?.grades?.filter(grade => grade.subject_id === test_grade_subjects[i]?.id && grade.quarter === quarter)?.[0]?.grade){
                    student_grade = student?.grades?.filter(grade => grade.subject_id === test_grade_subjects[i]?.id && grade.quarter === quarter)?.[0]?.grade;
                }
            }
        }
        if(String(subject).toLowerCase() === 'mapeh'){
            let mapeh = subjects?.filter(advSubject => String(advSubject.title).replaceAll(" ", '').toLowerCase() === 'mapeh')?.[0] || null;
            let mapeh_subjects = subjects?.filter(mapehSub => mapehSub.parent_subject === mapeh?.id) || [];
            let mapeh_grade = student?.grades?.reduce((accumulator, currentValue) => {
                if(currentValue.quarter === String(quarter) && mapeh_subjects.filter(mapehSub => mapehSub.id === currentValue.subject_id).length > 0){
                    return accumulator + Number(Number(currentValue.grade).toFixed());
                }else{
                    return accumulator;
                }
            }, 0);
            student_grade = mapeh_grade / mapeh_subjects.length;
        }
        if(Number(student_grade).toFixed() == 0 || Number(student_grade).toFixed() == 'NaN'){
            return "";
        }
        return Number(student_grade).toFixed() == 0 ? "" : Number(student_grade).toFixed();
    };

    const handleFindStudentValue = (coreValue, quarter) => {
        let core_value = student?.values?.filter(value => value.core_value === coreValue && value.quarter === quarter)?.[0]?.remarks || "";
        return core_value;
    };
    return(
        <>
        <Tooltip title="Print Official Report Card">
            <IconButton size="small" onClick={() => handleModalState()} color="success">
                <PrintIcon fontSize="small"/>
            </IconButton>
        </Tooltip>
        <Dialog
        open={open}
        fullScreen
        scroll='paper'
        >
            <form>
                <DialogContent dividers>
                    <div className="col-12 mt-5">
                        {open && (
                            <PDFViewer className='w-100' style={{height: '600px'}}>
                                <Document>
                                    <Page size="A5" orientation="landscape" style={{display: 'flex', flexDirection: 'row'}}>
                                        <View style={{width: '50%', padding: '20px'}}>
                                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', marginBottom: '10px'}}>REPORT OF ATTENDANCE</Text>
                                                <View style={{width: '100%', display: 'flex', flexDirection: 'column', border: '1px solid black'}}>
                                                    <View style={{width: '100%', display: 'flex', flexDirection: 'row', borderBottom: '1px solid black'}}>
                                                        <View style={{width: '15%', borderRight: '1px solid black', padding: '2px'}}>
                                                            <Text style={{fontSize: '5px', textAlign: 'center'}}></Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Jun</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Jul</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Aug</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Sep</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Oct</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Nov</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Dec</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Jan</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Feb</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Mar</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Apr</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>Total</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '100%', display: 'flex', flexDirection: 'row', borderBottom: '1px solid black'}}>
                                                        <View style={{width: '15%', borderRight: '1px solid black', padding: '2px'}}>
                                                            <Text style={{fontSize: '5px', textAlign: 'center'}}>No. of School Days</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("jun").school_days}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("jul").school_days}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("aug").school_days}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("sep").school_days}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("oct").school_days}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("nov").school_days}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("dec").school_days}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("jan").school_days}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("feb").school_days}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("mar").school_days}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("apr").school_days}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center",}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("").total_school_days}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '100%', display: 'flex', flexDirection: 'row', borderBottom: '1px solid black'}}>
                                                        <View style={{width: '15%', borderRight: '1px solid black', padding: '2px'}}>
                                                            <Text style={{fontSize: '5px', textAlign: 'center'}}>No. of days present</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("jun").present}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("jul").present}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("aug").present}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("sep").present}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("oct").present}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("nov").present}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("dec").present}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("jan").present}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("feb").present}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("mar").present}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("apr").present}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center",}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("").total_present}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                                                        <View style={{width: '15%', borderRight: '1px solid black', padding: '2px'}}>
                                                            <Text style={{fontSize: '5px', textAlign: 'center'}}>No. of days absent</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("jun").absent}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("jul").absent}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("aug").absent}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("sep").absent}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("oct").absent}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("nov").absent}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("dec").absent}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("jan").absent}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("feb").absent}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("mar").absent}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center", borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("apr").absent}</Text>
                                                        </View>
                                                        <View style={{width: '7%', textAlign: 'center', display: 'flex', flexDirection: "column", justifyContent: "center",}}>
                                                            <Text style={{fontSize: '7px', fontFamily: 'Helvetica'}}>{handleGetStudentAttendance("").total_absent}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <Text style={{fontSize: '10px', fontFamily: 'Helvetica-Bold', marginTop: '50px'}}>PARENT / GUARDIAN'S SIGNATURE</Text>
                                                <Text style={{fontSize: '10px', fontFamily: 'Helvetica-Bold', marginTop: '20px', alignSelf: 'flex-start'}}>1st Quarter ___________________________________</Text>
                                                <Text style={{fontSize: '10px', fontFamily: 'Helvetica-Bold', marginTop: '20px', alignSelf: 'flex-start'}}>2nd Quarter ___________________________________</Text>
                                                <Text style={{fontSize: '10px', fontFamily: 'Helvetica-Bold', marginTop: '20px', alignSelf: 'flex-start'}}>3rd Quarter ___________________________________</Text>
                                                <Text style={{fontSize: '10px', fontFamily: 'Helvetica-Bold', marginTop: '20px', alignSelf: 'flex-start'}}>4th Quarter ___________________________________</Text>
                                            </View>
                                        </View>
                                        
                                        <View style={{width: '50%', padding: '20px'}}>
                                            
                                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                <View style={{display: 'flex', flexDirection: 'row', marginBottom: '3px', width: '90%'}}>
                                                    <Text style={{fontSize: '6px', fontFamily:'Helvetica'}}>DepEd SF-9</Text>
                                                    <Text style={{fontSize: '6px', fontFamily:'Helvetica', marginLeft: 'auto'}}>School ID: {advisory?.institution?.gov_id}</Text>
                                                </View>
                                                <View style={{display: 'flex', flexDirection: 'row', marginBottom: '3px'}}>
                                                    <Image source={`/${advisory?.institution?.abbr ? String(advisory?.institution?.abbr).toLowerCase(): 'deped'}-logo.png`} style={{height: 49, width: 49}}></Image>
                                                    <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px', marginHorizontal: '10px', gap: '1px'}}>
                                                        <Text style={{fontSize: '8px', fontFamily:'Helvetica'}}>Republic of the Philippines</Text>
                                                        <Text style={{fontSize: '8px', fontFamily:'Helvetica'}}>Department of Education</Text>
                                                        {/* <Text style={{fontSize: '8px', fontFamily:'Helvetica-Bold'}}>Region XII</Text> */}
                                                        <Text style={{fontSize: '8px', fontFamily:'Helvetica'}}>Division of General Santos City</Text>
                                                        <Text style={{fontSize: '8px', fontFamily:'Helvetica'}}>General Santos City</Text>
                                                    </View>
                                                    <Image source={`/deped-logo.png`} style={{height: 49, width: 49}}></Image>
                                                </View>
                                                <Text style={{fontSize: '6px', fontFamily:'Helvetica-Bold', alignSelf:'center'}}>{advisory?.institution?.title}</Text>
                                                <Text style={{fontSize: '6px', fontFamily:'Helvetica-Bold', alignSelf:'center'}}>{advisory?.institution?.address}</Text>
                                                
                                                <View style={{backgroundColor: 'black', marginTop: '10px', width: '100%', paddingVertical: '4px'}}>
                                                    <Text style={{color: 'white', fontSize: '8px', fontFamily:'Helvetica-Bold', alignSelf:'center'}}>REPORT CARD </Text>
                                                </View>
                                                
                                                <Text style={{fontFamily: 'Helvetica', fontSize: '8px', alignSelf:'flex-end'}}>LRN: {student.lrn}</Text>
                                                
                                                <View style={{marginTop: '2px', display: 'flex', flexDirection: 'row', alignSelf: 'flex-start'}}>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px', textTransform: 'uppercase'}}>Name:  <span style={{textDecoration: 'underline'}}>{student.last_name}, {student.first_name} {String(student.middle_name).charAt(0).toUpperCase()}. {student.ext_name}</span></Text>
                                                </View>
                                                
                                                <View style={{marginTop: '3px', display: 'flex', flexDirection: 'row', alignSelf: 'flex-start', gap: '20px'}}>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Age: <span style={{textDecoration: 'underline'}}>{calculateAge(student.birthdate)}</span></Text>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Sex: <span style={{textDecoration: 'underline'}}>{String(student.gender).charAt(0).toUpperCase()}</span></Text>
                                                </View>
                                                
                                                <View style={{marginTop: '3px', display: 'flex', flexDirection: 'row', alignSelf: 'flex-start', gap: '8px'}}>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Grade: <span style={{textDecoration: 'underline'}}>{advisory?.grade_level}</span></Text>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px', textDecoration: 'underline'}}>Section: <span style={{textDecoration: 'underline'}}>{advisory?.title}</span></Text>
                                                </View>
                                                
                                                <View style={{marginTop: '3px', display: 'flex', flexDirection: 'row', alignSelf: 'flex-start', gap: '5px'}}>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>School Year: 2024 - 2025</Text>
                                                </View>
                                                
                                                <View style={{marginTop: '5px', display: 'flex', flexDirection: 'column'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginBottom: '5px'}}>Dear Parent:</Text>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginLeft: '10px'}}>This report card shows the ability and progress your child has made</Text>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>in different learning areas as well as his/her core values.</Text>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginLeft: '10px'}}>{" "}The school welcomes you should you desire to know more about your</Text>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>child's progress.</Text>
                                                </View>
                                                
                                                <View style={{marginTop: '8px', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                                    <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                        <Text style={{fontSize: '8px', textTransform: 'uppercase', textDecoration: 'underline'}}>{advisory?.institution?.principal?.[0]?.first_name} {String(advisory?.institution?.principal?.[0]?.middle_name).charAt(0)}. {advisory?.institution?.principal?.[0]?.last_name}</Text>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginTop: '2px'}}>Principal {advisory?.institution?.abbr === 'GSCNSSAT' ? 'II' : ''}</Text>
                                                    </View>
                                                    <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                        <Text style={{fontSize: isNameTooLong(`${advisory?.class_adviser.first_name} ${String(advisory?.class_adviser.middle_name).charAt(0).toUpperCase()}. ${advisory?.class_adviser.last_name}`) ? '5px': '8px', textTransform: 'uppercase', textDecoration: 'underline'}}>{advisory?.class_adviser.first_name} {String(advisory?.class_adviser.middle_name).charAt(0).toUpperCase()}. {advisory?.class_adviser.last_name}</Text>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginTop: '2px'}}>Teacher</Text>
                                                    </View>
                                                </View>
                                                
                                                <View style={{backgroundColor: 'black', marginTop: '5px', width: '100%', paddingVertical: '4px'}}>
                                                    <Text style={{color: 'white', fontSize: '8px', fontFamily:'Helvetica-Bold', alignSelf:'center'}}>Certificate of Transfer </Text>
                                                </View>
                                                
                                                <View style={{marginTop: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px'}}>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '10px'}}></Text>
                                                    <View style={{display: 'flex', flexDirection: 'row', marginTop: '2px', maringBottom: '5px', alignSelf: 'flex-start'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>Admitted to Grade:______________</Text>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>Section:______________</Text>
                                                    </View>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'flex-start'}}>Eligibility for Admission to Grade:_______________________</Text>
                                                    <View style={{display: 'flex', flexDirection: 'row', marginTop: '1px'}}>
                                                        <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                            <Text style={{fontSize: '8px', textTransform: 'uppercase', textDecoration: 'underline'}}>{advisory?.institution?.principal?.[0]?.first_name} {String(advisory?.institution?.principal?.[0]?.middle_name).charAt(0)}. {advisory?.institution?.principal?.[0]?.last_name}</Text>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginTop: '2px'}}>Principal {advisory?.institution?.abbr === 'GSCNSSAT' ? 'II' : ''}</Text>
                                                        </View>
                                                        <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                            <Text style={{fontSize: '8px', textTransform: 'uppercase', textDecoration: 'underline'}}>{advisory?.class_adviser.first_name} {String(advisory?.class_adviser.middle_name).charAt(0).toUpperCase()}. {advisory?.class_adviser.last_name}</Text>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginTop: '2px'}}>Teacher</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                
                                                <View style={{backgroundColor: 'black', marginTop: '5px', width: '100%', paddingVertical: '4px'}}>
                                                    <Text style={{color: 'white', fontSize: '8px', fontFamily:'Helvetica-Bold', alignSelf:'center'}}>CANCELLATION OF ELIGIBILITY TO TRANSFER </Text>
                                                </View>
                                                
                                                <View style={{marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'flex-start'}}>Admitted To:_______________________</Text>
                                                    <View style={{display: 'flex', flexDirection: 'row'}}>
                                                        <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                        </View>
                                                        <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                            <Text>___________</Text>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>Principal</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                
                                            </View>
                                            
                                        </View>
                                    </Page>
                                    <Page size="A5" orientation="landscape" style={{display: 'flex', flexDirection: 'row', fontFamily: 'Helvetica'}}>
                                        
                                        <View style={{height: '100%', width: '50%', padding: '20px', display: 'flex', flexDirection: 'column'}}>
                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', marginBottom: '10px'}}>REPORT ON LEARNING PROGRESS AND ACHIEVEMENT</Text>
                                            {/* TABLE HEADER */}
                                            <View style={{display: 'flex', flexDirection: 'row', border: '1px solid black'}}>
                                                <View style={{width: '30%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}>Learning Areas</Text>
                                                </View>
                                                <View style={{width: '40%', display: 'flex', flexDirection: 'column', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}>Quarter</Text>
                                                    <View style={{display: 'flex', flexDirection: 'row', borderTop: '1px solid black'}}>
                                                        <View style={{width: '25%', borderRight: '1px sold black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>1</Text>
                                                        </View>
                                                        <View style={{width: '25%', borderRight: '1px sold black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>2</Text>
                                                        </View>
                                                        <View style={{width: '25%', borderRight: '1px sold black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>3</Text>
                                                        </View>
                                                        <View style={{width: '25%'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>4</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}>Final Grade</Text>
                                                </View>
                                                <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}>Remarks</Text>
                                                </View>
                                            </View>

                                            {advisory?.grade_level === "7" && (!String(advisory?.title).toLowerCase().includes('ste') && !String(advisory?.title).toLowerCase().includes('spa') && !String(advisory?.title).toLowerCase().includes('spj')) && grade7Subjects.map((subject) => (
                                                <>
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subject?.title}</Text>
                                                    </View>
                                                    <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "1")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "2")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "3")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "4")}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                    </View>
                                                </View>
                                                {subject.sub_subjects?.length > 0 && subject?.sub_subjects.map((subSubject) => (
                                                    <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                        <View style={{paddingLeft: '10px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subSubject?.title}</Text>
                                                        </View>
                                                        <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "1")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "2")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "3")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "4")}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                        </View>
                                                        <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                        </View>
                                                    </View>
                                                ))}
                                                </>
                                            ))}

                                            {advisory?.grade_level === "7" && String(advisory?.title).toLowerCase().includes('spa') && spaG7.map((subject) => (
                                                <>
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subject?.title}</Text>
                                                    </View>
                                                    <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "1")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "2")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "3")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "4")}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                    </View>
                                                </View>
                                                {subject.sub_subjects?.length > 0 && subject?.sub_subjects.map((subSubject) => (
                                                    <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                        <View style={{paddingLeft: '10px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subSubject?.title}</Text>
                                                        </View>
                                                        <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "1")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "2")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "3")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "4")}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                        </View>
                                                        <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                        </View>
                                                    </View>
                                                ))}
                                                </>
                                            ))}

                                            {advisory?.grade_level === "7" && String(advisory?.title).toLowerCase().includes('spj') && spjG7.map((subject) => (
                                                <>
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subject?.title}</Text>
                                                    </View>
                                                    <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "1")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "2")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "3")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "4")}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                    </View>
                                                </View>
                                                {subject.sub_subjects?.length > 0 && subject?.sub_subjects.map((subSubject) => (
                                                    <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                        <View style={{paddingLeft: '10px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subSubject?.title}</Text>
                                                        </View>
                                                        <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "1")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "2")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "3")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "4")}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                        </View>
                                                        <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                        </View>
                                                    </View>
                                                ))}
                                                </>
                                            ))}

                                            {advisory?.grade_level === "7" && String(advisory?.title).toLowerCase().includes('ste') && steG7.map((subject) => (
                                                <>
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subject?.title}</Text>
                                                    </View>
                                                    <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "1")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "2")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "3")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "4")}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                    </View>
                                                </View>
                                                {subject.sub_subjects?.length > 0 && subject?.sub_subjects.map((subSubject) => (
                                                    <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                        <View style={{paddingLeft: '10px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subSubject?.title}</Text>
                                                        </View>
                                                        <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "1")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "2")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "3")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "4")}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                        </View>
                                                        <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                        </View>
                                                    </View>
                                                ))}
                                                </>
                                            ))}

                                            {advisory?.grade_level !== "7" && String(advisory?.title).toLowerCase().includes('spa') && spa.map((subject) => (
                                                <>
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subject?.title}</Text>
                                                    </View>
                                                    <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "1")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "2")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "3")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "4")}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                    </View>
                                                </View>
                                                {subject.sub_subjects?.length > 0 && subject?.sub_subjects.map((subSubject) => (
                                                    <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                        <View style={{paddingLeft: '10px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subSubject?.title}</Text>
                                                        </View>
                                                        <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "1")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "2")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "3")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "4")}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                        </View>
                                                        <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                        </View>
                                                    </View>
                                                ))}
                                                </>
                                            ))}

                                            {advisory?.grade_level !== "7" && String(advisory?.title).toLowerCase().includes('spj') && spj.map((subject) => (
                                                <>
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subject?.title}</Text>
                                                    </View>
                                                    <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "1")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "2")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "3")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "4")}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                    </View>
                                                </View>
                                                {subject.sub_subjects?.length > 0 && subject?.sub_subjects.map((subSubject) => (
                                                    <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                        <View style={{paddingLeft: '10px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subSubject?.title}</Text>
                                                        </View>
                                                        <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "1")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "2")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "3")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "4")}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                        </View>
                                                        <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                        </View>
                                                    </View>
                                                ))}
                                                </>
                                            ))}

                                            {advisory?.grade_level !== "7" && String(advisory?.title).toLowerCase().includes('ste') && ste.map((subject) => (
                                                <>
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subject?.title}</Text>
                                                    </View>
                                                    <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "1")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "2")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "3")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "4")}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                    </View>
                                                </View>
                                                {subject.sub_subjects?.length > 0 && subject?.sub_subjects.map((subSubject) => (
                                                    <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                        <View style={{paddingLeft: '10px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subSubject?.title}</Text>
                                                        </View>
                                                        <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "1")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "2")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "3")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "4")}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                        </View>
                                                        <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                        </View>
                                                    </View>
                                                ))}
                                                </>
                                            ))}

                                            {advisory?.grade_level !== "7" &&  (!String(advisory?.title).toLowerCase().includes('ste') && !String(advisory?.title).toLowerCase().includes('spa') && !String(advisory?.title).toLowerCase().includes('spj')) && generalSubjects.map((subject) => (
                                                <>
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{advisory?.grade_level === "10" && subject?.title === 'TLE' ? 'TVE' : subject?.title}</Text>
                                                    </View>
                                                    <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "1")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "2")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "3")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,subject.title, "4")}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                    </View>
                                                </View>
                                                {subject.sub_subjects?.length > 0 && subject?.sub_subjects.map((subSubject) => (
                                                    <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                        <View style={{paddingLeft: '10px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subSubject?.title}</Text>
                                                        </View>
                                                        <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "1")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "2")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "3")}</Text>
                                                            </View>
                                                            <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                <Text>{handleFindStudentGrade(student,subSubject.title, "4")}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                        </View>
                                                        <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                        </View>
                                                    </View>
                                                ))}
                                                </>
                                            ))}

                                            {/* SPECIAL SUBJECT ENTREPRENEURSHIP */}
                                            {checkIfStudentHasSpecialSubject(student, 'ENTREPRENEURSHIP') && (
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>Entrepreneurship</Text>
                                                    </View>
                                                    <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,'ENTREPRENEURSHIP', "1")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,'ENTREPRENEURSHIP', "2")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,'ENTREPRENEURSHIP', "3")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,'ENTREPRENEURSHIP', "4")}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                    </View>
                                                </View>
                                            )}
                                            {checkIfStudentHasSpecialSubject(student, 'ENTREPRENUERSHIP') && (
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>Entrepreneuership</Text>
                                                    </View>
                                                    <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,'ENTREPRENUERSHIP', "1")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,'ENTREPRENEURSHIP', "2")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,'ENTREPRENEURSHIP', "3")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,'ENTREPRENEURSHIP', "4")}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                    </View>
                                                </View>
                                            )}
                                            {checkIfStudentHasSpecialSubject(student, 'GEOMETRY') && (
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>GEOMETRY</Text>
                                                    </View>
                                                    <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,'GEOMETRY', "1")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,'GEOMETRY', "2")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,'GEOMETRY', "3")}</Text>
                                                        </View>
                                                        <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                            <Text>{handleFindStudentGrade(student,'GEOMETRY', "4")}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                    </View>
                                                </View>
                                            )}

                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{width: '70%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>GENERAL AVERAGE</Text>
                                                    </View>
                                                    <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}></Text>
                                                    </View>
                                                    <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                                                    </View>
                                                </View>

                                                <View style={{marginTop: 'auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                                                    <View style={{width: '40%'}}>
                                                        <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Descriptors</Text>
                                                    </View>
                                                    <View style={{width: '30%'}}>
                                                        <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Grading Scale</Text>
                                                    </View>
                                                    <View style={{width: '30%'}}>
                                                        <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Remarks</Text>
                                                    </View>
                                                    <View style={{width: '100%', display: 'flex', flexDirection: 'row', marginTop: '5px'}}>
                                                        <View style={{width: '40%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Outstanding</Text>
                                                        </View>
                                                        <View style={{width: '30%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>90-100</Text>
                                                        </View>
                                                        <View style={{width: '30%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Passed</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                                                        <View style={{width: '40%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Very Satisfactory</Text>
                                                        </View>
                                                        <View style={{width: '30%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>85-89</Text>
                                                        </View>
                                                        <View style={{width: '30%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Passed</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                                                        <View style={{width: '40%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Satisfactory</Text>
                                                        </View>
                                                        <View style={{width: '30%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>80-84</Text>
                                                        </View>
                                                        <View style={{width: '30%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Passed</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                                                        <View style={{width: '40%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Fairly Satisfactory</Text>
                                                        </View>
                                                        <View style={{width: '30%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>75-84</Text>
                                                        </View>
                                                        <View style={{width: '30%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Passed</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                                                        <View style={{width: '40%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Did Not Meet Expectations</Text>
                                                        </View>
                                                        <View style={{width: '30%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Below 75</Text>
                                                        </View>
                                                        <View style={{width: '30%'}}>
                                                            <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Failed</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                        </View>
                                        
                                        <View style={{height: '100%', width: '50%', padding: '20px', display: 'flex', flexDirection: 'column'}}>
                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', marginBottom: '10px'}}>REPORT ON LEARNER'S OBSERVED VALUES</Text>
                                            <View style={{display: 'flex', flexDirection: 'row', border: '1px solid black'}}>
                                                <View style={{width: '18%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}>Core Values</Text>
                                                </View>
                                                <View style={{width: '42%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}>Behavior Statements</Text>
                                                </View>
                                                <View style={{width: '40%', display: 'flex', flexDirection: 'column'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}>Quarter</Text>
                                                    <View style={{display: 'flex', flexDirection: 'row', borderTop: '1px solid black'}}>
                                                        <View style={{width: '25%', borderRight: '1px sold black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>1</Text>
                                                        </View>
                                                        <View style={{width: '25%', borderRight: '1px sold black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>2</Text>
                                                        </View>
                                                        <View style={{width: '25%', borderRight: '1px sold black'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>3</Text>
                                                        </View>
                                                        <View style={{width: '25%'}}>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>4</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            
                                            <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                <View style={{width: '18%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '7px', fontFamily: 'Helvetica', alignSelf: 'center', whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>Maka-Diyos</Text>
                                                </View>
                                                <View style={{width: '42%', display: 'flex', flexDirection:'column', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <View style={{height: '30px', borderBottom: '1px solid black'}}>
                                                        <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                            Expresses one's spiritual beliefs while respecting the spiritual beliefs of others
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <Text style={{height: '25px', fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                            Show adherence to ethical principles by upholding truth
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{width: '40%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{width: '100%', height: '30px', borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('md-1', '1')}
                                                            </Text>
                                                        </View>
                                                        <View style={{width: '100%', height: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('md-2', '1')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{width: '100%', height: '30px', borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('md-1', '2')}
                                                            </Text>
                                                        </View>
                                                        <View style={{width: '100%', height: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('md-2', '2')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{width: '100%', height: '30px', borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('md-1', '3')}
                                                            </Text>
                                                        </View>
                                                        <View style={{width: '100%', height: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('md-2', '3')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{width: '100%', height: '30px', borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('md-1', '4')}
                                                            </Text>
                                                        </View>
                                                        <View style={{width: '100%', height: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('md-2', '4')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            
                                            <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                <View style={{width: '18%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '7px', fontFamily: 'Helvetica', alignSelf: 'center', whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>Maka Tao</Text>
                                                </View>
                                                <View style={{width: '42%', display: 'flex', flexDirection:'column', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <View style={{height: '25px', width: '100%',  borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                        <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                            Is sensitive to individual, social and cultural differences
                                                        </Text>
                                                    </View>
                                                    <View style={{height: '25px', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                        <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                            Demonstrates contributions towards solidarity
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{width: '40%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height: '25px', width: '100%',  borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('mt-1', '1')}
                                                            </Text>
                                                        </View>
                                                        <View style={{height: '25px', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('mt-2', '1')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height: '25px', width: '100%',  borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('mt-1', '2')}
                                                            </Text>
                                                        </View>
                                                        <View style={{height: '25px', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('mt-2', '2')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height: '25px', width: '100%',  borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('mt-1', '3')}
                                                            </Text>
                                                        </View>
                                                        <View style={{height: '25px', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('mt-2', '3')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height: '25px', width: '100%',  borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('mt-1', '4')}
                                                            </Text>
                                                        </View>
                                                        <View style={{height: '25px', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '4px'}}>
                                                                {handleFindStudentValue('mt-2', '4')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            
                                            <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                <View style={{width: '18%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '7px', fontFamily: 'Helvetica', alignSelf: 'center'}}>Maka Kalikasan</Text>
                                                </View>
                                                <View style={{width: '42%', display: 'flex', flexDirection:'column', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <View>
                                                        <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '3px'}}>
                                                            Cares for the environment and utilizes resources wisely, judiciously, and economically.
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{width: '40%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <View style={{height:'100%' ,fontSize: '6px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                        <Text>
                                                            {handleFindStudentValue('mk-1', '1')}
                                                        </Text>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '6px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                        <Text>
                                                            {handleFindStudentValue('mk-1', '2')}
                                                        </Text>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '6px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                        <Text>
                                                            {handleFindStudentValue('mk-1', '3')}
                                                        </Text>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '6px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                        <Text>
                                                            {handleFindStudentValue('mk-1', '4')}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            
                                            <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                <View style={{width: '18%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '7px', fontFamily: 'Helvetica', alignSelf: 'center', whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>Maka Bansa</Text>
                                                </View>
                                                <View style={{width: '42%', display: 'flex', flexDirection:'column', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <View style={{height: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: '1px solid black'}}>
                                                        <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '3px'}}>
                                                            Demonstrates pride in being a Filipino; excercises the rights and responsibilities of a Filipino citizen.
                                                        </Text>
                                                    </View>
                                                    <View style={{height: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                        <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '3px'}}>
                                                            Demonstrates appropriate behaviour in carrying out activities in the school, community, and country.
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{width: '40%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height: '30px', width: '100%',  borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '3px'}}>
                                                                {handleFindStudentValue('mb-1', '1')}
                                                            </Text>
                                                        </View>
                                                        <View style={{height: '30px', width: '100%',  display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '3px'}}>
                                                                {handleFindStudentValue('mb-2', '1')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height: '30px', width: '100%',  borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '3px'}}>
                                                                {handleFindStudentValue('mb-1', '2')}
                                                            </Text>
                                                        </View>
                                                        <View style={{height: '30px', width: '100%',  display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '3px'}}>
                                                                {handleFindStudentValue('mb-2', '2')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height: '30px', width: '100%',  borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '3px'}}>
                                                                {handleFindStudentValue('mb-1', '3')}
                                                            </Text>
                                                        </View>
                                                        <View style={{height: '30px', width: '100%',  display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '3px'}}>
                                                                {handleFindStudentValue('mb-2', '3')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                        <View style={{height: '30px', width: '100%',  borderBottom: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '3px'}}>
                                                                {handleFindStudentValue('mb-1', '4')}
                                                            </Text>
                                                        </View>
                                                        <View style={{height: '30px', width: '100%',  display: 'flex', flexDirection: 'column', justifyContent:'center'}}>
                                                            <Text style={{fontSize: '6px', fontFamily: 'Helvetica', alignSelf: 'center', padding: '3px'}}>
                                                                {handleFindStudentValue('mb-2', '4')}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            
                                            <View style={{marginTop: 'auto', display: 'flex', flexDirection: 'column'}}>
                                                <View style={{display: 'flex', flexDirection: 'row', paddingBottom: '5px'}}>
                                                    <Text style={{width: '20%', fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Marking</Text>
                                                    <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Non-numerical Rating</Text>
                                                </View>
                                                <View style={{display: 'flex', flexDirection: 'row'}}>
                                                    <Text style={{width: '20%', fontFamily: 'Helvetica', fontSize: '8px'}}>AO</Text>
                                                    <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Always Observed</Text>
                                                </View>
                                                <View style={{display: 'flex', flexDirection: 'row'}}>
                                                    <Text style={{width: '20%', fontFamily: 'Helvetica', fontSize: '8px'}}>SO</Text>
                                                    <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Sometimes Observed</Text>
                                                </View>
                                                <View style={{display: 'flex', flexDirection: 'row'}}>
                                                    <Text style={{width: '20%', fontFamily: 'Helvetica', fontSize: '8px'}}>RO</Text>
                                                    <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Rarely Observed</Text>
                                                </View>
                                                <View style={{display: 'flex', flexDirection: 'row'}}>
                                                    <Text style={{width: '20%', fontFamily: 'Helvetica', fontSize: '8px'}}>NO</Text>
                                                    <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}>Not Observed</Text>
                                                </View>
                                                <View style={{display: 'flex', flexDirection: 'row'}}>
                                                    <Text style={{width: '20%', fontFamily: 'Helvetica', fontSize: '8px'}}> </Text>
                                                    <Text style={{fontFamily: 'Helvetica', fontSize: '8px'}}> </Text>
                                                </View>
                                            </View>
                                            
                                        </View>
                                        
                                    </Page>
                                </Document>
                            </PDFViewer>
                        )}
                    </div>
                </DialogContent>
                <DialogActions className='justify-content-start'>
                    {/* <Button variant='contained' color='primary' onClick={() => handleModalState()}>Print</Button> */}
                    <Button variant='contained' color='error' onClick={() => handleModalState()}>Close</Button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    );
};
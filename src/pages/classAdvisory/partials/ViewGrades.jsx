import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useEffect, useState } from 'react';
import { Page, Text, View, Document, PDFViewer, Image, StyleSheet   } from '@react-pdf/renderer';
import PrintIcon from '@mui/icons-material/Print';
import { IconButton, Tooltip } from '@mui/material';
import { calculateAge, CheckIfHonor, GetActiveInstitution } from '../../../global/Helpers';
import axios from 'axios';
import Subjects from '../components/ViewGrades.Subjects';

const styles = StyleSheet.create({
    attendanceMonthContainer: {width: '7%', textAlign: 'center', borderRight: '1px solid black'},
    attendanceMonthText: {fontSize: '7px', fontFamily: 'Helvetica'}
});

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
    const [fetching, setFetching] = useState(false);
    const [cardTemplates, setCardTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showFinalGrade, setShowFinalGrade] = useState(false);
    
    const institution = GetActiveInstitution();
    const default_academic_year = "2024-2025";
    
    const handleFetchCardTemplates = async () => {
        setFetching(true);
        await axios.get(`card_templates/institutions/${institution.id}`)
        .then((res) => {
            setCardTemplates(res.data);
        })
        .finally(() => {
            setFetching(false);
        });
    };
    
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
            present: isNaN(parseInt(attendance_records[month])) ? "" : parseInt(attendance_records[month]),
            absent:  isNaN(parseInt(default_school_days[month]) - parseInt(attendance_records[month])) ? "" : parseInt(default_school_days[month]) - parseInt(attendance_records[month]),
            total_school_days: isNaN(total_school_days) ? "" : total_school_days,
            total_present: isNaN(total_present) ? "" : total_present,
            total_absent: isNaN(total_school_days - total_present) ? "" : total_school_days - total_present
        };
        
    };
    const isNameTooLong = (Tname) => {
        if(String(Tname).length >= 25){
            return true;
        }
        return false;
    };

    const handleFindStudentValue = (coreValue, quarter) => {
        let core_value = student?.values?.filter(value => value.core_value === coreValue && value.quarter === quarter)?.[0]?.remarks || "";
        return core_value;
    };
    
    const handleGeneralAverage = () => {
        let mapeh_subjects = ['pe', 'arts', 'health', 'music', 'pe & health', 'music & arts'];
        let final_subject_grades = JSON.parse(selectedTemplate)?.map(subject => {
            return student?.grades?.filter(grade =>
                !mapeh_subjects.includes(grade.subject.title)
                && String(subject.subject_to_match).toLowerCase() === String(grade.subject.title).toLowerCase()
            );
        }).filter(grade => grade.length > 0).flat();
        
        const groupedGrades = {};

        final_subject_grades.forEach((gradeObj) => {
            const subjectTitle = gradeObj.subject.title;
            const gradeValue = parseInt(gradeObj.grade);

            if (!groupedGrades[subjectTitle]) {
              groupedGrades[subjectTitle] = {
                totalGrade: 0,
                count: 0,
              };
            }

            groupedGrades[subjectTitle].totalGrade += gradeValue;
            groupedGrades[subjectTitle].count += 1;
        });

        const averagedGrades = {};
        for (const subjectTitle in groupedGrades) {
            averagedGrades[subjectTitle] = {
            totalGrade: groupedGrades[subjectTitle].totalGrade,
            count: groupedGrades[subjectTitle].count,
            averageGrade: Number(Number(groupedGrades[subjectTitle].totalGrade / groupedGrades[subjectTitle].count).toFixed()),
            };
        }
        
        if(JSON.parse(selectedTemplate)?.some(templateSubject => templateSubject.subject_to_match === 'mapeh')){
            let final_mapeh_grades = student?.grades?.filter(grade => mapeh_subjects.includes(String(grade.subject.title).toLowerCase()));
            let final_mapeh_accu_grade = final_mapeh_grades.reduce((accumulator, currentValue) => {
                return accumulator + Number(Number(currentValue.grade).toFixed());
            }, 0);

            averagedGrades['Mapeh'] = {
                averageGrade: Number(Number(final_mapeh_accu_grade / final_mapeh_grades.length).toFixed()),
            };
        }
        let totalAverage = 0;
        let subjectCount = 0;
        for(const subjectTitle in averagedGrades){
            totalAverage += averagedGrades[subjectTitle].averageGrade;
            subjectCount++;
        }
        if(isNaN(totalAverage/subjectCount) || ""){
            return {
                ave: "",
                remarks: ""
            };
        } else {
            return {
                ave: Number(Number(totalAverage/subjectCount).toFixed()),
                remarks: CheckIfHonor(Number(Number(totalAverage/subjectCount).toFixed()))
            };
        };
    };
    
    useEffect(() => {
        if(open){
            handleFetchCardTemplates();
        }
    }, [open]);
    
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
                <DialogContent dividers>
                    <div className="d-flex flex-row col-12">
                        <div className="d-flex flex-column">
                            <p className="text-dark m-0">Please Select a Card Template</p>
                            <select className="form-select" defaultValue={selectedTemplate?.[0].subjects} onChange={(e) => setSelectedTemplate(e.target.value)}>
                                {cardTemplates.map(cardTemplate => (
                                    <option key={cardTemplate.id} value={cardTemplate.subjects}>
                                        {cardTemplate.title}
                                    </option>
                                ))}
                            </select>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={showFinalGrade} onChange={() => setShowFinalGrade(!showFinalGrade)} />
                                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Show Final Grade?</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        {selectedTemplate && (
                            <PDFViewer className='w-100' style={{height: '90vh'}}>
                                <Document>
                                    <Page size="A5" orientation="landscape" style={{display: 'flex', flexDirection: 'row'}}>
                                        <View style={{width: '50%', padding: '20px'}}>
                                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', marginBottom: '10px'}}>REPORT ON ATTENDANCE</Text>
                                                <View style={{width: '100%', display: 'flex', flexDirection: 'column', border: '1px solid black'}}>
                                                    <View style={{width: '100%', display: 'flex', flexDirection: 'row', borderBottom: '1px solid black'}}>
                                                        <View style={{width: '15%', borderRight: '1px solid black', padding: '2px'}}>
                                                            <Text style={{fontSize: '5px', textAlign: 'center'}}></Text>
                                                        </View>
                                                        <View style={styles.attendanceMonthContainer}>
                                                            <Text style={styles.attendanceMonthText}>Jun</Text>
                                                        </View>
                                                        <View style={styles.attendanceMonthContainer}>
                                                            <Text style={styles.attendanceMonthText}>Jul</Text>
                                                        </View>
                                                        <View style={styles.attendanceMonthContainer}>
                                                            <Text style={styles.attendanceMonthText}>Aug</Text>
                                                        </View>
                                                        <View style={styles.attendanceMonthContainer}>
                                                            <Text style={styles.attendanceMonthText}>Sep</Text>
                                                        </View>
                                                        <View style={styles.attendanceMonthContainer}>
                                                            <Text style={styles.attendanceMonthText}>Oct</Text>
                                                        </View>
                                                        <View style={styles.attendanceMonthContainer}>
                                                            <Text style={styles.attendanceMonthText}>Nov</Text>
                                                        </View>
                                                        <View style={styles.attendanceMonthContainer}>
                                                            <Text style={styles.attendanceMonthText}>Dec</Text>
                                                        </View>
                                                        <View style={styles.attendanceMonthContainer}>
                                                            <Text style={styles.attendanceMonthText}>Jan</Text>
                                                        </View>
                                                        <View style={styles.attendanceMonthContainer}>
                                                            <Text style={styles.attendanceMonthText}>Feb</Text>
                                                        </View>
                                                        <View style={styles.attendanceMonthContainer}>
                                                            <Text style={styles.attendanceMonthText}>Mar</Text>
                                                        </View>
                                                        <View style={styles.attendanceMonthContainer}>
                                                            <Text style={styles.attendanceMonthText}>Apr</Text>
                                                        </View>
                                                        <View style={styles.attendanceMonthContainer}>
                                                            <Text style={styles.attendanceMonthText}>Total</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{width: '100%', display: 'flex', flexDirection: 'row', borderBottom: '1px solid black'}}>
                                                        <View style={{width: '15%', borderRight: '1px solid black', padding: '2px'}}>
                                                            <Text style={{fontSize: '5px', textAlign: 'center'}}>No. of school days</Text>
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
                                        
                                        <View style={{width: '50%', padding: '20px', paddingTop: '8px'}}>
                                            
                                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                <View style={{display: 'flex', flexDirection: 'row', marginBottom: '3px', width: '90%'}}>
                                                    <Text style={{fontSize: '6px', fontFamily:'Helvetica'}}>DepEd SF-9</Text>
                                                    <Text style={{fontSize: '6px', fontFamily:'Helvetica', marginLeft: 'auto'}}>School ID: {advisory?.institution?.gov_id}</Text>
                                                </View>
                                                <View style={{display: 'flex', flexDirection: 'row', marginBottom: '3px'}}>
                                                    <Image source={`/deped-logo.png`} style={{height: 49, width: 49}}></Image>
                                                    <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px', marginHorizontal: '10px', gap: '1px'}}>
                                                        <Text style={{fontSize: '8px', fontFamily:'Helvetica'}}>Republic of the Philippines</Text>
                                                        <Text style={{fontSize: '8px', fontFamily:'Helvetica'}}>Department of Education</Text>
                                                        <Text style={{fontSize: '8px', fontFamily:'Helvetica-Bold'}}>Region XII</Text>
                                                        <Text style={{fontSize: '8px', fontFamily:'Helvetica'}}>Division of General Santos City</Text>
                                                        <Text style={{fontSize: '8px', fontFamily:'Helvetica'}}>{advisory?.institution?.division}</Text>
                                                    </View>
                                                    <Image source={`/${advisory?.institution?.abbr ? String(advisory?.institution?.abbr).toLowerCase(): 'deped'}-logo.png`} style={{height: 49, width: 49}}></Image>
                                                </View>
                                                <Text style={{fontSize: '6px', fontFamily:'Helvetica-Bold', alignSelf:'center'}}>{advisory?.institution?.title}</Text>
                                                <Text style={{fontSize: '6px', fontFamily:'Helvetica-Bold', alignSelf:'center'}}>{advisory?.institution?.address}</Text>
                                                
                                                <View style={{backgroundColor: 'black', marginTop: '10px', width: '100%', paddingVertical: '4px'}}>
                                                    <Text style={{color: 'white', fontSize: '8px', fontFamily:'Helvetica-Bold', alignSelf:'center'}}>REPORT CARD </Text>
                                                </View>
                                                
                                                <Text style={{fontFamily: 'Helvetica', fontSize: '8px', alignSelf:'flex-end'}}>LRN: {student.lrn}</Text>
                                                
                                                <View style={{marginTop: '2px', display: 'flex', flexDirection: 'row', alignSelf: 'flex-start'}}>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px', textTransform: 'uppercase'}}>Name:  <Text style={{textDecoration: 'underline'}}>{student.last_name}, {student.first_name} {String(student.middle_name).charAt(0).toUpperCase()}. {student.ext_name}</Text></Text>
                                                </View>
                                                
                                                <View style={{marginTop: '3px', display: 'flex', flexDirection: 'row', alignSelf: 'flex-start', gap: '20px'}}>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Age: <Text style={{textDecoration: 'underline'}}>{calculateAge(student.birthdate)}</Text></Text>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Sex: <Text style={{textDecoration: 'underline'}}>{String(student.gender).charAt(0).toUpperCase()}</Text></Text>
                                                </View>
                                                
                                                <View style={{marginTop: '3px', display: 'flex', flexDirection: 'row', alignSelf: 'flex-start', gap: '8px'}}>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Grade: <Text style={{textDecoration: 'underline'}}>{advisory?.grade_level}</Text></Text>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>Section: <Text style={{textDecoration: 'underline'}}>{advisory?.title}</Text></Text>
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
                                                        <Text style={{fontSize: isNameTooLong(`${advisory?.class_adviser.first_name} ${String(advisory?.class_adviser.middle_name).charAt(0).toUpperCase()}. ${advisory?.class_adviser.last_name}`) ? '6px': '8px', textTransform: 'uppercase', textDecoration: 'underline'}}>{advisory?.class_adviser.first_name} {String(advisory?.class_adviser.middle_name).charAt(0).toUpperCase()}. {advisory?.class_adviser.last_name}</Text>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginTop: '2px'}}>Teacher</Text>
                                                    </View>
                                                </View>
                                                
                                                <View style={{backgroundColor: 'black', marginTop: '5px', width: '100%', paddingVertical: '4px'}}>
                                                    <Text style={{color: 'white', fontSize: '8px', fontFamily:'Helvetica-Bold', alignSelf:'center'}}>Certificate of Transfer </Text>
                                                </View>
                                                
                                                <View style={{marginTop: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px'}}>
                                                    <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '10px'}}></Text>
                                                    <View style={{display: 'flex', flexDirection: 'row', marginTop: '2px', maringBottom: '8px', alignSelf: 'flex-start'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>Admitted to Grade:______________</Text>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica'}}>Section:______________</Text>
                                                    </View>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'flex-start'}}>Eligibility for Admission to Grade:_______________________</Text>
                                                    <View style={{display: 'flex', flexDirection: 'row', marginTop: '5px'}}>
                                                        <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                            <Text style={{fontSize: '8px', textTransform: 'uppercase', textDecoration: 'underline'}}>{advisory?.institution?.principal?.[0]?.first_name} {String(advisory?.institution?.principal?.[0]?.middle_name).charAt(0)}. {advisory?.institution?.principal?.[0]?.last_name}</Text>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginTop: '2px'}}>Principal {advisory?.institution?.abbr === 'GSCNSSAT' ? 'II' : ''}</Text>
                                                        </View>
                                                        <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                            <Text style={{fontSize: isNameTooLong(`${advisory?.class_adviser.first_name} ${String(advisory?.class_adviser.middle_name).charAt(0).toUpperCase()}. ${advisory?.class_adviser.last_name}`) ? '6px' : '8px', textTransform: 'uppercase', textDecoration: 'underline'}}>{advisory?.class_adviser.first_name} {String(advisory?.class_adviser.middle_name).charAt(0).toUpperCase()}. {advisory?.class_adviser.last_name}</Text>
                                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica', marginTop: '2px'}}>Teacher</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                
                                                <View style={{backgroundColor: 'black', marginTop: '2px', width: '100%', paddingVertical: '4px'}}>
                                                    <Text style={{color: 'white', fontSize: '8px', fontFamily:'Helvetica-Bold', alignSelf:'center'}}>CANCELLATION OF ELIGIBILITY TO TRANSFER </Text>
                                                </View>
                                                
                                                <View style={{marginTop:"2px", display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: "100%"}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'flex-start'}}>Admitted in:_______________________</Text>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'flex-start'}}>Date: _____________________________</Text>
                                                    <View style={{width:"100%",display: 'flex', flexDirection: 'row', justifyContent: "flex-end"}}>
                                                        <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: "center"}}>
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

                                            {/* ===== SUBJECTS START =====*/}
                                            <Subjects subjects={JSON.parse(selectedTemplate) || []} student={student}/>
                                            {/* ===== SUBJECTS END =====*/}
                                            <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                <View style={{width: '70%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', alignSelf: 'center'}}>GENERAL AVERAGE</Text>
                                                </View>
                                                <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}>
                                                        {handleGeneralAverage().ave}
                                                    </Text>
                                                </View>
                                                <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                                                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}>
                                                        {handleGeneralAverage().remarks}
                                                    </Text>
                                                </View>
                                            </View>

                                                <View style={{marginTop: '30px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
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
                                                    <Text style={{fontSize: '7px', fontFamily: 'Helvetica', alignSelf: 'center', whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>Makatao</Text>
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
                                                    <Text style={{fontSize: '7px', fontFamily: 'Helvetica', alignSelf: 'center', whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>Makabansa</Text>
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
                                            
                                            <View style={{marginTop: '20px', display: 'flex', flexDirection: 'column'}}>
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
        </Dialog>
        </>
    );
};
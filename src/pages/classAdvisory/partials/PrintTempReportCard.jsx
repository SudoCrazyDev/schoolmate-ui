import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useState } from 'react';
import { Page, Text, View, Document, PDFViewer, Image  } from '@react-pdf/renderer';
import PrintIcon from '@mui/icons-material/Print';
import { IconButton, Tooltip } from '@mui/material';
import { calculateAge, checkIfStudentHasSpecialSubject, GetActiveInstitution } from '../../../global/Helpers';

const spa = [
    {title: "Filipino"},
    {title: "English"},
    {title: "Mathematics"},
    {title: "Science"},
    {title: "Araling Panlipunan"},
    {title: "Edukasyon Sa Pagpapakatao"},
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
    {title: "Edukasyon Sa Pagpapakatao"},
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
    {title: "Edukasyon Sa Pagpapakatao"},
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
    {title: "Edukasyon Sa Pagpapakatao"},
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
    {title: "Edukasyon Sa Pagpapakatao"},
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
    {title: "Edukasyon Sa Pagpapakatao"},
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
    {title: "Edukasyon Sa Pagpapakatao"},
    {title: "TLE"},
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
    {title: "Edukasyon Sa Pagpapakatao"},
    {title: "TLE"},
    {title: "MAPEH", sub_subjects: [
        {title: "Music"},
        {title: "Arts"},
        {title: "PE"},
        {title: "Health"}
    ]}
];

export default function PrintTempReportCard({student, subjects, advisory}){
    const [open ,setOpen] = useState(false);
    
    const handleModalState = () => {
        setOpen(!open);
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
        <Tooltip title="Print Temp Report Card">
            <IconButton size="small" onClick={() => handleModalState()} color="warning">
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
                                    <Page size="A5" orientation="landscape" style={{height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', fontFamily: 'Helvetica', flexWrap: 'wrap'}}>
                                        <View style={{ width: '95%', alignContent: "center", display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '10px' }}>
                                            <Text style={{ textTransform: 'uppercase', textAlign: 'center', fontSize: '13px' }}>{advisory?.institution?.title}</Text>
                                            <Text style={{ fontSize: '10px', textAlign: 'center' }}>{advisory?.institution?.address}</Text>
                                        </View>
                                        <View style={{ paddingHorizontal: '20px', width: '100%', display: 'flex', flexDirection: 'row', marginTop: '5px'}}>
                                            <Text style={{ textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '12px'}}>{student?.last_name}, {student?.first_name}</Text>
                                            <Text style={{ marginLeft: 'auto', fontFamily: 'Helvetica-Bold', fontSize: '12px' }}>{student?.lrn}</Text>
                                        </View>
                                        <View style={{width: '50%', paddingHorizontal: '20px', display: 'flex', flexDirection: 'column', marginTop: '5px'}}>
                                            <Text style={{fontSize: '8px', fontFamily: 'Helvetica-Bold', marginBottom: '10px'}}>REPORT ON LEARNING PROGRESS AND ACHIEVEMENT</Text>
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

                                            {checkIfStudentHasSpecialSubject(student, 'ENTREPRENEURSHIP') && (
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>Entreprenuership</Text>
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

                                            {checkIfStudentHasSpecialSubject(student, 'ENTREPRENEURSHIP') && (
                                                <View style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                                                    <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                                                        <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>Entreprenuership</Text>
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
                                                
                                                <View style={{marginTop: '0', display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
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
                                                <View style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: '5px'}}>
                                                    <Text style={{ textTransform: 'uppercase', fontSize: '10px', fontFamily: 'Helvetica-Bold' }}>{advisory?.class_adviser?.first_name} {String(advisory?.class_adviser?.middle_name).charAt(0)}. {advisory?.class_adviser?.last_name}</Text>
                                                    <Text style={{ fontSize: '8px'}}>ADVISER</Text>
                                                </View>
                                        </View>
                                        
                                        <View style={{width: '50%', paddingHorizontal: '20px', display: 'flex', flexDirection: 'column', marginTop: '5px'}}>
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
                                            
                                            <View style={{marginTop: '0', display: 'flex', flexDirection: 'column'}}>
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
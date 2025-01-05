import { Page, Text, View, Document, PDFViewer, Image, StyleSheet, Font  } from '@react-pdf/renderer';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const subjectsSPAG7 = [
    {title: 'FILIPINO', matching: 'filipino'},
    {title: 'ENGLISH', matching: 'english'},
    {title: 'MATH', matching: 'mathematics'},
    {title: 'SCIENCE', matching: 'science'},
    {title: 'ArPan', matching: 'araling panlipunan'},
    {title: 'EsP', matching: 'edukasyon sa pagpapakatao'},
    {title: 'Specialization', matching: 'specialization'},
    {title: 'MAPEH'},
    {title: 'Music & Arts', matching: 'music & arts'},
    {title: 'PE & Health', matching: 'pe & health'},
];
const subjectsSPA = [
    {title: 'FILIPINO', matching: 'filipino'},
    {title: 'ENGLISH', matching: 'english'},
    {title: 'MATH', matching: 'mathematics'},
    {title: 'SCIENCE', matching: 'science'},
    {title: 'ArPan', matching: 'araling panlipunan'},
    {title: 'EsP', matching: 'edukasyon sa pagpapakatao'},
    {title: 'Specialization', matching: 'specialization'},
    {title: 'MAPEH'},
    {title: 'Music', matching: 'music'},
    {title: 'Arts', matching: 'arts'},
    {title: 'PE', matching: 'pe'},
    {title: 'Health', matching: 'health'}
];
const subjectsSPJG7 = [
    {title: 'FILIPINO', matching: 'filipino'},
    {title: 'ENGLISH', matching: 'english'},
    {title: 'MATH', matching: 'mathematics'},
    {title: 'SCIENCE', matching: 'science'},
    {title: 'ArPan', matching: 'araling panlipunan'},
    {title: 'EsP', matching: 'edukasyon sa pagpapakatao'},
    {title: 'Fil. Journ', matching: 'fil. journ'},
    {title: 'Eng. Journ', matching: 'eng. journ'},
    {title: 'MAPEH'},
    {title: 'Music & Arts', matching: 'music & arts'},
    {title: 'PE & Health', matching: 'pe & health'},
];
const subjectsSPJ = [
    {title: 'FILIPINO', matching: 'filipino'},
    {title: 'ENGLISH', matching: 'english'},
    {title: 'MATH', matching: 'mathematics'},
    {title: 'SCIENCE', matching: 'science'},
    {title: 'ArPan', matching: 'araling panlipunan'},
    {title: 'EsP', matching: 'edukasyon sa pagpapakatao'},
    {title: 'Fil. Journ', matching: 'fil. journ'},
    {title: 'Eng. Journ', matching: 'eng. journ'},
    {title: 'MAPEH'},
    {title: 'Music', matching: 'music'},
    {title: 'Arts', matching: 'arts'},
    {title: 'PE', matching: 'pe'},
    {title: 'Health', matching: 'health'}
];
const subjectsSTEG7 = [
    {title: 'FILIPINO', matching: 'filipino'},
    {title: 'ENGLISH', matching: 'english'},
    {title: 'MATH', matching: 'mathematics'},
    {title: 'SCIENCE', matching: 'science'},
    {title: 'ArPan', matching: 'araling panlipunan'},
    {title: 'EsP', matching: 'edukasyon sa pagpapakatao'},
    {title: 'MATHElec', matching: 'math electives'},
    {title: 'RES', matching:'research'},
    {title: 'ICT', matching: 'ict / robotics'},
    {title: 'MAPEH'},
    {title: 'Music & Arts', matching: 'music & arts'},
    {title: 'PE & Health', matching: 'pe & health'},
];
const subjectsSTE = [
    {title: 'FILIPINO', matching: 'filipino'},
    {title: 'ENGLISH', matching: 'english'},
    {title: 'MATH', matching: 'mathematics'},
    {title: 'SCIENCE', matching: 'science'},
    {title: 'ArPan', matching: 'araling panlipunan'},
    {title: 'EsP', matching: 'edukasyon sa pagpapakatao'},
    {title: 'MATHElec', matching: 'math electives'},
    {title: 'RES', matching:'research'},
    {title: 'ICT', matching: 'ict / robotics'},
    {title: 'MAPEH'},
    {title: 'Music', matching: 'music'},
    {title: 'Arts', matching: 'arts'},
    {title: 'PE', matching: 'pe'},
    {title: 'Health', matching: 'health'}
];
const subjectsMatchingG7 = [
    {title: 'FILIPINO', matching: 'filipino'},
    {title: 'ENGLISH', matching: 'english'},
    {title: 'MATH', matching: 'mathematics'},
    {title: 'SCIENCE', matching: 'science'},
    {title: 'ArPan', matching: 'araling panlipunan'},
    {title: 'EsP', matching: 'edukasyon sa pagpapakatao'},
    {title: 'TLE', matching: 'tle'},
    {title: 'MAPEH'},
    {title: 'Music & Arts', matching: 'music & arts'},
    {title: 'PE & Health', matching: 'pe & health'},
];
const subjectsMatching = [
    {title: 'FILIPINO', matching: 'filipino'},
    {title: 'ENGLISH', matching: 'english'},
    {title: 'MATH', matching: 'mathematics'},
    {title: 'SCIENCE', matching: 'science'},
    {title: 'ArPan', matching: 'araling panlipunan'},
    {title: 'EsP', matching: 'edukasyon sa pagpapakatao'},
    {title: 'TLE', matching: 'tle'},
    {title: 'MAPEH'},
    {title: 'Music', matching: 'music'},
    {title: 'Arts', matching: 'arts'},
    {title: 'PE', matching: 'pe'},
    {title: 'Health', matching: 'health'}
];
export default function PrintConsolidatedGrades({section, open, quarter = 1}){
    const user = useSelector(state => state.user);
    const [maleStudents, setMaleStudents] = useState([]);
    const [femaleStudents, setFemaleStudents] = useState([]);

    const handleFetchSectionDetails = async () => {
        await axios.get(`institution_sections/${section.id}`)
        .then((res) => {
            let students = res.data.students || [];
            let sortedStudents = students.sort((a, b) => a.last_name.localeCompare(b.last_name));
            let maleStudents = sortedStudents.filter(student => student.gender === 'male');
            let femaleStudents = sortedStudents.filter(student => student.gender === 'female');
            setMaleStudents(maleStudents);
            setFemaleStudents(femaleStudents);
        });
    };
    
    const handleGetGrades = (student, subject) => {
        let grade = Number(student?.grades?.filter(grade => String(grade.subject.title).toLowerCase() === subject.matching && grade.quarter === String(quarter))?.[0]?.grade).toFixed();
        if(subject.title == 'MAPEH'){
            let grades = student?.grades?.filter(grade => ['music', 'arts', 'pe', 'health'].includes(String(grade.subject.title).toLowerCase()) && grade.quarter === String(quarter)) || [];
            let total = grades.reduce((acc, grade) => acc + Number(grade.grade), 0);
            if(section.grade_level === '7'){
                grades = student?.grades?.filter(grade => ['music & arts', 'pe & health'].includes(String(grade.subject.title).toLowerCase()) && grade.quarter === String(quarter)) || [];
                total = grades.reduce((acc, grade) => acc + Number(grade.grade), 0);
                return Number(total/2).toFixed();
            }
            return Number(total/4).toFixed();
        }
        if(isNaN(grade) || ""){
            return "";
        } else {
            return grade;
        };
    };

    const handleGetGeneralAve = (student) => {
        let availableGrades = student?.grades?.filter(grade => {
            const lowerCaseSubject = String(grade.subject.title).toLowerCase();
            if(section.grade_level === '7'){
                return !['music & arts', 'pe & health'].includes(lowerCaseSubject) && grade.quarter === String(quarter);
            }
            return !['music', 'arts', 'pe', 'health'].includes(lowerCaseSubject) && grade.quarter === String(quarter);
        });
        let mapehGeneral = student?.grades?.filter(grade => {
            const lowerCaseSubject = String(grade.subject.title).toLowerCase();
            if(section.grade_level === '7'){
                return ['music & arts', 'pe & health'].includes(lowerCaseSubject) && grade.quarter === String(quarter);
            }
            return ['music', 'arts', 'pe', 'health'].includes(String(grade.subject.title).toLowerCase()) && grade.quarter === String(quarter)
        }) || [];
        let mapehTotal = mapehGeneral.reduce((acc, grade) => acc + Number(grade.grade), 0) / mapehGeneral.length;
        let steTotal = availableGrades.reduce((acc, grade) => acc + Number(grade.grade), 0);
        return Number(Number(steTotal + mapehTotal)/(availableGrades.length + 1)).toFixed();
    };
    
    const handleCheckIfHonor = (student) => {
        let gen_ave = Number(handleGetGeneralAve(student));
        if(gen_ave >= 90){
            return 'with honors'
        } else if (gen_ave >=97){
            return 'with high honors'
        } else if (gen_ave >=98){
            return 'with highest honors'
        }
        return "";
    };
    
    const CheckIfSpecialProgram = () => {
        if(String(section.title).toLowerCase().includes('spj') || String(section.title).toLowerCase().includes('ste') || String(section.title).toLowerCase().includes('spa')){
            return true;
        }
    };
    
    useEffect(() => {
        if(open){
            handleFetchSectionDetails();
        }
    }, [open]);
    
    console.log(['ste', 'spj', 'spa'].includes(String(section.title).toLowerCase()), String(section.title).toLowerCase());
    
    return(
        <PDFViewer className='w-100 h-100'>
            <Document>
                <Page size="A4" style={{display: 'flex', flexDirection: 'column', width: '100%', padding: '20px', border: '1px solid black'}}>
                    <View style={{alignSelf: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2px'}}>
                        <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '12px'}}>{user.institutions?.[0]?.title}</Text>
                        <Text style={{textTransform: 'capitalize', fontFamily: 'Helvetica', fontSize: '10px'}}>{user.institutions?.[0]?.address}</Text>
                        <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '10px'}}>Consolidated Grades</Text>
                        <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica', fontSize: '10px'}}>Quarter</Text>
                        <Text style={{textTransform: 'capitalize', fontFamily: 'Helvetica-Bold', fontSize: '10px'}}>{`${section.grade_level} - ${section.title}`}</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', marginTop: '5px'}}>
                        <View style={{width: '15%', border: '0.5px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>LEARNER'S NAME</Text>
                        </View>
                        <View style={{width: '70%', display: 'flex', flexDirection: 'column', borderTop: '0.5px solid black'}}>
                            <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica', fontSize: '8px', textAlign: 'center'}}>SUBJECTS</Text>
                            <View style={{display: 'flex', flexDirection: 'row', borderTop: '0.5px solid black', borderBottom: '0.5px solid black', width: '100%'}}>
                                {String(String(section.title).toLowerCase()).includes('ste') && section.grade_level !== '7' && subjectsSTE.map((subject, i) => (
                                    <View style={{padding: '3px', borderRight: '0.5px solid black', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{subject.title}</Text>
                                    </View>
                                ))}
                                {String(String(section.title).toLowerCase()).includes('spa') && section.grade_level !== '7' && subjectsSPA.map((subject, i) => (
                                    <View style={{padding: '3px', borderRight: '0.5px solid black', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{subject.title}</Text>
                                    </View>
                                ))}
                                {String(String(section.title).toLowerCase()).includes('spj') && section.grade_level !== '7' && subjectsSPJ.map((subject, i) => (
                                    <View style={{padding: '3px', borderRight: '0.5px solid black', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{subject.title}</Text>
                                    </View>
                                ))}
                                {!CheckIfSpecialProgram() && section.grade_level !== '7' && subjectsMatching.map((subject, i) => (
                                    <View style={{padding: '3px', borderRight: '0.5px solid black', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{subject.title}</Text>
                                    </View>
                                ))}
                                {/* ============================= GRADE 7 ========================================== */}
                                {String(String(section.title).toLowerCase()).includes('ste') && section.grade_level == '7' && subjectsSTEG7.map((subject, i) => (
                                    <View style={{padding: '3px', borderRight: '0.5px solid black', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{subject.title}</Text>
                                    </View>
                                ))}
                                {String(String(section.title).toLowerCase()).includes('spa') && section.grade_level == '7' && subjectsSPAG7.map((subject, i) => (
                                    <View style={{padding: '3px', borderRight: '0.5px solid black', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{subject.title}</Text>
                                    </View>
                                ))}
                                {String(String(section.title).toLowerCase()).includes('spj') && section.grade_level == '7' && subjectsSPJG7.map((subject, i) => (
                                    <View style={{padding: '3px', borderRight: '0.5px solid black', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{subject.title}</Text>
                                    </View>
                                ))}
                                {!CheckIfSpecialProgram() && section.grade_level == '7' && subjectsMatchingG7.map((subject, i) => (
                                    <View style={{padding: '3px', borderRight: '0.5px solid black', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{subject.title}</Text>
                                    </View>
                                ))}
                                {/* ============================= GRADE 7 ========================================== */}
                            </View>
                        </View>
                        <View style={{width: '5%', borderLeft: '0.5px solid black', borderTop: '0.5px solid black', borderBottom: '0.5px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '8px', textAlign: 'center'}}>GEN. AVE</Text>
                        </View>
                        <View style={{width: '10%', border: '0.5px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '8px', textAlign: 'center'}}>REMARKS</Text>
                        </View>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <View style={{padding: '2px', width: '15%', border: '0.5px solid black', borderRight: '0.5px solid black', borderTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>MALES</Text>
                        </View>
                        <View style={{padding: '2px', width: '85%', border: '0.5px solid black', borderRight: '0.5px solid black', borderTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '8px'}}></Text>
                        </View>
                    </View>
                    {maleStudents.map((student, i) => (
                        <View style={{display: 'flex', flexDirection: 'row', borderBottom: '0.5px solid black'}}>
                            <View style={{paddingLeft: '3px', width: '15%', borderLeft: '0.5px solid black', borderRight: '0.5px solid black', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                                <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{student.last_name}, {student.first_name}</Text>
                            </View>
                            <View style={{width: '70%', display: 'flex', flexDirection: 'row'}}>
                                <View style={{display: 'flex', flexDirection: 'row', borderTop: 0, borderBottom: 0, width: '100%'}}>
                                    {String(String(section.title).toLowerCase()).includes('ste') && section.grade_level !== '7' && subjectsSTE.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', textOverflow: 'ellipsis', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {String(String(section.title).toLowerCase()).includes('spa') && section.grade_level !== '7' && subjectsSPA.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', textOverflow: 'ellipsis', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {String(String(section.title).toLowerCase()).includes('spj') && section.grade_level !== '7' && subjectsSPJ.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', textOverflow: 'ellipsis', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {!CheckIfSpecialProgram() && section.grade_level !== '7' && subjectsMatching.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {/* ============================= GRADE 7 ========================================== */}
                                    {String(String(section.title).toLowerCase()).includes('ste') && section.grade_level == '7' && subjectsSTEG7.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', textOverflow: 'ellipsis', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {String(String(section.title).toLowerCase()).includes('spa') && section.grade_level == '7' && subjectsSPAG7.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', textOverflow: 'ellipsis', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {String(String(section.title).toLowerCase()).includes('spj') && section.grade_level == '7' && subjectsSPJG7.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', textOverflow: 'ellipsis', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {!CheckIfSpecialProgram() && section.grade_level == '7' && subjectsMatchingG7.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {/* ============================= GRADE 7 ========================================== */}
                                </View>
                            </View>
                            <View style={{width: '5%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '10px', textAlign: 'center'}}>{handleGetGeneralAve(student)}</Text>
                            </View>
                            <View style={{width: '10%', border: '0.5px solid black', borderTop: 0, borderBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '6px', textAlign: 'center'}}>{handleCheckIfHonor(student)}</Text>
                            </View>
                        </View>
                    ))}
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <View style={{padding: '2px', width: '15%', border: '0.5px solid black', borderRight: '0.5px solid black', borderTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>FEMALES</Text>
                        </View>
                        <View style={{padding: '2px', width: '85%', border: '0.5px solid black', borderRight: '0.5px solid black', borderTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '8px'}}></Text>
                        </View>
                    </View>
                    {femaleStudents.map((student, i) => (
                        <View style={{display: 'flex', flexDirection: 'row', borderTop: '0.5px solid black'}}>
                            <View style={{paddingLeft: '3px', width: '15%', borderLeft: '0.5px solid black', borderRight: '0.5px solid black', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                                <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{student.last_name}, {student.first_name}</Text>
                            </View>
                            <View style={{width: '70%', display: 'flex', flexDirection: 'row'}}>
                                <View style={{display: 'flex', flexDirection: 'row', borderBottom: 0, width: '100%'}}>
                                    {String(String(section.title).toLowerCase()).includes('ste') && section.grade_level !== '7' && subjectsSTE.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', textOverflow: 'ellipsis', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {String(String(section.title).toLowerCase()).includes('spa') && section.grade_level !== '7' && subjectsSPA.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', textOverflow: 'ellipsis', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {String(String(section.title).toLowerCase()).includes('spj') && section.grade_level !== '7' && subjectsSPJ.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', textOverflow: 'ellipsis', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {!CheckIfSpecialProgram() && section.grade_level !== '7' && subjectsMatching.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {/* ============================= GRADE 7 ========================================== */}
                                    {String(String(section.title).toLowerCase()).includes('ste') && section.grade_level == '7' && subjectsSTEG7.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', textOverflow: 'ellipsis', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {String(String(section.title).toLowerCase()).includes('spa') && section.grade_level == '7' && subjectsSPAG7.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', textOverflow: 'ellipsis', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {String(String(section.title).toLowerCase()).includes('spj') && section.grade_level == '7' && subjectsSPJG7.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', textOverflow: 'ellipsis', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {!CheckIfSpecialProgram() && section.grade_level == '7' && subjectsMatchingG7.map((subject, i) => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', width: '8.333%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '10px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                    {/* ============================= GRADE 7 ========================================== */}
                                </View>
                            </View>
                            <View style={{width: '5%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '10px', textAlign: 'center'}}>{handleGetGeneralAve(student)}</Text>
                            </View>
                            <View style={{width: '10%', border: '0.5px solid black', borderTop: 0, borderBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '6px', textAlign: 'center'}}>{handleCheckIfHonor(student)}</Text>
                            </View>
                        </View>
                    ))}
                </Page>
            </Document>
        </PDFViewer>
    );
};
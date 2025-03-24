import { Page, Text, View, Document, PDFViewer, Image, StyleSheet, Font  } from '@react-pdf/renderer';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

export default function PrintConsolidatedGrades({template, section, open, quarter = 1, quarterTitle}){
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
        let grade = Number(student?.grades?.filter(grade => String(grade.subject.title).toLowerCase() === String(subject.subject_to_match).toLowerCase() && grade.quarter === String(quarter))?.[0]?.grade).toFixed();
        if(String(subject.subject_to_match).toLowerCase() === 'mapeh'){
            let mapeh_subjects = ['pe', 'arts', 'health', 'music', 'pe & health', 'music & arts'];
            let mapeh_grades = student?.grades?.filter(grade => mapeh_subjects.includes(String(grade.subject.title).toLowerCase()) && grade.quarter === String(quarter));
            let mapeh_grade = mapeh_grades.reduce((accumulator, currentValue) => {
                return accumulator + Number(Number(currentValue.grade).toFixed());
            }, 0);
            grade = mapeh_grade / mapeh_grades.length;
        }
        if(isNaN(grade) || ""){
            return "";
        } else {
            return Number(Number(grade).toFixed());
        };
    };

    const handleGetGeneralAve = (student) => {
        let mapeh_subjects = ['pe', 'arts', 'health', 'music', 'pe & health', 'music & arts'];
        let subject_grades = template.map(subject => {
            return student?.grades?.filter(grade =>
                !mapeh_subjects.includes(grade.subject.title)
                && String(subject.subject_to_match).toLowerCase() === String(grade.subject.title).toLowerCase()
                && grade.quarter === String(quarter)
            );
        }).filter(grade => grade.length > 0).flat();

        let accu_grade = subject_grades.reduce((accumulator, currentValue) => {
            return accumulator + Number(Number(currentValue.grade).toFixed());
        }, 0);

        let mapeh_grades = student?.grades?.filter(grade => mapeh_subjects.includes(String(grade.subject.title).toLowerCase()) && grade.quarter === String(quarter));
        let mapeh_accu_grade = mapeh_grades.reduce((accumulator, currentValue) => {
            return accumulator + Number(Number(currentValue.grade).toFixed());
        }, 0);

        return Number(Number(accu_grade + (mapeh_accu_grade / mapeh_grades.length))/(subject_grades.length + 1)).toFixed();
    };

    const CheckIfHonor = (student) => {
        let gen_ave = Number(handleGetGeneralAve(student));
        if(gen_ave >=98){
            return 'with highest honors'
        }else if (gen_ave >= 95){
            return 'with high honors'
        }else if (gen_ave >= 90){
            return 'with honors'
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
    
    return(
        <PDFViewer className='w-100 h-100'>
            <Document>
                <Page size="A4" orientation="landscape" style={{display: 'flex', flexDirection: 'column', width: '100%', padding: '20px', border: '1px solid black'}}>
                    <View style={{alignSelf: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2px'}}>
                        <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '12px'}}>{user.institutions?.[0]?.title}</Text>
                        <Text style={{textTransform: 'capitalize', fontFamily: 'Helvetica', fontSize: '10px'}}>{user.institutions?.[0]?.address}</Text>
                        <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '10px'}}>Consolidated Grades</Text>
                        <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica', fontSize: '10px'}}>{quarterTitle} Quarter</Text>
                        <Text style={{textTransform: 'capitalize', fontFamily: 'Helvetica-Bold', fontSize: '10px'}}>{`${section.grade_level} - ${section.title}`}</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', marginTop: '5px'}}>
                        <View style={{width: '15%', border: '0.5px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '8px'}}>LEARNER'S NAME</Text>
                        </View>
                        <View style={{width: '70%', display: 'flex', flexDirection: 'column', borderTop: '0.5px solid black'}}>
                            <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica', fontSize: '8px', textAlign: 'center'}}>SUBJECTS</Text>
                            <View style={{display: 'flex', flexDirection: 'row', borderTop: '0.5px solid black', borderBottom: '0.5px solid black', width: '100%'}}>
                                {template.length > 0 && template.map(subject => (
                                    <View style={{padding: '3px', borderRight: '0.5px solid black', width: `${100/template.length}%`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{subject?.card_subject}</Text>
                                    </View>
                                ))}
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
                                    {template.length > 0 && template.map(subject => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', width: `${100/template.length}%`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <View style={{width: '5%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '10px', textAlign: 'center'}}>{handleGetGeneralAve(student)}</Text>
                            </View>
                            <View style={{width: '10%', border: '0.5px solid black', borderTop: 0, borderBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '6px', textAlign: 'center'}}>{CheckIfHonor(student)}</Text>
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
                                    {template.length > 0 && template.map(subject => (
                                        <View style={{padding: '3px', borderRight: '0.5px solid black', width: `${100/template.length}%`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontFamily: 'Helvetica-Bold', fontSize: '7px'}}>{handleGetGrades(student, subject)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <View style={{width: '5%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '10px', textAlign: 'center'}}>{handleGetGeneralAve(student)}</Text>
                            </View>
                            <View style={{width: '10%', border: '0.5px solid black', borderTop: 0, borderBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{textTransform: 'uppercase', fontFamily: 'Helvetica-Bold', fontSize: '6px', textAlign: 'center'}}>{CheckIfHonor(student)}</Text>
                            </View>
                        </View>
                    ))}
                </Page>
            </Document>
        </PDFViewer>
    );
};
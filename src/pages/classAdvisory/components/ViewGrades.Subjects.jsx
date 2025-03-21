import { Page, Text, View, Document, PDFViewer, Image, StyleSheet   } from '@react-pdf/renderer';

export default function Subjects({subjects, student}){
    const student_grades = student.grades || [];

    const handleFindStudentGrade = (subject, quarter) => {
        let grade_subject = student_grades.filter(advSubject =>
            String(advSubject.subject.title).replaceAll(" ", '').toLowerCase() === String(subject).replaceAll(" ", "").toLowerCase()
            &&
            advSubject.quarter === quarter
        )?.[0];

        let student_grade = grade_subject?.grade || 0;

        if(String(subject).toLowerCase() === 'mapeh'){
            let mapeh_subjects = ['pe', 'arts', 'health', 'music', 'pe & health', 'music & arts'];
            let mapeh_grades = student_grades.filter(grade => mapeh_subjects.includes(String(grade.subject.title).toLowerCase()) && grade.quarter === quarter);
            let mapeh_grade = mapeh_grades.reduce((accumulator, currentValue) => {
                return accumulator + Number(Number(currentValue.grade).toFixed());
            }, 0);
            student_grade = mapeh_grade / mapeh_grades.length;
        }
        if(Number(student_grade).toFixed() == 0 || Number(student_grade).toFixed() == 'NaN'){
            return "";
        }
        return Number(student_grade).toFixed() == 0 ? "" : Number(student_grade).toFixed();
    };
    
    const handleFinalGrade = (subject) => {
        let grade_subjects = student_grades.filter(advSubject =>
            String(advSubject.subject.title).replaceAll(" ", '').toLowerCase() === String(subject).replaceAll(" ", "").toLowerCase()
        );
        let final_grade = grade_subjects.reduce((accumulator, currentValue) => {
            return accumulator + Number(Number(currentValue.grade).toFixed());
        }, 0);
        final_grade = final_grade / grade_subjects.length;
        
        if(String(subject).toLowerCase() === 'mapeh'){
            let mapeh_subjects = ['pe', 'arts', 'health', 'music', 'pe & health', 'music & arts'];
            let mapeh_grades = student_grades.filter(grade => mapeh_subjects.includes(String(grade.subject.title).toLowerCase()));
            let mapeh_grade = mapeh_grades.reduce((accumulator, currentValue) => {
                return accumulator + Number(Number(currentValue.grade).toFixed());
            }, 0);
            final_grade = mapeh_grade / mapeh_grades.length;
        }
        
        if(Number(final_grade).toFixed() == 0 || Number(final_grade).toFixed() == 'NaN'){
            return "";
        }
        return Number(final_grade).toFixed() == 0 ? "" : Number(final_grade).toFixed();
    };
    
    return(
        <>
        {subjects.length > 0 && subjects.map(subject =>(
            <View key={crypto.randomUUID()} style={{display: 'flex', flexDirection: 'row', borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
                <View style={{paddingLeft: '2px', paddingVertical: '2px', width: '30%', display: 'flex', flexDirection:'row', alignContent: 'left', justifyContent: 'flex-start', borderRight: '1px solid black'}}>
                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'left'}}>{subject.card_subject}</Text>
                </View>
                <View style={{width: '40%', display: 'flex', flexDirection: 'row', borderRight: '1px solid black', alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Text>{handleFindStudentGrade(subject.subject_to_match, "1")}</Text>
                    </View>
                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Text>{handleFindStudentGrade(subject.subject_to_match, "2")}</Text>
                    </View>
                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', borderRight: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Text>{handleFindStudentGrade(subject.subject_to_match, "3")}</Text>
                    </View>
                    <View style={{height:'100%' ,fontSize: '8px', fontFamily: 'Helvetica', width: '25%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Text>{handleFindStudentGrade(subject.subject_to_match, "4")}</Text>
                    </View>
                </View>
                <View style={{width: '10%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center', borderRight: '1px solid black'}}>
                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center', textAlign: 'center'}}>
                        {handleFinalGrade(subject.subject_to_match)}
                    </Text>
                </View>
                <View style={{width: '20%', display: 'flex', flexDirection:'row', alignContent: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}></Text>
                </View>
            </View>
        ))}
        </>
    );
};
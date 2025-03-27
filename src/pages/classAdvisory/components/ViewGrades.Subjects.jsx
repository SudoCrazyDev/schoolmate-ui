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
            
            const groupedGrades = {};

            mapeh_grades.forEach((gradeObj) => {
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
        
            let totalAverage = 0;
            let subjectCount = 0;
            for(const subjectTitle in averagedGrades){
                totalAverage += averagedGrades[subjectTitle].averageGrade;
                subjectCount++;
            }
            student_grade = totalAverage / subjectCount;
        }
        if(Number(student_grade).toFixed() == 0 || Number(student_grade).toFixed() == 'NaN'){
            return "";
        }
        return Number(student_grade).toFixed() == 0 ? "" : Number(student_grade).toFixed();
    };

    const handleFinalGrade = (subject) => {
        let mapeh_subjects = ['pe', 'arts', 'health', 'music', 'pe & health', 'music & arts'];
        if(mapeh_subjects.includes(String(subject).toLowerCase())) return "";
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
            
            const groupedByQuarter = {};
            
            mapeh_grades.forEach((gradeObj) => {
                const quarter = gradeObj.quarter;
                const gradeValue = parseInt(gradeObj.grade);

                if (!groupedByQuarter[quarter]) {
                    groupedByQuarter[quarter] = {
                    totalGrade: 0,
                    count: 0,
                    };
                }

                groupedByQuarter[quarter].totalGrade += gradeValue;
                groupedByQuarter[quarter].count += 1;
            });
            const groupedWithAverage = {};
            for (const subjectQuarter in groupedByQuarter) {
                groupedWithAverage[subjectQuarter] = {
                totalGrade: groupedByQuarter[subjectQuarter].totalGrade,
                count: groupedByQuarter[subjectQuarter].count,
                averageGrade: Number(Number(groupedByQuarter[subjectQuarter].totalGrade / groupedByQuarter[subjectQuarter].count).toFixed()),
                };
            }
            
            let totalAverage = 0;
            let subjectCount = 0;
            for(const subjectQuarter in groupedWithAverage){
                totalAverage += groupedWithAverage[subjectQuarter].averageGrade;
                subjectCount++;
            }
            
            final_grade = totalAverage / subjectCount;
            // final_grade = mapeh_grade / mapeh_grades.length;
        }

        if(Number(final_grade).toFixed() == 0 || Number(final_grade).toFixed() == 'NaN'){
            return "";
        }
        return Number(final_grade).toFixed() == 0 ? "" : Number(final_grade).toFixed();
    };

    const handleRemarks = (subject) => {
        let mapeh_subjects = ['pe', 'arts', 'health', 'music', 'pe & health', 'music & arts'];
        if(mapeh_subjects.includes(String(subject).toLowerCase())) return "";
        let finalGrade = handleFinalGrade(subject);
        if(parseInt(finalGrade) >= 75){
            return 'PASSED';
        } else{
            return 'FAILED';
        }
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
                    <Text style={{fontSize: '8px', fontFamily: 'Helvetica', alignSelf: 'center'}}>
                        {handleRemarks(subject.subject_to_match)}
                    </Text>
                </View>
            </View>
        ))}
        </>
    );
};
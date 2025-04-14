import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * Check if the user has certain role.
 * @param {array} accessRole Array of Roles.
 * @returns {boolean} default false
 */
export const userHasRole = (accessRoles) => {
    const { roles } = useSelector(state => state.user);
    if(roles){
        const hasRole = accessRoles.some(accessRole => roles.some(userRole => userRole.slug === accessRole));
        return hasRole;
    }
    return false;
};

userHasRole.propTypes = {
    accessRoles: PropTypes.array
};

export const getUserId = () => {
    const { user } = useSelector(state => state.user);
    return user.id;
};

/**
 * Returns the active institution details.
 * @constructor
 * @returns{{id: String, institution: String, abbr: String}}
 */
export const GetActiveInstitution = () => {
    const institution = useSelector(state => state.user?.institutions?.[0]);
    if(institution){
        return {
            id: institution.id,
            title: institution.title,
            abbr: institution.abbr
        };
    }
    return {
        id: 0,
        institution: 'NO INSTITUTION',
        abbr: ''
    };
};

export const GetAppInstitutionRoles = async () => {
    return [];
};

export const calculateAge = (birthdate) => {
    const birthdateParts = birthdate.split('-');
    const birthYear = parseInt(birthdateParts[0]);
    const birthMonth = parseInt(birthdateParts[1])
    const birthDay = parseInt(birthdateParts[2]);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    let age = currentYear - birthYear;

    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
        age--;
    }

  return age;
};

export const checkIfStudentHasSpecialSubject = (student, subject) => {
    let filtered_subject = student?.grades?.filter(grade => String(grade.subject.title).toLowerCase() == String(subject).toLowerCase());
    return filtered_subject.length > 0 ? true : false;
};

export const axiosErrorCodeHandler = (error) => {
    switch(error.code){
        case 'ERR_NETWORK':
            return 'Network error. Please try again later.';
        case 'ERR_CONNECTION_REFUSED':
            return 'Connection refused. Please try again later.';
        default:
            return error.response.data.message;
    }
};

export const CheckIfHonor = (grade) => {
    if(grade >=98){
        return 'PROMOTED with Highest Honors'
    }else if (grade >= 95){
        return 'PROMOTED with High Honors'
    }else if (grade >= 90){
        return 'PROMOTED with Honors'
    } else if (grade < 75){
        return 'RETAINED';
    } else {
        return 'PROMOTED'
    }
};


export const IsNegative = (value) => {
    return typeof value === 'number' && value < 0;
};

export const setCookie = (name, value) => {
    const d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

export const getCookie = (name) => {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
        }
    }
    return "";
};

export const getStudentRemarks = (student, template) => {
    if(!template) return ;
    let mapeh_subjects = ['pe', 'arts', 'health', 'music', 'pe & health', 'music & arts'];
    let final_subject_grades = template.map(subject => {
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

        groupedGrades[subjectTitle].totalGrade += Number(Number(gradeValue).toFixed());
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
    
    if(template.some(templateSubject => String(templateSubject.subject_to_match).toLowerCase() === 'mapeh')){
        let final_mapeh_grades = student?.grades?.filter(grade => mapeh_subjects.includes(String(grade.subject.title).toLowerCase()));
            
        const groupedByQuarter = {};
    
        final_mapeh_grades.forEach((gradeObj) => {
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
        averagedGrades['Mapeh'] = {
            averageGrade: Number(Number(totalAverage / subjectCount).toFixed()),
        };
    }
    let totalAverage = 0;
    let subjectCount = 0;
    for(const subjectTitle in averagedGrades){
        totalAverage += averagedGrades[subjectTitle].averageGrade;
        subjectCount++;
    }
    
    if(isNaN(totalAverage/subjectCount) || ""){
        return "";
    } else {
        return Number(Number(totalAverage/subjectCount).toFixed());
    };
};

export const cocHonors = (grade) => {
    let gen_ave = Number(grade);
    if(gen_ave >=98){
        return 'with Highest Honors'
    }else if (gen_ave >= 95){
        return 'with High Honors'
    }else if (gen_ave >= 90){
        return 'with Honors'
    }
    return "";
};

export const buildStudentName = (student) => {
    if(student?.middle_name){
        return `${student?.first_name} ${String(student?.middle_name).charAt(0)}. ${student?.last_name}`
    } else {
        return `${student?.first_name} ${student?.last_name}`
    }
};

export const buildStudentNameReportCard = (student) => {
    if(student?.middle_name && student?.middle_name !== null){
        return `${student?.last_name}, ${student?.first_name} ${String(student?.middle_name).charAt(0)}. ${student.ext_name}`
    } else {
        return `${student?.last_name}, ${student?.first_name}`
    }
};

/**
 * Simplify the Grades of the Students.
 * @param {object} student Student Data object containing a 'grades' array.
 * @returns {object|null} An object where keys are subject titles and values are objects containing grade details. Returns an empty string if student.grades is not defined.
 */
export const simplifyStudentGrades = (student) => {
    let student_grades = student.grades;
    let mapeh_subjects = ['pe', 'arts', 'health', 'music', 'pe & health', 'music & arts'];
    if(!student_grades) return "";
    let mapeh_subjects_count = 0;

    const groupedGradesBySubject = student_grades.reduce((acc, gradeObj) => {
        const { subject: { title: subject_title }, quarter, grade: gradeStr } = gradeObj;
        const gradeValue = parseInt(gradeStr, 10);
        const subjectTitle = mapeh_subjects.includes(String(subject_title).toLowerCase()) ? capitalizeString(subject_title) : subject_title;

        if(mapeh_subjects.includes(String(subjectTitle).toLowerCase()) && !acc[subjectTitle]){
            mapeh_subjects_count += 1;
        }

        acc[subjectTitle] = acc[subjectTitle] || {
          grades: [],
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          total_grade: 0,
          final_rating: 0,
          remarks: ""
        };

        acc[subjectTitle].grades.push(gradeObj);
        acc[subjectTitle][quarter] = gradeValue;
        acc[subjectTitle].total_grade += gradeValue;
        if(!mapeh_subjects.includes(String(subjectTitle).toLowerCase())){
            acc[subjectTitle].final_rating = parseFloat((acc[subjectTitle].total_grade / acc[subjectTitle].grades.length).toFixed());
        }
        acc[subjectTitle].remarks = cocHonors(acc[subjectTitle].final_rating);

        if(mapeh_subjects.includes(String(subjectTitle).toLowerCase())){
            acc["MAPEH"] = acc["MAPEH"] || {
                1: 0,
                "1st_quarter_final": 0,
                "1st_quarter_total": 0,
                2: 0,
                "2nd_quarter_final": 0,
                "2nd_quarter_total": 0,
                3: 0,
                "3rd_quarter_final": 0,
                "3rd_quarter_total": 0,
                4: 0,
                "4th_quarter_final": 0,
                "4th_quarter_total": 0,
                final_rating: 0,
                remarks: "",
            };
            acc["MAPEH"][quarter] += gradeValue;
            acc["MAPEH"]["1st_quarter_final"] = parseFloat((acc["MAPEH"][1] / mapeh_subjects_count).toFixed());
            acc["MAPEH"]["2nd_quarter_final"] = parseFloat((acc["MAPEH"][2] / mapeh_subjects_count).toFixed());
            acc["MAPEH"]["3rd_quarter_final"] = parseFloat((acc["MAPEH"][3] / mapeh_subjects_count).toFixed());
            acc["MAPEH"]["4th_quarter_final"] = parseFloat((acc["MAPEH"][4] / mapeh_subjects_count).toFixed());
            if(quarter === "1"){
                acc["MAPEH"]["1st_quarter_total"] += gradeValue;
                acc["MAPEH"][quarter] = parseFloat((acc["MAPEH"]["1st_quarter_total"] / mapeh_subjects_count).toFixed());
            }
            if(quarter === "2"){
                acc["MAPEH"]["2nd_quarter_total"] += gradeValue;
                acc["MAPEH"][quarter] = parseFloat((acc["MAPEH"]["2nd_quarter_total"] / mapeh_subjects_count).toFixed());
            }
            if(quarter === "3"){
                acc["MAPEH"]["3rd_quarter_total"] += gradeValue;
                acc["MAPEH"][quarter] = parseFloat((acc["MAPEH"]["3rd_quarter_total"] / mapeh_subjects_count).toFixed());
            }
            if(quarter === "4"){
                acc["MAPEH"]["4th_quarter_total"] += gradeValue;
                acc["MAPEH"][quarter] = parseFloat((acc["MAPEH"]["4th_quarter_total"] / mapeh_subjects_count).toFixed());
            }
            acc["MAPEH"].final_rating = parseFloat(((
                acc["MAPEH"]["1st_quarter_final"] +
                acc["MAPEH"]["2nd_quarter_final"] +
                acc["MAPEH"]["3rd_quarter_final"] +
                acc["MAPEH"]["4th_quarter_final"]
            ) / mapeh_subjects_count).toFixed());
            acc["MAPEH"]["remarks"] = cocHonors(acc["MAPEH"].final_rating);
        }
        return acc;
      }, {});
    return groupedGradesBySubject || null;
};

export const stringToUpperCase = (string) => {
    if(String(string) === "" || string === null){
        return "";
    }
    return String(string).toUpperCase();
};

export const capitalizeString = (str) => {
    return str.toLowerCase().split(', ').map(phrase => {
      return phrase.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
    }).join(', ');
  }
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
    } else {
        return 'PROMOTED';
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
        return 'with highest honors'
    }else if (gen_ave >= 95){
        return 'with high honors'
    }else if (gen_ave >= 90){
        return 'with honors'
    }
    return "";
};

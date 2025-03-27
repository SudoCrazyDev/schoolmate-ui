import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import pb from './pb';
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
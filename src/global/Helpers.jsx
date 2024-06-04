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
        const hasRole = accessRoles.some(accessRole => roles.some(userRole => userRole.title === accessRole));
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
    // const institution = useSelector(state => state.user?.institutions?.filter(institution => institution.pivot.is_active));
    // if(institution){
    //     return {
    //         id: institution[0].id,
    //         institution: institution[0].institution,
    //         abbr: institution[0].abbr
    //     };
    // }
    return {
        id: 0,
        institution: 'NO INSTITUTION',
        abbr: ''
    };
};
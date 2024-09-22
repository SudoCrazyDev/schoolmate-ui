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
    const records = await pb.collection("roles").getFullList({
        filter: `title!="App Admin"`,
        fields: `id, title`
    });
    return records || [];
};
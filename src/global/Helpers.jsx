import { useSelector } from 'react-redux';

export const userHasRole = (accessRoles) => {
    const { roles } = useSelector(state => state.user);
    if(roles){
        const hasRole = accessRoles.some(role => roles.includes(role));
        return hasRole;
    }
    return false;
};

export const getUserId = () => {
    const { user } = useSelector(state => state.user);
    return user.id;
};
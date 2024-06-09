import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';

export default function Header(){
const user = useSelector(state => state.user); 
    return(
        <div className="d-flex flex-column bg-dark text-white justify-content-center" style={{height: '50px'}}>
            <h5 className='m-0 text-capitalize'>Hi, {user?.info?.first_name}</h5>
        </div>
    );
};
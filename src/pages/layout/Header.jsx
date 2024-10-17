import { useSelector } from 'react-redux';

export default function Header(){
const user = useSelector(state => state.user);
    return(
        <div className="d-flex flex-column justify-content-center header">
            <div className="ms-auto pe-3">
                {user.institutions?.[0]?.title}
            </div>
        </div>
    );
};
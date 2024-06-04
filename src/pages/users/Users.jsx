import axios from "axios";
import { useEffect, useState } from "react";
import NewUser from "./components/NewUser";

export default function Users(){
    const [users, setUsers] = useState([]);
    
    const handleFetchAllUsers = () => {
        axios.get(`user/all`)
        .then(({data}) => {
            setUsers(data.data);
        });
    };
    
    
    useEffect(() => {
        handleFetchAllUsers();
    }, []);
    
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12">
                <div className="card">
                    <div className="card-body d-flex flex-row align-items-center">
                        <div className="d-flex flex-column">
                            <h2 className="m-0 fw-bolder">Users</h2>
                            <p className="m-0 fst-italic" style={{fontSize: '12px'}}>Create, Retrieve, Update and Delete users.</p>
                        </div>
                        <div className="ms-auto">
                            <NewUser />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 mt-3">
                <div className="card">
                    <div className="card-body">
                        <table className="table table-bordere">
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Institutions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td className="text-capitalize">{user.details?.last_name}, {user.details?.first_name}</td>
                                        <td className="text-capitalize">{user.email}</td>
                                        <td className="text-capitalize">{user.institutions.length}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
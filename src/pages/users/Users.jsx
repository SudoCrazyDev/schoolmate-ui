import axios from "axios";
import { useEffect, useState } from "react";
import NewUser from "./components/NewUser";
import pb from "../../global/pb";
import { useAlert } from "../../hooks/CustomHooks";

export default function Users(){
    const [users, setUsers] = useState([]);
    const alert = useAlert();
    
    const handleFetchAllUsers = async () => {
        await axios.get('users/principal')
        .then((res) => {
            setUsers(res.data.data.data);
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
                            <NewUser refreshUsers={handleFetchAllUsers}/>
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
                                    <th>Email</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td className="fw-bold">{user.email}</td>
                                        <td className="text-uppercase fw-bold">{user.last_name}, {user.first_name}</td>
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
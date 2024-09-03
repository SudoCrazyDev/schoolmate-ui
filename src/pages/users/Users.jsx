import axios from "axios";
import { useEffect, useState } from "react";
import NewUser from "./components/NewUser";
import pb from "../../global/pb";
import { useAlert } from "../../hooks/CustomHooks";

export default function Users(){
    const [users, setUsers] = useState([]);
    const alert = useAlert();
    
    const handleFetchAllUsers = async () => {
        try {
            const records = await pb.collection('user_relationships').getFullList({
                sort: '-created',
                expand: "user,institutions,personal_info,"
            });
            setUsers(records);
        } catch (error) {
            alert.setAlert('error', 'Failed to fetch users');
        }
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
                                        <td className="fw-bold">{user.expand?.user?.email}</td>
                                        <td className="text-uppercase fw-bold">{user.expand.personal_info.last_name}, {user.expand.personal_info.first_name} {String(user.expand.personal_info.last_name).charAt(0)}.</td>
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
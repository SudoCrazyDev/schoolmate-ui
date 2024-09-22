import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import NewRole from "./components/NewRoles";

export default function Roles(){
    const [fetching, setFetching] = useState(false);
    const [roles, setRoles] = useState([]);
    
    const handleFetchRoles = async () => {
        setFetching(true);
        await axios.get('roles/all')
        .then((res) => {
            setRoles(res.data.data);
        })
        .catch(err => {
            
        })
        .finally(() => {
            setFetching(false);
        });
    };
    
    useEffect(() => {
        handleFetchRoles();
    }, []);
    
    return(
        <div className="d-flex flex-column gap-2">
            <div className="card">
                <div className="card-body d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">User Roles</h2>
                        <p className="m-0">Manage Users Roles.</p>
                    </div>
                    <div className="ms-auto">
                        <NewRole refresh={handleFetchRoles}/>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Roles</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetching && Array(5).fill().map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={2}><Skeleton variant="rect" height={25}/></td>
                                </tr>
                            ))}
                            {!fetching && roles.map((permission, index) => (
                                <tr key={index}>
                                    <td>{permission.title}</td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
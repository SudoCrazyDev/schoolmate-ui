import axios from "axios";
import { useEffect, useState } from "react";
import NewPermission from "./components/NewPermission";
import { Skeleton } from "@mui/material";

export default function Permissions(){
    const [fetching, setFetching] = useState(false);
    const [permissions, setPermissions] = useState([]);
    
    const handleFetchPermissions = async () => {
        setFetching(true);
        await axios.get('permissions/all')
        .then((res) => {
            setPermissions(res.data.data);
        })
        .catch(err => {
            
        })
        .finally(() => {
            setFetching(false);
        });
    };
    
    useEffect(() => {
        handleFetchPermissions();
    }, []);
    
    return(
        <div className="d-flex flex-column gap-2">
            <div className="card">
                <div className="card-body d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">User Permissions</h2>
                        <p className="m-0">Manage Users Permissions.</p>
                    </div>
                    <div className="ms-auto">
                        <NewPermission refresh={handleFetchPermissions}/>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Permission</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetching && Array(5).fill().map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={2}><Skeleton variant="rect" height={25}/></td>
                                </tr>
                            ))}
                            {!fetching && permissions.map((permission, index) => (
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
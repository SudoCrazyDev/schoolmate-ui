import { useEffect, useState } from "react";
import AddInstitution from "./components/AddInstution";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { useAlert } from "../../hooks/CustomHooks";
import { Skeleton } from "@mui/material";
import EditInstitution from "./components/EditInstitution";

export default function Institutions(){
    const [fetching, setFetching] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const alert = useAlert();
    
    const handleFetchInstitutions = async () => {
        setFetching(true);
        await axios.get('institution/all')
        .then((res) => {
            setInstitutions(res.data.data);
        })
        .finally(() => { 
            setFetching(false);
        });
    };

    useEffect(() => {
        handleFetchInstitutions();
    }, []);

    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12">
                <div className="card">
                    <div className="card-body d-flex flex-row align-items-center">
                        <div className="d-flex flex-column">
                            <h2 className="m-0 fw-bolder">Institutions</h2>
                            <p className="m-0 fst-italic" style={{fontSize: '12px'}}>Create, Retrieve, Update and Delete institutions.</p>
                        </div>
                        <div className="ms-auto">
                            <AddInstitution setInstitutions={setInstitutions} refresh={handleFetchInstitutions}/>
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
                                    <th>Institution</th>
                                    <th>ABBR</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetching && Array(5).fill().map((_,i) => (
                                    <tr key={i}>
                                        <td colSpan={3}><Skeleton className="rounded" variant="rect" height={30}/></td>
                                    </tr>
                                ))}
                                {!fetching && institutions.map((insititution, index) => (
                                    <tr key={index}>
                                        <td className="fw-bold">{insititution.title}</td>
                                        <td>{insititution.abbr}</td>
                                        <td>
                                            <div className="d-flex flex-row">
                                                <EditInstitution institution={insititution} refresh={handleFetchInstitutions}/>
                                            </div>
                                        </td>
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
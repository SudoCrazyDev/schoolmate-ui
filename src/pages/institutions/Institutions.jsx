import { useEffect, useState } from "react";
import AddInstitution from "./components/AddInstution";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CreateIcon from '@mui/icons-material/Create';
import pb from "../../global/pb";
import { useAlert } from "../../hooks/CustomHooks";

export default function Institutions(){
    const [institutions, setInstitutions] = useState([]);
    const alert = useAlert();
    
    const handleFetchInstitutions = async () => {
        try {
            const records = await pb.collection('institutions').getFullList();
            setInstitutions(records);
        } catch (error) {
            alert.setAlert('error', "There's an error fetching institutions");
        }
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
                            <AddInstitution setInstitutions={setInstitutions}/>
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
                                {institutions.map((insititution, index) => (
                                    <tr>
                                        <td className="fw-bold">{insititution.title}</td>
                                        <td>{insititution.abbr}</td>
                                        <td>
                                            <div className="d-flex flex-row">
                                                <Tooltip title="Edit">
                                                    <IconButton color="primary" size="small">
                                                        <CreateIcon fontSize="inherit"/>
                                                    </IconButton>
                                                </Tooltip>
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
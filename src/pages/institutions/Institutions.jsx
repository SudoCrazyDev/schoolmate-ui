import { useEffect, useState } from "react";
import AddInstitution from "./components/AddInstution";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAlert } from "../../hooks/CustomHooks";
import { Skeleton } from "@mui/material";
import EditInstitution from "./components/EditInstitution";
import UpdateInsitutionSubscription from "./components/UpdateInstitutionSubscription";
import {
    ContentContainer,
    ParentContentContainer,
    PageHeading,
    PageContent,
    TableContainer,
    TableFunctions,
    Table
} from "@UIComponents";

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
        <ParentContentContainer>
            <ContentContainer className="w-[100%] gap-3">
                <PageHeading title="Institutions" info="add, update, delete and manage institutions.">
                    <div className="lg:ml-auto">
                        <AddInstitution setInstitutions={setInstitutions} refresh={handleFetchInstitutions} />
                    </div>
                </PageHeading>
                <PageContent>
                    <TableContainer>
                        <TableFunctions>
                            
                        </TableFunctions>
                        <Table>
                            <thead>
                                <tr>
                                    <th width={'50%'} className="text-xl px-1 py-2 uppercase bg-zinc-50 border text-start border-gray-300">Institution</th>
                                    <th width={'40%'} className="text-xl px-1 py-2 uppercase bg-zinc-50 border text-start border-gray-300">ABBR</th>
                                    <th width={'10%'} className="text-xl px-1 py-2 uppercase bg-zinc-50 border text-start border-gray-300"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {!fetching && institutions.map((institution) => (
                                    <tr key={institution.id}>
                                        <td className="p-1 py-2 font-bold uppercase border-y border-gray-300">{institution.title}</td>
                                        <td className="p-1 py-2 font-bold uppercase border-y border-gray-300">{institution.abbr}</td>
                                        <td className="p-1 py-2 font-bold uppercase border-y border-gray-300">
                                            <EditInstitution institution={institution} refresh={handleFetchInstitutions}/>
                                            <UpdateInsitutionSubscription institution={institution} refresh={handleFetchInstitutions}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableContainer>
                </PageContent>
            </ContentContainer>
        </ParentContentContainer>
    );
};
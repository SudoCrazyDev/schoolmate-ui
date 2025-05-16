import axios from "axios";
import { useEffect, useState } from "react";
import NewRole from "./components/NewRoles";
import {
    ContentContainer,
    ParentContentContainer,
    PageHeading,
    PageContent,
    TableContainer,
    TableFunctions,
    Table
} from "@UIComponents";

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
        <ParentContentContainer>
            <ContentContainer className="w-[100%] gap-3">
                <PageHeading title="Roles" info="add, update, delete and manage institutions.">
                    <div className="lg:ml-auto">
                        <NewRole refresh={handleFetchRoles}/>
                    </div>
                </PageHeading>
                <PageContent>
                    <TableContainer>
                        <TableFunctions>
                            
                        </TableFunctions>
                        <Table>
                            <thead>
                                <tr>
                                    <th width={'50%'} className="text-xl px-1 py-2 uppercase bg-zinc-50 border text-start border-gray-300">Roles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role) => (
                                    <tr key={role.id}>
                                        <td className="p-1 py-2 font-bold uppercase border-y border-gray-300">{role.title}</td>
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
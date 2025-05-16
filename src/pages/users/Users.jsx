import axios from "axios";
import { useEffect, useState } from "react";
import NewUser from "./components/NewUser";
import { useAlert } from "../../hooks/CustomHooks";
import {
    ContentContainer,
    ParentContentContainer,
    PageHeading,
    PageContent,
    TableContainer,
    TableFunctions,
    Table,
} from "@UIComponents";

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
        <ParentContentContainer>
            <ContentContainer className="w-[100%] gap-3">
                <PageHeading title="Users" info="add, update, delete and manage users.">
                    <div className="lg:ml-auto">
                        <NewUser refreshUsers={handleFetchAllUsers}/>
                    </div>
                </PageHeading>
                <PageContent>
                    <TableContainer>
                        <TableFunctions>
                            
                        </TableFunctions>
                        <Table>
                            <thead>
                                <tr>
                                    <th width={'40%'} className="text-xl px-1 py-2 uppercase bg-zinc-50 border text-start border-gray-300">Email</th>
                                    <th width={'60%'} className="text-xl px-1 py-2 uppercase bg-zinc-50 border text-start border-gray-300">Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="p-1 py-2 font-bold uppercase border-y border-gray-300">{user.email}</td>
                                        <td className="p-1 py-2 font-bold uppercase border-y border-gray-300">{user.last_name}, {user.first_name}</td>
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
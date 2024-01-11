import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import AddTeacher from './partials/AddTeacher';
import TextField from '@mui/material/TextField';
import EditTeacher from './partials/EditTeacher';

export default function Teachers(){
    const { teachers } = useSelector(state => state.org);
    const [keyword, setKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [totalPages, setTotalPages] = useState(0);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const flattenObject = (obj) => {
        return Object.values(obj).reduce((acc, val) => {
            if (typeof val === 'object' && val !== null) {
            return acc + ' ' + flattenObject(val);
            }
            return acc + ' ' + val;
        }, '');
    };
      
    const filteredTeachers = useMemo(() => {
        const sortedTeachers = teachers.sort((a, b) => {
            if(a.details?.last_name.toLowerCase() < b.details?.last_name.toLowerCase()) return -1;
            if(a.details?.last_name.toLowerCase() > b.details?.last_name.toLowerCase()) return 1;
        });
        const filteredResults = sortedTeachers.filter(teacher => flattenObject(teacher).toLowerCase().includes(keyword));
        setTotalPages(Math.ceil(filteredResults.length / itemsPerPage) || 0);
        return filteredResults.slice(startIndex, endIndex);
    }, [teachers, keyword, currentPage]);
    
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">TEACHERS</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>add or update teachers information.</p>
                    </div>
                    <div className="ms-auto">
                        <AddTeacher />
                    </div>
                </div>
            </div>
            <div className="col-12 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row">
                            <TextField size='small' label="Search" variant="outlined" onChange={(e) => setKeyword(e.target.value.toLowerCase())}/>
                            <div className="ms-auto">
                                
                            </div>
                        </div>
                        <div className="d-flex flex-column mb-1">
                            <hr />
                        </div>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th className='fw-bold'>Teacher</th>
                                    <th className='fw-bold'>Advisory</th>
                                    <th className='fw-bold'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeachers.map((teacher) => (
                                    <tr key={teacher.id}>
                                        <td>{teacher.details.last_name}, {teacher.details.first_name}</td>
                                        <td>{teacher?.advisory[0]?.section_name}</td>
                                        <td>
                                            <EditTeacher teacher={teacher} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination mb-0">
                                {Array(totalPages).fill().map((_, index) => (
                                    <li className={`page-item ${currentPage === index + 1 && 'active'}`}><a className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</a></li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};
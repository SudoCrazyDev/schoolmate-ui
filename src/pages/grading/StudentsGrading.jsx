import IconButton from '@mui/material/IconButton';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import NewSection from './partials/NewSection';
import AddSubject from './partials/AddSubject';
import TextField from '@mui/material/TextField';

export default function StudentsGrading(){
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0">Subject Assignation</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>Student Grades and assigned subjects.</p>
                    </div>
                    <div className="ms-auto">
                        
                    </div>
                </div>
            </div>
            <div className="col-3 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-row align-items-center align-items-center class-section">
                       <h6 className="m-0" style={{padding: '8px'}}>7 - ALITAO</h6>
                       <h6 className="m-0 ms-auto" style={{padding: '8px'}}>English</h6>
                    </div>
                    <div className="d-flex flex-row align-items-center align-items-center class-section">
                       <h6 className="m-0" style={{padding: '8px'}}>7 - BANGCAYA</h6>
                       <h6 className="m-0 ms-auto" style={{padding: '8px'}}>Math</h6>
                    </div>
                    <div className="d-flex flex-row align-items-center align-items-center class-section">
                       <h6 className="m-0" style={{padding: '8px'}}>8 - MEGALODON</h6>
                       <h6 className="m-0 ms-auto" style={{padding: '8px'}}>English</h6>
                    </div>
                </div>
            </div>
            <div className="col-9 p-2">
                <div className="card p-3">
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row">
                            <div className="d-flex flex-column">
                                <h5 className="m-0 fw-bolder">7 - ALITAO STUDENTS</h5>
                                <p className="m-0 text-muted fw-bolder" style={{fontSize: '12px'}}>Class adviser: Philip Louis Calub</p>
                            </div>
                            <div className="ms-auto">
                                
                            </div>
                        </div>
                        <div className="d-flex flex-column mt-1">
                            <hr />
                        </div>
                        <div className="d-flex flex-row my-2">
                            <TextField variant="outlined" size="small" label="Student Filter"/>
                            <Button variant="outlined" size='small' color="success" className='ms-auto'>Save Changes</Button>
                        </div>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th className='fw-bold'>NAME</th>
                                    <th className='fw-bold'>G1</th>
                                    <th className='fw-bold'>G2</th>
                                    <th className='fw-bold'>G3</th>
                                    <th className='fw-bold'>G4</th>
                                    <th className='fw-bold'>FINAL</th>
                                    <th className='fw-bold'>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array(43).fill().map((_, i) => (
                                    <tr key={i}>
                                        <td width={'30%'}>
                                            Calub, Philip Louis
                                        </td>
                                        <td width={'5%'}>
                                            <TextField variant="standard" size="small" value={95}/>
                                        </td>
                                        <td width={'5%'}>
                                            <TextField variant="standard" size="small" value={95}/>
                                        </td>
                                        <td width={'5%'}>
                                            <TextField variant="standard" size="small" value={95}/>
                                        </td>
                                        <td width={'5%'}>
                                            <TextField variant="standard" size="small" value={95}/>
                                        </td>
                                        <td width={'5%'}>
                                            <TextField variant="standard" size="small" value={100}/>
                                        </td>
                                        <td width={'20%'}>
                                            ...
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
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useEffect, useState } from "react";
import { convertTo12Hour, GetActiveInstitution, sortAttendanceLogByDate } from "../../../global/Helpers";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import axios from "axios";
import { useAlert } from "../../../hooks/CustomHooks";
import PrintDTR from "./PrintDTR";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function ViewDTR({teacher, attendances, start_period, end_period, refresh}){
    const [open, setOpen] = useState(false);
    const [sortedAttendances, setSortedAttendances] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [addMode, setAddMode] = useState(false);
    const [editTime, setEditTime] = useState(null);
    const [editPeriod, setEditPeriod] = useState(null);
    const [editDay, setEditDay] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const institution = GetActiveInstitution();
    
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    const handleCloseModal = () => {
        setOpen(!open);
        refresh();
    };
    
    useEffect(() => {
        if(open){
            setSortedAttendances(sortAttendanceLogByDate(attendances))
        }
    }, [open]);
    
    const handleFilterByDay = (day, type) => {
        if (sortedAttendances && sortedAttendances.length > 0) {
            return sortedAttendances.filter((attendance) => {
                const authDate = new Date(attendance.auth_date);
                const attendanceDay = authDate.getDate();
                return attendanceDay === day && String(attendance.status).toLowerCase() === type;
              })?.[0]
        }
        return null;
    };
    
    const handleUpdateSortedAttendances = () => {
        let mutatedAttendances = sortedAttendances.map((attendance) => {
            if(attendance.id === editTime?.id){
                return {
                    ...attendance,
                    auth_time: editTime?.val
                }
            }
            return attendance;
        });
        setSortedAttendances(
            sortAttendanceLogByDate(
                mutatedAttendances
            )
        );
    };
    
    const handleDeletedSortedAttendances = (id) => {
        setSortedAttendances((prevAttendances) => {
          const updatedAttendances = prevAttendances.filter(
            (attendance) => attendance.id !== id
          );
          return sortAttendanceLogByDate(updatedAttendances);
        });
    };
    
    const handleAddSortedAttendances = (record) => {
        setSortedAttendances((prevAttendances) => {
          const updatedAttendances = [...prevAttendances,
            {
            ...record
            }
          ];
          return sortAttendanceLogByDate(updatedAttendances);
        });
    };
    
    const handleEditMode = (period, day, time, id) => {
        if(!id){
            setAddMode(true);
        }
        setEditMode(!editMode);
        setEditPeriod(period);
        setEditDay(day);
        setEditTime({val: time});
    };
    
    const handleCancel = () => {
        setEditMode(false);
        setEditPeriod(null);
        setEditDay(null);
        setEditTime(null);
        setAddMode(false);
    };
        
    const handleSave = async () => {
        setSubmitting(true);
        await axios.post('attendance_records/update/attendace-record', editTime)
        .then(() => {
            alert.setAlert('success', 'Attendance record updated successfully');
            handleUpdateSortedAttendances();
            handleCancel();
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to update attendance record');
        })
        .finally(() => {
            setSubmitting(false);
        })
    };
    
    const handleDelete = async (id) => {
        setSubmitting(true);
        await axios.post('attendance_records/delete/attendance-record', {id: id})
        .then(() => {
            alert.setAlert('success', 'Attendance record deleted successfully');
            handleDeletedSortedAttendances(id);
            handleCancel();
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to delete record');
        })
        .finally(() => {
            setSubmitting(false);
        })
    };
    
    const handleAdd = async () => {
        setSubmitting(true);
        await axios.post('attendance_records/add/attendance-record', editTime)
        .then((res) => {
            alert.setAlert('success', 'Attendance record added successfully');
            handleAddSortedAttendances(res.data.record);
            handleCancel();
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to add attendance record');
        })
        .finally(() => {
            setSubmitting(false);
        })
    };
    
    const handleTimeChange = (e, id, period, day) => {
        if(addMode){
            setEditTime({
                institution_id: institution.id,
                employee_id: teacher.id,
                status: period,
                auth_date: `2025-04-${day}`,
                val: e.target.value
            });
        } else {
            setEditTime({val: e.target.value, id: id});
        }
    };
    
    const handleShowButton = (period, day, index) => {
        if(editMode && editPeriod === period && editDay === day){
            return (
                <div className="input-group">
                    <input
                        type="time"
                        className="form-control"
                        value={editTime?.val}
                        onChange={(e) => handleTimeChange(e, handleFilterByDay(index + 1, period)?.id, period, index + 1)}
                    />
                    {addMode && (
                        <Tooltip title="Add">
                            <button className="btn btn-sm btn-outline-success" onClick={() => handleAdd()} disabled={submitting}>
                                {submitting && <div className="spinner-border spinner-border-sm"></div>}
                                {!submitting && <AddIcon fontSize="inherit"/>}
                            </button>
                        </Tooltip>
                    )}
                    {!addMode && (
                        <Tooltip title="Save">
                            <button className="btn btn-sm btn-outline-success" onClick={() => handleSave()} disabled={submitting}>
                                {submitting && <div className="spinner-border spinner-border-sm"></div>}
                                {!submitting && <CheckIcon fontSize="inherit"/>}
                            </button>
                        </Tooltip>
                    )}
                    {!addMode && (
                        <Tooltip title="Delete Entry">
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(handleFilterByDay(index + 1, period)?.id)} disabled={submitting}>
                                {submitting && <div className="spinner-border spinner-border-sm"></div>}
                                {!submitting && <DeleteIcon fontSize="inherit"/>}
                            </button>
                        </Tooltip>
                    )}
                    <Tooltip title="Cancel">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel()} disabled={submitting}>
                            <ClearIcon fontSize="inherit"/>
                        </button>
                    </Tooltip>
                </div>
            );
        } else {
            return(
                <Button
                    variant="text"
                    className="text-dark"
                    sx={{fontSize:"20px"}}
                    fullWidth
                    onClick={() => handleEditMode(period, index + 1, convertTo12Hour(handleFilterByDay(index + 1, period)?.auth_time, false), handleFilterByDay(index + 1, period)?.id)}
                >
                    {convertTo12Hour(handleFilterByDay(index + 1, period)?.auth_time, true)}
                </Button>
            )
        }
    };
    
    return(
        <>
        <Tooltip title="View DTR">
            <IconButton color="primary" onClick={handleModalState}>
                <EventNoteIcon fontSize="small" color="primary"/>
            </IconButton>
        </Tooltip>
        <Dialog open={open} fullWidth maxWidth="lg">
            <DialogTitle className="fw-bold text-uppercase h2">
                DAILY TIME RECORD FOR THE PERIOD OF <br />
                {new Date(start_period).toLocaleDateString('en-US')} - {new Date(end_period).toLocaleDateString('en-US')}
            </DialogTitle>
            <hr className="m-0"/>
            <DialogContent>
                <div className="d-flex flex-row">
                    <div className="ms-auto mb-3">
                        <PrintDTR teacher={teacher} attendances={sortedAttendances}/>
                    </div>
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th width={`1%`}></th>
                            <th colSpan={2} className="text-center">AM</th>
                            <th colSpan={2} className="text-center">PM</th>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <th width={`1%`}></th>
                            <th width={`24%`} className="text-center">IN</th>
                            <th width={`24%`} className="text-center">OUT</th>
                            <th width={`24%`} className="text-center">IN</th>
                            <th width={`24%`} className="text-center">OUT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array(31).fill().map((_, index) => (
                            <tr key={crypto.randomUUID()}>
                                <td className="text-center v-center">{index + 1}</td>
                                <td className="text-center v-center">
                                    {handleShowButton('check-in', index + 1, index)}
                                </td>
                                <td className="text-center v-center">
                                    {handleShowButton('break-out', index + 1, index)}
                                </td>
                                <td className="text-center v-center">
                                    {handleShowButton('break-in', index + 1, index)}
                                </td>
                                <td className="text-center v-center">
                                    {handleShowButton('check-out', index + 1, index)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DialogContent>
            <hr />
            <DialogActions>
                <button className="btn btn-danger" onClick={handleCloseModal}>Close</button>
            </DialogActions>
        </Dialog>
        </>
    );
};
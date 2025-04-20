import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Tooltip } from "@mui/material";
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useEffect, useState } from "react";
import { convertTo12Hour, sortAttendanceLogByDate } from "../../../global/Helpers";

export default function ViewDTR({attendances}){
    const [open, setOpen] = useState(false);
    const [sortedAttendances, setSortedAttendances] = useState([]);
    
    const handleModalState = () => {
        setOpen(!open);
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
              })?.[0]?.auth_time
        }
        return null;
    };
    return(
        <>
        <Tooltip title="View DTR">
            <IconButton color="primary" onClick={handleModalState}>
                <EventNoteIcon fontSize="small" color="primary"/>
            </IconButton>
        </Tooltip>
        <Dialog open={open} fullWidth maxWidth="md">
            <DialogTitle className="fw-bold text-uppercase h2">
                DAILY TIME RECORD FOR THE PERIOD OF
            </DialogTitle>
            <hr className="m-0"/>
            <DialogContent>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th width={`1%`}></th>
                            <th colSpan={2} className="text-center">AM</th>
                            <th colSpan={2} className="text-center">PM</th>
                            <th colSpan={2} className="text-center">UNDERTIME</th>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <th width={`1%`}></th>
                            <th className="text-center">IN</th>
                            <th className="text-center">OUT</th>
                            <th className="text-center">IN</th>
                            <th className="text-center">OUT</th>
                            <th className="text-center">Hour</th>
                            <th className="text-center">Minute</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array(31).fill().map((_, index) => (
                            <tr key={crypto.randomUUID()}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{convertTo12Hour(handleFilterByDay(index + 1, 'check-in'))}</td>
                                <td className="text-center">{convertTo12Hour(handleFilterByDay(index + 1, 'break-out'))}</td>
                                <td className="text-center">{convertTo12Hour(handleFilterByDay(index + 1, 'break-in'))}</td>
                                <td className="text-center">{convertTo12Hour(handleFilterByDay(index + 1, 'check-out'))}</td>
                                <td className="text-center"></td>
                                <td className="text-center"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DialogContent>
            <hr />
            <DialogActions>
                <button className="btn btn-danger" onClick={handleModalState}>Close</button>
            </DialogActions>
        </Dialog>
        </>
    );
};
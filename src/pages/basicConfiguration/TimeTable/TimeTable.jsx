import { useEffect, useState } from "react";
import TimeTableForm from "./components/TimeTableForm";
import axios from 'axios';
import { GetActiveInstitution } from "../../../global/Helpers";

export default function TimeTable(){
    const [timeSchedules, setTimeSchedules] = useState([]);
    const institution = GetActiveInstitution();
    
    const handleFetchTimeSchedules = async () => {
        await axios.get(`time_schedules/${institution.id}`)
        .then((res) => {
            setTimeSchedules(res.data.data);
        });
    };
    
    useEffect(() => {
        handleFetchTimeSchedules()
    }, []);
    
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                    <h2 className="m-0 fw-bolder">TIMETABLE</h2>
                    <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>manage staffs schedules.</p>
                    </div>
                    <div className="ms-auto">
                        <TimeTableForm type="create" refresh={handleFetchTimeSchedules}/>
                    </div>
                </div>
            </div>
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-column">
                    <div className="d-flex flex-row col-2">
                        <input type="text" className="form-control" placeholder="Search timetable..." />
                    </div>
                    <hr />
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Working Hours</th>
                                <th width="1%"></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeSchedules.map(timeSchedule => (
                               <tr key={timeSchedule.id}>
                                    <td>{timeSchedule.title}</td>
                                    <td>{timeSchedule.start_working_time} - {timeSchedule.end_working_time}</td>
                                    <td>
                                        <div className="p-3 rounded-0 border-0" style={{background: timeSchedule.color}}>
                                        </div>
                                    </td>
                                    <td>
                                        <TimeTableForm isCreate={false} refresh={handleFetchTimeSchedules} timetable={timeSchedule}/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
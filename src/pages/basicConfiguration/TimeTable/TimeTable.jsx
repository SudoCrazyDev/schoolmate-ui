import Form137 from "../../students/Forms/Form137";
import TimeTableForm from "./components/TimeTableForm";

export default function TimeTable(){
    return(
        <div className="d-flex flex-row flex-wrap">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                    <h2 className="m-0 fw-bolder">TIMETABLE</h2>
                    <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>manage staffs schedules.</p>
                    </div>
                    <div className="ms-auto">
                        <TimeTableForm type="create" />
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
                                <th>Type</th>
                                <th>Working Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Normal Shift</td>
                                <td>Normal Shift</td>
                                <td>8:00 AM - 10:00 AM</td>
                            </tr>
                            <tr>
                                <td>SHS Shift</td>
                                <td>Flexible Shift</td>
                                <td>8:00 AM - 10:00 AM</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
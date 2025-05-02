import axios from "axios";
import UploadRecords from "./components/UploadRecords";
import { GetActiveInstitution, objectToString, sortStaff, staffNameBuilder } from "../../global/Helpers";
import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import ViewDTR from "./components/ViewDTR";
import CustomBulkUpload from "./components/CustomBulkUpload";

const AttendanceRecord = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [keyword, setKeyword] = useState(null);
    const institution = GetActiveInstitution();
    
    const handleFetchAttendanceRecords = async (values) => {
        await axios.post('users/attendance', values)
        .then((res) => {
            let fetched_staffs = res.data.data;
            setAttendanceRecords(sortStaff(fetched_staffs.map((staff) => {
                return {
                    ...staff,
                    attendances: [...staff?.proper_attendances, ...staff?.custom_attendances]
                }
            })));
        });
    };
    
    const filteredAttendanceRecords = useMemo(() => {
        if(!keyword) return attendanceRecords;
        return attendanceRecords.filter((record) => String(objectToString(record)).includes(String(keyword).toLowerCase()));
    }, [attendanceRecords, keyword]);
    
    const formik = useFormik({
        initialValues:{
            institution_id: institution.id,
            start_date: new Date().toLocaleDateString('en-CA'),
            end_date: new Date().toLocaleDateString('en-CA'),
        },
        onSubmit: handleFetchAttendanceRecords
    });
    
    return(
        <div className="d-flex flex-column gap-3">
            <div className="card">
                <div className="card-body d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">TEACHERS ATTENDANCE LOGS</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>View teacher's attendance logs.</p>
                    </div>
                    <div className="ms-auto d-flex flex-row gap-2">
                        <UploadRecords />
                        <CustomBulkUpload />
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body d-flex flex-column">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="d-flex flex-row gap-3 align-items-end">
                            <div className="d-flex flex-column">
                                <label htmlFor="search">Employee</label>
                                <input
                                    id="search"
                                    type="text"
                                    className="form-control"
                                    placeholder="Type employee id..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                            <div className="d-flex flex-column">
                                <label htmlFor="start-date">Start Period Date</label>
                                <input type="date" className="form-control" {...formik.getFieldProps('start_date')}/>
                            </div>
                            <div className="d-flex flex-column">
                                <label htmlFor="start-date">End Period Date</label>
                                <input type="date" className="form-control" {...formik.getFieldProps('end_date')}/>
                            </div>
                            <div className="d-flex flex-column">
                                <button className="btn btn-primary" disabled={formik.isSubmitting} onClick={() => handleFetchAttendanceRecords(formik.values)}>
                                    {formik.isSubmitting && <div className="spinner-border spinner-border-sm"></div>}
                                    Generate
                                </button>
                            </div>
                            <div className="ms-auto">
                                <button className="btn btn-primary">
                                    Bulk Print
                                </button>
                            </div>
                        </div>
                    </form>
                    <hr />
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendanceRecords.map(record => (
                                <tr key={record.id}>
                                    <td className="fw-bolder">{staffNameBuilder(record)}</td>
                                    <td>
                                        <ViewDTR
                                            attendances={record?.attendances}
                                            start_period={formik.values?.start_date}
                                            end_period={formik.values?.end_date}
                                            refresh={formik.submitForm}
                                        />
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

export default AttendanceRecord;
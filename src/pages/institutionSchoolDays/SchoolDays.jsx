import { useFormik } from "formik";
import { useAlert } from "../../hooks/CustomHooks";
import axios from "axios";
import { GetActiveInstitution } from "../../global/Helpers";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

export default function SchoolDays(){
    const alert = useAlert();
    const institution = GetActiveInstitution();
    const [schoolDays, setSchoolDays] = useState([]);
    const [fetching, setFetching] = useState(false);

    const handleFetchInstitutionSchoolDays = async () => {
        setFetching(true);
        await axios.get(`school_days/${institution.id}`)
        .then(res => {
            setSchoolDays(res.data.data);
        })
        .catch(() => {
            alert.setAlert("error", "Error Fetching Data");
        })
        .finally(() => {
            setFetching(false);
        });
    };

    const handleSubmit = async (values) => {
        if(values.academic_year === ""){
            alert.setAlert("error", "Invalid Academic Year");
            return;
        }
        await axios.post('school_days/add', values)
        .then(() => {
            alert.setAlert("success", "Academic Year Added");
            formik.resetForm();
        })
        .catch(() => {
            alert.setAlert("error", "Failed to Add");
        })
        .finally(() => {
            handleFetchInstitutionSchoolDays();
            formik.setSubmitting(false);
        });
    };

    const formik = useFormik({
        initialValues:{
            academic_year: "",
            institution_id: institution.id,
            jan: 0,
            feb: 0,
            mar: 0,
            apr: 0,
            may: 0,
            jun: 0,
            jul: 0,
            aug: 0,
            sep: 0,
            oct: 0,
            nov: 0,
            dec: 0
        },
        onSubmit: handleSubmit
    });

    useEffect(() => {
        handleFetchInstitutionSchoolDays();
    }, []);

    return(
        <div className="d-flex flex-column gap-2">
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <h2 className="m-0 fw-bolder">School Days</h2>
                        <p className="m-0 text-muted fw-normal" style={{fontSize: '12px'}}>manage number of school days.</p>
                    </div>
                </div>
            </div>
            <div className="col-12 p-2">
                <div className="card p-3 d-flex flex-row align-items-center">
                    <table className="table">
                        <thead>
                            <tr>
                                <th width={'18%'} className="text-secondary">Academic Year</th>
                                <th width={'6%'} className="text-secondary text-center">Jan</th>
                                <th width={'6%'} className="text-secondary text-center">Feb</th>
                                <th width={'6%'} className="text-secondary text-center">Mar</th>
                                <th width={'6%'} className="text-secondary text-center">Apr</th>
                                <th width={'6%'} className="text-secondary text-center">May</th>
                                <th width={'6%'} className="text-secondary text-center">Jun</th>
                                <th width={'6%'} className="text-secondary text-center">Jul</th>
                                <th width={'6%'} className="text-secondary text-center">Aug</th>
                                <th width={'6%'} className="text-secondary text-center">Sep</th>
                                <th width={'6%'} className="text-secondary text-center">Oct</th>
                                <th width={'6%'} className="text-secondary text-center">Nov</th>
                                <th width={'6%'} className="text-secondary text-center">Dec</th>
                                <th width={'10%'} className="text-secondary"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetching && (
                                <tr>
                                    <td colSpan={14}>
                                        <Skeleton variant="rect"/>
                                    </td>
                                </tr>
                            )}
                            {!fetching && schoolDays.map(schoolDay => (
                                <tr key={schoolDay.id}>
                                    <td className="v-center"><input type="text" className="form-control" value={schoolDay.academic_year} disabled/></td>
                                    <td className="v-center"><input type="number" className="form-control" value={schoolDay.jan} /></td>
                                    <td className="v-center"><input type="number" className="form-control" value={schoolDay.feb} /></td>
                                    <td className="v-center"><input type="number" className="form-control" value={schoolDay.mar} /></td>
                                    <td className="v-center"><input type="number" className="form-control" value={schoolDay.apr} /></td>
                                    <td className="v-center"><input type="number" className="form-control" value={schoolDay.may} /></td>
                                    <td className="v-center"><input type="number" className="form-control" value={schoolDay.jun} /></td>
                                    <td className="v-center"><input type="number" className="form-control" value={schoolDay.jul} /></td>
                                    <td className="v-center"><input type="number" className="form-control" value={schoolDay.aug} /></td>
                                    <td className="v-center"><input type="number" className="form-control" value={schoolDay.sep} /></td>
                                    <td className="v-center"><input type="number" className="form-control" value={schoolDay.oct} /></td>
                                    <td className="v-center"><input type="number" className="form-control" value={schoolDay.nov} /></td>
                                    <td className="v-center"><input type="number" className="form-control" value={schoolDay.dec} /></td>
                                    <td className="v-center">
                                        <button className="btn btn-sm btn-primary">Update</button>
                                    </td>
                                </tr>
                            ))}
                            {!fetching && (
                                <tr>
                                    <td><input type="text" className="form-control" {...formik.getFieldProps('academic_year')} placeholder="Academic Year"/></td>
                                    <td><input type="number" className="form-control" {...formik.getFieldProps('jan')}/></td>
                                    <td><input type="number" className="form-control" {...formik.getFieldProps('feb')}/></td>
                                    <td><input type="number" className="form-control" {...formik.getFieldProps('mar')}/></td>
                                    <td><input type="number" className="form-control" {...formik.getFieldProps('apr')}/></td>
                                    <td><input type="number" className="form-control" {...formik.getFieldProps('may')}/></td>
                                    <td><input type="number" className="form-control" {...formik.getFieldProps('jun')}/></td>
                                    <td><input type="number" className="form-control" {...formik.getFieldProps('jul')}/></td>
                                    <td><input type="number" className="form-control" {...formik.getFieldProps('aug')}/></td>
                                    <td><input type="number" className="form-control" {...formik.getFieldProps('sep')}/></td>
                                    <td><input type="number" className="form-control" {...formik.getFieldProps('oct')}/></td>
                                    <td><input type="number" className="form-control" {...formik.getFieldProps('nov')}/></td>
                                    <td><input type="number" className="form-control" {...formik.getFieldProps('dec')}/></td>
                                    <td>
                                        <button className="btn btn-sm btn-primary" onClick={() => formik.handleSubmit()} disabled={formik.isSubmitting}>
                                            {formik.isSubmitting && <div className="spinner-border spinner-border-sm"></div>}
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAlert } from "../../../hooks/CustomHooks";

export default function NewPermission({refresh}){
    const [open, setOpen] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        formik.resetForm();
        setOpen(!open);
    };
    
    const handleSubmit = async (values) => {
        await axios.post('permissions/add', {slug: String(values.title).toLowerCase().replace(/\s/g, '-'), title: values.title})
        .then((res) => {
            alert.setAlert('success', 'Permission Created!');
            handleModalState();
            refresh();
        })
        .catch(err => {
            alert.setAlert('error', 'Failed to create Permission');
        });
    }
    const formik = useFormik({
        initialValues: {
            title: '',
            slug: '',
        },
        onSubmit: handleSubmit
    });
    
    return(
        <>
        <button className="btn btn-primary fw-bold" onClick={() => handleModalState()}>New Permission</button>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className="fw-bold">Create New Permission</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <input type="text" className="form-control" {...formik.getFieldProps('title')}/>
                </DialogContent>
                <DialogActions className="p-2 d-flex justify-content-start">
                    <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                        {formik.isSubmitting && <div className="spinner-border spinner-border-sm"></div>}
                        Save
                    </button>
                    <button type="button" className="btn btn-danger" disabled={formik.isSubmitting} onClick={() => handleModalState()}>Cancel</button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    );
};
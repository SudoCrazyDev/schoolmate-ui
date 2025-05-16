import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useAlert } from "../../../hooks/CustomHooks";
import {
    Button,
    Modal,
    ModalHeader,
    ModalContent,
    ModalActions,
    TextField
} from "@UIComponents";

export default function NewRole({refresh}){
    const [open, setOpen] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        formik.resetForm();
        setOpen(!open);
    };
    
    const handleSubmit = async (values) => {
        await axios.post('roles/add', {slug: String(values.title).toLowerCase().replace(/\s/g, '-'), title: values.title})
        .then((res) => {
            alert.setAlert('success', 'Role Created!');
            handleModalState();
            refresh();
        })
        .catch(err => {
            alert.setAlert('error', 'Failed to create Role');
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
        {/* <button className="btn btn-primary fw-bold" onClick={() => handleModalState()}>New User Role</button>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className="fw-bold">Create New Role</DialogTitle>
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
        </Dialog> */}
        <Button type="button" onClick={() => handleModalState()}>
            New Role
        </Button>
        <Modal open={open}>
            <ModalHeader title="Create New Role"/>
            <form onSubmit={formik.handleSubmit}>
                <ModalContent>
                    <div className="flex flex-col gap-2">
                        <TextField type="text" label="Role" value={formik.values.title} onChange={(e) => formik.setFieldValue("title", e.target.value)}/>
                    </div>
                </ModalContent>
                <ModalActions>
                    <Button type="submit" loading={formik.isSubmitting} disabled={formik.isSubmitting}>
                        Save
                    </Button>
                    <Button type="cancel" onClick={() => handleModalState()} disabled={formik.isSubmitting}>
                        Cancel
                    </Button>
                </ModalActions>
            </form>
        </Modal>
        </>
    );
};
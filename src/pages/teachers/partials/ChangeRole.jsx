import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormik  } from "formik";
import { useAlert } from "../../../hooks/CustomHooks";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import axios from "axios";

export default function ChangeRoleModal({teacher, refresh}){
    const [roles, setRoles] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [open, setOpen] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        formik.resetForm();
        setOpen(!open);
    };
    
    const handleSubmit = async (values) => {
        setUpdating(true);
        await axios.put(`users/role/${teacher.id}`, values)
        .then(() => {
            alert.setAlert('success', 'User Role Updated');
            refresh();
            handleModalState();
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to update user Role');
        })
        .finally(() => {
            setUpdating(false);
        })
    };
    
    const handleFetchRoles = async () => {
        await axios.get('roles/all')
        .then((res) => {
          setRoles(res.data.data || []);
        })
      };
      
    const formik = useFormik({
        initialValues:{
            roles: teacher.roles[0].id
        },
        enableReinitialize: true,
        onSubmit: handleSubmit,
    });
    
    useEffect(() => {
        if(open){
            handleFetchRoles();
        }
    }, [open]);
    
    return(
        <>
        <Tooltip title="Change User Role">
            <IconButton size="small" color="primary" onClick={() => handleModalState()}>
                <ManageAccountsIcon fontSize="small"/>
            </IconButton>
        </Tooltip>
        <Dialog open={open} fullWidth maxWidth="md">
            <DialogTitle>Update User Role</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <div className="d-flex flex-column">
                        <select className="form-select" value={formik.values.roles} onChange={(e) => formik.setFieldValue('roles', e.target.value)}>
                            {roles.map((role, index) => (
                                <option key={index} value={role.id}>
                                    {role.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </DialogContent>
                <DialogActions className="d-flex justify-content-start">
                    <button type="submit" className="btn btn-primary" disabled={updating}>
                        {updating ? <div className="spinner-border spinner-border-sm"></div> : "Save"}
                    </button>
                    <button type="button" className="btn btn-danger" disabled={updating} onClick={() => handleModalState()}>Cancel</button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    )
};
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { GetAppInstitutionRoles } from "../../../global/Helpers";
import { useEffect, useState } from "react";
import { useFormik  } from "formik";
import pb from "../../../global/pb";
import { useAlert } from "../../../hooks/CustomHooks";

export default function ChangeRoleModal({reducer, refresh}){
    const teacher = reducer.state.selected_teacher;
    const dispatch = reducer.dispatch;
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(teacher?.expand?.roles[0].id);
    const [updating, setUpdating] = useState(false);
    const alert = useAlert();
    
    const handleFetchRoles = async () => {
        const roles = await GetAppInstitutionRoles();
        setRoles(roles);
    };
    
    const handleSubmit = async () => {
        setUpdating(true);
        try {
            await pb.collection("user_relationships")
            .update(teacher.id, {
                roles: [selectedRole]
            });
            alert.setAlert("success", "User updated.")
            dispatch(reducer.actions.UPDATE_MODAL_STATE(false));
            refresh();
        } catch (error) {
            alert.setAlert("error", "Failed to update user.")
        } finally {
            setUpdating(false);
        }
    };
    
    useEffect(() => {
        setSelectedRole(teacher?.expand?.roles[0].id);
    }, [teacher]);
    
    useEffect(() => {
        handleFetchRoles();
    }, []);
    
    return(
        <Dialog open={reducer?.state.change_role_modal_state} fullWidth maxWidth="md">
            <DialogTitle>Update User Role</DialogTitle>
                <DialogContent dividers>
                    <div className="d-flex flex-column">
                        <select className="form-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                            {roles.map((role, index) => (
                                <option key={index} value={role.id}>
                                    {role.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </DialogContent>
                <DialogActions className="d-flex justify-content-start">
                    <button className="btn btn-primary" onClick={() => handleSubmit()} disabled={updating}>
                        {updating ? <div className="spinner-border spinner-border-sm"></div> : "Save"}
                    </button>
                    <button className="btn btn-danger" disabled={updating} onClick={() => dispatch(reducer.actions.UPDATE_MODAL_STATE(false))}>Cancel</button>
                </DialogActions>
        </Dialog>
    )
};
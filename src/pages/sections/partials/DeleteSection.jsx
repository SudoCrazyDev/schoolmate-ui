import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import axios from "axios";
import { useAlert } from "../../../hooks/CustomHooks";
import { userHasRole } from "../../../global/Helpers";

export default function DeleteSection({section, refresh}){
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    const handleDelete = async () => {
        setDeleting(true);
        await axios.delete(`institution_sections/delete/${section.id}`)
        .then(() => {
            alert.setAlert('success', 'Section deleted!');
            refresh();
            handleModalState();
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to delete section!');
        })
        .finally(() => {
            setDeleting(false);
        })
    };
    
    return(
        <>
        {userHasRole(['institution-app-admin']) && (
           <Tooltip title="Delete Section">
                <IconButton size="small" color="error" onClick={() => handleModalState()}>
                    <DeleteIcon fontSize="small"/>
                </IconButton>
            </Tooltip>
        )}
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle>Are you sure you want to delete {section.grade_level} - {section.title}?</DialogTitle>
            <DialogContent dividers>
                <h3 className="fw-bold">STUDENTS, GRADES & SUBJECTS will also be deleted.</h3>
                <p>Are you really sure? You can't undo this action.</p>
            </DialogContent>
            <DialogActions className="d-flex flex-row justify-content-start gap-1">
                <button className="btn btn-primary" disabled={deleting} onClick={() => handleDelete()}>
                    {deleting && <span className="spinner-border spinner-border-sm"></span>}
                    Submit
                </button>
                <button className="btn btn-danger" disabled={deleting} onClick={() => handleModalState()}>Cancel</button>
            </DialogActions>
        </Dialog>
        </>
    );
}
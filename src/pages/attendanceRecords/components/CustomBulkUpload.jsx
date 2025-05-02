import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useAlert } from "../../../hooks/CustomHooks";
import axios from "axios";
import { GetActiveInstitution } from "../../../global/Helpers";

const CustomBulkUpload = () => {
    const [open, setOpen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [notCSV, setNotCSV] = useState(false);
    const institution = GetActiveInstitution();
    const [submitting, setSubmitting] = useState(false);
    
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpen(!open);
        setUploadedFile(null);
    };
    
    const handleSelectFile = (file) => {
        if(file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            setUploadedFile(file);
        } else {
            setNotCSV(true);
        }
    };
    
    const handleSubmitFile = async () => {
        if(!uploadedFile){
            alert.setAlert("error", "Invalid File");
            return;
        }
        setSubmitting(true);
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('institution_id', institution.id);
        await axios.post('attendance_records/custom-bulk-upload', formData)
        .then(() => {
            alert.setAlert("success", "Records has been processed");
            handleModalState();
        })
        .catch((err) => {
            alert.setAlert("error", "Failed to process");
        })
        .finally(() => {
            setSubmitting(false);
        });
    };
    
    useEffect(() => {
        if(notCSV){
            setTimeout(() => {
                setNotCSV(false);
            }, 3500);
        }
    }, [notCSV]);
    return(
        <>
        <button className="btn btn-primary" onClick={() => handleModalState()}>Custom Upload</button>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className="fw-bolder pb-0">
                Upload the Attendance Records
            </DialogTitle>
            <hr />
            <DialogContent>
                {notCSV && (
                    <div className="card p-3 shadow d-flex flex-column rounded bg-danger-subtle mb-3">
                        <h4 className="m-0 fw-bolder text-danger">FILE NOT CSV</h4>
                    </div>
                )}
                {uploadedFile && (
                    <div className="card p-3 shadow d-flex flex-column rounded">
                        <h4 className="m-0 fw-bolder">{uploadedFile.name}</h4>
                    </div>
                )}
                {!uploadedFile && (
                    <div className="d-flex flex-column align-items-center justify-content-center w-100 border border-secondary-subtle rounded-4" style={{height: "350px"}}>
                        <input type="file" style={{position: "absolute", height: "350px", width: "100%", opacity: "0", cursor: "pointer"}} onChange={(e) => handleSelectFile(e.target.files[0])}/>
                        <h2 className="m-0 fw-bolder">Upload Files</h2>
                        <button className="btn btn-outline-secondary rounded-5 mt-2">Choose File</button>
                    </div>
                )}
            </DialogContent>
            <DialogActions className="d-flex flex-row gap-2 justify-content-start">
                <button className="btn btn-primary" onClick={() => handleSubmitFile()} disabled={submitting}>
                    {submitting && <div className="spinner-border spinner-border-sm"></div>}
                    Submit
                </button>
                <button className="btn btn-danger" onClick={()=> handleModalState()} disabled={submitting}>Cancel</button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default CustomBulkUpload;
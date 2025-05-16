import { useFormik } from 'formik';
import { useState } from 'react';
import axios from 'axios';
import { useAlert } from '../../../hooks/CustomHooks';
import { IconButton, Tooltip } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import {
    Modal,
    ModalActions,
    ModalContent,
    ModalHeader,
    TextField,
    Button
} from '@UIComponents';

export default function EditInstitution({institution, refresh}){
    const [open, setOpen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const alert = useAlert();
    
    const handleModalState = () => {
        formik.resetForm();
        setOpen(!open);
    };
    
    const handleSubmit = async (values) => {
        formik.setSubmitting(true);
        const formData = new FormData();
        for(const [key, value] of Object.entries(values)){
            formData.append(key, value);
        }
        await axios.post(`institution/update`, formData)
        .then(() => {
            alert.setAlert('success', 'Institution Updated');
            handleModalState();
            refresh();
        })
        .catch((err) => {
            console.log(err);
            alert.setAlert('error', 'Failed to update Institution');
        })
        .finally(() => {
            formik.setSubmitting(false);
        });
    };
    
    const handleUploadFile = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            setUploadedFile(reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
        formik.setFieldValue('logo', e.target.files[0]);
    };
    
    const formik = useFormik({
        initialValues: {
            id: institution.id,
            institution: institution.title,
            abbr: institution.abbr,
            gov_id: institution.gov_id,
            address: institution.address,
            logo: institution.logo,
            division: institution.division,
            region: institution.region,
        },
        onSubmit: handleSubmit
    });
    
    return(
        <>
        <Tooltip title="Edit">
            <IconButton color="primary" size="small" onClick={() => handleModalState()}>
                <CreateIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>
        <Modal open={open}>
            <ModalHeader title="Update Institution" />
            <form onSubmit={formik.handleSubmit}>
                <ModalContent>
                    <div className="flex flex-col gap-2">
                        <TextField type="text" label="Institution" value={formik.values.title} onChange={(e) => formik.setFieldValue("institution", e.target.value)}/>
                        <TextField type="text" label="Abbrevation" value={formik.values.abbr} onChange={(e) => formik.setFieldValue("abbr", e.target.value)}/>
                        <TextField type="text" label="Address" value={formik.values.address} onChange={(e) => formik.setFieldValue("address", e.target.value)}/>
                        <TextField type="text" label="School ID" value={formik.values.gov_id} onChange={(e) => formik.setFieldValue("gov_id", e.target.value)}/>
                        <TextField type="text" label="Region" value={formik.values.region} onChange={(e) => formik.setFieldValue("region", e.target.value)}/>
                        <TextField type="text" label="Division" value={formik.values.division} onChange={(e) => formik.setFieldValue("division", e.target.value)}/>
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
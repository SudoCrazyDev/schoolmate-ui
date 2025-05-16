import { useFormik } from 'formik';
import { useState } from 'react';
import Axios from 'axios';
import { useAlert } from '../../../hooks/CustomHooks';
import {
    Button,
    Modal,
    ModalHeader,
    ModalContent,
    ModalActions,
    TextField
} from "@UIComponents";

export default function AddInstitution({setInstitutions}){
    const [open, setOpen] = useState(false);
    const alert = useAlert();
    
    const handleModalState = () => {
        formik.resetForm();
        setOpen(!open);
    };
    
    const handleSubmit = async (values) => {
        formik.setSubmitting(true);
        await Axios.post('institution/add', values)
        .then((res) => {
            setInstitutions(res.data.data.data);
            alert.setAlert('success', res.data.message);
            handleModalState();
        })
        .catch(err => {
            alert.setAlert('error', err.response.data.message);
            formik.setSubmitting(false);
        });
    };
    
    const formik = useFormik({
        initialValues: {
            title: '',
            abbr: '',
            division: '',
            region: '',
            address: '',
            gov_id: ''
        },
        onSubmit: handleSubmit
    });
    
    return(
        <>
        <Button type="button" onClick={() => handleModalState()}>
            NEW INSTITUTION
        </Button>
        <Modal open={open}>
            <ModalHeader title="NEW INSTITUTIONS"/>
            <form onSubmit={formik.handleSubmit}>
                <ModalContent>
                    <div className="flex flex-col gap-2">
                        <TextField type="text" label="Institution" value={formik.values.title} onChange={(e) => formik.setFieldValue("title", e.target.value)}/>
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
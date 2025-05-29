import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { useFormik } from 'formik';
import { useAlert, useFilterTeacher } from '../../../hooks/CustomHooks';
import axios from 'axios';
import {
    TextField,
    AutoComplete,
    Button
} from '@UIComponents';

export default function EditSubject({subject, refresh}){
    const {
        id,
        title,
        start_time,
        end_time,
        schedule,
        subject_teacher,
        section_id
    } = subject;
    const { teachers, setText, text } = useFilterTeacher();
    const [open, setOpenModal] = useState(false);
    const alert = useAlert();

    const handleModalState = () => {
        setOpenModal(!open);
    };
    
    const handleSubmit = async (values) => {
        formik.setSubmitting(true)
        await axios.put(`subjects/${id}`, values)
        .then(() => {
            alert.setAlert('success', 'Subject Updated!');
            refresh();
            handleModalState();
        })
        .catch(() => {
            alert.setAlert('error', 'Failed to update Subject!');
        });
    };

    const formik = useFormik({
        initialValues: {
            title: title,
            start_time: start_time,
            end_time: end_time,
            subject_teacher: subject_teacher?.id,
            section_id: section_id,
            schedule: schedule
        },
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    const handleChange = (value) => {
        setText(`${String(value.last_name).toUpperCase()}, ${String(value.first_name).toUpperCase()}`);
        formik.setFieldValue("subject_teacher", value.id);
    };
    
    useEffect(() => {
        if(subject_teacher){
            setText(`${String(subject_teacher.last_name).toUpperCase()}, ${String(subject_teacher.first_name).toUpperCase()}`);
        }
    }, [subject_teacher]);
    
    return(
        <>
        <IconButton size='small' color='primary' onClick={() => handleModalState()}>
            <EditIcon fontSize='small' />
        </IconButton>
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle className='font-bolder'>Update Subject Details</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <div className="flex flex-col gap-4">
                        <TextField
                            type="text"
                            label="Subject Title"
                            disabled={formik.isSubmitting}
                            {...formik.getFieldProps('title')}
                        />
                        <TextField
                            type="time"
                            label="Start Time"
                            disabled={formik.isSubmitting}
                            {...formik.getFieldProps('start_time')}
                        />
                        <TextField
                            type="time"
                            label="End Time"
                            disabled={formik.isSubmitting}
                            {...formik.getFieldProps('end_time')}
                        />
                        <AutoComplete
                            label="Subject Teacher"
                            options={teachers}
                            onChange={handleChange}
                            textChange={(text) => setText(text)}
                            value={text}
                            key="id"
                            getOptionLabel={(option) => `${String(option.last_name).toUpperCase()}, ${String(option.first_name).toUpperCase()}`}
                        />
                    </div>
                </DialogContent>
                <DialogActions className='flex flex-row justify-start mt-2'>
                    <Button
                        type="submit"
                        disabled={formik.isSubmitting}
                        loading={formik.isSubmitting}
                    >
                        Submit
                    </Button>
                    <Button
                        type="cancel"
                        onClick={() => handleModalState()}
                        disabled={formik.isSubmitting}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
        </>
    );
}
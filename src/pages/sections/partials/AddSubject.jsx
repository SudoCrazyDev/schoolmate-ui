// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Divider from '@mui/material/Divider'
import Axios from 'axios';
import { useFormik } from "formik";
import { useAlert } from '../../../hooks/CustomHooks';
import { useSelector } from 'react-redux';
import {
  Button,
  TextField,
  AutoComplete
} from '@UIComponents'
import {
  useFilterTeacher
} from '@CustomHooks'

export default function AddSubject({selectedSection, refresh}){
    const {teachers, setText, text} = useFilterTeacher();
    const [open, setOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const alert = useAlert()

    const handleCloseModal = () => {
      formik.resetForm();
      setOpen(false);
    };

    const handleSubmit = async (values) => {
      formik.setSubmitting(true);
      await Axios.post('subjects/add', values)
      .then(() => {
        refresh();
        alert.setAlert('success', 'Subject Created!');
        handleCloseModal();
      })
      .catch((err) => {
        alert.setAlert('error', 'Error on adding subject');
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
    };

    const formik = useFormik({
      initialValues:{
        title: '',
        section_id: selectedSection.id,
        subject_teacher: null,
        start_time: '',
        end_time: ''
      },
      enableReinitialize: true,
      onSubmit: handleSubmit
    });

    const handleChange = (teacher) => {
        formik.setFieldValue('subject_teacher', teacher.id);
        setSelectedTeacher(teacher)
    };
    
    return(
        <>
        <Button onClick={() => setOpen(true)}>
          Add Subject
        </Button>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => handleCloseModal()}>
            <DialogTitle className='fw-bolder'>Add New Subject for {selectedSection.section_name}</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col gap-3">
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
                          value={selectedTeacher ? `${String(selectedTeacher.last_name).toUpperCase()}, ${String(selectedTeacher.first_name).toUpperCase()}` : text}
                          key="id"
                          getOptionLabel={(option) => `${String(option.last_name).toUpperCase()}, ${String(option.first_name).toUpperCase()}`}
                        />
                        <Divider />
                        <div className="flex flex-row mt-2 gap-2">
                            <Button type="submit" disabled={formik.isSubmitting}>Submit {formik.isSubmitting && <span className="ms-2 spinner-border spinner-border-sm"></span>}</Button>
                            <Button type="cancel" onClick={() => handleCloseModal()} disabled={formik.isSubmitting}>Cancel</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}
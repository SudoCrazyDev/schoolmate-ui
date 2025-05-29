import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useMemo, useState } from 'react';
import Divider from '@mui/material/Divider'
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useAlert } from '../../../hooks/CustomHooks';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { Tooltip } from '@mui/material';
import {
    TextField,
    AutoComplete,
    Button
} from "@UIComponents";
import { objectToString } from '../../../global/Helpers';

export default function EditSection({section, refresh}){
    const {institutions} = useSelector(state => state.user);
    const [teachers, setTeachers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const alert = useAlert();

    const handleModalState = () => {
      formik.resetForm();
      setOpen(!open);
    };

    const handleFetchTeachers = async () => {
      setFetching(true);
      await axios.get(`users/all_by_institutions/${institutions[0].id}`)
      .then((res) => {
          let fetched = res.data.data;
          setTeachers(fetched.sort((a,b) => a.last_name.localeCompare(b.last_name)));
      })
      .catch(err => {
          alert.setAlert('error', 'Failed to fetch Teachers');
      })
      .finally(() => {
          setFetching(false);
      });
    };

    const findSelectedTeacher = () => {
      setSelectedTeacher(teachers.filter(teacher => teacher.id === section.class_adviser.id)[0]);
    };
    
    const filteredTeachers = useMemo(() => {
      if(search === "") return teachers;
      return teachers.filter(teacher => objectToString(teacher).includes(String(search).toLowerCase()));
    },[search, teachers]);

    const handleSubmit = async (values) => {
      await axios.post(`institution_sections/update`, values)
      .then(({data}) => {
          alert.setAlert('success', 'Section updated successfully')
          refresh();
          handleModalState();
      })
      .catch(() => {
        alert.setAlert('error', 'Failed updating section')
      })
      .finally(() => {
        formik.setSubmitting(false);
      });
    };

    const formik = useFormik({
        initialValues: {
          section_id: section.id,
          title: section.title,
          class_adviser: section.class_adviser.id
        },
        enableReinitialize: true,
        onSubmit: handleSubmit
    });

    useEffect(() => {
      if(open){
        handleFetchTeachers();
      }
    }, [open]);

    const handleOnChange = (item) => {
      setSelectedTeacher(item);
      formik.setFieldValue('class_adviser', item.id);
    };

    useEffect(() => {
      findSelectedTeacher();
    }, [teachers]);
    
    return(
        <>
        <Tooltip title="Edit Section">
          <IconButton className='ms-auto' size='small' color="info" onClick={handleModalState}>
              <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => setOpen(false)}>
            <DialogTitle className='fw-bolder'>Update Section</DialogTitle>
            <Divider />
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col gap-3">
                        <TextField
                          required={true}
                          type="text"
                          label="Section Name"
                          disabled={formik.isSubmitting}
                          {...formik.getFieldProps('title')}
                        />
                        <AutoComplete
                          label="Section Adviser"
                          options={filteredTeachers}
                          onChange={handleOnChange}
                          textChange={(text) => setSearch(text)}
                          value={selectedTeacher ? `${String(selectedTeacher.last_name).toUpperCase()}, ${String(selectedTeacher.first_name).toUpperCase()}` : search}
                          key="id"
                          getOptionLabel={(option) => `${String(option.last_name).toUpperCase()}, ${String(option.first_name).toUpperCase()}`}
                        />
                        <Divider />
                        <div className="flex flex-row mt-2 gap-2">
                            <Button type="submit" disabled={formik.isSubmitting} loading={formik.isSubmitting}>
                              Submit
                            </Button>
                            <Button type="cancel" disabled={formik.isSubmitting} loading={formik.isSubmitting} onClick={handleModalState}>
                              Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}
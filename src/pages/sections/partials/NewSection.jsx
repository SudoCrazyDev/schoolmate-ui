import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import Axios from 'axios';


export default function NewSection(){
    const [open, setOpen] = useState(false);
    const { teachers } = useSelector(state => state.org);
    const [gradeLevels, setGradeLevels] = useState([]);
    
    const handleModalState = () => {
      setOpen(!open);
    };
    
    const handleGetLevels = () => {
      Axios.get('grade_levels')
      .then(({data}) => {
        setGradeLevels(data);
      });
    };
    
    useEffect(() => {
      handleGetLevels();
    }, []);
    
    const formik = useFormik({
        initialValues: {
          
        },
    });
    
    return(
        <>
        <Button variant="contained" className='fw-bolder' onClick={handleModalState}>New Section</Button>
        <Dialog open={open} maxWidth="sm" fullWidth onClose={() => setOpen(false)}>
            <DialogTitle className='fw-bolder'>Add New Section</DialogTitle>
            <Divider />
            <DialogContent>
                <form>
                    <div className="d-flex flex-column gap-3">
                        <TextField label="Section Name" variant="outlined" />
                        <FormControl>
                            <InputLabel id="grade_level_label">Grade Level</InputLabel>
                            <Select labelId="grade_level_label" label="Grade Level" fullWidth>
                              {gradeLevels.map((gl, index) => (
                                <MenuItem key={index} value={gl.id}>Grade {gl.grade_level}</MenuItem>
                              ))}
                            </Select>
                        </FormControl>
                        <Autocomplete
                            disabled={formik.isSubmitting}
                            id="combo-box-demo"
                            options={teachers}
                            fullWidth
                            disableClearable
                            onChange={(event, newValue) =>{
                              formik.setFieldValue('user_id', newValue.id);
                            }}
                            getOptionLabel={(option) => `${option.details?.first_name} ${option.details?.last_name}`}
                            renderInput={(params) => <TextField {...params} label="Class Adviser" />}
                        />
                        <Divider />
                        <div className="d-flex flex-row mt-2 gap-2">
                            <Button type="submit" variant="contained" color="primary">Submit</Button>
                            <Button variant="contained" color="error" onClick={handleModalState}>Cancel</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}
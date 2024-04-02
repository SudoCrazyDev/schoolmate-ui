import TextField from '@mui/material/TextField';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox'

export default function GuardianInfo({formik}){
    return(
        <div role='tabpanel' className="mt-3 d-flex flex-row flex-wrap">
            <div className="p-2 col-3">
                <TextField
                inputProps={{className: 'text-uppercase'}}
                variant='outlined'
                size='small'
                label="Father's First Name"
                fullWidth
                {...formik.getFieldProps('parent_guardian.father.first_name')}
                error={formik.touched.parent_guardian?.father.first_name && formik.errors.parent_guardian?.father.first_name}
                helperText={formik.errors.parent_guardian?.father.first_name}
                />
            </div>
            <div className="p-2 col-3">
                <TextField
                inputProps={{className: 'text-uppercase'}}
                variant='outlined'
                size='small'
                label="Father's Middle Name"
                fullWidth
                {...formik.getFieldProps('parent_guardian.father.middle_name')}
                error={formik.touched.parent_guardian?.father.middle_name && formik.errors.parent_guardian?.father.middle_name}
                helperText={formik.errors.parent_guardian?.father.middle_name}
                />
            </div>
            <div className="p-2 col-3">
                <TextField
                inputProps={{className: 'text-uppercase'}}
                variant='outlined'
                size='small'
                label="Father's Last Name"
                fullWidth
                {...formik.getFieldProps('parent_guardian.father.last_name')}
                error={formik.touched.parent_guardian?.father.last_name && formik.errors.parent_guardian?.father.last_name}
                helperText={formik.errors.parent_guardian?.father.last_name}
                />
            </div>
            <div className="p-2 col-3">
                <TextField
                inputProps={{className: 'text-uppercase'}}
                variant='outlined'
                size='small'
                label="Father's Contact"
                fullWidth
                {...formik.getFieldProps('parent_guardian.father.contact_no')}
                error={formik.touched.parent_guardian?.father.contact_no && formik.errors.parent_guardian?.father.contact_no}
                helperText={formik.errors.parent_guardian?.father.contact_no}
                />
            </div>
            <div className="p-2 col-3">
                <TextField
                inputProps={{className: 'text-uppercase'}}
                variant='outlined'
                size='small'
                label="Mother's First Name"
                fullWidth
                {...formik.getFieldProps('parent_guardian.mother.first_name')}
                error={formik.touched.parent_guardian?.mother.first_name && formik.errors.parent_guardian?.mother.first_name}
                helperText={formik.errors.parent_guardian?.mother.first_name}
                />
            </div>
            <div className="p-2 col-3">
                <TextField
                inputProps={{className: 'text-uppercase'}}
                variant='outlined'
                size='small'
                label="Mother's Middle Name"
                fullWidth
                {...formik.getFieldProps('parent_guardian.mother.middle_name')}
                error={formik.touched.parent_guardian?.mother.middle_name && formik.errors.parent_guardian?.mother.middle_name}
                helperText={formik.errors.parent_guardian?.mother.middle_name}
                />
            </div>
            <div className="p-2 col-3">
                <TextField
                inputProps={{className: 'text-uppercase'}}
                variant='outlined'
                size='small'
                label="Mother's Last Name"
                fullWidth
                {...formik.getFieldProps('parent_guardian.mother.last_name')}
                error={formik.touched.parent_guardian?.mother.last_name && formik.errors.parent_guardian?.mother.last_name}
                helperText={formik.errors.parent_guardian?.mother.last_name}
                />
            </div>
            <div className="p-2 col-3">
                <TextField
                inputProps={{className: 'text-uppercase'}}
                variant='outlined'
                size='small'
                label="Mother's Contact"
                fullWidth
                {...formik.getFieldProps('parent_guardian.mother.contact_no')}
                error={formik.touched.parent_guardian?.mother.contact_no && formik.errors.parent_guardian?.mother.contact_no}
                helperText={formik.errors.parent_guardian?.mother.contact_no}
                />
            </div>
            <div className="p-2 col-3">
                <TextField
                inputProps={{className: 'text-uppercase'}}
                variant='outlined'
                size='small'
                label="Guardian's First Name"
                fullWidth
                {...formik.getFieldProps('parent_guardian.guardian.first_name')}
                error={formik.touched.parent_guardian?.guardian.first_name && formik.errors.parent_guardian?.guardian.first_name}
                helperText={formik.errors.parent_guardian?.guardian.first_name}
                />
            </div>
            <div className="p-2 col-3">
                <TextField
                inputProps={{className: 'text-uppercase'}}
                variant='outlined'
                size='small'
                label="Guardian's Middle Name"
                fullWidth
                {...formik.getFieldProps('parent_guardian.guardian.middle_name')}
                error={formik.touched.parent_guardian?.guardian.middle_name && formik.errors.parent_guardian?.guardian.middle_name}
                helperText={formik.errors.parent_guardian?.guardian.middle_name}
                />
            </div>
            <div className="p-2 col-3">
                <TextField
                inputProps={{className: 'text-uppercase'}}
                variant='outlined'
                size='small'
                label="Guardian's Last Name"
                fullWidth
                {...formik.getFieldProps('parent_guardian.guardian.last_name')}
                error={formik.touched.parent_guardian?.guardian.last_name && formik.errors.parent_guardian?.guardian.last_name}
                helperText={formik.errors.parent_guardian?.guardian.last_name}
                />
            </div>
            <div className="p-2 col-3">
                <TextField
                inputProps={{className: 'text-uppercase'}}
                variant='outlined'
                size='small'
                label="Guardian's Contact"
                fullWidth
                {...formik.getFieldProps('parent_guardian.guardian.contact_no')}
                error={formik.touched.parent_guardian?.guardian.contact_no && formik.errors.parent_guardian?.guardian.contact_no}
                helperText={formik.errors.parent_guardian?.guardian.contact_no}
                />
            </div>
        </div>
    );
};
import { useEffect, useState } from "react";
import axios from 'axios';
import { useAlert } from "../../../hooks/CustomHooks";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Dialog, DialogActions, DialogContent, IconButton, Tooltip } from "@mui/material";
import { GetActiveInstitution, simplifyStudentGrades, stringToUpperCase } from "../../../global/Helpers";

export default function Form137({student}){
  const [downloading, setDownloading] = useState(false);
  const [cardTemplates, setCardTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [open, setOpen] = useState(false);
  const institution = GetActiveInstitution();
  const alert = useAlert();

  const handleDownload = async () => {
    if(!selectedTemplate){
      alert.setAlert("error", "Invalid Card Template");
      return;
    }
    let subjectTemplate = JSON.parse(selectedTemplate);
    let studentGrade_obj = simplifyStudentGrades(student);
    let student_grades = Object.keys(studentGrade_obj).map(key => ({ title: key, ...studentGrade_obj[key] }));
    let finalized_grades = [];

    subjectTemplate.forEach(subject => {
      finalized_grades.push(student_grades.filter(grade => String(grade.title).toLowerCase() === String(subject.subject_to_match).toLowerCase())[0]);
    });

    setDownloading(true)
    let dataBuilder = {
      first_name: stringToUpperCase(student.first_name),
      middle_name: stringToUpperCase(student.middle_name),
      last_name: stringToUpperCase(student.last_name),
      lrn: student.lrn,
      extension: stringToUpperCase(student.ext_name),
      sex: stringToUpperCase(student.gender),
      birthday: student.birthdate,
      student_grades: finalized_grades
    };
    await axios.post('school_forms/form137', dataBuilder)
    .then(res => {
      window.open(res.data, '_blank');
      handleModalState();
    })
    .catch(() => {
      alert.setAlert("error", "Failed to download FORM-10")
    })
    .finally(() => {
      setDownloading(false);
    });
  };

  const handleModalState = () => {
    setOpen(!open);
  };
  
  const handleFetchCardTemplates = async () => {
      await axios.get(`card_templates/institutions/${institution.id}`)
      .then((res) => {
          setCardTemplates(res.data);
      });
  };

  useEffect(() => {
    if(open){
      handleFetchCardTemplates()
    }
  }, [open]);
  return(
    <>
    <Tooltip title="Download FORM-10">
      <IconButton color="primary" size="small" disabled={downloading} onClick={() => handleModalState()}>
        {downloading && <span className="spinner-border spinner-border-sm"></span>}
        {!downloading && <CloudDownloadIcon />}
      </IconButton>
    </Tooltip>
    <Dialog open={open} maxWidth="sm" fullWidth onClose={() => handleModalState()}>
      <DialogContent className="d-flex flex-column">
          <p className="text-dark m-0 mt-2">Please Select a Card Template</p>
          <select className="form-select" defaultValue={cardTemplates?.[0]?.subjects} onChange={(e) => setSelectedTemplate(e.target.value)}>
              {cardTemplates.map(cardTemplate => (
                  <option key={cardTemplate.id} value={cardTemplate.subjects}>
                      {cardTemplate.title}
                  </option>
              ))}
          </select>
      </DialogContent>
      <DialogActions>
        <button
          className="btn btn-primary w-100"
          disabled={downloading}
          onClick={() => handleDownload()}
        >
          {downloading && <span className="spinner-border spinner-border-sm"></span>}
          Download{downloading && 'ing...'}
        </button>
      </DialogActions>
    </Dialog>
    </>
  );
};
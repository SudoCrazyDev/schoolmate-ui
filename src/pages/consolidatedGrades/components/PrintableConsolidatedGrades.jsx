import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import PrintConsolidatedGrades from "./PrintConsolidatedGrades";
import axios from "axios";
import { GetActiveInstitution } from "../../../global/Helpers";

export default function PrintableConsolidatedGrades({section, quarter}){
    const [open, setOpen] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [cardTemplates, setCardTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const institution = GetActiveInstitution();
    
    const handleClickOpen = () => {
        setOpen(!open);
    };
    
    const handleGetQuarterTitle = () => {
        switch(quarter){
            case 1: return "1st";
            case 2: return "2nd";
            case 3: return "3rd";
            case 4: return "4th";
            default: return quarter;
        }
    };
    
    const handleFetchCardTemplates = async () => {
        setFetching(true);
        await axios.get(`card_templates/institutions/${institution.id}`)
        .then((res) => {
            setCardTemplates(res.data);
        })
        .finally(() => {
            setFetching(false);
        });
    };
    
    useEffect(() => {
        if(open){
            handleFetchCardTemplates();
        }
    }, [open]);

    return(
        <>
        <button className="btn btn-sm btn-primary" onClick={() => handleClickOpen()}>{handleGetQuarterTitle()}</button>
        <Dialog open={open} fullScreen onClose={() => handleClickOpen()}>
            <div className="d-flex flex-row flex-wrap">
                <p className="m-0 col-12 fw-bolder">CONSOLIDATED GRADES</p>
                <div className="d-flex flex-column">
                    <p className="text-dark m-0">Please Select a Card Template</p>
                    <select className="form-select" defaultValue={selectedTemplate?.[0].subjects} onChange={(e) => setSelectedTemplate(e.target.value)}>
                        {cardTemplates.map(cardTemplate => (
                            <option key={cardTemplate.id} value={cardTemplate.subjects}>
                                {cardTemplate.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <hr />
            <DialogContent style={{height: '100vh'}}>
                {selectedTemplate && (
                    <PrintConsolidatedGrades template={JSON.parse(selectedTemplate) || []} section={section} open={open} quarter={quarter} quarterTitle={handleGetQuarterTitle()}/>
                )}
            </DialogContent>
            <hr />
            <DialogActions>
                <button className="btn btn-sm btn-secondary" onClick={() => handleClickOpen()}>Close</button>
            </DialogActions>
        </Dialog>
        </>
    );
};
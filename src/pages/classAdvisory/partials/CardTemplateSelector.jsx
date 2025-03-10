import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { GetActiveInstitution } from "../../../global/Helpers";

export default function CardTemplateSelector({sectionId}){
    const [open, setOpen] = useState(false);
    const [cardTemplates, setCardTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [fetching, setFetching] = useState(true);
    
    const institution = GetActiveInstitution();
    
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
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    const handleSetCardTemplate = async () => {
        const data = {
            section_id:sectionId,
            card_template_id: selectedTemplate
        };
        await axios.post(`card_templates/update/section_card_template`, data)
        .then(() => {
            handleModalState();
        });
    };
    
    useEffect(() => {
        if(open){
            handleFetchCardTemplates();
        }
    }, [open]);

    return(
        <>
        <Button variant="contained" className='fw-bolder me-2' onClick={() => handleModalState()}>CARD TEMPLATE</Button>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle>Selected Card Template</DialogTitle>
            <DialogContent>
                <div className="d-flex flex-column">
                    <select className="form-select" onChange={(e) => setSelectedTemplate(e.target.value)}>
                        {cardTemplates.map(cardTemplate => (
                            <option key={cardTemplate.id} value={cardTemplate.id}>{cardTemplate.title}</option>
                        ))}
                    </select>
                    <button className="btn btn-sm btn-primary mt-3" onClick={() => handleSetCardTemplate()}>SET AS DEFAULT CARD TEMPLATE</button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
};
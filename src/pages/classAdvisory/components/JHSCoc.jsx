import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { Dialog, DialogActions, DialogContent, IconButton, Tooltip } from '@mui/material';
import { useEffect, useReducer, useState } from 'react';
import JHSCocPrintable from './JHSCocPrintable';
import ArticleIcon from '@mui/icons-material/Article';
import SaveIcon from '@mui/icons-material/Save';
import { getCookie, setCookie } from '../../../global/Helpers';
import { useAlert } from '../../../hooks/CustomHooks';

const reducer = (state, action) => {
    switch (action.type) {
        case "set_district_eng":
            return {
                ...state,
                districtEng: action.payload
            };
        case "set_district_alt":
            return {
                ...state,
                districtAlt: action.payload
            };
        case "set_date_eng":
            return {
                ...state,
                dateEng: action.payload
            };
        case "set_date_alt":
            return {
                ...state,
                dateAlt: action.payload
            };
        default:
            return state;
    }
};

export default function JHSCoc({advisory, student}){
    const [open, setOpen] = useState(false);
    const [state, dispatch] = useReducer(reducer, {
        districtEng: "",
        districtAlt: "",
        dateEng: "",
        dateAlt: ""
    });
    const [overrides, setOverrides] = useState(null);
    const alert = useAlert();
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    const handleInputChange = (val, type) => {
        dispatch({type: type, payload: val})
    };
    
    const handleApplyOverrides = () => {
        setOverrides(state);
    };
    
    useEffect(() => {
        if(open){
            if(getCookie("COC-OVERIDE-DISTRICT-ENG")){
                dispatch({type: "set_district_eng", payload: getCookie("COC-OVERIDE-DISTRICT-ENG")})
            }
            if(getCookie("COC-OVERIDE-DISTRICT-ALT")){
                dispatch({type: "set_district_alt", payload: getCookie("COC-OVERIDE-DISTRICT-ALT")})
            }
            if(getCookie("COC-OVERIDE-DATE-ENG")){
                dispatch({type: "set_date_eng", payload: getCookie("COC-OVERIDE-DATE-ENG")})
            }
            if(getCookie("COC-OVERIDE-DATE-ALT")){
                dispatch({type: "set_date_alt", payload: getCookie("COC-OVERIDE-DATE-ALT")})
            }
        }
    }, [open]);
    
    const handleSaveOverrides = () => {
        setCookie("COC-OVERIDE-DISTRICT-ENG", state.districtEng);
        setCookie("COC-OVERIDE-DISTRICT-ALT", state.districtAlt);
        setCookie("COC-OVERIDE-DATE-ENG", state.dateEng);
        setCookie("COC-OVERIDE-DATE-ALT", state.dateAlt);
        alert.setAlert("success", "Overrides Save");
    };
    return(
        <>
        <Tooltip title="Print COC">
            <IconButton color="primary" size="small" onClick={() => handleModalState()}>
                <ArticleIcon fontSize="inherit"/>
            </IconButton>
        </Tooltip>
        <Dialog open={open} fullScreen>
            <DialogContent className="d-flex flex-row">
                <div className="col-4 d-flex flex-column p-2">
                    <div className="d-flex flex-row align-items-center">
                        <h2 className="m-0 fw-bolder text-dark">COC Settings</h2>
                        <div className="ms-auto">
                            <Tooltip title="Save Overrides">
                                <IconButton color="primary" size="small" onClick={() => handleSaveOverrides()}>
                                    <SaveIcon fontSize="inherit"/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex flex-row gap-2 w-100">
                        <div className="d-flex flex-column col-6">
                            <label>District Eng</label>
                            <input type="text" className="form-control" value={state.districtEng} onChange={(e) => handleInputChange(e.target.value, "set_district_eng")}/>
                        </div>
                        <div className="d-flex flex-column col-6">
                            <label>District Alt</label>
                            <input type="text" className="form-control" value={state.districtAlt} onChange={(e) => handleInputChange(e.target.value, "set_district_alt")}/>
                        </div>
                    </div>
                    <div className="mt-2 d-flex flex-row gap-2 w-100">
                        <div className="d-flex flex-column col-6">
                            <label>Date Eng</label>
                            <input type="text" className="form-control" value={state.dateEng} onChange={(e) => handleInputChange(e.target.value, "set_date_eng")} />
                        </div>
                        <div className="d-flex flex-column col-6">
                            <label>Date Alt</label>
                            <input type="text" className="form-control" value={state.dateAlt}onChange={(e) => handleInputChange(e.target.value, "set_date_alt")} />
                        </div>
                    </div>
                    <button className="mt-3 btn btn-sm btn-primary" onClick={() => handleApplyOverrides()}>Apply Overrides</button>
                </div>
                <div className="col-8 d-flex flex-column p-2">
                    {open && (
                        <JHSCocPrintable advisory={advisory} student={student} overrides={overrides}/>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <button className="btn btn-danger" onClick={() => handleModalState()}>Close</button>
            </DialogActions>
        </Dialog>
        </>
    );
};
import { useEffect, useMemo, useState } from "react";
import './components.scss';

export function SCAutoComplete(props){
    const [lookup, setLookup] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    
    const handleLookup = () => {
        if(lookup.length < 3) return;
        setShowOptions(true);
    };
    
    const style = {
        top: '100%',
        width: '100%',
        maxHeight: '200px',
        overflowY: 'scroll'
    };
    
    const filteredOptions = useMemo(() => {
        if(!Array(props.options)) return [];
        return props.options.filter(option => String(option.institution).toLowerCase().includes(lookup.toLowerCase()));
    },[props.options]);

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        setLookup(option.institution);
    };
    
    useEffect(() => {
        handleLookup();
    }, [lookup]);
    
    return(
        <div className="d-flex flex-column position-relative">
            <input type="text" className="form-control" placeholder="Institution" value={lookup} onChange={(e) => setLookup(e.target.value)}/>
            <div className={`${lookup !== "" ? 'd-flex' : selectedOption ? 'd-none' : 'd-flex'} bg-white border border-secondary rounded position-absolute p-2 flex-column gap-2`} style={style}>
                {lookup.length < 3 && (
                   <div className="d-flex flex-row text-muted p-1 fst-italic"><p className="m-0">Type atleast 3 characters...</p></div>
                )}
                {lookup.length >= 3 && filteredOptions.map((option) => (
                   <div className="d-flex flex-row component-option"><p className="m-0" onClick={() => handleSelectOption(option)}>{option.institution}</p></div>
                ))}
            </div>
        </div>
    );
};
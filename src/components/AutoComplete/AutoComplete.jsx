import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useEffect, useRef, useState } from 'react';

const AutoComplete = (
    {
        label = "",
        required = false,
        options = [],
        onChange,
        value,
        key,
        getOptionLabel,
        textChange,
    }
) => {
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);
    const inputRef = useRef(null);
    
    const handleShowMenu = () => {
        setOpenMenu(!openMenu);
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
        const target = event.target;
        if (
            menuRef.current &&
            !menuRef.current.contains(target)
        ) {
            setOpenMenu(false);
        }
        };

        if (openMenu) {
        document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
        
    }, [openMenu]);
    
    const handleClickItem = (item) => {
        setOpenMenu(false);
        if(onChange){
            onChange(item);
        }
    };
    
    const handleTextChange = (text) => {
        if(textChange){
            textChange(text);
        }
    };
    
    const handleClearSelectedOption = () => {
        handleTextChange("");
        handleClickItem(null);
    };
    
    return(
        <div className="flex flex-col gap-2 px-3 md:px-0 relative">
            <p>
                {label}
                {required && <span className="text-red-500">*</span>}
            </p>
            <div className="flex flex-row border px-5 py-2 rounded-lg">
                <input
                    value={value}
                    ref={inputRef}
                    type="text"
                    className='w-100 focus:border-0 active:border-0 focus-visible:border-0 focus:outline-hidden'
                    onFocus={handleShowMenu}
                    onChange={(e) => handleTextChange(e.target.value)}
                />
                <div className="ml-auto">
                    {value && (
                        <CloseIcon fontSize="small" onClick={handleClearSelectedOption} className='cursor-pointer'/>
                    )}
                </div>
            </div>
            {openMenu && (
                <div ref={menuRef} className="absolute w-full bg-white top-[68px] z-10 border rounded-lg">
                    <div className="w-full flex flex-col">
                        {options.length === 0 && (
                            <div className="p-2 cursor-pointer transition-all text-center italic text-gray-400">
                                <p>No Options Available....</p>
                            </div>
                        )}
                        {options.map(option => (
                            <div key={option[key]} onClick={() => handleClickItem(option)} className="p-2 hover:bg-gray-300/80 cursor-pointer transition-all">
                                <p>{getOptionLabel(option)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutoComplete;
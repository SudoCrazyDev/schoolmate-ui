import { useSelector } from "react-redux";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Account(){
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const {info} = useSelector(state => state.user);
    
    return(
        <div className="p-2">
            <div className="p-2 d-flex flex-row gap-2 align-items-center rounded account-button" style={{background: '#e9e1e1'}} onClick={(e) => setAnchorEl(e.currentTarget)}>
                <p className="m-0 text-uppercase bg-light fw-bolder" style={{padding: '4px', borderRadius: '50px', fontSize: '15px'}}>
                    {String(info.first_name).charAt(0)}{String(info.last_name).charAt(0)}
                </p>
                <div className="d-flex flex-column">
                    <h6 className="m-0 fw-bold text-capitalize" style={{fontSize: '13px'}}>{info.first_name} {info.last_name}</h6>
                    <p className="m-0 fw-light" style={{fontSize: '10px'}}>{info.email}</p>
                </div>
                <div className="ms-auto">
                    <ChevronRightIcon />
                </div>
            </div>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem>
                    <NavLink to={`/logout`} style={{textDecoration: 'none'}}>
                        Logout
                    </NavLink>
                </MenuItem>
            </Menu>
        </div>
    );
};
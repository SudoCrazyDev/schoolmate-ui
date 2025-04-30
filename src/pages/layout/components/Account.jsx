import { useSelector } from "react-redux";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkHistorySharpIcon from '@mui/icons-material/WorkHistorySharp';

export default function Account(){
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const {info} = useSelector(state => state.user);
    
    return(
        <div className="p-2">
            <div className="p-2 d-flex flex-row gap-2 align-items-center rounded account-button" style={{background: '#e9e1e1'}} onClick={(e) => setAnchorEl(e.currentTarget)}>
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
                    <NavLink to={`/profile`} style={{textDecoration: 'none'}}>
                        <AccountBoxIcon /> Profile
                    </NavLink>
                </MenuItem>
                <MenuItem>
                    <NavLink to={`/my-dtr`} style={{textDecoration: 'none'}}>
                        <WorkHistorySharpIcon /> DTR
                    </NavLink>
                </MenuItem>
                <MenuItem>
                    <NavLink to={`/logout`} style={{textDecoration: 'none'}}>
                        <LogoutIcon /> Logout
                    </NavLink>
                </MenuItem>
            </Menu>
        </div>
    );
};
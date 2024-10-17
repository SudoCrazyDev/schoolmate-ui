import { NavLink } from "react-router-dom";

export default function Menu({link, icon, title}){
    return(
        <div className="menu-option-container">
            <NavLink to={link}>
                <div className="menu-option">
                    {icon}
                    <p className="text-uppercase">{title}</p>
                </div>
            </NavLink>
        </div>
        
    )
}
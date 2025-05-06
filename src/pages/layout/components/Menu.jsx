import { NavLink } from "react-router-dom";
import { userHasRole } from "../../../global/Helpers";

export default function Menu({link, icon, title, allowedRole = []}){
    return(
        <>
            {userHasRole(allowedRole) && (
                <div className="menu-option-container">
                    <NavLink to={link}>
                        <div className="menu-option">
                            {icon}
                            <p className="text-uppercase">{title}</p>
                        </div>
                    </NavLink>
                </div>
            )}
        </>
    )
}
import { NavLink } from "react-router-dom";
import { userHasRole } from "../../../global/Helpers";

export default function Menu({link, icon, title, allowedRole = []}){
    return(
        <>
            {userHasRole(allowedRole) && (
                <NavLink to={link}>
                    <div className="flex flex-col p-1">
                        <div className="flex flex-row gap-2 items-center hover:bg-blue-500/80 hover:text-white hover:shadow-md p-2 rounded-sm">
                            {icon}
                            <p className="text-sm capitalize">{title}</p>
                        </div>
                    </div>
                </NavLink>
            )}
        </>
    )
}
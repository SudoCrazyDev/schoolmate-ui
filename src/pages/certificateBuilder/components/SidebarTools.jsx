import { useState } from "react";

export default function SidebarTools(){
    const [width, setWidth] = useState(200);
    
    return(
        <div className="d-flex flex-row" style={{width: width}}>
            <div className="sidebar-tools w-100">
                SIDE BAR TOOLS
            </div>
        </div>
    );
};
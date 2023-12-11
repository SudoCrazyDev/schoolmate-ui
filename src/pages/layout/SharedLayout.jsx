import Header from "./Header";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

export default function SharedLayout(){
    return(
        <div className="d-flex flex-row" style={{minHeight: '100vh'}}>
            <div className="col-2">
                <SideBar />
            </div>
            <div className="col-10 d-flex flex-column">
                <Header />
                <div className="p-3">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
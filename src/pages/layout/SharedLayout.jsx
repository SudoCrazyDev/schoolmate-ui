import Header from "./Header";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

export default function SharedLayout(){
    return(
        <div className="flex flex-row flex-wrap min-h-screen">
            <div className="hidden md:block w-[240px] border border-gray-300">
                <SideBar />
            </div>
            <div className="flex flex-col grow">
                <Header />
                <div className="p-3">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
import PageContainer from "./components/PageContainer";
import SidebarTools from "./components/SidebarTools";
import TopBarTool from "./components/TopBarTool";

export default function CertificateBuilder(){
    return(
        <div className="d-flex flex-row" style={{minHeight: '100vh'}}>
            <SidebarTools />
            <div className="d-flex flex-column" style={{width: '100%'}}>
                <TopBarTool />
                <PageContainer />
            </div>
        </div>
    );
};
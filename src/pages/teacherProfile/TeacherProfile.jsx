import { Avatar, Tabs, Tab } from "@mui/material";

export default function TeacherProfile(){
    return(
        <div className="d-flex flex-column">
            <div className="d-flex flex-row">
                <div className="col-4 p-2">
                    <div className="card p-3 shadow d-flex flex-column align-items-center">
                        <Avatar
                            alt="Philip Louis Calub"
                            sx={{
                                width: 150,
                                height: 150
                            }}
                        />
                        <h4 className="m-0 mt-2 fw-bold">Philip Louis Calub</h4>
                        <h4 className="badge rounded-pill text-bg-dark m-0 mt-1 fw-normal">Teacher</h4>
                    </div>
                </div>
                <div className="col-8 d-flex flex-column p-2">
                    <div className="d-flex flex-column">
                        <div className="card">
                            <Tabs>
                                <Tab label="Personal" className="fw-bold text-dark"/>
                                <Tab label="Education" className="fw-bold text-dark" />
                                <Tab label="Advisories" className="fw-bold text-dark" />
                                <Tab label="MOVs" className="fw-bold text-dark" />
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
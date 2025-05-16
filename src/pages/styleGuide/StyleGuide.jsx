import { Button, TextField } from "@UIComponents";

const StyleGuide = () => {
    return(
        <div className="p-5 flex flex-col w-screen h-screen gap-5">
            <div className="flex flex-col">
                <h1>Buttons</h1>
                <div className="flex flex-row">
                    <div className="flex flex-col p-1">
                        <p>Normal</p>
                        <Button type="submit">
                            Submit
                        </Button>
                    </div>
                    <div className="flex flex-col p-1">
                        <p>Loading</p>
                        <Button type="submit" loading={true}>
                            Submit
                        </Button>
                    </div>
                    <div className="flex flex-col p-1">
                        <p>Cancel</p>
                        <Button type="cancel">
                            Cancel
                        </Button>
                    </div>
                    <div className="flex flex-col p-1">
                        <p>Disabled</p>
                        <Button type="cancel" disabled={true}>
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <h1>TextFields</h1>
                <div className="flex flex-row">
                    <div className="flex flex-col p-1">
                        <TextField type="text" label="Text"/>
                    </div>
                    <div className="flex flex-col p-1">
                        <TextField type="email" label="Email"/>
                    </div>
                    <div className="flex flex-col p-1">
                        <TextField type="password" label="Password"/>
                    </div>
                    <div className="flex flex-col p-1">
                        <TextField type="number" label="Number"/>
                    </div>
                    <div className="flex flex-col p-1">
                        <TextField type="date" label="Date"/>
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="flex flex-col p-1">
                        <TextField type="text" label="Text" invalid/>
                    </div>
                    <div className="flex flex-col p-1">
                        <TextField type="email" label="Email" invalid/>
                    </div>
                    <div className="flex flex-col p-1">
                        <TextField type="password" label="Password" invalid/>
                    </div>
                    <div className="flex flex-col p-1">
                        <TextField type="number" label="Number" invalid/>
                    </div>
                    <div className="flex flex-col p-1">
                        <TextField type="date" label="Date" invalid/>
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="flex flex-col p-1">
                        <TextField type="text" label="Text" disabled/>
                    </div>
                    <div className="flex flex-col p-1">
                        <TextField type="email" label="Email" disabled/>
                    </div>
                    <div className="flex flex-col p-1">
                        <TextField type="password" label="Password" disabled/>
                    </div>
                    <div className="flex flex-col p-1">
                        <TextField type="number" label="Number" disabled/>
                    </div>
                    <div className="flex flex-col p-1">
                        <TextField type="date" label="Date" disabled/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StyleGuide;
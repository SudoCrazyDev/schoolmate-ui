import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { useEffect, useState } from "react";
import axios from "axios";
import { useAlert } from "../../../hooks/CustomHooks";

const UpdateInsitutionSubscription = ({institution, refresh}) => {
    const [open, setOpen] = useState(false);
    const [fetching, setFetching] = useState(false);
    const alert = useAlert();
    const [fetchedSubscriptions, setFetchedSubscriptions] = useState([]);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    
    const handleModalState = () => {
        setOpen(!open);
    };
    
    const handleFetchSubscriptions = async () => {
        setFetching(true);
        await axios.get('subscriptions')
        .then((res) => {
            setFetchedSubscriptions(res.data.data);
            setSelectedSubscription(res.data.data?.[0].id);
        })
        .catch((err) => {
            alert.setAlert("error", "Error fetching subscriptions");
        })
        .finally(() => {
            setFetching(false);
        })
    };
    
    const handleSaveInstitutionSubscription = async () => {
        setFetching(true);
        let data = {
            institution_id: institution.id,
            subscription_id: selectedSubscription
        };
        await axios.post('institution/update/subscription', data)
        .then(() => {
            alert.setAlert("success", "Subscription updated successfully");
            refresh();
            handleModalState();
        })
        .catch(() => {
            alert.setAlert("error", "Error updating subscription");
        })
        .finally(() => {
            setFetching(false);
        })
    };
    
    useEffect(() => {
        handleFetchSubscriptions();
    }, []);
    
    return(
        <>
        <Tooltip title="Update Subscription">
            <IconButton color="primary" onClick={() => handleModalState()}>
                <CardMembershipIcon fontSize="small" color="primary"/>
            </IconButton>
        </Tooltip>
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle className="h2 m-0 fw-bold">
                Update Institution Subscription
            </DialogTitle>
            <hr />
            <DialogContent>
                <div className="d-flex flex-column">
                    <label>Select a Subscription</label>
                    {fetchedSubscriptions.length > 0 && (
                         <select className="form-select" defaultValue={fetchedSubscriptions?.[0].id} onChange={(e) => setSelectedSubscription(e.target.value)}>
                            {fetchedSubscriptions.map((subscription) =>(
                                <option key={subscription.id} value={subscription.id}>
                                    {subscription.title}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </DialogContent>
            <hr />
            <DialogActions className="d-flex flex-row justify-content-start gap-2">
                <button className="btn btn-primary" onClick={() => handleSaveInstitutionSubscription()} disabled={fetching}>
                    {fetching && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
                    Save
                </button>
                <button className="btn btn-danger" onClick={() => handleModalState()}>Cancel</button>
            </DialogActions>
        </Dialog>
        </>
    );
}

export default UpdateInsitutionSubscription
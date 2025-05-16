import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { useEffect, useState } from "react";
import axios from "axios";
import { useAlert } from "../../../hooks/CustomHooks";
import { 
    Modal,
    ModalContent,
    ModalHeader,
    SelectComponent,
    ModalActions,
    Button
} from "@UIComponents";

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
        if(open){
            handleFetchSubscriptions();
        }
    }, [open]);
    
    return(
        <>
        <Tooltip title="Update Subscription">
            <IconButton color="primary" onClick={() => handleModalState()}>
                <CardMembershipIcon fontSize="small" color="primary"/>
            </IconButton>
        </Tooltip>
        <Modal open={open}>
            <ModalHeader title="Update Institution Subscription" />
            <ModalContent>
                <p className="font-normal mb-2 capitalize">Select a Subscription</p>
                <SelectComponent className="p-3 text-md uppercase" defaultValue={"default"} onChange={(e) => setSelectedSubscription(e.target.value)}>
                    <option value="default" className="text-gray-300 p-5 text-md" disabled>Select an Option</option>
                    {fetchedSubscriptions.map((subscription) =>(
                        <option key={subscription.id} value={subscription.id} className="text-black text-md uppercase">
                            {subscription.title}
                        </option>
                    ))}
                </SelectComponent>
            </ModalContent>
            <ModalActions>
                <Button type="submit" loading={fetching} disabled={fetching} onClick={() => handleSaveInstitutionSubscription()}>
                    Submit
                </Button>
                <Button type="cancel" disabled={fetching} onClick={() => handleModalState()}>
                    Cancel
                </Button>
            </ModalActions>
        </Modal>
        </>
    );
}

export default UpdateInsitutionSubscription
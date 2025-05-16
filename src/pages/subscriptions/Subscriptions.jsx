import axios from "axios";
import { useEffect, useState } from "react";
import { useAlert } from "../../hooks/CustomHooks";
import {
    ContentContainer,
    ParentContentContainer,
    PageHeading,
    PageContent,
    TableContainer,
    TableFunctions,
    Table,
    Button,
    TextField
} from "@UIComponents";

const Subscriptions = () => {
    const [fetching, setFetching] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [fetchedSubscriptions, setFetchedSubscriptions] = useState([]);
    const [subscriptionTitle, setSubscriptionTitle] = useState("");
    const [subscriptionDescription, setSubscriptionDescription] = useState("");
    const [subscriptionPrice, setSubscriptionPrice] = useState(0);
    const alert = useAlert();
    
    const handleFetchSubscriptions = async () => {
        setFetching(true);
        await axios.get('subscriptions')
        .then((res) => {
            setFetchedSubscriptions(res.data.data);
        })
        .catch((err) => {
            alert.setAlert("error", "Error fetching subscriptions");
        })
        .finally(() => {
            setFetching(false);
        })
    };
    
    const handleAddSubscription = async () => {
        if(!subscriptionTitle){
            alert.setAlert("error", "Please enter a title");
            return;
        }
        setFetching(true);
        const data = {
            title: subscriptionTitle,
            description: subscriptionDescription,
            price: subscriptionPrice
        };
        await axios.post('subscriptions', data)
        .then(() => {
            alert.setAlert("success", "Subscription created successfully");
        })
        .catch((err) => {
            alert.setAlert("error", "Error updating subscription");
        })
        .finally(() => {
            setSubscriptionTitle("");
            setSubscriptionDescription("");
            setSubscriptionPrice(0);
            setSelectedSubscription(null);
            handleFetchSubscriptions();
            setFetching(false);
        });
    };
    
    const handleButtonClick = (subscription) => {
        if(selectedSubscription){
            handleUpdateSubscription(subscription);
        }else{
            handleAddSubscription();
        }
    };
    
    const handleUpdateSubscription = async () => {
        if(!selectedSubscription){
            alert.setAlert("error", "No subscription Selected");
            return;
        }
        setFetching(true);
        const data = {
            id: selectedSubscription.id,
            title: subscriptionTitle,
            description: subscriptionDescription,
            price: subscriptionPrice
        };
        await axios.post('subscriptions/update', data)
        .then(() => {
            alert.setAlert("success", "Subscription created successfully");
        })
        .catch((err) => {
            alert.setAlert("error", "Error updating subscription");
        })
        .finally(() => {
            setSubscriptionTitle("");
            setSubscriptionDescription("");
            setSubscriptionPrice(0);
            setSelectedSubscription(null);
            handleFetchSubscriptions();
            setFetching(false);
        });
    };
    
    const handleClearSubscriptions = () => {
        setSubscriptionTitle("");
        setSubscriptionDescription("");
        setSubscriptionPrice(0);
        setSelectedSubscription(null);
        handleFetchSubscriptions();
        setFetching(false);
    };
    
    useEffect(() => {
        handleFetchSubscriptions();
    }, []);
    
    return(
        <ParentContentContainer>
            <ContentContainer className="w-[100%] gap-3">
                <PageHeading title="Subscriptions" info="add, update, delete and manage subscriptions.">
                    <div className="lg:ml-auto">
                    </div>
                </PageHeading>
                <PageContent>
                    <ContentContainer className="w-full lg:w-1/2">
                        <div className="flex flex-col w-1/2 gap-2">
                            <TextField type="text" label="Subscription Title" value={subscriptionTitle} onChange={(e) => setSubscriptionTitle(e.target.value)}/>
                            <TextField type="text" label="Description" value={subscriptionDescription} onChange={(e) => setSubscriptionDescription(e.target.value)}/>
                            <TextField type="number" label="Price" value={subscriptionPrice} onChange={(e) => setSubscriptionPrice(e.target.value)}/>
                            <div className="flex flex-row gap-3">
                                <Button type="submit" onClick={() => handleButtonClick()}>
                                    {selectedSubscription ? "Save" : "Add"} Subscription
                                </Button>
                                <Button type="cancel" onClick={() => handleClearSubscriptions()}>
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </ContentContainer>
                    <ContentContainer className="w-full lg:w-1/2">
                        <TableContainer>
                            <TableFunctions>
                                
                            </TableFunctions>
                            <Table>
                                <thead>
                                    <tr>
                                        <th width={'50%'} className="text-xl px-1 py-2 uppercase bg-zinc-50 border text-start border-gray-300">Subscription</th>
                                        <th width={'40%'} className="text-xl px-1 py-2 uppercase bg-zinc-50 border text-start border-gray-300">Price</th>
                                        <th width={'10%'} className="text-xl px-1 py-2 uppercase bg-zinc-50 border text-start border-gray-300"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fetchedSubscriptions.map((subscription) => (
                                        <tr key={subscription.id}>
                                            <td className="p-1 py-2 font-bold uppercase border-y border-gray-300">{subscription.title}</td>
                                            <td className="p-1 py-2 font-bold uppercase border-y border-gray-300">{subscription.price}</td>
                                            <td>
                                                <div className="d-flex flex-row">
                                                    <Button type="button" onClick={() => {
                                                        setSelectedSubscription(subscription);
                                                        setSubscriptionTitle(subscription.title);
                                                        setSubscriptionDescription(subscription.description);
                                                        setSubscriptionPrice(subscription.price);
                                                    }}>
                                                        Edit
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </TableContainer>
                    </ContentContainer>
                </PageContent>
            </ContentContainer>
        </ParentContentContainer>
    );
};

export default Subscriptions;
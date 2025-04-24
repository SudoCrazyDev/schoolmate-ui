import axios from "axios";
import { useEffect, useState } from "react";
import { useAlert } from "../../hooks/CustomHooks";

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
        <div className="d-flex flex-column gap-3">
            <div className="col-12">
                <div className="card">
                    <div className="card-body d-flex flex-row align-items-center">
                        <div className="d-flex flex-column">
                            <h2 className="m-0 fw-bolder">Subscriptions</h2>
                            <p className="m-0 fst-italic" style={{fontSize: '12px'}}>Create, Retrieve, Update and Delete subscriptions.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-row gap-2">
                <div className="col-4">
                    <div className="card">
                        <div className="card-body d-flex flex-column gap-2">
                            <div className="d-flex flex-column">
                                <label>Subscription Title</label>
                                <input
                                type="text"
                                className="form-control w-100 rounded"
                                placeholder="Title..."
                                value={subscriptionTitle}
                                onChange={(e) => setSubscriptionTitle(e.target.value)}
                                />
                            </div>
                            <div className="d-flex flex-column">
                                <label>Description</label>
                                <textarea
                                type="text"
                                className="form-control"
                                placeholder="Description..."
                                value={subscriptionDescription}
                                onChange={(e) => setSubscriptionDescription(e.target.value)}
                                />
                            </div>
                            <div className="d-flex flex-column">
                                <label>Price</label>
                                <input
                                type="number"
                                className="form-control"
                                value={subscriptionPrice}
                                onChange={(e) => setSubscriptionPrice(e.target.value)}
                                />
                            </div>
                            <div className="d-flex flex-row gap-2">
                                <button className="btn btn-primary" disabled={fetching} onClick={() => handleButtonClick()}>
                                    {fetching && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
                                    {selectedSubscription ? "Update" : "Add"} Subscription
                                </button>
                                    <button className="btn btn-danger" disabled={fetching} onClick={() => handleClearSubscriptions()}>
                                        Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-8">
                    <div className="card">
                        <div className="card-body d-flex flex-row align-items-center">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Subscription</th>
                                        <th>Price</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fetchedSubscriptions.map((subscription) => (
                                        <tr key={subscription.id}>
                                            <td className="fw-bold">{subscription.title}</td>
                                            <td>{subscription.price}</td>
                                            <td>
                                                <div className="d-flex flex-row">
                                                    <button className="btn btn-primary" onClick={() => {
                                                        setSelectedSubscription(subscription);
                                                        setSubscriptionTitle(subscription.title);
                                                        setSubscriptionDescription(subscription.description);
                                                        setSubscriptionPrice(subscription.price);
                                                    }}>
                                                        Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscriptions;
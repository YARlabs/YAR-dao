import { useEffect, useState } from "react";
import { useVote } from "../../hooks/useVote";
import { Event } from "ethers"; 
import { useLocation } from 'react-router-dom';
import { useIsAccepted } from "../../hooks/useIsAccepted";
import { useGetDescription } from "../../hooks/useGetDescription"; 

type IProp = {
    event: Event
}

const ValidatorBlockRewardsVoting = (props: IProp) => {
    const location = useLocation();
    const isAcceptedHook = useIsAccepted();
    const [isAccepted, setIsAccepted] = useState(false);
    const [votingDescription, setDescription] = useState("");

    const getDescriptionHook = useGetDescription();
    const voteHook = useVote();
    const vote = async (isAccepted: boolean) => {
        voteHook(props.event.args?.['contractAddress'], isAccepted);
    }

    useEffect(
        () => {
            const fetchDescription = async () => {
                const description: any = await getDescriptionHook(props.event.args?.['contractAddress']);
                if(description !== undefined) {
                    setDescription(description.data.description)
                }
            }
            fetchDescription().catch(console.error);
            if(location.pathname === "/history") {
                const fetchData = async () => {
                    const resposnseIsAccepted = await isAcceptedHook(props.event.args?.['contractAddress']) as boolean;   
                    setIsAccepted(resposnseIsAccepted);
                }
                fetchData().catch(console.error);
            }
        }
    );
    
    return (
        <div className="row"
            style={{ 
                backgroundColor: "#fff",
                padding: "10px 0",
                width: "100%",
                borderRadius: "6px",
                color: "rgba(0,0,0, 0.87)",
                background: "#fff",
                marginBottom: "10px"
            }}
        >
            <div className="col-md-11">
                Validator Block Rewards
            </div>

            <div className="col-md-1">
                {location.pathname === "/history" && 
                    (
                        isAccepted ? 
                        <div className="badge text-bg-success">Accepted</div> : 
                        <div className="badge text-bg-danger">Rejected</div>
                    )
                }
            </div>
            {votingDescription !== "" && <div className="col-md-12">
                <div className="form-floating">
                    <div className="form-control">
                        {votingDescription}
                    </div>
                    <label>Description</label>
                </div>
            </div>}

            <div className="col-md-6">
                <div className="form-floating">
                    <div className="form-control">
                        {props.event.args?.['contractAddress']}
                    </div>
                    <label>Voting Address</label>
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-floating">
                    <div className="form-control"> 
                        { parseInt(props.event.args?.['newValidatorBlockRewards']?._hex, 16) / 10**18 }
                    </div>
                    <label>New Rewards</label>
                </div>
            </div>
            
            {location.pathname !== "/history" && 
            <div className="row">
                <div className="col-md-2">
                    <div className="form-floating">
                        <button
                            className="btn btn-success w-100"
                            onClick={() => vote(true)}
                        >
                            Accept
                        </button>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-floating">
                        <button
                            className="btn btn-danger w-100"
                            onClick={() => vote(false)}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </div>}

        </div>
    )
}

export default ValidatorBlockRewardsVoting;
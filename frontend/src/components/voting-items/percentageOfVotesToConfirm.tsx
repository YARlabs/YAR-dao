import { useEffect, useState } from "react";
import { useVote } from "../../hooks/useVote";
import { Event } from "ethers"; 
import { useLocation } from 'react-router-dom';
import { useIsAccepted } from "../../hooks/useIsAccepted";

type IProp = {
    event: Event
}

const PercentageOfVotesToConfirmVoting = (props: IProp) => {
    const location = useLocation();
    const isAcceptedHook = useIsAccepted();
    const [isAccepted, setIsAccepted] = useState(false);

    const voteHook = useVote();
    const vote = async (isAccepted: boolean) => {
        voteHook(props.event.args?.['contractAddress'], isAccepted);
    }

    useEffect(
        () => {
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
            <div className="col-md-12">
                Percentage Of Votes To Confirm
                {location.pathname === "/history" && 
                    (
                        isAccepted ? 
                        <img style={{ marginLeft: "10px" }} src="/assets/img/check-circle-fill.svg" alt="check" width="16" height="16"></img> : 
                        <img style={{ marginLeft: "10px" }} src="/assets/img/x.svg" width="16" alt="x" height="16"></img>
                    )
                }
            </div>
            <div className="col-md-6">
                <div className="form-floating">
                    <div className="form-control">
                        {props.event.args?.['contractAddress']}
                    </div>
                    <label>Voting Address</label>
                </div>
            </div>
            <div className="col-md-5">
                <div className="form-floating">
                    <div className="form-control"> 
                        { parseInt(props.event.args?.['newPercentageOfVotesToConfirm']?._hex, 16) / 100 }
                    </div>
                    <label>New Percentage</label>
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

export default PercentageOfVotesToConfirmVoting;
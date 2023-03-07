import { useVote } from "../../hooks/useVote";
import { Event } from "ethers"; 
type IProp = {
    event: Event
}

const UnblockNodeVoting = (props: IProp) => {

    const voteHook = useVote();
    const vote = async (isAccepted: boolean) => {
        voteHook(props.event.args?.['contractAddress'], isAccepted);
    }
    
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
                Unblock Node
            </div>
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
                        {props.event.args?.['nodeHash']}
                    </div>
                    <label>Node Hash</label>
                </div>
            </div>
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
        </div>
    )
}

export default UnblockNodeVoting;
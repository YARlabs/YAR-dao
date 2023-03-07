import { useVote } from "../../hooks/useVote";
import { Event } from "ethers"; 
type IProp = {
    event: Event
}

const WithdrawVoting = (props: IProp) => {
    
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
                Withdraw
            </div>
            <div className="col-md-5">
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
                        {props.event.args?.['recipient']}
                    </div>
                    <label>Recipient</label>
                </div>
            </div>
            <div className="col-md-2">
                <div className="form-floating">
                    <div
                        className="form-control"
                    > 
                        { parseInt(props.event.args?.['amount']?._hex, 16) / 10**18 }
                    </div>
                    <label>Amount</label>
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

export default WithdrawVoting;
import { useState, useEffect } from "react";
import { useGetVotingInfo } from "../hooks/useGetVotingInfo";

type IPropVotingInfo = {
    address: string
}

const VotingInfo = (props: IPropVotingInfo) => {

    interface VotingInfo {
        acceptedAmount: string | undefined;
        rejectedAmount: string | undefined;
        start: string;
        end: string;
    }

    const [info, setInfo] = useState<VotingInfo>();

    const infoHook = useGetVotingInfo();

    useEffect(
        () => {
            const fetchInfo = async () => {
                const data = await infoHook(props.address);
                setInfo(data);
            }
            fetchInfo().catch(console.error);
        },
        []
    );

    return (
        <>
           <div className="col-md-3">
                <div className="form-floating">
                    <div className="form-control">
                        {info?.acceptedAmount}
                    </div>
                    <label>Accepted Amount</label>
                </div>
            </div> 
            <div className="col-md-3">
                <div className="form-floating">
                    <div className="form-control">
                        {info?.rejectedAmount}
                    </div>
                    <label>Rejected Amount</label>
                </div>
            </div> 
            <div className="col-md-3">
                <div className="form-floating">
                    <div className="form-control">
                        {info?.start}
                    </div>
                    <label>Start Voting</label>
                </div>
            </div> 
            <div className="col-md-3">
                <div className="form-floating">
                    <div className="form-control">
                        {info?.end}
                    </div>
                    <label>End Voting</label>
                </div>
            </div> 
        </>
    )
}

export default VotingInfo;
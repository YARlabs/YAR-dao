import { useState } from "react";
import { useVotingTimeout } from "../../hooks/creators/useVotingTimeout";
import { useNavigate } from "react-router-dom";

const VotingTimeout = () => {
    const navigate = useNavigate();

    const [days, setDays] = useState('');

    const createHook = useVotingTimeout();
    const createVoting = async () => {
        const tx = await createHook(days);
                
        const addressVoting = tx?.logs[0].address;
        console.log('address voting:', addressVoting);

        console.log('tx', tx);
        navigate('/');
    }

    return (
        <div className="row g-4">
            <div className="col-md-4">
                <div className="form-floating">
                    <input 
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        className="form-control"/>
                    <label>New Voting Timeout(days)</label>
                </div>
            </div>
            <div className="col-md-2">
                <div className="form-floating">
                    <button 
                        className="btn btn-secondary w-100"
                        onClick={() => createVoting()}
                    >Create Voting</button>
                </div>
            </div>
        </div>
    )
}

export default VotingTimeout;
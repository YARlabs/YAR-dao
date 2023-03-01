import { useState } from "react";
import { usePercentageOfVotesToConfirm } from "../../hooks/creators/usePercentageOfVotesToConfirm";

const PercentageOfVotesToConfirm = () => {
    const [percentage, setPercentage] = useState('');

    const createHook = usePercentageOfVotesToConfirm();
    const createVoting = async () => {
        const tx = await createHook(percentage);
        console.log('tx', tx);
    }

    return (
        <div className="row g-4">
            <div className="col-md-4">
                <div className="form-floating">
                    <input
                        type="number"
                        value={percentage} 
                        onChange={(e) => setPercentage(e.target.value)}
                        className="form-control"
                    />
                    <label>New Percentage</label>
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

export default PercentageOfVotesToConfirm;
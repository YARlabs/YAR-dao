import { useState } from "react";
import { useFee } from "../../hooks/creators/useFee";

const Fee = () => {
    const [fee, setFee] = useState('');

    const createHook = useFee();
    const createVoting = async () => {
        const tx = await createHook(fee);
        console.log('tx', tx);
    }

    return (
        <div className="row g-4">
            <div className="col-md-4">
                <div className="form-floating">
                    <input 
                        type="number"
                        value={fee} 
                        onChange={(e) => setFee(e.target.value)}
                        className="form-control"
                    />
                    <label>New Fee</label>
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

export default Fee;
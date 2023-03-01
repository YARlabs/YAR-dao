import { useState } from "react";
import { useValidatorBlockRewards } from "../../hooks/creators/useValidatorBlockRewards";

const ValidatorBlockRewards = () => {
    const [amount, setAmount] = useState('');

    const createHook = useValidatorBlockRewards();
    const createVoting = async () => {
        const tx = await createHook(amount);
        console.log('tx', tx);
    }

    return (
        <div className="row g-4">
            <div className="col-md-6">
                <div className="form-floating">
                    <input 
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="form-control"
                    />
                    <label>New validator Block Rewards</label>
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

export default ValidatorBlockRewards;
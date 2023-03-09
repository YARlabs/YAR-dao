import { useState } from "react";
import { useValidatorStakeAmount } from "../../hooks/creators/useValidatorStakeAmount";
import { useNavigate } from "react-router-dom";

const ValidatorStakeAmount = () => {
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');

    const createHook = useValidatorStakeAmount();
    const createVoting = async () => {
        const tx = await createHook(amount);
                
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
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}   
                        className="form-control"
                    />
                    <label>New Stake Amount</label>
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

export default ValidatorStakeAmount;
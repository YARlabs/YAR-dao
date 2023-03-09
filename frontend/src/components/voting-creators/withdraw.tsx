import { useState } from "react";
import { useWithdraw } from "../../hooks/creators/useWithdraw";
import { useNavigate } from "react-router-dom";

const Withdraw = () => {
    const navigate = useNavigate();

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');

    const createHook = useWithdraw();
    const createVoting = async () => {
        const tx = await createHook(recipient, amount);
                
        const addressVoting = tx?.logs[0].address;
        console.log('address voting:', addressVoting);

        console.log('tx', tx);
        navigate('/');
    }

    return (
        <div className="row g-4">
            <div className="col-md-6">
                <div className="form-floating">
                    <input 
                        type="text"
                        value={recipient} 
                        onChange={(e) => setRecipient(e.target.value)}                     
                        className="form-control"
                    />
                    <label>Address Recipient</label>
                </div>
            </div>
            <div className="col-md-4">
                <div className="form-floating">
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        className="form-control"
                    />
                    <label>Withdrawal amount</label>
                </div>
            </div>
            <div className="col-md-2">
                <div className="form-floating">
                    <button 
                        className="btn btn-secondary w-100 h-100"
                        onClick={() => createVoting()}    
                    >Create Voting</button>
                </div>
            </div>
        </div>
    )
}

export default Withdraw;
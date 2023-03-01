import { useState } from "react";
import { useWithdrawERC20 } from "../../hooks/creators/useWithdrawERC20";

const WithdrawERC20 = () => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [token, setToken] = useState('');

    const createHook = useWithdrawERC20();
    const createVoting = async () => {
        const tx = await createHook(recipient, token, amount);
        console.log('tx', tx);
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
            <div className="col-md-6">
                <div className="form-floating">
                    <input 
                        type="text"
                        value={token} 
                        onChange={(e) => setToken(e.target.value)}  
                        className="form-control"
                    />
                    <label>Address Token</label>
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
                <div className="form-floating w-100">
                    <button 
                        className="btn btn-secondary w-100"
                        onClick={() => createVoting()} 
                    >Create Voting</button>
                </div>
            </div>
        </div>
    )
}

export default WithdrawERC20;
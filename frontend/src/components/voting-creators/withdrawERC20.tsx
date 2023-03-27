import { useState } from "react";
import { useEthers } from '@usedapp/core';
import { useWithdrawERC20 } from "../../hooks/creators/useWithdrawERC20";
import { useNavigate } from "react-router-dom";
import { useSignMessage } from "../../hooks/useSignMessage";
import { useSendDescription } from "../../hooks/useSendDescription";

const WithdrawERC20 = () => {
    const { account } = useEthers();
    const navigate = useNavigate();

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [token, setToken] = useState('');
    const [description, setDescription] = useState('');

    const sendHook = useSendDescription();
    const signHook = useSignMessage();
    const createHook = useWithdrawERC20();
    const createVoting = async () => {
        const publicKey = account as string;
        const tx = await createHook(recipient, token, amount);
        const addressVoting = tx?.logs[0].address as string;
        const signature = await signHook(addressVoting + description) as string;
        const request = await sendHook(
            addressVoting,
            publicKey, 
            signature,
            description
        );
        console.log('tx', tx);
        navigate('/');
    }

    return (
        <div className="row g-4">
            <div className="col-md-12">
                <div className="form-floating">
                    <input 
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-control"
                    />
                    <label>Description</label>
                </div>
            </div>
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
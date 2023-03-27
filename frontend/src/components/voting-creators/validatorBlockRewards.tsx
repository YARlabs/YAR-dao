import { useState } from "react";
import { useEthers } from '@usedapp/core';
import { useValidatorBlockRewards } from "../../hooks/creators/useValidatorBlockRewards";
import { useNavigate } from "react-router-dom";
import { useSignMessage } from "../../hooks/useSignMessage";
import { useSendDescription } from "../../hooks/useSendDescription";

const ValidatorBlockRewards = () => {
    const { account } = useEthers();
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const sendHook = useSendDescription();
    const signHook = useSignMessage();
    const createHook = useValidatorBlockRewards();
    const createVoting = async () => {
        const publicKey = account as string;
        const tx = await createHook(amount);
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
import { useState } from "react";
import { useCertifiedConnector } from "../../hooks/creators/useCertifiedConnector";

const CertifiedConnector = () => {
    const [hash, setHash] = useState('');
    const [boolValue, setBoolValue] = useState(false);

    const boolHandler = () => {
        setBoolValue(!boolValue)
    }

    const createHook = useCertifiedConnector();
    const createVoting = async () => {
        const tx = await createHook(hash, boolValue);
        console.log('tx', tx);
    }

    return (
        <div className="row g-4">
            <div className="col-md-6">
                <div className="form-floating">
                    <input 
                        type="text"
                        value={hash}
                        onChange={(e) => setHash(e.target.value)}
                        className="form-control"
                    />
                    <label>New Text Hash</label>
                </div>
            </div>
            <div className="col-md-1">
                <input 
                    className="form-check-input" 
                    checked={boolValue}
                    onChange={boolHandler}
                    type="checkbox"
                />
                <label className="form-check-label">
                   Value
                </label>
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

export default CertifiedConnector;
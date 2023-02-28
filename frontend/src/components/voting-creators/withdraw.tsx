const Withdraw = () => {
    return (
        <div className="row g-4">
            <div className="col-md-6">
                <div className="form-floating">
                    <input type="text" className="form-control" placeholder="0x0123..."/>
                    <label>Address Recipient</label>
                </div>
            </div>
            <div className="col-md-4">
                <div className="form-floating">
                    <input type="number" className="form-control" placeholder="0"/>
                    <label>Withdrawal amount</label>
                </div>
            </div>
            <div className="col-md-2">
                <div className="form-floating h-100">
                    <button type="button" className="btn btn-secondary w-100 h-100">Create Voting</button>
                </div>
            </div>
        </div>
    )
}

export default Withdraw;

const CertifiedConnector = () => {
    return (
        <div className="row g-4">
            <div className="col-md-6">
                <div className="form-floating">
                    <input type="text" className="form-control" placeholder="0"/>
                    <label>New Text Hash</label>
                </div>
            </div>
            <div className="col-md-1">
                <input className="form-check-input w-50 h-50" type="checkbox" value="" />
                <label className="form-check-label">
                   Value
                </label>
            </div>
            <div className="col-md-2">
                <div className="form-floating h-100">
                    <button type="button" className="btn btn-secondary w-100 h-100">Create Voting</button>
                </div>
            </div>
        </div>
    )
}

export default CertifiedConnector;
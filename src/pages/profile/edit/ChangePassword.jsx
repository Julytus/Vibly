const ChangePassword = () => {
    return (
        <div className="tab-pane fade" id="chang-pwd" role="tabpanel">
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <div className="iq-header-title">
                        <h4 className="card-title">Change Password</h4>
                    </div>
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label htmlFor="cpass" className="form-label">Current Password:</label>
                            <a href="#" className="float-end">Forgot Password</a>
                            <input type="Password" className="form-control" id="cpass" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="npass" className="form-label">New Password:</label>
                            <input type="Password" className="form-control" id="npass" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="vpass" className="form-label">Verify Password:</label>
                            <input type="Password" className="form-control" id="vpass" />
                        </div>
                        <button type="submit" className="btn btn-primary me-2">Submit</button>
                        <button type="reset" className="btn btn-danger-subtle">Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword; 
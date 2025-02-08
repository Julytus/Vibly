const EditTabs = () => {
    return (
        <div className="iq-edit-list">
            <ul className="iq-edit-profile row nav nav-pills" role="tablist">
                <li className="col-md-3 p-0">
                    <a className="nav-link active" data-bs-toggle="pill" href="#personal-information" role="tab">
                        Personal Information
                    </a>
                </li>
                <li className="col-md-3 p-0">
                    <a className="nav-link" data-bs-toggle="pill" href="#chang-pwd" role="tab">
                        Change Password
                    </a>
                </li>
                <li className="col-md-3 p-0">
                    <a className="nav-link" data-bs-toggle="pill" href="#emailandsms" role="tab">
                        Email and SMS
                    </a>
                </li>
                <li className="col-md-3 p-0">
                    <a className="nav-link" data-bs-toggle="pill" href="#manage-contact" role="tab">
                        Manage Contact
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default EditTabs; 
import React from 'react';
import { useSelector } from 'react-redux';
import EditTabs from './EditTabs';
import PersonalInformation from './PersonalInformation';
import ChangePassword from './ChangePassword';
import EmailAndSMS from './EmailAndSMS';
import ManageContact from './ManageContact';

const EditProfile = () => {
    const { userProfile } = useSelector((state) => state.account);

    return (
        <div className="main-content">
            <div className="position-relative">
                <div>
                    <div className="position-relative">
                    </div>
                    <div className="content-inner" id="page_layout">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card">
                                        <div className="card-body p-0">
                                            <EditTabs />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="iq-edit-list-data">
                                        <div className="tab-content">
                                            <PersonalInformation userProfile={userProfile} />
                                            <ChangePassword />
                                            <EmailAndSMS />
                                            <ManageContact userProfile={userProfile} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile; 
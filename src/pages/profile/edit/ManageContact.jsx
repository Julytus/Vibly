import { useState } from 'react';

const ManageContact = ({ userProfile }) => {
    const [formData, setFormData] = useState({
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        url: userProfile.url || ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý submit form
    };

    return (
        <div className="tab-pane fade" id="manage-contact" role="tabpanel">
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">Manage Contact</h4>
                    </div>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">Contact Number:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="url" className="form-label">Url:</label>
                            <input 
                                type="url" 
                                className="form-control" 
                                id="url"
                                value={formData.url}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary me-2">Submit</button>
                        <button type="reset" className="btn btn-danger-subtle">Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageContact; 
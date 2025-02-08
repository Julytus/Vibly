import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile, updateAvatar } from '../../../services/api';
import { doGetAccountAction } from '../../../redux/account/accountSlice';
import { useNavigate } from 'react-router-dom';

const PersonalInformation = ({ userProfile }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: userProfile.id,
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        city: userProfile.city || '',
        gender: userProfile.gender || '',
        dob: userProfile.dateOfBirth || '',
        email: userProfile.email || '',
        username: userProfile.username || '',
        avatar: userProfile.avatar || '',
        background: userProfile.background || ''
    });
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            const profilePic = document.querySelector('.profile-pic');
            if (profilePic) {
                profilePic.src = previewUrl;
            }
        }
    };

    useEffect(() => {
        return () => {
            if (selectedFile) {
                URL.revokeObjectURL(selectedFile);
            }
        };
    }, [selectedFile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Cập nhật thông tin cơ bản
            const updatedProfile = await updateProfile(formData);

            // Nếu có chọn file ảnh mới thì upload
            if (selectedFile) {
                await updateAvatar(userProfile.id, selectedFile);
            }

            // Cập nhật redux store
            dispatch(doGetAccountAction(updatedProfile));

            // Thông báo thành công
            alert('Profile updated successfully!');

            // Reset trang
            navigate(0);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-pane fade active show" id="personal-information" role="tabpanel">
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">Personal Information</h4>
                    </div>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group row align-items-center">
                            <div className="col-md-12">
                                <div className="profile-img-edit position-relative">
                                    <img
                                        className="profile-pic avatar-600"
                                        src={userProfile.avatar}
                                        alt="profile-pic"
                                        loading="lazy"
                                        style={{
                                            objectFit: 'cover',
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    />
                                    <div className="p-image" style={{}}>
                                        <label htmlFor="file-upload" style={{ cursor: 'pointer', margin: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span className="material-symbols-outlined">edit</span>
                                        </label>
                                        <input
                                            id="file-upload"
                                            className="file-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{
                                                display: 'none',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="form-group col-sm-6">
                                <label htmlFor="first_name" className="form-label">First Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group col-sm-6">
                                <label htmlFor="last_name" className="form-label">Last Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group col-sm-6">
                                <label htmlFor="city" className="form-label">City:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group col-sm-6">
                                <label className="form-label d-block">Gender:</label>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="gender"
                                        value="MALE"
                                        checked={formData.gender === 'MALE'}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="gender">Male</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="gender"
                                        value="FEMALE"
                                        checked={formData.gender === 'FEMALE'}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="gender">Female</label>
                                </div>
                            </div>
                            <div className="form-group col-sm-6">
                                <label htmlFor="dob" className="form-label">Date Of Birth:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary me-2"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Submit'}
                        </button>
                        <button type="reset" className="btn btn-danger-subtle">Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PersonalInformation; 
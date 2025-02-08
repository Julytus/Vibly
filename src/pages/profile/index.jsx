import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileById, openConversation } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { setInitialState } from '../../redux/slices/sidebarSlice';
import Loading from '../../components/loading';
import Error404 from '../../components/error404';
import Description from './Description';
import FriendRequestButton from '../../components/FriendRequestButton';

const ProfilePage = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { userProfile } = useSelector((state) => state.account);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOpenConversation = async () => {
        try {
            const conversation = await openConversation(userProfile.id, profile.id);
            navigate(`/chat/${conversation.id}`);
        } catch (error) {
            console.error('Error opening conversation:', error);
        }
    }

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setIsLoading(true);
                const profileData = await getProfileById(id);
                setProfile(profileData);
                console.log("profile", profileData);
            } catch (error) {
                return <Error404 />;
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProfileData();
        }
    }, [id]);

    useEffect(() => {
        // Set specific sidebar state for profile page
        dispatch(setInitialState({ leftSidebarOpen: true, rightSidebarOpen: false }));
    }, [dispatch]);

    if (isLoading) {
        return <Loading />;
    }

    if (!profile) {
        return <Error404 />;
    }

    return (
        <div className="position-relative">
            <div>
                <div className="position-relative">
                    <div className="header-for-bg">
                        <div className="background-header position-relative">
                            <img
                                src={profile.background}
                                className="img-fluid w-100"
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    height: '500px',
                                    width: '100%'
                                }}
                                alt="header-bg"
                                loading="lazy"
                            />
                        </div>
                    </div>
                    {/* Page Content */}
                </div>
                <div className="content-inner" id="page_layout">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-lg-2">
                                                <div className="item1 ms-1">
                                                    <img
                                                        src={profile.avatar}
                                                        className="img-fluid rounded profile-image object-cover"
                                                        alt="profile-image"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-10">
                                                <div className="d-flex justify-content-between">
                                                    <div className="item2">
                                                        <h4 className="">{profile.first_name} {profile.last_name}</h4>
                                                        <span>{profile.followers || 0} followers</span>
                                                    </div>
                                                    {
                                                        id === userProfile.id ? "" : (
                                                            <div className="item4 ms-1">
                                                                <div className="d-flex justify-content-between align-items-center ms-1 flex-wrap gap-2 gap-md-3 cursor-pointer"
                                                                    >
                                                                    <div className="d-flex align-items-center"
                                                                        onClick={handleOpenConversation}>
                                                                        <span className="material-symbols-outlined writ-icon md-18">
                                                                        send
                                                                    </span>
                                                                    <h6 className="ms-1">Write a message</h6>
                                                                </div>
                                                                <FriendRequestButton 
                                                                    profileId={profile.id} 
                                                                    currentUserId={userProfile.id} 
                                                                />
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-5">
                                                        <div className="item5 mt-3">
                                                            <div className="d-flex align-items-center mb-1">
                                                                <span className="material-symbols-outlined md-18">
                                                                    business_center
                                                                </span>
                                                                <a href="#" className="link-primary h6 ms-2">Model at next model management</a>
                                                            </div>
                                                            <div className="d-flex align-items-center mb-1">
                                                                <span className="material-symbols-outlined md-18">
                                                                    import_contacts
                                                                </span>
                                                                <span className="ms-2">Studies public relations at <a href="#" className="link-primary h6">Cacus University</a></span>
                                                            </div>
                                                            <div className="d-flex align-items-center mb-5 mb-lg-1">
                                                                <span className="material-symbols-outlined md-18">
                                                                    bookmark_border
                                                                </span>
                                                                <span className="ms-2"><a href="#" className="link-primary h6">Born on October 9, 2000</a></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="item6 position-relative mb-5 mb-lg-0">
                                                            <div className="vr h-100 d-inline-block position-absolute start-0 d-lg-block d-none"></div>
                                                            <div className="vr h-100 d-inline-block position-absolute end-0 d-lg-block d-none"></div>
                                                            <div className="ms-2">
                                                                <h6 className="mb-2">People {profile.first_name} follows</h6>
                                                            </div>
                                                            <div className="iq-media-group ms-2">
                                                                <a href="#" className="iq-media">
                                                                    <img className="img-fluid avatar-30 rounded-circle" src="1" alt="" loading="lazy" />
                                                                </a>
                                                                <a href="#" className="iq-media">
                                                                    <img className="img-fluid avatar-30 rounded-circle" src="2" alt="" loading="lazy" />
                                                                </a>
                                                                <a href="#" className="iq-media">
                                                                    <img className="img-fluid avatar-30 rounded-circle" src="3" alt="" loading="lazy" />
                                                                </a>
                                                                <a href="#" className="iq-media">
                                                                    <img className="img-fluid avatar-30 rounded-circle" src="4" alt="" loading="lazy" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4">
                                                        <div className="item7 ms-2">
                                                            <div className="d-flex justify-content-between mb-2 flex-wrap">
                                                                <h6>{profile.first_name}'s Interests</h6>
                                                                <a href="#">See all</a>
                                                            </div>
                                                            <div className="d-flex">
                                                                <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill">Fashion</button>
                                                                <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill ms-1">CS</button>
                                                                <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill ms-1">Cats</button>
                                                                <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill ms-1">Politics</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Description 
                            otherProfile={profile}
                        />
                    </div>
                </div>
            </div>
            <div className="chat-popup-modal" id="chat-popup-modal">
                <div className="bg-primary p-3 d-flex align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <div className="image flex-shrink-0">
                            <img
                                src="test"
                                alt="img"
                                className="img-fluid avatar-45 rounded-circle object-cover"
                            />
                        </div>
                        <div className="content">
                            <h6 className="mb-0 font-size-14 text-white">Bob Frapples</h6>
                            <span className="d-inline-block lh-1 font-size-12 text-white">
                                <span className="d-inline-block rounded-circle bg-success border-5 p-1 align-baseline me-1"></span>
                                Avaliable
                            </span>
                        </div>
                    </div>
                    <div className="chat-popup-modal-close lh-1" type="button">
                        <span className="material-symbols-outlined font-size-18 text-white">
                            close
                        </span>
                    </div>
                </div>
                <div className="chat-popup-body p-3 border-bottom">
                    <ul className="list-inline p-0 mb-0 chat">
                        <li>
                            <div className="text-center">
                                <span className="time font-size-12 text-primary">Today</span>
                            </div>
                        </li>
                        <li className="mt-2">
                            <div className="text-start">
                                <div className="d-inline-block py-2 px-3 bg-gray-subtle chat-popup-message font-size-12 fw-medium">
                                    Hello, How Are you Doing Today?
                                </div>
                                <span className="mt-1 d-block time font-size-10 fst-italic">
                                    03:41 PM
                                </span>
                            </div>
                        </li>
                        <li className="mt-3">
                            <div className="text-end">
                                <div className="d-inline-block py-2 px-3 bg-primary-subtle chat-popup-message message-right font-size-12 fw-medium">
                                    Hello, I'm Doing Well.
                                </div>
                                <span className="mt-1 d-block time font-size-10 fst-italic">
                                    03:42 PM
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="chat-popup-footer p-3">
                    <div className="chat-popup-form">
                        <form>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Start Typing..."
                            />
                            <button
                                type="submit"
                                className="chat-popup-form-button btn btn-primary"
                            >
                                <span className="material-symbols-outlined font-size-18 icon-rtl">
                                    send
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
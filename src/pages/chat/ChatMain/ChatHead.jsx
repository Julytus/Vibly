
const ChatHead = ({ otherUser, otherAvatar }) => {
    if (!otherUser) return null;

    return (
        <div className="chat-head">
            <header className="d-flex justify-content-between align-items-center pt-3 ps-3 pe-3 pb-3">
                <div className="d-flex align-items-center gap-3">
                    <div className="avatar chat-user-profile m-0">
                        <img src={otherAvatar} alt="avatar" className="avatar-50 rounded-pill" loading="lazy" />
                        <div className="iq-profile-badge bg-success"></div>
                    </div>
                    <div>
                        <h5 className="mb-0">{otherUser.first_name} {otherUser.last_name}</h5>
                        <small className="text-capitalize fw-500">Online</small>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default ChatHead; 
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getBasicProfileById } from '../../services/api';
import { webSocketService } from '../../services/websocket';
import 'swiper/css';

const OnlineUser = ({ currentUserId }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const fetchOnlineUsersData = async () => {
            try {
                // Lấy danh sách ID của các user đang online và lọc bỏ currentUserId
                const activeUserIds = webSocketService.getActiveUsers()
                    .filter(id => id !== currentUserId);
                
                if (activeUserIds.length === 0) {
                    setOnlineUsers([]);
                    return;
                }

                // Fetch thông tin cho mỗi user
                const usersData = await Promise.all(
                    activeUserIds.map(async (userId) => {
                        try {
                            const userData = await getBasicProfileById(userId);
                            return {
                                id: userId,
                                name: `${userData.first_name} ${userData.last_name}`,
                                avatar: userData.avatar
                            };
                        } catch (error) {
                            console.error(`Error fetching user data for ${userId}:`, error);
                            return null;
                        }
                    })
                );

                // Lọc bỏ các null values (nếu có lỗi khi fetch)
                setOnlineUsers(usersData.filter(user => user !== null));
            } catch (error) {
                console.error('Error fetching online users:', error);
            }
        };

        // Fetch lần đầu
        fetchOnlineUsersData();

        // Cập nhật mỗi khi có thay đổi trong danh sách active users
        const intervalId = setInterval(fetchOnlineUsersData, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, [currentUserId]);

    if (onlineUsers.length === 0) {
        return null;
    }

    return (
        <div className="swiper-general messenger-swiper overflow-hidden mb-4">
            <Swiper
                slidesPerView={7.3}
                spaceBetween={12}
                breakpoints={{
                    320: {
                        slidesPerView: 4.3
                    },
                    768: {
                        slidesPerView: 5.3
                    },
                    1024: {
                        slidesPerView: 6.3
                    },
                    1200: {
                        slidesPerView: 7.3
                    }
                }}
            >
                {onlineUsers.map((user) => (
                    <SwiperSlide key={user.id} className="text-center">
                        <div className="messanger-box position-relative d-inline-block">
                            <img 
                                src={user.avatar} 
                                className="avatar-48 object-cover rounded-circle" 
                                alt={`${user.name}-avatar`}
                            />
                            <div className="iq-profile-badge bg-success"></div>
                        </div>
                        <p className="mt-2 mb-0 font-size-14 custom-ellipsis text-body">
                            {user.name}
                        </p>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default OnlineUser;

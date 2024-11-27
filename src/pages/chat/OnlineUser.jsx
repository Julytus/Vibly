import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const OnlineUser = () => {
    const onlineUsers = [
        {
            id: 1,
            name: "Paul Molive",
            avatar: "/images/chat/avatar/01.png"
        },
        {
            id: 2, 
            name: "John Travolta",
            avatar: "/images/chat/avatar/02.png"
        },
        {
            id: 3,
            name: "Barb Ackue",
            avatar: "/images/chat/avatar/03.png"
        },
        {
            id: 4,
            name: "Robert Fox",
            avatar: "/images/chat/avatar/04.png"
        },
        {
            id: 5,
            name: "Maya Didas",
            avatar: "/images/chat/avatar/05.png"
        },
        {
            id: 6,
            name: "Monty Carlo",
            avatar: "/images/chat/avatar/06.png"
        },
        {
            id: 7,
            name: "Paige Turner",
            avatar: "/images/chat/avatar/07.png"
        },
        {
            id: 8,
            name: "Arnold Schwarzenegger",
            avatar: "/images/chat/avatar/08.png"
        },
        {
            id: 9,
            name: "Leonardo DiCaprio", 
            avatar: "/images/chat/avatar/09.png"
        }
    ];

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

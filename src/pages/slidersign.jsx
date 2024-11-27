import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import img1 from '/images/login/1.jpg';
import img2 from '/images/login/2.jpg';
import img3 from '/images/login/3.jpg';

const SliderSign = () => {
  const slides = [
    {
      image: img1,
      title: 'Power UP Your Friendship',
      description: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      image: img2,
      title: 'Connect with the world',
      description: 'It is a long established fact that a reader will be distracted by the readable content.'
    },
    {
      image: img3,
      title: 'Together Is better',
      description: 'It is a long established fact that a reader will be distracted by the readable content.'
    }
  ];

  return (
    <div className="col-md-6 overflow-hidden position-relative">
      <div className="bg-primary w-100 h-100 position-absolute top-0 bottom-0 start-0 end-0"></div>
      <div className="container-inside z-1">
        <div className="main-circle circle-small"></div>
        <div className="main-circle circle-medium"></div>
        <div className="main-circle circle-large"></div>
        <div className="main-circle circle-xlarge"></div>
        <div className="main-circle circle-xxlarge"></div>
      </div>
      <div className="sign-in-detail container-inside-top" style={{ height: '100%', width: '100%' }}>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop={true}
          style={{ height: '100%', width: '100%' }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <img src={slide.image} className="signin-img img-fluid mb-5 rounded-3" alt="image" style={{ maxWidth: '80%', height: 'auto' }} />
              <h2 className="mb-3 text-white fw-semibold">{slide.title}</h2>
              <p className="font-size-16 text-white mb-0">{slide.description}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SliderSign;

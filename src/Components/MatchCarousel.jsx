import styled from 'styled-components'
import MatchCard from './MatchCard'
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Keyboard, Scrollbar, Navigation, Pagination } from 'swiper/modules';

const MatchCarousel = () => {
  return (
<>
      <Swiper
        slidesPerView={3}
        slidesPerGroupSkip={1}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        breakpoints={{
          769: {
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
        }}

        modules={[Keyboard, Scrollbar, Navigation, Pagination]}
        className="mySwiper"
      >
      
        <SwiperSlide>
              <MatchCard/>
        </SwiperSlide>
        <SwiperSlide>
              <MatchCard/>
        </SwiperSlide><SwiperSlide>
              <MatchCard/>
        </SwiperSlide><SwiperSlide>
              <MatchCard/>
        </SwiperSlide><SwiperSlide>
              <MatchCard/>
        </SwiperSlide><SwiperSlide>
              <MatchCard/>
        </SwiperSlide><SwiperSlide>
              <MatchCard/>
        </SwiperSlide><SwiperSlide>
              <MatchCard/>
        </SwiperSlide>
        
      </Swiper>
    </>
  )
}

export default MatchCarousel
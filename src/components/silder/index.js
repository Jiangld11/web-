import React, { memo, useState, useEffect } from 'react';
import { SliderContainer } from './style';
import "swiper/dist/css/swiper.css";
import Swiper from 'swiper';

export default memo(function Slider(props) {
    const [sliderSwiper, setSliderSwiper] = useState(null);
    const { bannerList } = props;
    useEffect(() => {
        if (bannerList.length && !sliderSwiper) { //初始化生成Swiper实例
            let newSliderSwiper = new Swiper(".slider-container", {
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false, //用户操作swiper之后，是否禁止autoplay。默认为true：停止。
                },
                pagination: { el: '.swiper-pagination' }
            })
            setSliderSwiper(newSliderSwiper);
        }
    }, [bannerList.length, sliderSwiper])
    return (
        <SliderContainer>
            <div className="slider-container">
                <div className="swiper-wrapper">
                    {bannerList.map(slider => {
                        return (
                            <div className="swiper-slide" key={slider.imageUrl}>
                                <div className="slider-nav">
                                    <img src={slider.imageUrl} width="100%" height="100%" alt="推荐" />
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="swiper-pagination"></div>
            </div>
            <div className="before"></div>
        </SliderContainer>
    )
})

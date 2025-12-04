"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./SocialFeedsOfMPF.css";

export default function SocialFeedsOfMPF() {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const socialPosts = [
    {
      text: "Status, you can put your Status on Whastapp",
      position: "top",
      video: "/static/social-media/social1.mp4"
    },
    {
      text: "Noida",
      position: "bottom",
      video: "/static/social-media/social2.mp4"
    },
    {
      text: "praying for our work stress to disappear",
      position: "bottom",
      video: "/static/social-media/social3.mp4"
    },
    {
      text: "love you, doesn't mean your Girlfriend won't",
      position: "top",
      video: "/static/social-media/social4.mp4"
    }
  ];

  const handleVideoClick = (index) => {
    const video = document.getElementById(`social-video-${index}`);
    if (video) {
      if (playingVideo === index) {
        video.pause();
        setPlayingVideo(null);
      } else {
        // Pause all other videos
        socialPosts.forEach((_, i) => {
          if (i !== index) {
            const otherVideo = document.getElementById(`social-video-${i}`);
            if (otherVideo) {
              otherVideo.pause();
            }
          }
        });
        video.play();
        setPlayingVideo(index);
      }
    }
  };

  return (
    <>
      <div className="social-feeds-section py-5">
        <div className="container-fluid">
          <h2 className="text-center mb-3 plus-jakarta-sans-bold fw-bold">
            Social Feeds from MPF on Instagram
          </h2>
          <div className="container">
            <div className="social-feeds-swiper-wrapper">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                navigation={true}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  576: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                  },
                  992: {
                    slidesPerView: 3,
                    spaceBetween: 5,
                  },
                  1200: {
                    slidesPerView: 4,
                    spaceBetween: 5,
                  },
                }}
                className="social-feeds-swiper"
              >
                {socialPosts.map((post, index) => (
                  <SwiperSlide key={index}>
                    <div 
                      className="instagram-post-card"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div className="post-video-wrapper" onClick={() => handleVideoClick(index)}>
                        <video
                          id={`social-video-${index}`}
                          className="post-video"
                          loop
                          muted
                          playsInline
                          onPlay={() => setPlayingVideo(index)}
                          onPause={() => {
                            if (playingVideo === index) {
                              setPlayingVideo(null);
                            }
                          }}
                        >
                          <source src={post.video} type="video/mp4" />
                          Your browser does not support the video tag.  
                        </video>
                        {/* Play Icon Overlay */}
                        {playingVideo !== index && (
                          <div className="play-icon-overlay">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 5V19L19 12L8 5Z"
                                fill="white"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                        {/* Text Overlay - Shows on hover with black background */}
                        <div className={`post-text-overlay ${post.position} ${hoveredIndex === index ? 'show-text' : ''}`}>
                          <div className="post-text-background">
                            <p className="post-text">{post.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

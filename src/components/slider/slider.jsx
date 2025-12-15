import React, { useState } from "react";
import bottleImg from "../../assets/images/изображение для оффера (1).png";
import bannerBg from "../../assets/images/баннер (5).png";
import slide2 from "../../assets/images/image2.png";
import "./Slider.css";
import { MoveRight, MoveLeft } from 'lucide-react';

export default function Slider() {
  const slides = [
    {
      id: 1,
      type: "combined",
    },
    {
      id: 2,
      image: slide2,
      hasText: true,
      title: "Special offer",
      subtitle: "PINOT NOIR: BURGUNDY VS. SOUTH AFRICA",
      bottomText: "LEARN MORE",
    },
  ];

  const [current, setCurrent] = useState(0);
  const nextSlide = () =>
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="slider">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === current ? "active" : ""}`}
        >
          {slide.type === "combined" ? (
            <div className="combined-slide">
              <img src={bottleImg} alt="Bottle" className="bottle-img" />
              <div className="banner-section">
                <img src={bannerBg} alt="Banner" className="banner-bg" />
                <div className="banner-text">
                  <h3>Special offer</h3>
                  <h2 >
                    PICHON LONGUEVILLE COMTESSE DE LALANDE
                  </h2>
                  <p className="bottom-text">ORDER WINE</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="slide-bg"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {slide.hasText && (
                <div className="content-right">
                  <h3>{slide.title}</h3>
                  <h2>{slide.subtitle}</h2>
                  <p className="bottom-text">{slide.bottomText}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <button className="arrow-btn left" onClick={prevSlide}>
        <MoveLeft />
      </button>
      <button className="arrow-btn right" onClick={nextSlide}>
        <MoveRight />
      </button>
    </div>
  );
}

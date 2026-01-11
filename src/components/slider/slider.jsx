import React, { useState, useEffect } from "react";
import "./slider.css";
import { MoveRight, MoveLeft } from 'lucide-react';
import { getAllSlides } from "../../data/slidesApi";

export default function Slider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await getAllSlides();
        console.log("Slides data from backend:", data);
        
        // Filter only active slides
        const activeSlides = Array.isArray(data) 
          ? data.filter(slide => slide.isActive && !slide.isDeleted)
          : [];
        
        console.log("Active slides:", activeSlides);
        setSlides(activeSlides);
      } catch (error) {
        console.error("Error fetching slides:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSlides();
  }, []);

  // Auto-play slides
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () =>
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  if (loading) {
    return <div className="slider">Loading...</div>;
  }

  if (slides.length === 0) {
    return <div className="slider">No slides available</div>;
  }

  return (
    <div className="slider">
      {slides.map((slide, index) => {
        const imageUrl = slide.imageUrl || slide.image_url || slide.imageURL || '';
        return (
          <div
            key={slide.id}
            className={`slide ${index === current ? "active" : ""}`}
          >
            <div
              className="slide-bg"
              style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}
            >
              <div className="content-right">
                <h3>{slide.title}</h3>
                <h2>{slide.subtitle}</h2>
                <p className="bottom-text">{slide.description}</p>
              </div>
            </div>
          </div>
        );
      })}

      <button className="arrow-btn left" onClick={prevSlide}>
        <MoveLeft />
      </button>
      <button className="arrow-btn right" onClick={nextSlide}>
        <MoveRight />
      </button>
    </div>
  );
}

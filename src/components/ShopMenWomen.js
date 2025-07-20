import React, { useState, useEffect } from 'react';
import './ShopMenWomen.css';
import womenImage from '../images/shop-women.jpg';
import menImage from '../images/shop-men.jpg'; 
import accessoriesImage from '../images/accessories.jpg'; 

function ShopMenWomen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const images = [
    { src: womenImage, label: 'Shop Women' },
    { src: menImage, label: 'Shop Men' },
    { src: accessoriesImage, label: 'Accessories' },
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, images.length]);

  // Handlers for navigation buttons
  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  return (
    <div
      className="shop-men-women-main"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="shop-men-women-slider"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <div key={index} className="shop-men-women-slide">
            <img src={image.src} alt={image.label} />
            <p>{image.label}</p>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button className="nav-button prev-button" onClick={handlePrev}>
        &#8592; 
        {/* Left Arrow */}
      </button>
      <button className="nav-button next-button" onClick={handleNext}>
        &#8594;
         {/* Right Arrow */}
      </button>
    </div>
  );
}

export default ShopMenWomen;

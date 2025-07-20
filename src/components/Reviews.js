import React, { useState, useEffect } from 'react';
import "./Reviews.css";


function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const reviews = [
    {
      text: "Great product! I'm really happy with my purchase.",
      author: "Jane Doe",
    },
    {
      text: "Excellent customer service and fast delivery!",
      author: "John Smith",
    },
    {
      text: "The quality exceeded my expectations. Highly recommend!",
      author: "Emily Johnson",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 4000); // Change review every 4 seconds
      return () => clearInterval(interval);
    }
  }, [isPaused, reviews.length]);

  // Handlers for navigation buttons
  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % reviews.length);
  };

  return (
    <div className='reviews'>
      <div
        className="reviews-carousel-main"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="reviews-carousel-slider"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {reviews.map((review, index) => (
            <div key={index} className="review-slide">
              <p className="review-text">"{review.text}"</p>
              <p className="review-author">- {review.author}</p>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button className="nav-button prev-button" onClick={handlePrev}>
          &#8592; {/* Left Arrow */}
        </button>
        <button className="nav-button next-button" onClick={handleNext}>
          &#8594; {/* Right Arrow */}
        </button>
      </div>
    </div>
  );
}

export default Reviews;

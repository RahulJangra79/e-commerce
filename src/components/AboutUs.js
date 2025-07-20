// import React from "react";
// import "./AboutUs.css";
// import image11 from "../images/about 1.jpg";
// import image22 from "../images/about 22.jpg";
// import image33 from "../images/about 33.jpg";
// import image1 from "../images/about 1.jpg";
// import image2 from "../images/about 2.jpg";
// import image3 from "../images/about 3.jpg";

// function AboutUs() {
//   return (
//     <div className="aboutus-main">
//         <div className='aboutus-our-story'>
//             <h2>Our Story</h2>
//             <p>Our story begins with a passion for creating unique and 
//                 memorable experiences for our customers.</p>
//         </div>
//         <div className='aboutus-our-story-images'>
//             <img alt='img1' src={image11}/>
//             <img alt='img1' src={image22}/>
//             <img alt='img1' src={image33}/>
//         </div>
//         <div className="aboutus-container">
//             <div className="aboutus-image-container from-left">
//             <img alt="Sustainability" src={image1} className="aboutus-image" />
//             </div>
//             <div className="aboutus-text-container">
//             <h2 className="aboutus-title">Sustainability</h2>
//             <p className="aboutus-subtitle animated-line">
//                 From our farms, to our manufacturing and packaging.
//             </p>
//             <p className="aboutus-description animated-line">
//                 Our story is a journey of creating sustainable and memorable
//                 experiences for our customers while preserving the planet.
//                 Our story is a journey of creating sustainable and memorable
//                 experiences for our customers while preserving the planet.
//             </p>
//             </div>
//         </div>

//         <div className="aboutus-container">
//             <div className="aboutus-text-container">
//             <h2 className="aboutus-title">Our Factories</h2>
//             <p className="aboutus-subtitle animated-line">
//                 We respect people as much as we respect the planet.
//             </p>
//             <p className="aboutus-description animated-line">
//                 Our story is a journey of creating sustainable and memorable
//                 experiences for our customers while preserving the planet.
//                 Our story is a journey of creating sustainable and memorable
//                 experiences for our customers while preserving the planet.
//             </p>
//             </div>
//             <div className="aboutus-image-container from-right">
//             <img alt="Our Factories" src={image2} className="aboutus-image" />
//             </div>
//         </div>

//         <div className="aboutus-container">
//             <div className="aboutus-image-container from-left">
//             <img alt="Our Fabrics" src={image3} className="aboutus-image" />
//             </div>
//             <div className="aboutus-text-container">
//             <h2 className="aboutus-title">Our Fabrics</h2>
//             <p className="aboutus-subtitle animated-line">
//                 Crafted from recycled and sustainably grown fibers.
//             </p>
//             <p className="aboutus-description animated-line">
//                 Our story is a journey of creating sustainable and memorable
//                 experiences for our customers while preserving the planet.
//                 Our story is a journey of creating sustainable and memorable
//                 experiences for our customers while preserving the planet.
//             </p>
//             </div>
//         </div>
//     </div>
//   );
// }

// export default AboutUs;










import React, { useEffect, useRef, useState } from "react";
import "./AboutUs.css";
import image11 from "../images/about 1.jpg";
import image22 from "../images/about 22.jpg";
import image33 from "../images/about 33.jpg";
import image1 from "../images/about 1.jpg";
import image2 from "../images/about 2.jpg";
import image3 from "../images/about 3.jpg";

function AboutUs() {
  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const leftRef = useRef();
  const rightRef = useRef();

  useEffect(() => {
    const observerLeft = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setLeftVisible(true);
    }, { threshold: 0.3 });

    const observerRight = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setRightVisible(true);
    }, { threshold: 0.3 });

    if (leftRef.current) observerLeft.observe(leftRef.current);
    if (rightRef.current) observerRight.observe(rightRef.current);

    return () => {
      observerLeft.disconnect();
      observerRight.disconnect();
    };
  }, []);

  return (
    <div className="aboutus-main">
      <div className="aboutus-our-story">
        <h2>Our Story</h2>
        <p>
          Our story begins with a passion for creating unique and
          memorable experiences for our customers.
        </p>
      </div>
      <div className="aboutus-our-story-images">
        <img alt="img1" src={image11} />
        <img alt="img2" src={image22} />
        <img alt="img3" src={image33} />
      </div>

      <div className="aboutus-container">
        <div
          ref={leftRef}
          className={`aboutus-image-container ${leftVisible ? "animate-left" : "hidden-left"}`}
        >
          <img alt="Sustainability" src={image1} className="aboutus-image" />
        </div>
        <div className="aboutus-text-container">
          <h2 className="aboutus-title">Sustainability</h2>
          <p className="aboutus-subtitle animated-line">From our farms, to our manufacturing and packaging.</p>
          <p className="aboutus-description animated-line">
            Our story is a journey of creating sustainable and memorable
            experiences for our customers while preserving the planet.
          </p>
        </div>
      </div>

      <div className="aboutus-container">
        <div className="aboutus-text-container">
          <h2 className="aboutus-title">Our Factories</h2>
          <p className="aboutus-subtitle animated-line">We respect people as much as we respect the planet.</p>
          <p className="aboutus-description animated-line">
            Our story is a journey of creating sustainable and memorable
            experiences for our customers while preserving the planet.
          </p>
        </div>
        <div
          ref={rightRef}
          className={`aboutus-image-container ${rightVisible ? "animate-right" : "hidden-right"}`}
        >
          <img alt="Our Factories" src={image2} className="aboutus-image" />
        </div>
      </div>

      <div className="aboutus-container">
        <div className={`aboutus-image-container ${leftVisible ? "animate-left" : "hidden-left"}`}>
          <img alt="Our Fabrics" src={image3} className="aboutus-image" />
        </div>
        <div className="aboutus-text-container">
          <h2 className="aboutus-title">Our Fabrics</h2>
          <p className="aboutus-subtitle animated-line">Crafted from recycled and sustainably grown fibers.</p>
          <p className="aboutus-description animated-line">
            Our story is a journey of creating sustainable and memorable
            experiences for our customers while preserving the planet.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;

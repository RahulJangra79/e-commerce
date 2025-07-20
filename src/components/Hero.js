import React from 'react'
import "./Hero.css"
import myImage from "../images/hero-image.png";

function Hero() {
  return (
    <div className='hero-main'>
        <div className='hero-main-image'>
            <img alt='hero-image' src={myImage}/>
        </div>
    </div>
  )
}

export default Hero
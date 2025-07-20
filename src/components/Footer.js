import React from 'react';
import './Footer.css'; // Add CSS styles in this file

const Footer = () => {
  return (
    <div className='footer-main'>
      <div className="footer">
        <div className="footer-column">
          <h4>Customer Care</h4>
          <ul>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/shipping-returns">Shipping & Returns</a></li>
            <li><a href="/store-policy">Store Policy</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://www.instagram.com">Instagram</a></li>
            <li><a href="https://www.twitter.com">Twitter</a></li>
            <li><a href="https://www.facebook.com">Facebook</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Awe & Attire</h4>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/about">Sustainability</a></li>
            <li><a href="/about">Accessibility</a></li>
            <li><a href="/about">Store Locator</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Sign up for special offers</h4>
          <form>
            <p>Enter your Email here*</p>
            <input type="email"/>
            <label>
              <input type="checkbox" /> Subscribe to our newsletter*
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      <div className="footer-copyright">
          <p>© 2025 by Awe & Attire.</p>
        </div>
    </div>
  );
};

export default Footer;

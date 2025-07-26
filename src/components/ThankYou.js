import React from "react";
import "./ThankYou.css";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="thankyou-container">
      <h1>Thank You for Your Order! 🎉</h1>
      <p>Your order has been placed successfully.</p>
      <p>We'll reach out shortly with shipping details.</p>
      <button onClick={() => navigate("/")}>Continue Shopping</button>
    </div>
  );
};

export default ThankYou;

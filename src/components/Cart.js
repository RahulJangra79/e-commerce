import React, { useState, useEffect } from "react";
import "./Cart.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const navigate = useNavigate();

  const validCoupons = {
    SAVE10: 10,
    WELCOME5: 5,
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "cart"),
          where("userId", "==", user.uid)
        );
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            docId: doc.id,
            ...doc.data(),
          }));
          setCartItems(items);
        });

        return () => unsubscribeSnapshot();
      } else {
        setCartItems([]);
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please login to view your cart.",
          showConfirmButton: true,
        }).then(() => {
          navigate("/login");
        });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleQuantityChange = async (docId, amount) => {
    const item = cartItems.find((i) => i.docId === docId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + amount);
    await updateDoc(doc(db, "cart", docId), { quantity: newQty });
  };

  const handleRemoveItem = async (docId) => {
    await deleteDoc(doc(db, "cart", docId));
  };

  const handleApplyCoupon = () => {
    if (validCoupons[coupon]) {
      setDiscount(validCoupons[coupon]);
      setCouponMessage(`Coupon applied! ${validCoupons[coupon]}% off`);
    } else {
      setDiscount(0);
      setCouponMessage("Invalid coupon code.");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        total: total,
        discount: discount,
        coupon: coupon,
        cartItems: cartItems,
      },
    });
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) * item.quantity || 0),
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  return (
    <div className="cart-container">
      <div className="cart-items">
        <h2>My Cart</h2>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.docId} className="cart-item">
              <img src={item.img} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <p className="item-name">{item.name}</p>
                <p className="item-price">${Number(item.price).toFixed(2)}</p>
                {item.size && (
                  <p className="item-size">Size: {item.size}</p>
                )}
              </div>
              <div className="cart-item-quantity">
                <button onClick={() => handleQuantityChange(item.docId, -1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.docId, 1)}>
                  +
                </button>
              </div>
              <p className="item-total">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => handleRemoveItem(item.docId)}
                className="remove-item"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))
        ) : (
          <p>Your cart is empty</p>
        )}

        <div className="coupon-section">
          <input
            type="text"
            placeholder="Enter a promo code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
          />
          <button onClick={handleApplyCoupon}>Apply</button>
          {couponMessage && <p className="coupon-message">{couponMessage}</p>}
        </div>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        <p>
          Subtotal: <span>${subtotal.toFixed(2)}</span>
        </p>
        {discount > 0 && (
          <p>
            Discount: <span>-${discountAmount.toFixed(2)}</span>
          </p>
        )}
        <p>
          Delivery: <span>FREE</span>
        </p>
        <p className="total">
          <strong>Total: ${total.toFixed(2)}</strong>
        </p>
        <button className="checkout-button" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

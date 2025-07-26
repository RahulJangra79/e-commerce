import { useState } from "react";
import "./Checkout.css";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { total, discount, coupon } = location.state || {};
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const isAddressValid = () =>
    Object.values(address).every((field) => field.trim() !== "");

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRazorpayPayment = async (amount) => {
    const finalAmount = Math.round(amount * 100);
    const res = await loadRazorpayScript();

    if (!res) {
      Swal.fire("Error", "Razorpay SDK failed to load.", "error");
      return false;
    }

    return new Promise((resolve) => {
      const paymentObject = new window.Razorpay({
        key: "rzp_test_hrZxVvTBohc9xJ",
        amount: finalAmount,
        currency: "INR",
        name: "Awe & Attire",
        description: "Order Payment",
        handler: function (response) {
          Swal.fire(
            "Payment Successful",
            `Payment ID: ${response.razorpay_payment_id}`,
            "success"
          ).then(() => resolve(true));
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        notes: {
          coupon: coupon,
          discount: `${discount}%`,
        },
        theme: {
          color: "#3399cc",
        },
      });

      paymentObject.on("payment.failed", function (response) {
        Swal.fire("Payment Failed", response.error.description, "error");
        resolve(false);
      });

      paymentObject.open();
    });
  };

  const handlePlaceOrder = async () => {
    if (!isAddressValid()) {
      alert("Please fill all address fields before placing the order.");
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        Swal.fire("Error", "User not authenticated.", "error");
        return;
      }

      try {
        const cartQuery = query(
          collection(db, "cart"),
          where("userId", "==", user.uid)
        );
        const cartSnapshot = await getDocs(cartQuery);
        const cartItems = cartSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const orderDetails = {
          userId: user.uid,
          address,
          cartItems,
          totalAmount: total,
          couponApplied: coupon,
          discountPercent: discount,
          placedAt: new Date().toISOString(),
          status: "pending",
        };

        await addDoc(collection(db, "orders"), orderDetails);

        const paymentSuccess = await handleRazorpayPayment(total);

        if (paymentSuccess) {
          for (const docSnap of cartSnapshot.docs) {
            await deleteDoc(doc(db, "cart", docSnap.id));
          }
          navigate("/thankyou");
        }
      } catch (error) {
        console.error("Checkout error:", error);
        Swal.fire("Error", "Something went wrong during checkout.", "error");
      }
    });
  };

  return (
    <div className="checkout-address-container">
      <h2>Delivery Address</h2>
      <form className="address-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={address.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={address.phone}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={address.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Street Address"
          value={address.street}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={address.state}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="zip"
          placeholder="Zip Code"
          value={address.zip}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={!isAddressValid()}
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default Checkout;

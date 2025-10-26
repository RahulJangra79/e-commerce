import React, { useEffect, useState } from "react";
import "./Orders.css";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const userOrders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(userOrders);
        });

        return () => unsubscribeSnapshot();
      } else {
        setOrders([]);
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please login to view your orders.",
        }).then(() => {
          navigate("/login");
        });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header-table">
              <table className="order-summary-table">
                <tbody>
                  <tr>
                    <td>
                      <strong>Status</strong>
                    </td>
                    <td>{order.status}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Placed At</strong>
                    </td>
                    <td>{new Date(order.placedAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Coupon</strong>
                    </td>
                    <td>{order.couponApplied || "None"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Discount</strong>
                    </td>
                    <td>{order.discountPercent || 0}%</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="order-items">
              {order.cartItems.map((item, index) => (
                <div key={index} className="order-item">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">
                      ${Number(item.price).toFixed(2)}
                    </p>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                    <p className="item-size">
                      Size:{" "}
                      {item.sizes?.filter((s) => s).join(", ") ||
                        "Not specified"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-address">
              <h4>Shipping Address</h4>
              <p>{order.address.name}</p>
              <p>{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state} -{" "}
                {order.address.zip}
              </p>
              <p>Phone: {order.address.phone}</p>
              <p>Email: {order.address.email}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Orders;

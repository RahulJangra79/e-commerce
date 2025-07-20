import React, { useState, useEffect } from 'react';
import "./BestSellers.css";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function BestSellers() {
  const [bestsellers, setBestsellers] = useState([]);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const allProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        const filtered = allProducts.filter(product =>
          product.categories.includes("Bestseller")
        );
        setBestsellers(filtered);
      } catch (error) {
        console.error("Error fetching bestseller products:", error);
      }
    };

    fetchBestsellers();
  }, []);

  return (
    <div className='bestsellers-main'>
      <div className='bestsellers-main-text'>
        OUR BEST SELLERS
        <p>Don't miss out</p>
      </div>
      <div className='bestsellers-top-products'>
        {bestsellers.map((product) => (
          <div className='bestsellers-top-product' key={product.id}>
            <img src={product.img} alt={product.name} />
            <p className='bestsellers-top-product-name'>{product.name}</p>
            <p className='bestsellers-top-product-price'>${product.price}</p>
          </div>
        ))}
      </div>

      {/* Future enhancement: 
      <button className='bestsellers-top-products-shop-now-button'>Shop BestSellers</button> 
      */}
    </div>
  );
}

export default BestSellers;

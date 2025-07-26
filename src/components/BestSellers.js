import React, { useState, useEffect } from 'react';
import './BestSellers.css';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function BestSellers() {
  const [bestsellers, setBestsellers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // 🔍 New state for zoom

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
          <div
            className='bestsellers-top-product'
            key={product.id}
            onClick={() => setSelectedImage(product.img)} // 📸 Track clicked image
          >
            <img src={product.img} alt={product.name} />
            <p className='bestsellers-top-product-name'>{product.name}</p>
            <p className='bestsellers-top-product-price'>${product.price}</p>
          </div>
        ))}
      </div>

      {/* 📸 Image Modal Overlay */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Expanded product" />
        </div>
      )}
    </div>
  );
}

export default BestSellers;

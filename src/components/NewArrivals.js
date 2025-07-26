// import { useState, useEffect } from "react";
// import "./NewArrivals.css";
// import { db } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";

// function NewArrivals() {
//   const [newArrivals, setNewArrivals] = useState([]);

//   useEffect(() => {
//     const fetchNewArrivals = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, "products"));
//         const allProducts = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         const filtered = allProducts.filter((product) =>
//           product.categories.includes("New Arrival")
//         );
//         setNewArrivals(filtered);
//       } catch (error) {
//         console.error("Error fetching new arrivals:", error);
//       }
//     };

//     fetchNewArrivals();
//   }, []);

//   return (
//     <div className="new-arrivals">
//       <div className="new-arrivals-main">
//         <div className="new-arrivals-text">NEW ARRIVALS</div>
//         <div className="new-arrivals-products">
//           {newArrivals.map((product) => (
//             <div className="new-arrivals-product" key={product.id}>
//               <img src={product.img} alt={product.name} />
//               <p className="new-arrivals-product-name">{product.name}</p>
//               <p className="new-arrivals-product-price">${product.price}</p>
//             </div>
//           ))}
//         </div>

//         <button className="new-arrivals-products-shop-now-button">
//           <a href="/allproducts">View More</a>
//         </button>
//       </div>

//       {selectedImage && (
//         <div className="image-modal" onClick={() => setSelectedImage(null)}>
//           <img src={selectedImage} alt="Expanded product" />
//         </div>
//       )}
//     </div>
//   );
// }

// export default NewArrivals;



import { useState, useEffect } from "react";
import "./NewArrivals.css";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // 🖼️ For modal

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filtered = allProducts.filter((product) =>
          product.categories.includes("New Arrival")
        );
        setNewArrivals(filtered);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <div className="new-arrivals">
      <div className="new-arrivals-main">
        <div className="new-arrivals-text">NEW ARRIVALS</div>
        <div className="new-arrivals-products">
          {newArrivals.map((product) => (
            <div
              className="new-arrivals-product"
              key={product.id}
              onClick={() => setSelectedImage(product.img)} // 👈 Add click handler
            >
              <img src={product.img} alt={product.name} />
              <p className="new-arrivals-product-name">{product.name}</p>
              <p className="new-arrivals-product-price">${product.price}</p>
            </div>
          ))}
        </div>

        <button className="new-arrivals-products-shop-now-button">
          <a href="/allproducts">View More</a>
        </button>
      </div>

      {/* 🖼️ Modal for full-size image */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Expanded product" />
        </div>
      )}
    </div>
  );
}

export default NewArrivals;

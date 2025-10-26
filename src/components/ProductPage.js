import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToBag = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add products to your cart.",
      });
      return;
    }
    if (!selectedSize) {
      Swal.fire({
        icon: "warning",
        title: "Size Required",
        text: "Please select a size before adding to cart.",
      });
      return;
    }

    try {
      const cartRef = collection(db, "cart");
      const q = query(
        cartRef,
        where("userId", "==", user.uid),
        where("productId", "==", product.id)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const existingDoc = snapshot.docs[0];
        const docRef = doc(db, "cart", existingDoc.id);
        await updateDoc(docRef, {
          quantity: existingDoc.data().quantity + 1,
        });
      } else {
        await addDoc(cartRef, {
          userId: user.uid,
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          img: product.img,
          quantity: 1,
          size: selectedSize,
        });
      }

      Swal.fire({
        icon: "success",
        title: "Product Added To Cart",
        text: `${product.name} was added to your cart.`,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      Swal.fire({
        icon: "error",
        title: "Cart Error",
        text: "Could not add product to cart.",
      });
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-image-box">
          <img src={product.img} alt={product.name} />
        </div>
        <div className="product-details-box">
          <h1>{product.name}</h1>
          <p>
            <strong>Price:</strong> ${product.price}
          </p>
          <p>
            <strong>Color:</strong> {product.color?.join(", ")}
          </p>

          <label>
            <strong>Select Size:</strong>
          </label>
          <div className="size-selection">
            <label>
              <strong>Select Size:</strong>
            </label>
            <div className="size-buttons">
              {product.sizes
                ?.filter((size) => size)
                .map((size, index) => (
                  <button
                    key={index}
                    className={`size-button ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
            </div>
          </div>

          <button
            className="buy-now-button"
            onClick={() => handleAddToBag(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import "./ShopWomen.css";
import { useNavigate } from "react-router-dom";

function ShopWomen() {
  const navigate = useNavigate();
  const [shopwomenProducts, setShopwomenProducts] = useState([]);
  const [allWomenProducts, setAllWomenProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    size: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const womenProducts = allProducts.filter((p) =>
          p.categories.includes("Women")
        );
        setShopwomenProducts(womenProducts);
        setAllWomenProducts(womenProducts);
      } catch (error) {
        console.error("Error fetching women products:", error);
      }
    };

    fetchWomenProducts();
  }, []);

  // const handleAddToBag = async (product) => {
  //   const user = auth.currentUser;
  //   if (!user) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Login Required",
  //       text: "Please login to add items to your cart.",
  //     });
  //     return;
  //   }

  //   try {
  //     const cartRef = collection(db, "cart");
  //     const q = query(
  //       cartRef,
  //       where("userId", "==", user.uid),
  //       where("productId", "==", product.id)
  //     );
  //     const snapshot = await getDocs(q);

  //     if (!snapshot.empty) {
  //       const existingDoc = snapshot.docs[0];
  //       const docRef = doc(db, "cart", existingDoc.id);
  //       await updateDoc(docRef, {
  //         quantity: existingDoc.data().quantity + 1,
  //       });
  //     } else {
  //       await addDoc(cartRef, {
  //         userId: user.uid,
  //         productId: product.id,
  //         name: product.name,
  //         price: Number(product.price),
  //         img: product.img,
  //         quantity: 1,
  //         sizes: product.sizes,
  //       });
  //     }

  //     Swal.fire({
  //       icon: "success",
  //       title: "Product Added To Cart",
  //       text: `${product.name} was added to your cart.`,
  //     });
  //   } catch (error) {
  //     console.error("Cart error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Cart Error",
  //       text: "Could not add item to cart.",
  //     });
  //   }
  // };

  const handleAddToBag = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Can't Add to Cart",
        text: "Please login first to add items to your cart.",
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
          sizes: product.sizes,
        });
      }

      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: `${product.name} was added to your cart.`,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      Swal.fire({
        icon: "error",
        title: "Cart Error",
        text: "Something went wrong while adding to cart.",
      });
    }
  };

  const handleSort = (option) => {
    let sorted = [...shopwomenProducts];
    if (option === "lowToHigh") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (option === "highToLow") {
      sorted.sort((a, b) => b.price - a.price);
    }
    setShopwomenProducts(sorted);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = [...allWomenProducts];

    if (filters.category) {
      filtered = filtered.filter((p) =>
        p.categories.includes(filters.category)
      );
    }
    if (filters.size) {
      filtered = filtered.filter((p) => p.sizes.includes(filters.size));
    }
    if (filters.color) {
      filtered = filtered.filter((p) => p.color?.includes(filters.color));
    }
    if (filters.minPrice) {
      filtered = filtered.filter(
        (p) => p.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (p) => p.price <= parseFloat(filters.maxPrice)
      );
    }

    setShopwomenProducts(filtered);
    setShowFilter(false);
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      size: "",
      color: "",
      minPrice: "",
      maxPrice: "",
    });
    setShopwomenProducts(allWomenProducts);
    setShowFilter(false);
  };

  return (
    <div className="shopwomen">
      <div className="shopwomen-heading">WOMEN'S</div>

      <div className="shopwomen-filter-sort">
        <button
          className="shopwomen-filter-left"
          onClick={() => setShowFilter(true)}
        >
          FILTER <i className="fa-solid fa-filter"></i>
        </button>

        <div className="shopwomen-sortby-right">
          SORT BY <i className="fa-solid fa-sort-down"></i>
          <div className="shopwomen-sort-options">
            <p onClick={() => handleSort("lowToHigh")}>Price: Low to High</p>
            <p onClick={() => handleSort("highToLow")}>Price: High to Low</p>
          </div>
        </div>
      </div>

      <p className="shopwomen-total-products">
        {shopwomenProducts.length} PRODUCTS
      </p>

      <div className="shopwomen-products">
        {shopwomenProducts.map((product) => (
          <div className="shopwomen-product" key={product.id}>
            <img
              src={product.img}
              alt={product.name}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: "zoom-in" }}
            />
            <div className="shopwomen-product-details">
              <p className="shopwomen-product-name">{product.name}</p>
              <div className="shopwomen-product-details-price-size-cart">
                <div className="shopwomen-product-details-price-size">
                  <p className="shopwomen-product-price">${product.price}</p>
                  <p className="shopwomen-product-sizes">
                    <strong>Size :</strong> {product.sizes.join(", ")}
                  </p>
                </div>
                <div className="product-details-cart">
                  <button
                    className="shopwomen-add-to-cart"
                    onClick={() => handleAddToBag(product)}
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showFilter && (
        <div className="filter-overlay">
          <div className="filter-container">
            <button
              className="close-filter"
              onClick={() => setShowFilter(false)}
            >
              ×
            </button>
            <h2>Product Filters</h2>
            <div className="filter-options">
              <label>
                Category:
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Footwear">Footwear</option>
                </select>
              </label>
              <label>
                Size:
                <select
                  name="size"
                  value={filters.size}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </label>
              <label>
                Color:
                <select
                  name="color"
                  value={filters.color}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="White">White</option>
                  <option value="Black">Black</option>
                  <option value="Cream">Cream</option>
                  <option value="Red">Red</option>
                  <option value="Brown">Brown</option>
                </select>
              </label>
              <label>
                Min Price:
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </label>
              <label>
                Max Price:
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </label>
            </div>
            <button className="apply-filters" onClick={applyFilters}>
              SHOW PRODUCTS
            </button>
            <button className="reset-filters" onClick={resetFilters}>
              RESET FILTERS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopWomen;

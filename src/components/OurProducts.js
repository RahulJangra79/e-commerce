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
import "./OurProducts.css";
import { useNavigate } from "react-router-dom";

function OurProducts() {
  const navigate = useNavigate();
  const [ourproductProducts, setourproductProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    size: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setourproductProducts(fetchedProducts);
        setAllProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToBag = async (product) => {
    const user = auth.currentUser;

    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to add products to your cart.",
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

  const handleSort = (option) => {
    let sortedProducts = [...ourproductProducts];
    if (option === "lowToHigh") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (option === "highToLow") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setourproductProducts(sortedProducts);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filteredProducts = [...allProducts];

    if (filters.category) {
      filteredProducts = filteredProducts.filter((product) =>
        product.categories.includes(filters.category)
      );
    }
    if (filters.size) {
      filteredProducts = filteredProducts.filter((product) =>
        product.sizes.includes(filters.size)
      );
    }
    if (filters.color) {
      filteredProducts = filteredProducts.filter((product) =>
        product.color?.includes(filters.color)
      );
    }
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= parseFloat(filters.maxPrice)
      );
    }

    setourproductProducts(filteredProducts);
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
    setourproductProducts(allProducts);
    setShowFilter(false);
  };

  return (
    <div className="ourproduct">
      <div className="ourproduct-heading">OUR PRODUCTS</div>

      <div className="ourproduct-filter-sort">
        <button
          className="ourproduct-filter-left"
          onClick={() => setShowFilter(true)}
        >
          FILTER <i className="fa-solid fa-filter"></i>
        </button>

        <div className="ourproduct-sortby-right">
          SORT BY <i className="fa-solid fa-sort-down"></i>
          <div className="ourproduct-sort-options">
            <p onClick={() => handleSort("lowToHigh")}>Price: Low to High</p>
            <p onClick={() => handleSort("highToLow")}>Price: High to Low</p>
          </div>
        </div>
      </div>

      <p className="ourproduct-total-products">
        {ourproductProducts.length} PRODUCTS
      </p>

      <div className="ourproduct-products">
        {ourproductProducts.map((product) => (
          <div className="ourproduct-product" key={product.id}>
            <img
              src={product.img}
              alt={product.name}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: "zoom-in" }}
            />
            <div className="ourproduct-product-details">
              <p className="ourproduct-product-name">{product.name}</p>
              <div className="ourproduct-product-details-price-size-cart">
                <div className="ourproduct-product-details-price-size">
                  <p className="ourproduct-product-price">${product.price}</p>
                  <p className="ourproduct-product-sizes">
                    <strong>Size:</strong> {product.sizes.join(", ")}
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
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
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
                  <option value="Blue">Blue</option>
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

export default OurProducts;

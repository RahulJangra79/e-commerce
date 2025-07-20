import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import "./AddProduct.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    categories: "",
    sizes: "",
    color: "",
    imgFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      imgFile: e.target.files[0],
    }));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "awe-n-attire");

    const res = await fetch("https://api.cloudinary.com/v1_1/dmjuvhepw/image/upload", {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.imgFile) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(product.imgFile);

      const newProduct = {
        name: product.name,
        price: parseFloat(product.price),
        categories: product.categories.split(",").map((c) => c.trim()),
        sizes: product.sizes.split(",").map((s) => s.trim()),
        color: product.color ? product.color.split(",").map((c) => c.trim()) : [],
        img: imageUrl,
      };

      await addDoc(collection(db, "products"), newProduct);

      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: `${product.name} has been saved.`,
      });

      setProduct({
        name: "",
        price: "",
        categories: "",
        sizes: "",
        color: "",
        imgFile: null,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.message,
      });
    }
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Add New Product</h2>
      <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
      <input type="text" name="categories" placeholder="Categories (comma-separated)" value={product.categories} onChange={handleChange} required />
      <input type="text" name="sizes" placeholder="Sizes (comma-separated)" value={product.sizes} onChange={handleChange} required />
      <input type="text" name="color" placeholder="Colors (optional, comma-separated)" value={product.color} onChange={handleChange} />
      <input type="file" accept="image/*" onChange={handleFileChange} required />
      <button type="submit">Upload Product</button>
    </form>
  );
};

export default AddProduct;

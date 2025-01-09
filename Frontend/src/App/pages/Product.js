import React, { useState } from "react";
import Contnet from "../components/Content";

// Sample data for 20 products
const productsData = [
  {
    id: 1,
    name: "Product 1",
    description: "Description for Product 1",
    price: 100,
    discount: 10,
    offer: "Buy 1 Get 1 Free",
    rating: 4.2,
    brand: "Brand A",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Product 2",
    description: "Description for Product 2",
    price: 200,
    discount: 15,
    offer: "Free Shipping",
    rating: 3.8,
    brand: "Brand B",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Product 3",
    description: "Description for Product 3",
    price: 150,
    discount: 20,
    offer: "15% off",
    rating: 4.5,
    brand: "Brand A",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Product 4",
    description: "Description for Product 4",
    price: 250,
    discount: 5,
    offer: "Buy 2 Get 1 Free",
    rating: 3.9,
    brand: "Brand C",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    name: "Product 5",
    description: "Description for Product 5",
    price: 300,
    discount: 30,
    offer: "20% off",
    rating: 4.0,
    brand: "Brand B",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 6,
    name: "Product 6",
    description: "Description for Product 6",
    price: 180,
    discount: 10,
    offer: "Free Shipping",
    rating: 3.7,
    brand: "Brand A",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 7,
    name: "Product 7",
    description: "Description for Product 7",
    price: 120,
    discount: 5,
    offer: "No offer",
    rating: 4.1,
    brand: "Brand C",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 8,
    name: "Product 8",
    description: "Description for Product 8",
    price: 220,
    discount: 15,
    offer: "Buy 1 Get 1 Free",
    rating: 4.3,
    brand: "Brand A",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 9,
    name: "Product 9",
    description: "Description for Product 9",
    price: 160,
    discount: 10,
    offer: "15% off",
    rating: 4.2,
    brand: "Brand B",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 10,
    name: "Product 10",
    description: "Description for Product 10",
    price: 130,
    discount: 20,
    offer: "Free Shipping",
    rating: 3.9,
    brand: "Brand C",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 11,
    name: "Product 11",
    description: "Description for Product 11",
    price: 170,
    discount: 5,
    offer: "Buy 2 Get 1 Free",
    rating: 4.1,
    brand: "Brand A",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 12,
    name: "Product 12",
    description: "Description for Product 12",
    price: 190,
    discount: 15,
    offer: "20% off",
    rating: 3.8,
    brand: "Brand B",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 13,
    name: "Product 13",
    description: "Description for Product 13",
    price: 210,
    discount: 10,
    offer: "Free Shipping",
    rating: 4.4,
    brand: "Brand A",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 14,
    name: "Product 14",
    description: "Description for Product 14",
    price: 240,
    discount: 25,
    offer: "No offer",
    rating: 4.0,
    brand: "Brand C",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 15,
    name: "Product 15",
    description: "Description for Product 15",
    price: 260,
    discount: 5,
    offer: "Buy 1 Get 1 Free",
    rating: 3.9,
    brand: "Brand A",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 16,
    name: "Product 16",
    description: "Description for Product 16",
    price: 280,
    discount: 10,
    offer: "15% off",
    rating: 4.5,
    brand: "Brand B",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 17,
    name: "Product 17",
    description: "Description for Product 17",
    price: 300,
    discount: 20,
    offer: "Free Shipping",
    rating: 4.2,
    brand: "Brand C",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 18,
    name: "Product 18",
    description: "Description for Product 18",
    price: 320,
    discount: 30,
    offer: "20% off",
    rating: 4.0,
    brand: "Brand A",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 19,
    name: "Product 19",
    description: "Description for Product 19",
    price: 350,
    discount: 15,
    offer: "Buy 2 Get 1 Free",
    rating: 4.3,
    brand: "Brand B",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 20,
    name: "Product 20",
    description: "Description for Product 20",
    price: 400,
    discount: 10,
    offer: "Free Shipping",
    rating: 4.1,
    brand: "Brand C",
    image: "https://via.placeholder.com/150",
  },
];

const ProductPage = () => {
  const [filteredBrand, setFilteredBrand] = useState("All");
  const brands = ["All", "Brand A", "Brand B", "Brand C"];

  const handleBrandFilter = (e) => {
    setFilteredBrand(e.target.value);
  };

  const filteredProducts =
    filteredBrand === "All"
      ? productsData
      : productsData.filter((product) => product.brand === filteredBrand);

  return (
    <Contnet Page_title="Product Page">
      <div>
        {/* Filter Section */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <label style={{ fontSize: "18px", marginRight: "10px" }}>
            Filter by Brand:
          </label>
          <select
            onChange={handleBrandFilter}
            value={filteredBrand}
            style={{ padding: "10px", fontSize: "16px" }}
          >
            {brands.map((brand, index) => (
              <option key={index} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Product Cards Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />
              <h3 style={{ fontSize: "20px" }}>{product.name}</h3>
              <p style={{ fontSize: "14px" }}>{product.description}</p>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                ${product.price}{" "}
                <span style={{ fontSize: "14px" }}>
                  <strike>{product.price + product.discount}</strike>
                </span>
              </p>
              <p style={{ fontSize: "14px" }}>{product.offer}</p>
              <p style={{ fontSize: "16px" }}>Rating: {product.rating} ★</p>
              <button
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </Contnet>
  );
};

export default ProductPage;

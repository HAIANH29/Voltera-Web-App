import React from "react";
// Import the FontAwesomeIcon component and specific icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faBatteryHalf,
  faChargingStation,
  faPlusCircle,
  faShoppingCart,
  faCheckCircle,
  faUserPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import "./HomePage.css";

/*
  This component represents an enhanced home page for an EV marketplace.
  It adds search functionality, product categories, featured products,
  a “How It Works” guide, and a call‑to‑action section.  It reuses
  the welcoming hero from the existing site and extends the look
  with clean cards and subtle gradients.  Feel free to adjust
  the dummy data below to suit your needs or connect it to a backend.
*/

// Placeholder hero image
const HERO_IMG =
  "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Promo-Model-Y-Performance-Desktop.png";

// Category definitions.  You can add more or adjust text as needed.
const categories = [
  {
    id: "cars",
    title: "Electric Cars",
    description: "Browse hundreds of EVs from trusted sellers.",
    icon: faCar,
  },
  {
    id: "batteries",
    title: "EV Batteries",
    description: "Find new or pre-owned battery packs.",
    icon: faBatteryHalf,
  },
  {
    id: "chargers",
    title: "Chargers & Accessories",
    description: "Discover chargers, cables, and more.",
    icon: faChargingStation,
  },
];

// Featured products.  In a real application these would come from
// your database or API.  Here they provide a sense of layout.
const featuredProducts = [
  {
    id: 1,
    name: "Tesla Model 3 Long Range",
    price: "$45,000",
    image:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=960&q=80",
    location: "Ho Chi Minh City",
  },
  {
    id: 2,
    name: "Nissan Leaf 40 kWh",
    price: "$22,500",
    image:
      "https://images.unsplash.com/photo-1580431042355-1e5f7a7cb894?auto=format&fit=crop&w=960&q=80",
    location: "Hanoi",
  },
  {
    id: 3,
    name: "EV Battery Pack 60 kWh",
    price: "$5,000",
    image:
      "https://images.unsplash.com/photo-1555375773-5e1026e21142?auto=format&fit=crop&w=960&q=80",
    location: "Da Nang",
  },
];

export default function HomePage() {
  return (
    <div className="home-wrap">
      {/* Welcome heading and hero image */}
      <div className="welcome-section">
        <h1 className="v-h1">
          Welcome to <span className="v-gradient">Voltera</span>
        </h1>
        <p className="v-sub">Fast, clean, and modern.</p>
      </div>
      <section className="home-hero">
        <img className="hero-img" src={HERO_IMG} alt="Voltera Hero" />
      </section>

      {/* Search bar */}
      <section className="search-section">
        <h2 className="section-title">Find the right car or battery</h2>
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            // Implement search logic here
          }}
        >
          <input
            type="text"
            placeholder="Enter car name, brand, or battery capacity..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <FontAwesomeIcon icon={faSearch} /> Search
          </button>
        </form>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-title">Categories</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <div className="icon-wrapper">
                <FontAwesomeIcon icon={cat.icon} size="2x" />
              </div>
              <h3 className="category-title">{cat.title}</h3>
              <p className="category-desc">{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="featured-section">
        <h2 className="section-title">Featured products</h2>
        <div className="products-grid">
          {featuredProducts.map((prod) => (
            <div key={prod.id} className="product-card">
              <img
                src={prod.image}
                alt={prod.name}
                className="product-img"
              />
              <div className="product-info">
                <h4 className="product-name">{prod.name}</h4>
                <p className="product-price">{prod.price}</p>
                <span className="product-location">{prod.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works-section">
        <h2 className="section-title">How it works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <FontAwesomeIcon icon={faUserPlus} size="2x" className="step-icon" />
            <h3 className="step-title">Register & List</h3>
            <p className="step-desc">
              Sellers create an account and post a listing with full details.
            </p>
          </div>
          <div className="step-card">
            <FontAwesomeIcon
              icon={faShoppingCart}
              size="2x"
              className="step-icon"
            />
            <h3 className="step-title">Buyers search</h3>
            <p className="step-desc">
              Buyers browse listings, filter by needs and submit purchase offers.
            </p>
          </div>
          <div className="step-card">
            <FontAwesomeIcon
              icon={faCheckCircle}
              size="2x"
              className="step-icon"
            />
            <h3 className="step-title">Complete transaction</h3>
            <p className="step-desc">
              Both parties agree, pay securely and exchange the car or battery.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="cta-section">
        <h2 className="cta-title">
          Ready to join <span className="v-gradient">Voltera</span>?
        </h2>
        <p className="cta-sub">
          Join thousands of users buying and selling EVs and batteries every day.
        </p>
        <div className="cta-buttons">
          <button className="cta-btn primary">
            <FontAwesomeIcon icon={faPlusCircle} /> Post a listing
          </button>
          <button className="cta-btn ghost">Explore products</button>
        </div>
      </section>

      <footer className="home-footer">
        © {new Date().getFullYear()} Voltera. All rights reserved.
      </footer>
    </div>
  );
}

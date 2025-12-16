import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faBatteryHalf,
  faChargingStation,
  faPlusCircle,
  faShoppingCart,
  faCheckCircle,
  faUserPlus,
  faPlay,
  faShield,
  faLightbulb,
  faUsers,
  faStar,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

import "./HomePage.css";

/*
  VOLTERA HOMEPAGE - Professional EV Marketplace
  Features: Hero Video/Animation, Trust Signals, Modern Design
  Focus: Electric Vehicle & Battery Trading Platform
*/

// Hero images - using reliable sources
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?auto=format&fit=crop&w=1920&q=80";
const HERO_FALLBACK =
  "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Promo-Model-Y-Performance-Desktop.png";

// Stats for trust building
const platformStats = [
  { number: "10,000+", label: "Active Users" },
  { number: "5,000+", label: "Vehicles Sold" },
  { number: "98%", label: "Success Rate" },
  { number: "24/7", label: "Support" },
];

// Core platform services - EV Sales & Battery Solutions Only
const services = [
  {
    id: "vehicles",
    title: "Electric Vehicles",
    description:
      "Premium electric cars from certified dealers with comprehensive quality inspection.",
    icon: faCar,
    link: "/vehicles",
    color: "#667eea",
  },
  {
    id: "batteries",
    title: "EV Battery Packs",
    description:
      "High-performance lithium-ion battery systems with extended warranty coverage.",
    icon: faBatteryHalf,
    link: "/electrics",
    color: "#3b82f6",
  },
  {
    id: "parts",
    title: "EV Components",
    description:
      "Original replacement parts and components for electric vehicle maintenance.",
    icon: faPlusCircle,
    link: "/electrics",
    color: "#10b981",
  },
];

// Trust & credibility features
const trustFeatures = [
  {
    icon: faShield,
    title: "Verified Sellers",
    description: "All sellers undergo strict verification process",
  },
  {
    icon: faCheckCircle,
    title: "Quality Guarantee",
    description: "30-day money-back guarantee on all purchases",
  },
  {
    icon: faUsers,
    title: "Expert Support",
    description: "24/7 technical and customer support team",
  },
  {
    icon: faLightbulb,
    title: "Smart Matching",
    description: "AI-powered recommendations for perfect matches",
  },
];

// Customer testimonials - English only
const testimonials = [
  {
    id: 1,
    name: "Michael Chen",
    role: "Tesla Model S Owner",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
    content:
      "Outstanding service! Found my dream Tesla Model S in perfect condition. The verification process gave me complete confidence in my purchase.",
    rating: 5,
    location: "Ho Chi Minh City",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "EV Battery Buyer",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    content:
      "Excellent platform for buying EV batteries. The technical specifications were accurate and delivery was prompt. Highly recommended!",
    rating: 5,
    location: "Hanoi",
  },
  {
    id: 3,
    name: "David Rodriguez",
    role: "VinFast Dealer",
    avatar:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=150&q=80",
    content:
      "Best marketplace for electric vehicle trading. Professional buyers, secure transactions, and excellent customer support team.",
    rating: 5,
    location: "Da Nang",
  },
];

// Popular EV brands - no emoji icons, more professional
const popularBrands = [
  { name: "Tesla", logo: "T", count: "1,200+", color: "#e82127" },
  { name: "VinFast", logo: "V", count: "850+", color: "#0066cc" },
  { name: "BYD", logo: "B", count: "640+", color: "#1e40af" },
  { name: "Hyundai", logo: "H", count: "520+", color: "#667eea" },
  { name: "BMW", logo: "BMW", count: "380+", color: "#000000" },
  { name: "Audi", logo: "A", count: "290+", color: "#ff0000" },
];
export default function HomePage() {
  return (
    <div className="voltera-home">
      {/* Hero Section with Image */}
      <section className="hero-section">
        <div className="hero-image-container">
          <img
            src={HERO_IMAGE}
            alt="Electric Vehicle Marketplace"
            className="hero-image"
            onError={(e) => {
              e.target.src = HERO_FALLBACK;
            }}
          />

          <div className="hero-overlay">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="hero-badge-text">
                  Vietnam's #1 EV Marketplace
                </span>
              </div>

              <h1 className="hero-title">
                The Future of <br />
                <span className="hero-title-gradient">Electric Mobility</span>
              </h1>

              <p className="hero-subtitle">
                Connect with trusted buyers and sellers in Vietnam's largest
                electric vehicle and battery marketplace. Safe, secure, and
                simple.
              </p>

              <div className="hero-stats">
                {platformStats.map((stat, index) => (
                  <div key={index} className="hero-stat">
                    <div className="hero-stat-number">{stat.number}</div>
                    <div className="hero-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Marketplace</h2>
            <p className="section-subtitle">
              Everything you need for electric mobility
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <Link key={service.id} to={service.link} className="service-card">
                <div className="service-icon" style={{ color: service.color }}>
                  <FontAwesomeIcon icon={service.icon} size="2x" />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="trust-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Voltera?</h2>
            <p className="section-subtitle">
              Built for trust, designed for success
            </p>
          </div>

          <div className="trust-grid">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="trust-card">
                <div className="trust-icon">
                  <FontAwesomeIcon icon={feature.icon} size="2x" />
                </div>
                <h3 className="trust-title">{feature.title}</h3>
                <p className="trust-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="brands-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Brands</h2>
            <p className="section-subtitle">
              Trusted by thousands of customers
            </p>
          </div>

          <div className="brands-grid">
            {popularBrands.map((brand, index) => (
              <div key={index} className="brand-card">
                <div className="brand-logo" style={{ color: brand.color }}>
                  {brand.logo}
                </div>
                <h3 className="brand-name">{brand.name}</h3>
                <div className="brand-count">{brand.count} listings</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">
              Real experiences from real customers
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="testimonial-stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} />
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.content}"</p>
                </div>

                <div className="testimonial-author">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="testimonial-avatar"
                  />
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <div className="testimonial-role">{testimonial.role}</div>
                    <div className="testimonial-location">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

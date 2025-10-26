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
  faSearch,
  faPlay,
  faShield,
  faLightbulb,
  faUsers,
  faStar,
  faMapMarkerAlt,
  faBook,
  faTools,
} from "@fortawesome/free-solid-svg-icons";

import "./HomePage.css";

/*
  VOLTERA HOMEPAGE - Professional EV Marketplace
  Features: Hero Video/Animation, Trust Signals, Modern Design
  Focus: Electric Vehicle & Battery Trading Platform
*/

// Hero images - using reliable sources
const HERO_IMAGE = "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?auto=format&fit=crop&w=1920&q=80";
const HERO_FALLBACK = "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Promo-Model-Y-Performance-Desktop.png";

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
    description: "Premium electric cars from certified dealers with comprehensive quality inspection.",
    icon: faCar,
    link: "/vehicles",
    color: "#667eea",
  },
  {
    id: "batteries",
    title: "EV Battery Packs",
    description: "High-performance lithium-ion battery systems with extended warranty coverage.",
    icon: faBatteryHalf,
    link: "/electrics",
    color: "#3b82f6",
  },
  {
    id: "parts",
    title: "EV Components",
    description: "Original replacement parts and components for electric vehicle maintenance.",
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

// Featured listings with better data
const featuredListings = [
  {
    id: 1,
    name: "Tesla Model 3 Performance",
    price: "1,850,000,000 ₫",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
    location: "Ho Chi Minh City",
    year: "2023",
    mileage: "15,000 km",
    battery: "75 kWh",
    isNew: false,
    rating: 4.9,
  },
  {
    id: 2,
    name: "VinFast VF8 Plus",
    price: "1,450,000,000 ₫",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80",
    location: "Hanoi",
    year: "2024",
    mileage: "5,000 km", 
    battery: "87.7 kWh",
    isNew: true,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Premium Battery Pack",
    price: "485,000,000 ₫",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    location: "Da Nang",
    capacity: "100 kWh",
    warranty: "8 years",
    condition: "New",
    rating: 5.0,
  },
  {
    id: 4,
    name: "BYD Tang EV",
    price: "1,250,000,000 ₫",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80",
    location: "Can Tho",
    year: "2024",
    mileage: "8,000 km",
    battery: "86.4 kWh",
    isNew: false,
    rating: 4.7,
  },
  {
    id: 5,
    name: "Hyundai Kona Electric",
    price: "890,000,000 ₫",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
    location: "Nha Trang",
    year: "2023",
    mileage: "22,000 km",
    battery: "64 kWh",
    isNew: false,
    rating: 4.6,
  },
  {
    id: 6,
    name: "Fast Charger Station",
    price: "125,000,000 ₫",
    image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?auto=format&fit=crop&w=800&q=80",
    location: "Vung Tau",
    power: "150 kW",
    warranty: "5 years",
    condition: "New",
    rating: 4.9,
  },
];

// Customer testimonials - English only
const testimonials = [
  {
    id: 1,
    name: "Michael Chen",
    role: "Tesla Model S Owner",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
    content: "Outstanding service! Found my dream Tesla Model S in perfect condition. The verification process gave me complete confidence in my purchase.",
    rating: 5,
    location: "Ho Chi Minh City"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "EV Battery Buyer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    content: "Excellent platform for buying EV batteries. The technical specifications were accurate and delivery was prompt. Highly recommended!",
    rating: 5,
    location: "Hanoi"
  },
  {
    id: 3,
    name: "David Rodriguez",
    role: "VinFast Dealer",
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=150&q=80",
    content: "Best marketplace for electric vehicle trading. Professional buyers, secure transactions, and excellent customer support team.",
    rating: 5,
    location: "Da Nang"
  },
];

// Latest news & blog posts - English only, EV/Battery focused
const blogPosts = [
  {
    id: 1,
    title: "Electric Vehicle Market Trends 2024",
    excerpt: "The EV market is experiencing unprecedented growth with new technologies and competitive pricing driving adoption...",
    image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?auto=format&fit=crop&w=400&q=80",
    date: "2024-10-20",
    category: "Market Analysis",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "EV Battery Buying Guide 2024",
    excerpt: "Essential factors to consider when purchasing EV batteries: capacity, lifespan, warranty coverage and cost analysis...",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
    date: "2024-10-18",
    category: "Buyer's Guide",
    readTime: "7 min"
  },
  {
    id: 3,
    title: "Battery Technology Innovations",
    excerpt: "Latest advancements in lithium-ion technology, solid-state batteries and their impact on EV performance...",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=400&q=80",
    date: "2024-10-15",
    category: "Technology",
    readTime: "6 min"
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
];export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/vehicles?search=${encodeURIComponent(searchQuery)}`;
    }
  };

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
                <span className="hero-badge-text">Vietnam's #1 EV Marketplace</span>
              </div>
              
              <h1 className="hero-title">
                The Future of <br />
                <span className="hero-title-gradient">Electric Mobility</span>
              </h1>
              
              <p className="hero-subtitle">
                Connect with trusted buyers and sellers in Vietnam's largest 
                electric vehicle and battery marketplace. Safe, secure, and simple.
              </p>

              <div className="hero-search">
                <form onSubmit={handleSearch} className="hero-search-form">
                  <div className="search-input-group">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search for Tesla, VinFast, batteries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="hero-search-input"
                    />
                    <button type="submit" className="hero-search-btn">
                      Search
                    </button>
                  </div>
                </form>
              </div>

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
            <p className="section-subtitle">Everything you need for electric mobility</p>
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
            <p className="section-subtitle">Built for trust, designed for success</p>
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
            <p className="section-subtitle">Trusted by thousands of customers</p>
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

      {/* Featured Listings */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Listings</h2>
            <p className="section-subtitle">Hand-picked premium vehicles and batteries</p>
            <Link to="/vehicles" className="view-all-link">View All →</Link>
          </div>
          
          <div className="featured-grid">
            {featuredListings.slice(0, 6).map((listing) => (
              <div key={listing.id} className="featured-card">
                <div className="featured-image">
                  <img src={listing.image} alt={listing.name} />
                  {listing.isNew && <div className="featured-badge">NEW</div>}
                  <div className="featured-rating">
                    <FontAwesomeIcon icon={faStar} />
                    <span>{listing.rating}</span>
                  </div>
                </div>
                
                <div className="featured-content">
                  <h3 className="featured-name">{listing.name}</h3>
                  <div className="featured-price">{listing.price}</div>
                  
                  <div className="featured-details">
                    {listing.year && <span>🗓️ {listing.year}</span>}
                    {listing.mileage && <span>🛣️ {listing.mileage}</span>}
                    {listing.battery && <span>🔋 {listing.battery}</span>}
                    {listing.capacity && <span>⚡ {listing.capacity}</span>}
                    {listing.power && <span>⚡ {listing.power}</span>}
                  </div>
                  
                  <div className="featured-location">
                    📍 {listing.location}
                  </div>
                </div>
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
            <p className="section-subtitle">Real experiences from real customers</p>
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
                  <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <div className="testimonial-role">{testimonial.role}</div>
                    <div className="testimonial-location">
                      <FontAwesomeIcon icon={faMapMarkerAlt} /> {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News & Blog */}
      <section className="blog-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest News & Insights</h2>
            <p className="section-subtitle">Stay updated with EV trends and tips</p>
            <Link to="/blog" className="view-all-link">Read All Articles →</Link>
          </div>
          
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-image">
                  <img src={post.image} alt={post.title} />
                  <div className="blog-category">{post.category}</div>
                </div>
                
                <div className="blog-content">
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  
                  <div className="blog-meta">
                    <span className="blog-date">{new Date(post.date).toLocaleDateString('en-US')}</span>
                    <span className="blog-read-time">
                      <FontAwesomeIcon icon={faBook} /> {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2 className="newsletter-title">Stay in the Loop</h2>
              <p className="newsletter-subtitle">
                Get the latest EV news, exclusive deals, and market insights delivered to your inbox
              </p>
            </div>
            
            <form className="newsletter-form" onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing!');
            }}>
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </div>
              <p className="newsletter-privacy">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Go Electric?</h2>
            <p className="cta-subtitle">
              Join thousands of satisfied customers who found their perfect electric vehicle on Voltera
            </p>
            
            <div className="cta-buttons">
              <Link to="/post/vehicles" className="cta-btn primary">
                <FontAwesomeIcon icon={faPlusCircle} />
                Sell Your Vehicle
              </Link>
              <Link to="/vehicles" className="cta-btn secondary">
                <FontAwesomeIcon icon={faSearch} />
                Browse Vehicles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

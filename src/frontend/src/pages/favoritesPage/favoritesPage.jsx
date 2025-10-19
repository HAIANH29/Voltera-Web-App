import React, { useState, useEffect } from "react";
import MiniPost from "../../components/miniPost/miniPost";
import "./favoritesPage.css";

// Mock data for favorite electric vehicles
const mockFavoriteVehicles = [
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
    productName: "VinFast VF8 Plus",
    basicInfo: ["Electric", "7 seats", "420km"],
    sellerName: "Tran Thi B",
    price: 1350000000,
    isNew: false,
    isFavorite: true,
    category: "vehicle",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400",
    productName: "Audi e-tron GT",
    basicInfo: ["Electric", "4 seats", "388km"],
    sellerName: "Hoang Van E",
    price: 4500000000,
    isNew: true,
    isFavorite: true,
    category: "vehicle",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=400",
    productName: "Mercedes EQS 450+",
    basicInfo: ["Electric", "5 seats", "770km"],
    sellerName: "Bui Thi H",
    price: 5500000000,
    isNew: true,
    isFavorite: true,
    category: "vehicle",
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1619976215249-4d1c3b3e3db4?w=400",
    productName: "Lucid Air Dream",
    basicInfo: ["Electric", "5 seats", "832km"],
    sellerName: "Truong Van L",
    price: 7800000000,
    isNew: true,
    isFavorite: true,
    category: "vehicle",
  },
];

// Mock data for favorite batteries
const mockFavoriteBatteries = [
  {
    id: 101,
    image: "https://images.unsplash.com/photo-1609592045856-c6ed3ac6a7a2?w=400",
    productName: "Tesla Lithium Battery 75kWh",
    basicInfo: ["75kWh", "8 years warranty", "95% new"],
    sellerName: "ABC Company",
    price: 450000000,
    isNew: false,
    isFavorite: true,
    category: "battery",
  },
  {
    id: 102,
    image: "https://images.unsplash.com/photo-1628618219968-6a65734d6bf8?w=400",
    productName: "CATL LFP Battery 60kWh",
    basicInfo: ["60kWh", "10 years warranty", "98% new"],
    sellerName: "Electric Viet Co.",
    price: 320000000,
    isNew: true,
    isFavorite: true,
    category: "battery",
  },
  {
    id: 103,
    image: "https://images.unsplash.com/photo-1586339546557-64463a5bb3ca?w=400",
    productName: "Samsung SDI Battery 85kWh",
    basicInfo: ["85kWh", "12 years warranty", "100% new"],
    sellerName: "Green Energy Ltd",
    price: 680000000,
    isNew: true,
    isFavorite: true,
    category: "battery",
  },
];

const ITEMS_PER_PAGE = 12;

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // all, vehicles, batteries

  useEffect(() => {
    // Simulate fetching data from API or localStorage
    const fetchFavorites = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Combine vehicles and batteries favorites
      const allFavorites = [...mockFavoriteVehicles, ...mockFavoriteBatteries];
      setFavorites(allFavorites);
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  // Filter by category
  const filteredFavorites = favorites.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "vehicles") return item.category === "vehicle";
    if (activeFilter === "batteries") return item.category === "battery";
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredFavorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFavorites = filteredFavorites.slice(startIndex, endIndex);

  // Calculate counts for filter tabs
  const vehiclesCount = favorites.filter(
    (item) => item.category === "vehicle"
  ).length;
  const batteriesCount = favorites.filter(
    (item) => item.category === "battery"
  ).length;

  // Reset current page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Handle remove favorite
  const handleFavoriteClick = (itemId) => {
    setFavorites(
      (prev) =>
        prev
          .map((item) =>
            item.id === itemId
              ? { ...item, isFavorite: !item.isFavorite }
              : item
          )
          .filter((item) => item.isFavorite) // Remove items that are no longer favorites
    );
  };

  // Handle card click
  const handleCardClick = (item) => {
    console.log("Clicked favorite item:", item);
    // Navigate to corresponding detail page
    if (item.category === "vehicle") {
      // navigate(`/vehicles/${item.id}`);
    } else if (item.category === "battery") {
      // navigate(`/batteries/${item.id}`);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="pagination-btn pagination-nav"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ‹
        </button>
      );
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pagination-btn"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === currentPage ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          className="pagination-btn"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="pagination-btn pagination-nav"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          ›
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-header">
          <h1>
            <span className="heart-icon">♥</span>
            Favorites
          </h1>
          <p>Your saved products list</p>
        </div>
        <div className="loading-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="loading-card">
              <div className="loading-image"></div>
              <div className="loading-content">
                <div className="loading-line long"></div>
                <div className="loading-line medium"></div>
                <div className="loading-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="favorites-header">
          <h1>
            <span className="heart-icon">♥</span>
            Favorites
          </h1>
          <p>Your saved products list</p>
        </div>

        <div className="empty-favorites">
          <div className="empty-icon">♡</div>
          <h2>No favorite products yet</h2>
          <p>
            You haven't saved any products to your favorites yet. Explore and
            add products you're interested in!
          </p>
          <a href="/vehicles" className="browse-btn">
            <span>🚗</span>
            Explore Electric Vehicles
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      {/* Header */}
      <div className="favorites-header">
        <h1>
          <span className="heart-icon">♥</span>
          Favorite
        </h1>
        <p>
          {favorites.length} product {favorites.length > 1 ? "s" : ""} saved in
          your favorites
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All ({favorites.length})
        </button>
        <button
          className={`filter-tab ${
            activeFilter === "vehicles" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("vehicles")}
        >
          Vehicle ({vehiclesCount})
        </button>
        <button
          className={`filter-tab ${
            activeFilter === "batteries" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("batteries")}
        >
          Battery ({batteriesCount})
        </button>
      </div>

      {/* Favorites Grid */}
      {filteredFavorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">♡</div>
          <h2>No products found</h2>
          <p>There are no products in this category.</p>
        </div>
      ) : (
        <>
          <div className="favorites-grid">
            {currentFavorites.map((item) => (
              <MiniPost
                key={`${item.category}-${item.id}`}
                image={item.image}
                productName={item.productName}
                basicInfo={item.basicInfo}
                sellerName={item.sellerName}
                price={item.price}
                isNew={item.isNew}
                isFavorite={item.isFavorite}
                onFavoriteClick={() => handleFavoriteClick(item.id)}
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination">{renderPagination()}</div>
              <div className="pagination-info">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredFavorites.length)} of{" "}
                {filteredFavorites.length} favorite products
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

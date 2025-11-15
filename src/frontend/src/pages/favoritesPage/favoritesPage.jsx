import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MiniPost from "../../components/miniPost/miniPost";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import api from "../../config/api";
import { favoriteService } from "../../services/favoriteService";
import "./favoritesPage.css";

const ITEMS_PER_PAGE = 12;

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // all, vehicles, batteries

  useEffect(() => {
    // Fetch real favorites from API
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        if (!favoriteService.isUserLoggedIn()) {
          console.log("❌ No access token found - user not logged in");
          setFavorites([]);
          setLoading(false);
          return;
        }

        const response = await favoriteService.getFavorites();

        if (response.data && Array.isArray(response.data)) {
          // Map backend FavListResponse to frontend format
          const mappedFavorites = response.data.map((fav) => ({
            id: fav.postId,
            postID: String(fav.postId),
            image:
              fav.thumbnailUrl ||
              "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
            productName: fav.postTitle || "Product",
            basicInfo: ["Click to view details"],
            sellerName: "Seller",
            price: Number(fav.price) || 0,
            isNew: true,
            isFavorite: true,
            category: "vehicle", // Default, will be determined by post details
          }));

          console.log("✅ Loaded favorites from API:", mappedFavorites.length);
          setFavorites(mappedFavorites);
        } else {
          console.log("✅ No favorites found");
          setFavorites([]);
        }
      } catch (error) {
        console.error("❌ Error fetching favorites:", error);
        setFavorites([]);
      }
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
  const handleFavoriteClick = async (itemId) => {
    try {
      if (favoriteService.isUserLoggedIn()) {
        // Call API to remove from favorites
        await favoriteService.removeFromFavorites(itemId);
      }

      // Update local state
      setFavorites((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing from favorites:", error);
      // Still update local state even if API call fails
      setFavorites((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  // Handle card click - navigate to detail page
  const handleCardClick = (item) => {
    console.log("Navigating to product detail:", item.postID);

    // Determine the route based on category or try to detect from product name
    if (
      item.category === "vehicle" ||
      item.productName.toLowerCase().includes("car") ||
      item.productName.toLowerCase().includes("vehicle") ||
      item.productName.toLowerCase().includes("tesla") ||
      item.productName.toLowerCase().includes("vinfast") ||
      item.productName.toLowerCase().includes("audi") ||
      item.productName.toLowerCase().includes("mercedes") ||
      item.productName.toLowerCase().includes("lucid")
    ) {
      navigate(`/vehicles/${item.postID}`);
    } else if (
      item.category === "battery" ||
      item.productName.toLowerCase().includes("battery") ||
      item.productName.toLowerCase().includes("lithium") ||
      item.productName.toLowerCase().includes("catl") ||
      item.productName.toLowerCase().includes("samsung")
    ) {
      navigate(`/electrics/${item.postID}`);
    } else {
      // Default to vehicles for unknown type
      navigate(`/vehicles/${item.postID}`);
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
        <LoadingSpinner message="Loading favorites..." />
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
          <div className="browse-buttons">
            <a href="/vehicles" className="browse-btn">
              <span>🚗</span>
              Explore Electric Vehicles
            </a>
            <a href="/electrics" className="browse-btn">
              <span>🔋</span>
              Explore Batteries
            </a>
          </div>
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

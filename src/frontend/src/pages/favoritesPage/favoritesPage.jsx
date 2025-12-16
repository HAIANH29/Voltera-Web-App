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

  useEffect(() => {
    // Fetch real favorites from API
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        if (!favoriteService.isUserLoggedIn()) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        const response = await favoriteService.getFavorites();

        if (response.data && Array.isArray(response.data)) {
          // Map backend FavListResponse to frontend format
          const mappedFavorites = await Promise.all(
            response.data.map(async (fav) => {
              let imageUrl = fav.thumbnailUrl;

              // Try to get the actual post image from post detail API
              try {
                const postDetailResponse = await api.get(
                  `/api/post/detail/${fav.postId}`
                );
                if (postDetailResponse.data) {
                  const postData = postDetailResponse.data;

                  // Priority order for image selection:
                  // 1. Use imageUrls[0] if available (most accurate for all posts)
                  if (postData.imageUrls && postData.imageUrls.length > 0) {
                    imageUrl = postData.imageUrls[0];
                  }
                  // 2. Use API thumbnail if available
                  else if (postData.thumbnail) {
                    imageUrl = postData.thumbnail;
                  }
                  // 3. For electric posts
                  else if (postData.electric && postData.electric.image) {
                    imageUrl = postData.electric.image;
                  }
                  // 4. For battery posts
                  else if (postData.battery && postData.battery.image) {
                    imageUrl = postData.battery.image;
                  }
                  // 5. For vehicle posts
                  else if (postData.vehicle && postData.vehicle.image) {
                    imageUrl = postData.vehicle.image;
                  }
                  // 6. Fallback to favorites thumbnail
                  else if (fav.thumbnailUrl) {
                    imageUrl = fav.thumbnailUrl;
                  }
                }
              } catch (error) {
                // Could not fetch detailed image, use thumbnail
              }

              return {
                id: fav.postId,
                postID: String(fav.postId),
                image:
                  imageUrl ||
                  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
                productName: fav.postTitle || "Product",
                basicInfo: ["Click to view details"],
                sellerName: "Seller",
                price: Number(fav.price) || 0,
                isNew: true,
                isFavorite: true,
              };
            })
          );

          setFavorites(mappedFavorites);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        setFavorites([]);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  // Calculate pagination for all favorites
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFavorites = favorites.slice(startIndex, endIndex);

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
      // Still update local state even if API call fails
      setFavorites((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  // Handle card click - navigate to detail page
  const handleCardClick = async (item) => {
    // Try to determine the correct route by checking post details
    try {
      const postDetailResponse = await api.get(
        `/api/post/detail/${item.postID}`
      );
      const postData = postDetailResponse.data;

      // Check if post has vehicle data or electric data
      if (postData.vehicle) {
        navigate(`/vehicles/${item.postID}`);
      } else if (postData.electric || postData.battery) {
        navigate(`/electrics/${item.postID}`);
      } else {
        // Fallback: try to detect from product name
        const name = item.productName.toLowerCase();
        if (
          name.includes("battery") ||
          name.includes("lithium") ||
          name.includes("electric")
        ) {
          navigate(`/electrics/${item.postID}`);
        } else {
          navigate(`/vehicles/${item.postID}`);
        }
      }
    } catch (error) {
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

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
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
                key={item.id}
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
                Showing {startIndex + 1}-{Math.min(endIndex, favorites.length)}{" "}
                of {favorites.length} favorite products
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MiniPost from "../../components/miniPost/miniPost";
import Pagination from "../../components/pagination/pagination";
import "../../components/pagination/pagination.css";
import api from "../../config/api";
import { favoriteService } from "../../services/favoriteService";
import "./electricsPage.css";

/** Số thẻ mỗi trang */
const ITEMS_PER_PAGE = 12;

/**
 * Map 1 PostResponse từ BE -> cấu trúc card MiniPost cho battery
 * - PostResponse chứa: postId, title, description, price, battery, imageUrls, location, thumbnail
 */
const mapPostToCard = (p) => {
  const b = p?.battery || {}; // BatteryDTO từ BE

  // Ưu tiên thumbnail, sau đó imageUrls
  const firstImg =
    p?.thumbnail ||
    (Array.isArray(p?.imageUrls) && p.imageUrls.length > 0
      ? p.imageUrls[0]
      : "");

  // Handle price conversion more carefully
  let processedPrice = 0;
  if (p.price !== null && p.price !== undefined) {
    if (typeof p.price === "string") {
      processedPrice = parseFloat(p.price.replace(/[^\d.]/g, "")) || 0;
    } else {
      processedPrice = Number(p.price) || 0;
    }
  }

  return {
    // id bài đăng
    postID: String(p?.postId ?? ""),

    // thông tin hiển thị của battery
    image: firstImg || "https://via.placeholder.com/400x300/667eea/ffffff?text=Battery+Pack",
    productName: p.title || `${b?.batteryTypeId?.typename || "Battery"} Pack`,
    basicInfo: [
      b?.batteryTypeId?.typename || "Li-ion",
      b?.originCapacity ? `${b.originCapacity}kWh` : "N/A",
      b?.voltage ? `${b.voltage}V` : "N/A",
      b?.cycleCount ? `${b.cycleCount} cycles` : "N/A",
    ],
    sellerName: p?.location || "Battery Seller",
    price: processedPrice,
    isNew: (b?.cycleCount || 0) < 100, // Consider low cycle count as "new"

    // Additional battery info for detail view
    batteryDetails: {
      serialNumber: b?.serialNumber,
      originCapacity: b?.originCapacity,
      remainingCapacity: b?.remainingCapacity,
      mileageCovered: b?.mileageCovered,
      voltage: b?.voltage,
      cycleCount: b?.cycleCount,
      warranty: b?.warranty,
      weight: b?.weight,
      lifeCycle: b?.lifeCycle,
      batteryType: b?.batteryTypeId?.typename,
      technical: b?.batteryTypeId?.technical,
      description: b?.batteryTypeId?.description,
    },

    // FE state
    isFavorite: false,
  };
};

const ElectricsPage = () => {
  // ===================== STATE CHÍNH =====================
  const navigate = useNavigate();
  const [batteries, setBatteries] = useState([]); // danh sách pin đã map
  const [loading, setLoading] = useState(true); // trạng thái loading
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // ===================== FETCH API TỪ BE =====================
  useEffect(() => {
    const fetchBatteries = async () => {
      try {
        setLoading(true);
        console.log("🔋 Fetching batteries from API...");

        // Sử dụng endpoint chuyên cho batteries đã được approved
        const response = await api.get("/api/post/public/batteries");

        console.log("✅ Battery API Response:", response.data);

        // BE trả list PostResponse chỉ chứa batteries
        const items = Array.isArray(response.data) ? response.data : [];

        console.log("[ElectricsPage] Loaded", items.length, "battery posts");

        const mapped = items.map(mapPostToCard);

        // Load user favorites to sync favorite status
        if (favoriteService.isUserLoggedIn()) {
          try {
            const favResponse = await favoriteService.getFavorites();
            const favoritePostIds = new Set(
              favResponse.data?.map((fav) => String(fav.postId)) || []
            );

            // Update mapped batteries with favorite status
            const mappedWithFavorites = mapped.map((battery) => ({
              ...battery,
              isFavorite: favoritePostIds.has(battery.postID),
            }));

            setBatteries(mappedWithFavorites);
          } catch (favError) {
            console.error("Error loading favorites:", favError);
            // Still set batteries even if favorites loading failed
            setBatteries(mapped);
          }
        } else {
          setBatteries(mapped);
        }

        console.log("✅ Batteries loaded:", mapped.length);
      } catch (error) {
        console.error("❌ Error fetching batteries:", error);
        console.log("STATUS =", error?.response?.status);
        console.log("DATA   =", error?.response?.data);
        
        // Only show test data in development
        if (process.env.NODE_ENV === "development") {
          const testData = [
            {
              postID: "test-1",
              image:
                "https://via.placeholder.com/400x300/667eea/ffffff?text=Tesla+Battery",
              productName: "Tesla Model S Battery Pack",
              basicInfo: ["Lithium-ion", "100kWh", "400V", "172 cycles"],
              sellerName: "Tesla Parts Dealer",
              price: 15000,
              isNew: true,
              isFavorite: false,
            },
            {
              postID: "test-2",
              image:
                "https://via.placeholder.com/400x300/10b981/ffffff?text=BMW+Battery",
              productName: "BMW i3 Battery Pack",
              basicInfo: ["Li-ion", "42kWh", "350V"],
              sellerName: "BMW Certified",
              price: 8500,
              isNew: false,
              isFavorite: false,
            },
            {
              postID: "test-3",
              image:
                "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Nissan+Battery",
              productName: "Nissan Leaf Battery",
              basicInfo: ["Li-ion", "62kWh", "350V"],
              sellerName: "Green Auto Parts",
              price: 12000,
              isNew: true,
              isFavorite: false,
            },
          ];
          setBatteries(testData);
        } else {
          setBatteries([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBatteries();
  }, []);

  // Optimized filtering with useMemo for performance
  const filteredBatteries = useMemo(() => {
    if (!searchTerm.trim()) return batteries;

    const searchLower = searchTerm.toLowerCase();
    return batteries.filter(
      (battery) =>
        battery.productName?.toLowerCase().includes(searchLower) ||
        battery.basicInfo?.some((info) =>
          info?.toLowerCase().includes(searchLower)
        ) ||
        battery.sellerName?.toLowerCase().includes(searchLower)
    );
  }, [batteries, searchTerm]);

  // ===================== PHÂN TRANG =====================
  const totalPages = Math.ceil(filteredBatteries.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBatteries = filteredBatteries.slice(startIndex, endIndex);

  // ===================== HANDLERS UI =====================
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Smooth scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBatteryClick = useCallback(
    (battery) => {
      navigate(`/electrics/${battery.postID}`);
    },
    [navigate]
  );

  const handleFavoriteClick = useCallback(
    async (postID) => {
      // Check if user is logged in
      if (!favoriteService.isUserLoggedIn()) {
        alert("Please log in to add favorites!");
        return;
      }

      // Find the current battery to check its favorite status
      const battery = batteries.find((b) => b.postID === postID);
      if (!battery) return;

      try {
        // Update UI immediately for better UX
        setBatteries((prev) =>
          prev.map((b) =>
            b.postID === postID ? { ...b, isFavorite: !b.isFavorite } : b
          )
        );

        // Call API based on current state
        if (battery.isFavorite) {
          // Currently favorited, so remove it
          await favoriteService.removeFromFavorites(postID);
        } else {
          // Not favorited, so add it
          await favoriteService.addToFavorites(postID);
        }
      } catch (error) {
        // Revert UI change if API call failed
        setBatteries((prev) =>
          prev.map((b) =>
            b.postID === postID ? { ...b, isFavorite: !b.isFavorite } : b
          )
        );

        console.error("Error toggling favorite:", error);
        alert("Failed to update favorites. Please try again.");
      }
    },
    [batteries]
  );

  // ===================== FORMAT HIỂN THỊ =====================
  const formatPrice = (price) => {
    if (!price || price === null || price === undefined)
      return "Contact for Price";

    let numPrice;
    if (typeof price === "string") {
      // Remove any non-numeric characters except decimal point
      const cleanPrice = price.replace(/[^\d.]/g, "");
      numPrice = parseFloat(cleanPrice);
    } else {
      numPrice = Number(price);
    }

    if (isNaN(numPrice) || numPrice === 0) return "Contact for Price";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  // ===================== RENDER =====================
  if (loading) {
    return (
      <div className="electrics-page modern-enhanced">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading batteries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="electrics-page modern-enhanced">
      {/* Compact Header */}
      <div className="compact-header">
        <h1>Electric Batteries</h1>
        <p>Quality batteries for electric vehicles</p>
      </div>

      {/* Results Header */}
      <div className="results-header">
        <div className="results-header">
          <div className="results-info">
            <h2>Electric Battery Collection</h2>
            <p className="results-count">
              {filteredBatteries.length} batter
              {filteredBatteries.length !== 1 ? "ies" : "y"} available
              {filteredBatteries.length !== batteries.length && (
                <span className="filter-indicator">
                  {" "}
                  (filtered from {batteries.length})
                </span>
              )}
              {searchTerm && (
                <span className="search-term"> for "{searchTerm}"</span>
              )}
            </p>
          </div>

          <div className="view-controls">
            <button className="view-btn active">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="layout enhanced-layout">
        {/* Sidebar Filters */}
        <aside className="filters modern-filters">
          <div className="filters-header">
            <h3>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
              </svg>
              Battery Filters
            </h3>
            <button
              className="clear-filters"
              onClick={() => setSearchTerm("")}
            >
              Clear All
            </button>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              </svg>
              Battery Type
            </label>
            <select className="filter-select">
              <option value="">All Types</option>
              <option value="Lithium-ion">Lithium-ion</option>
              <option value="LiFePO4">LiFePO4</option>
              <option value="NiMH">NiMH</option>
            </select>
          </div>

          <button className="apply-filters-btn">Apply Filters</button>
        </aside>

        {/* Main Content Grid */}
        <main className="grid-container">
          <div className="grid">
            {currentBatteries.map((battery) => (
              <MiniPost
                key={battery.postID}
                image={battery.image}
                productName={battery.productName}
                basicInfo={battery.basicInfo}
                sellerName={battery.sellerName}
                price={formatPrice(battery.price)}
                isNew={battery.isNew}
                isFavorite={battery.isFavorite}
                onFavoriteClick={() => handleFavoriteClick(battery.postID)}
                onClick={() => handleBatteryClick(battery)}
              />
            ))}

            {currentBatteries.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <h3>No batteries found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              <div className="pagination-info">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredBatteries.length)}{" "}
                of {filteredBatteries.length} batteries
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ElectricsPage;

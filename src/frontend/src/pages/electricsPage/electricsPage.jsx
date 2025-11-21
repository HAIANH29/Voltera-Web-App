import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MiniPost from "../../components/miniPost/miniPost";
import Pagination from "../../components/pagination/pagination";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import "../../components/pagination/pagination.css";
import api from "../../config/api";
import { favoriteService } from "../../services/favoriteService";
import "./ModernElectricsPage.css";

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

  // Check if price exists and is valid
  if (p.price !== null && p.price !== undefined && p.price !== "") {
    if (typeof p.price === "string") {
      const cleanedPrice = p.price.replace(/[^\d.]/g, "");
      processedPrice = parseFloat(cleanedPrice);
      if (isNaN(processedPrice)) {
        processedPrice = 0;
      }
    } else if (typeof p.price === "number") {
      processedPrice = p.price;
    } else {
      processedPrice = 0;
    }
  } else {
    processedPrice = 0;
  }

  return {
    // id bài đăng
    postID: String(p?.postId ?? ""),

    // thông tin hiển thị của battery
    image:
      firstImg ||
      "https://via.placeholder.com/400x300/667eea/ffffff?text=Battery+Pack",
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

/** State bộ lọc ban đầu cho batteries */
const initialFilters = {
  batteryType: "",
  minCapacity: "",
  maxCapacity: "",
  minVoltage: "",
  maxVoltage: "",
  minPrice: "",
  maxPrice: "",
  condition: "", // "new" | "used"
};

const ElectricsPage = () => {
  // ===================== STATE CHÍNH =====================
  const navigate = useNavigate();
  const [batteries, setBatteries] = useState([]); // danh sách pin đã map
  const [loading, setLoading] = useState(true); // trạng thái loading
  const [currentPage, setCurrentPage] = useState(1);

  // Tách input tìm kiếm/bộ lọc (draft) và bộ lọc áp dụng (applied)
  const [draftSearch, setDraftSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  // ===================== FETCH API TỪ BE =====================
  useEffect(() => {
    const fetchBatteries = async () => {
      try {
        setLoading(true);

        // Sử dụng endpoint chuyên cho batteries đã được approved
        const response = await api.get("/api/post/public/batteries");

        // BE trả list PostResponse chỉ chứa batteries
        const items = Array.isArray(response.data) ? response.data : [];

        // Debug first item to see structure
        if (items.length > 0) {
        }

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
            // Still set batteries even if favorites loading failed
            setBatteries(mapped);
          }
        } else {
          setBatteries(mapped);
        }
      } catch (error) {
        setBatteries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBatteries();
  }, []);

  // ===================== OPTIONS CHO BỘ LỌC (derive từ data) =====================
  const batteryTypes = useMemo(
    () =>
      Array.from(
        new Set(
          batteries.map((b) => b.batteryDetails?.batteryType).filter(Boolean)
        )
      ).sort(),
    [batteries]
  );

  // ===================== LỌC THEO APPLIED =====================
  const filteredBatteries = useMemo(() => {
    const s = appliedSearch.trim().toLowerCase();
    const f = appliedFilters;

    return batteries.filter((battery) => {
      // tìm kiếm toàn văn đơn giản
      const matchSearch =
        !s ||
        battery.productName?.toLowerCase().includes(s) ||
        battery.basicInfo?.some((info) => info?.toLowerCase().includes(s)) ||
        battery.sellerName?.toLowerCase().includes(s);

      // từng điều kiện đơn
      const inBatteryType =
        !f.batteryType || battery.batteryDetails?.batteryType === f.batteryType;
      const inCondition =
        !f.condition ||
        (f.condition === "new" && battery.isNew) ||
        (f.condition === "used" && !battery.isNew);

      // khoảng giá
      const minPriceOK = !f.minPrice || battery.price >= Number(f.minPrice);
      const maxPriceOK = !f.maxPrice || battery.price <= Number(f.maxPrice);

      // khoảng capacity
      const minCapacityOK =
        !f.minCapacity ||
        (battery.batteryDetails?.originCapacity &&
          battery.batteryDetails.originCapacity >= Number(f.minCapacity));
      const maxCapacityOK =
        !f.maxCapacity ||
        (battery.batteryDetails?.originCapacity &&
          battery.batteryDetails.originCapacity <= Number(f.maxCapacity));

      // khoảng voltage
      const minVoltageOK =
        !f.minVoltage ||
        (battery.batteryDetails?.voltage &&
          battery.batteryDetails.voltage >= Number(f.minVoltage));
      const maxVoltageOK =
        !f.maxVoltage ||
        (battery.batteryDetails?.voltage &&
          battery.batteryDetails.voltage <= Number(f.maxVoltage));

      return (
        matchSearch &&
        inBatteryType &&
        inCondition &&
        minPriceOK &&
        maxPriceOK &&
        minCapacityOK &&
        maxCapacityOK &&
        minVoltageOK &&
        maxVoltageOK
      );
    });
  }, [batteries, appliedSearch, appliedFilters]);

  const resetFilters = () => {
    setDraftFilters(initialFilters);
    setDraftSearch("");
    setAppliedFilters(initialFilters);
    setAppliedSearch("");
    setCurrentPage(1);
  };

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

        alert("Failed to update favorites. Please try again.");
      }
    },
    [batteries]
  );

  // ===================== FORMAT HIỂN THỊ =====================
  const formatPrice = (price) => {
    if (!price || price === null || price === undefined) {
      return "Contact for Price";
    }

    let numPrice;
    if (typeof price === "string") {
      // Remove any non-numeric characters except decimal point
      const cleanPrice = price.replace(/[^\d.]/g, "");
      numPrice = parseFloat(cleanPrice);
    } else {
      numPrice = Number(price);
    }

    if (isNaN(numPrice) || numPrice === 0) {
      return "Contact for Price";
    }

    // Use VND formatting like vehicles page
    const formatted = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);

    return formatted;
  };

  // ===================== RENDER =====================
  if (loading) {
    return (
      <div className="electrics-page">
        <LoadingSpinner message="Loading batteries..." />
      </div>
    );
  }

  return (
    <div className="electrics-page">
      {/* Enhanced Header */}
      <div className="enhanced-header">
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
              {appliedSearch && (
                <span className="search-term"> for "{appliedSearch}"</span>
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
              Filters
            </h3>
            <button className="clear-filters" onClick={resetFilters}>
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
            <select
              className="filter-select"
              value={draftFilters.batteryType}
              onChange={(e) =>
                setDraftFilters({
                  ...draftFilters,
                  batteryType: e.target.value,
                })
              }
            >
              <option value="">All Types</option>
              {batteryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
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
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Condition
            </label>
            <div className="status-buttons">
              <button
                className={`status-btn ${
                  draftFilters.condition === "" ? "active" : ""
                }`}
                onClick={() =>
                  setDraftFilters({ ...draftFilters, condition: "" })
                }
              >
                All
              </button>
              <button
                className={`status-btn ${
                  draftFilters.condition === "new" ? "active" : ""
                }`}
                onClick={() =>
                  setDraftFilters({ ...draftFilters, condition: "new" })
                }
              >
                New
              </button>
              <button
                className={`status-btn ${
                  draftFilters.condition === "used" ? "active" : ""
                }`}
                onClick={() =>
                  setDraftFilters({ ...draftFilters, condition: "used" })
                }
              >
                Used
              </button>
            </div>
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
                <path d="M4 7h16l-1 10H5L4 7z" />
                <path d="M4 7L2 3h2l2 4z" />
              </svg>
              Price Range (VND)
            </label>

            <div className="simple-price-inputs">
              <input
                type="text"
                placeholder="Min Price (VND) - e.g. 10,000,000"
                value={draftFilters.minPrice}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setDraftFilters({ ...draftFilters, minPrice: value });
                }}
                style={{ pointerEvents: "auto" }}
              />
              <input
                type="text"
                placeholder="Max Price (VND) - e.g. 50,000,000"
                value={draftFilters.maxPrice}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setDraftFilters({ ...draftFilters, maxPrice: value });
                }}
                style={{ pointerEvents: "auto" }}
              />
            </div>
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
                <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
                <path d="m22 10-2-2v8l2-2" />
              </svg>
              Capacity Range (kWh)
            </label>

            <div className="simple-price-inputs">
              <input
                type="text"
                placeholder="Min Capacity (kWh) - e.g. 20"
                value={draftFilters.minCapacity}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  setDraftFilters({ ...draftFilters, minCapacity: value });
                }}
                style={{ pointerEvents: "auto" }}
              />
              <input
                type="text"
                placeholder="Max Capacity (kWh) - e.g. 100"
                value={draftFilters.maxCapacity}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  setDraftFilters({ ...draftFilters, maxCapacity: value });
                }}
                style={{ pointerEvents: "auto" }}
              />
            </div>
          </div>

          <div className="filter-actions">
            <button
              className="apply-filters-btn"
              onClick={() => {
                setAppliedFilters(draftFilters);
                setAppliedSearch(draftSearch);
                setCurrentPage(1);
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Content Grid */}
        <main className="vehicles-content">
          {/* Sort Bar */}
          <div className="sort-bar">
            <div className="sort-info">
              <span className="showing-text">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, batteries.length)} of{" "}
                {batteries.length}
              </span>
            </div>
          </div>

          <div className="enhanced-grid">
            {currentBatteries.map((battery) => (
              <div key={battery.postID} className="enhanced-vehicle-card">
                <MiniPost
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
              </div>
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
                <p className="empty-message">
                  {batteries.length === 0
                    ? "No approved battery listings available at the moment"
                    : "Try adjusting your search criteria or filters"}
                </p>
                {(appliedSearch ||
                  Object.values(appliedFilters).some((v) => v)) && (
                  <button className="reset-btn" onClick={resetFilters}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M3 21v-5h5" />
                    </svg>
                    Clear All Filters
                  </button>
                )}
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
                {Math.min(endIndex, filteredBatteries.length)} of{" "}
                {filteredBatteries.length} batteries
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ElectricsPage;

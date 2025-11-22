// src/pages/vehiclesPage/vehiclesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import MiniPost from "../../components/miniPost/miniPost";
import Pagination from "../../components/pagination/pagination";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import "./ModernVehiclesPage.css";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { favoriteService } from "../../services/favoriteService";

/** Số thẻ mỗi trang */
const ITEMS_PER_PAGE = 12;

/** State bộ lọc ban đầu (dựa trên backend fields) */
const initialFilters = {
  brand: "",
  model: "",
  version: "",
  color: "",
  style: "",
  origin: "",
  status: "", // "new" | "old" (derived from odo)
  seats: "", // numberofseat
  minPrice: "",
  maxPrice: "",
  year: "", // yearmanufacture
  minOdo: "",
  maxOdo: "",
  minRange: "",
  maxRange: "",
  minBatteryCapacity: "",
  bodyInsurance: "", // "true" | "false" | ""
  vehicleInspection: "", // "true" | "false" | ""
};

/**
 * Map 1 PostResponse từ BE -> cấu trúc card MiniPost
 * - PostResponse chứa: postId, title, description, price, vehicle, imageUrls, location, thumbnail
 */
const mapPostToCard = (p) => {
  const v = p?.vehicle || {}; // VehicleDTO từ BE

  // Ưu tiên thumbnail, sau đó imageUrls
  const firstImg =
    p?.thumbnail ||
    (Array.isArray(p?.imageUrls) && p.imageUrls.length > 0
      ? p.imageUrls[0]
      : "");

  return {
    // id bài đăng
    postID: String(p?.postId ?? ""),

    // thông tin hiển thị của xe
    brand: v?.brand || "",
    model: v?.model || "",
    version: v?.version || "",
    style: v?.style || "",
    color: v?.color || "",
    origin: v?.origin || "",

    // số chỗ và odo - field name từ DTO
    numberOfSeat: Number(v?.numberOfSeat ?? 0),
    odo: Number(v?.odo ?? 0),
    status: Number(v?.odo ?? 0) > 0 ? "old" : "new",

    // các thông số kỹ thuật - field name khác nhau trong DTO
    batteryCapacityRaw: Number(v?.batterycapacity ?? 0),
    batteryCapacity:
      v?.batterycapacity != null ? `${v.batterycapacity} kWh` : "",
    rangeRaw: Number(v?.range ?? 0),
    range: v?.range != null ? `${v.range} km` : "",
    chargingTime: v?.chargingtime != null ? `${v.chargingtime} h` : "",
    year: Number(v?.yearmanufacture ?? 0),

    // insurance & inspection
    bodyInsurance: Boolean(v?.bodyinsurance),
    vehicleInspection: Boolean(v?.vehicleinspection),

    // image & seller
    image: firstImg,
    sellerName: p?.location || "", // location chứa thông tin seller

    // giá post (top-level)
    price: Number(p?.price ?? 0),

    // FE state
    isFavorite: false,
  };
};

export default function VehiclesPage() {
  // ===================== STATE CHÍNH =====================
  const [vehicles, setVehicles] = useState([]); // danh sách xe đã map
  const [loading, setLoading] = useState(true); // trạng thái loading
  const navigate = useNavigate();

  // Tách input tìm kiếm/bộ lọc (draft) và bộ lọc áp dụng (applied)
  const [draftSearch, setDraftSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);

  // ===================== FETCH API TỪ BE =====================
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // Sử dụng endpoint chuyên cho vehicles đã được approved
        const res = await api.get("/api/post/public/vehicles");

        // BE trả list PostResponse chỉ chứa vehicles
        const items = Array.isArray(res.data) ? res.data : [];

        const mapped = items.map(mapPostToCard);

        // Load user favorites to sync favorite status
        if (favoriteService.isUserLoggedIn()) {
          try {
            const favResponse = await favoriteService.getFavorites();
            const favoritePostIds = new Set(
              favResponse.data?.map((fav) => String(fav.postId)) || []
            );

            // Update mapped vehicles with favorite status
            const mappedWithFavorites = mapped.map((vehicle) => ({
              ...vehicle,
              isFavorite: favoritePostIds.has(vehicle.postID),
            }));

            setVehicles(mappedWithFavorites);
          } catch (favError) {
            // Still set vehicles even if favorites loading failed
            setVehicles(mapped);
          }
        } else {
          setVehicles(mapped);
        }
      } catch (e) {
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ===================== OPTIONS CHO BỘ LỌC (derive từ data) =====================
  const brands = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.brand))).sort(),
    [vehicles]
  );
  const models = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.model)))
        .filter(Boolean)
        .sort(),
    [vehicles]
  );
  const versions = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.version)))
        .filter(Boolean)
        .sort(),
    [vehicles]
  );
  const colors = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.color)))
        .filter(Boolean)
        .sort(),
    [vehicles]
  );
  const styles = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.style)))
        .filter(Boolean)
        .sort(),
    [vehicles]
  );
  const origins = useMemo(() => {
    // Normalize origin values for deduplication (trim + lowercase),
    // but preserve a friendly display value (first seen, trimmed).
    const map = new Map();
    for (const v of vehicles) {
      const raw = v.origin;
      if (!raw) continue;
      const norm = String(raw).trim().toLowerCase();
      if (!norm) continue;
      if (!map.has(norm)) {
        map.set(norm, String(raw).trim());
      }
    }
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
  }, [vehicles]);
  const seats = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.numberOfSeat)))
        .filter(Boolean)
        .sort((a, b) => a - b),
    [vehicles]
  );
  const years = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.year).filter(Boolean))).sort(
        (a, b) => b - a
      ),
    [vehicles]
  );

  // ===================== LỌC THEO APPLIED =====================
  const filtered = useMemo(() => {
    const s = appliedSearch.trim().toLowerCase();
    const f = appliedFilters;

    return vehicles.filter((v) => {
      // tìm kiếm toàn văn đơn giản
      const matchSearch =
        !s ||
        `${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(s) ||
        (v.sellerName || "").toLowerCase().includes(s);

      // từng điều kiện đơn
      const inBrand = !f.brand || v.brand === f.brand;
      const inModel = !f.model || v.model === f.model;
      const inVersion = !f.version || v.version === f.version;
      const inColor = !f.color || v.color === f.color;
      const inStyle = !f.style || v.style === f.style;
      const inOrigin = !f.origin || v.origin === f.origin;
      const inStatus = !f.status || v.status === f.status;
      const inSeats = !f.seats || String(v.numberOfSeat) === String(f.seats);
      const inYear = !f.year || String(v.year) === String(f.year);

      // insurance & inspection filters
      const inBodyInsurance =
        !f.bodyInsurance ||
        (f.bodyInsurance === "true" && v.bodyInsurance) ||
        (f.bodyInsurance === "false" && !v.bodyInsurance);
      const inVehicleInspection =
        !f.vehicleInspection ||
        (f.vehicleInspection === "true" && v.vehicleInspection) ||
        (f.vehicleInspection === "false" && !v.vehicleInspection);

      // khoảng giá
      const minPriceOK = !f.minPrice || v.price >= Number(f.minPrice);
      const maxPriceOK = !f.maxPrice || v.price <= Number(f.maxPrice);

      // khoảng odo
      const minOdoOK = !f.minOdo || v.odo >= Number(f.minOdo);
      const maxOdoOK = !f.maxOdo || v.odo <= Number(f.maxOdo);

      // khoảng range
      const minRangeOK = !f.minRange || v.rangeRaw >= Number(f.minRange);
      const maxRangeOK = !f.maxRange || v.rangeRaw <= Number(f.maxRange);

      // min battery capacity
      const minBatteryOK =
        !f.minBatteryCapacity ||
        v.batteryCapacityRaw >= Number(f.minBatteryCapacity);

      return (
        matchSearch &&
        inBrand &&
        inModel &&
        inVersion &&
        inColor &&
        inStyle &&
        inOrigin &&
        inStatus &&
        inSeats &&
        inYear &&
        inBodyInsurance &&
        inVehicleInspection &&
        minPriceOK &&
        maxPriceOK &&
        minOdoOK &&
        maxOdoOK &&
        minRangeOK &&
        maxRangeOK &&
        minBatteryOK
      );
    });
  }, [vehicles, appliedSearch, appliedFilters]);

  // ===================== PHÂN TRANG =====================
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVehicles = filtered.slice(startIndex, endIndex);

  // ===================== HANDLERS UI =====================
  const handleFavoriteClick = async (postID) => {
    // Check if user is logged in
    if (!favoriteService.isUserLoggedIn()) {
      alert("Please log in to add favorites!");
      return;
    }

    // Find the current vehicle to check its favorite status
    const vehicle = vehicles.find((v) => v.postID === postID);
    if (!vehicle) return;

    try {
      // Update UI immediately for better UX
      setVehicles((prev) =>
        prev.map((v) =>
          v.postID === postID ? { ...v, isFavorite: !v.isFavorite } : v
        )
      );

      // Call API based on current state
      if (vehicle.isFavorite) {
        // Currently favorited, so remove it
        await favoriteService.removeFromFavorites(postID);
      } else {
        // Not favorited, so add it
        await favoriteService.addToFavorites(postID);
      }
    } catch (error) {
      // Revert UI change if API call failed
      setVehicles((prev) =>
        prev.map((v) =>
          v.postID === postID ? { ...v, isFavorite: !v.isFavorite } : v
        )
      );

      alert("Failed to update favorites. Please try again.");
    }
  };

  const handleCardClick = (vehicle) => {
    navigate(`/vehicles/${vehicle.postID}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setDraftFilters(initialFilters);
    setDraftSearch("");
    setAppliedFilters(initialFilters);
    setAppliedSearch("");
    setCurrentPage(1);
  };

  // ===================== FORMAT HIỂN THỊ =====================
  const formatBasicInfo = (v) => {
    const info = [];

    // Battery capacity
    if (v.batteryCapacity) {
      info.push(v.batteryCapacity);
    }

    // Number of seats
    if (v.numberOfSeat && v.numberOfSeat > 0) {
      info.push(`${v.numberOfSeat} seats`);
    }

    // Range
    if (v.range) {
      info.push(v.range);
    }

    // Odometer/Status
    if (v.odo > 0) {
      info.push(`${v.odo.toLocaleString()} km`);
    } else {
      info.push("New");
    }

    return info.filter(Boolean);
  };

  const formatProductName = (v) => `${v.brand} ${v.model} ${v.version}`.trim();

  // ===================== RENDER =====================
  if (loading) {
    return (
      <div className="vehicles-page modern-enhanced">
        <LoadingSpinner message="Loading vehicles..." />
      </div>
    );
  }

  return (
    <div className="vehicles-page modern-enhanced">
      {/* Enhanced Header */}
      <div className="enhanced-header">
        <h1>Premium Electric Vehicles</h1>
        <p>Discover the future of sustainable transportation</p>
      </div>

      {/* Results Header */}
      <div className="results-header">
        <div className="results-info">
          <h2>Electric Vehicles Collection</h2>
          <p className="results-count">
            {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""}{" "}
            available
            {filtered.length !== vehicles.length && (
              <span className="filter-indicator">
                {" "}
                (filtered from {vehicles.length})
              </span>
            )}
            {appliedSearch && (
              <span className="search-term"> for "{appliedSearch}"</span>
            )}
          </p>
        </div>

        <div className="view-controls">
          <button className="view-btn active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Grid
          </button>
        </div>
      </div>

      <div className="layout enhanced-layout">
        {/* Simple Sidebar filters - Essential Only */}
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
                <path d="M19 14c0-1.1-.9-2-2-2h-1l-1-6H9L8 12H7c-1.1 0-2 .9-2 2v4c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h8v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-4z" />
                <circle cx="7.5" cy="16.5" r="2.5" />
                <circle cx="16.5" cy="16.5" r="2.5" />
              </svg>
              Brand
            </label>
            <div style={{ display: 'flex', width: '100%' }}>
              <select
                className="filter-select"
                style={{ fontSize: '1rem', padding: '10px 18px', maxWidth: '100%' }}
                value={draftFilters.brand}
                onChange={(e) =>
                  setDraftFilters({
                    ...draftFilters,
                    brand: e.target.value,
                    model: "",
                  })
                }
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
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
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              Model
            </label>
            <div style={{ display: 'flex', width: '100%' }}>
              <select
                className="filter-select"
                style={{ fontSize: '1rem', padding: '10px 18px', maxWidth: '100%' }}
                value={draftFilters.model}
                onChange={(e) =>
                  setDraftFilters({
                    ...draftFilters,
                    model: e.target.value,
                  })
                }
              >
                <option value="">All Models</option>
                {models
                  .filter(
                    (m) =>
                      !draftFilters.brand ||
                      vehicles.some(
                        (v) => v.brand === draftFilters.brand && v.model === m
                      )
                  )
                  .map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
              </select>
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
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Status
            </label>
            <div className="status-buttons">
              <button
                className={`status-btn ${
                  draftFilters.status === "" ? "active" : ""
                }`}
                onClick={() => setDraftFilters({ ...draftFilters, status: "" })}
              >
                All
              </button>
              <button
                className={`status-btn ${
                  draftFilters.status === "new" ? "active" : ""
                }`}
                onClick={() =>
                  setDraftFilters({ ...draftFilters, status: "new" })
                }
              >
                New
              </button>
              <button
                className={`status-btn ${
                  draftFilters.status === "old" ? "active" : ""
                }`}
                onClick={() =>
                  setDraftFilters({ ...draftFilters, status: "old" })
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
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Origin
            </label>
            <div style={{ display: 'flex', width: '100%' }}>
              <select
                className="filter-select"
                style={{ fontSize: '1rem', padding: '10px 18px', maxWidth: '100%' }}
                value={draftFilters.origin}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, origin: e.target.value })
                }
              >
                <option value="">All Origins</option>
                {origins.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
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
                placeholder="Min Price (e.g. 500000000)"
                value={draftFilters.minPrice}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setDraftFilters({ ...draftFilters, minPrice: value });
                }}
                className="simple-price-input"
              />
              <input
                type="text"
                placeholder="Max Price (e.g. 1000000000)"
                value={draftFilters.maxPrice}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setDraftFilters({ ...draftFilters, maxPrice: value });
                }}
                className="simple-price-input"
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

        {/* Enhanced Vehicles Grid */}
        <div className="vehicles-content">
          <div className="sort-bar">
            <div className="sort-info">
              <span className="showing-text">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
                {filtered.length}
              </span>
            </div>
          </div>

          <div className="vehicles-grid enhanced-grid">
            {currentVehicles.map((v) => (
              <div key={v.postID} className="enhanced-vehicle-card">
                <MiniPost
                  image={v.image}
                  productName={formatProductName(v)}
                  basicInfo={formatBasicInfo(v)}
                  sellerName={v.sellerName}
                  price={v.price}
                  isNew={v.status === "new"}
                  isFavorite={v.isFavorite}
                  onFavoriteClick={() => handleFavoriteClick(v.postID)}
                  onClick={() => handleCardClick(v)}
                />
                {v.status === "new" && <div className="new-badge">NEW</div>}
              </div>
            ))}

            {!currentVehicles.length && (
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
                    <path d="M19 14c0-1.1-.9-2-2-2h-1l-1-6H9L8 12H7c-1.1 0-2 .9-2 2v4c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h8v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-4z" />
                    <circle cx="7.5" cy="16.5" r="2.5" />
                    <circle cx="16.5" cy="16.5" r="2.5" />
                  </svg>
                </div>
                <h3>No vehicles found</h3>
                <p className="empty-message">
                  {vehicles.length === 0
                    ? "No approved vehicle listings available at the moment"
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
        </div>
      </div>

      {/* Enhanced Pagination */}
      {filtered.length > 0 && totalPages > 1 && (
        <div className="pagination-section">
          <div className="pagination-wrapper">
            <div className="pagination-info">
              <span>
                Page {currentPage} of {totalPages}
                <span className="total-items">
                  ({filtered.length} total vehicles)
                </span>
              </span>
            </div>
            <div className="pagination enhanced-pagination">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
            <div className="pagination-jump">
              <span>Go to page:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = Math.min(
                    Math.max(1, parseInt(e.target.value) || 1),
                    totalPages
                  );
                  handlePageChange(page);
                }}
                className="page-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <button
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          display: currentPage > 1 ? "flex" : "none",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
}

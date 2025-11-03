// src/pages/vehiclesPage/vehiclesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import MiniPost from "../../components/miniPost/miniPost";
import Pagination from "../../components/pagination/pagination";
import "./vehiclesPage.css";
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

        console.log("[VehiclesPage] Loaded", items.length, "vehicle posts");

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
            console.error("Error loading favorites:", favError);
            // Still set vehicles even if favorites loading failed
            setVehicles(mapped);
          }
        } else {
          setVehicles(mapped);
        }
      } catch (e) {
        console.error("Load vehicles failed:", e);
        console.log("STATUS =", e?.response?.status);
        console.log("DATA   =", e?.response?.data);
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
  const origins = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.origin)))
        .filter(Boolean)
        .sort(),
    [vehicles]
  );
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

      console.error("Error toggling favorite:", error);
      alert("Failed to update favorites. Please try again.");
    }
  };

  const handleCardClick = (vehicle) => {
    console.log("Navigating to vehicle detail:", vehicle.postID);
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
      <div className="vehicles-page">
        <div className="vehicles-header">
          <h1>Electric Vehicles</h1>
        </div>
        <div className="layout">
          <aside className="filters skeleton-box" />
          <div className="vehicles-grid">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="loading-card">
                <div className="loading-image" />
                <div className="loading-content">
                  <div className="loading-line long" />
                  <div className="loading-line medium" />
                  <div className="loading-line short" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicles-page modern-enhanced">
      {/* Enhanced Top Search Bar */}
      <div className="enhanced-topbar">
        <div className="topbar-content">
          <select className="location-select" defaultValue="">
            <option value="">All Cities</option>
            <option>Hà Nội</option>
            <option>TP. HCM</option>
            <option>Đà Nẵng</option>
          </select>

          <div className="search-input-group">
            <svg
              className="search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="search-input"
              placeholder="Search by Brand, Model, Seller..."
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setAppliedSearch(draftSearch);
                  setCurrentPage(1);
                }
              }}
            />
          </div>

          <button
            className="search-btn"
            onClick={() => {
              setAppliedSearch(draftSearch);
              setCurrentPage(1);
            }}
          >
            Search
          </button>
        </div>
      </div>

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
        {/* Enhanced Sidebar filters */}
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
              Advanced Filters
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
            <select
              className="filter-select"
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
            <select
              className="filter-select"
              value={draftFilters.model}
              onChange={(e) =>
                setDraftFilters({
                  ...draftFilters,
                  model: e.target.value,
                  version: "",
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
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" />
              </svg>
              Version
            </label>
            <select
              className="filter-select"
              value={draftFilters.version}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, version: e.target.value })
              }
            >
              <option value="">All Versions</option>
              {versions
                .filter(
                  (v) =>
                    (!draftFilters.brand ||
                      vehicles.some(
                        (vehicle) =>
                          vehicle.brand === draftFilters.brand &&
                          vehicle.version === v
                      )) &&
                    (!draftFilters.model ||
                      vehicles.some(
                        (vehicle) =>
                          vehicle.model === draftFilters.model &&
                          vehicle.version === v
                      ))
                )
                .map((v) => (
                  <option key={v} value={v}>
                    {v}
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Seats
            </label>
            <div className="seats-grid">
              <button
                className={`seat-btn ${
                  draftFilters.seats === "" ? "active" : ""
                }`}
                onClick={() => setDraftFilters({ ...draftFilters, seats: "" })}
              >
                All
              </button>
              {seats.map((s) => (
                <button
                  key={s}
                  className={`seat-btn ${
                    draftFilters.seats === String(s) ? "active" : ""
                  }`}
                  onClick={() =>
                    setDraftFilters({ ...draftFilters, seats: String(s) })
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group half-width">
              <label className="filter-label">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6m0 6v6" />
                </svg>
                Color
              </label>
              <select
                className="filter-select"
                value={draftFilters.color}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, color: e.target.value })
                }
              >
                <option value="">All Colors</option>
                {colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group half-width">
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
                </svg>
                Style
              </label>
              <select
                className="filter-select"
                value={draftFilters.style}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, style: e.target.value })
                }
              >
                <option value="">All Styles</option>
                {styles.map((s) => (
                  <option key={s} value={s}>
                    {s}
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
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Origin
            </label>
            <select
              className="filter-select"
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Year of Manufacture
            </label>
            <select
              className="filter-select"
              value={draftFilters.year}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, year: e.target.value })
              }
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
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
                <path d="M12 2v4" />
                <path d="M16 6l-4 6-4-6" />
                <path d="M8 18l4-6 4 6" />
                <path d="M12 18v4" />
              </svg>
              Odometer Range (km)
            </label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min ODO"
                value={draftFilters.minOdo}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, minOdo: e.target.value })
                }
                className="range-input"
              />
              <span className="range-separator">-</span>
              <input
                type="number"
                placeholder="Max ODO"
                value={draftFilters.maxOdo}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, maxOdo: e.target.value })
                }
                className="range-input"
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
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              Electric Range (km)
            </label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min Range"
                value={draftFilters.minRange}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, minRange: e.target.value })
                }
                className="range-input"
              />
              <span className="range-separator">-</span>
              <input
                type="number"
                placeholder="Max Range"
                value={draftFilters.maxRange}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, maxRange: e.target.value })
                }
                className="range-input"
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
              Min Battery Capacity (kWh)
            </label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={draftFilters.minBatteryCapacity}
              onChange={(e) =>
                setDraftFilters({
                  ...draftFilters,
                  minBatteryCapacity: e.target.value,
                })
              }
              className="filter-select"
            />
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
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Insurance & Inspection
            </label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={draftFilters.bodyInsurance === "true"}
                  onChange={(e) =>
                    setDraftFilters({
                      ...draftFilters,
                      bodyInsurance: e.target.checked ? "true" : "",
                    })
                  }
                />
                Body Insurance
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={draftFilters.vehicleInspection === "true"}
                  onChange={(e) =>
                    setDraftFilters({
                      ...draftFilters,
                      vehicleInspection: e.target.checked ? "true" : "",
                    })
                  }
                />
                Vehicle Inspection
              </label>
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
            <div className="sort-controls">
              <label>Sort by:</label>
              <select className="sort-select">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest</option>
                <option value="year-old">Year: Oldest</option>
              </select>
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

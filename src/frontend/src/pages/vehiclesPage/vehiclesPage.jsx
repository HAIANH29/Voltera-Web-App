// src/pages/vehiclesPage/vehiclesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import MiniPost from "../../components/miniPost/miniPost";
import Pagination from "../../components/pagination/pagination";
import "./vehiclesPage.css";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

/** Số thẻ mỗi trang */
const ITEMS_PER_PAGE = 12;

/** State bộ lọc ban đầu (chỉ dùng ở FE) */
const initialFilters = {
  brand: "",
  model: "",
  color: "",
  style: "",
  status: "", // "new" | "old"
  seats: "",
  minPrice: "",
  maxPrice: "",
  year: "",
};

/**
 * Map 1 PostResponse từ BE -> cấu trúc card MiniPost
 * - PostResponse chứa: postId, title, description, price, vehicle, imageUrls, location, thumbnail
 */
const mapPostToCard = (p) => {
  const v = p?.vehicle || {}; // VehicleDTO từ BE

  // Ưu tiên thumbnail, sau đó imageUrls
  const firstImg = p?.thumbnail || (Array.isArray(p?.imageUrls) && p.imageUrls.length > 0 ? p.imageUrls[0] : "");

  return {
    // id bài đăng
    postID: String(p?.postId ?? ""),

    // thông tin hiển thị của xe
    brand: v?.brand || "",
    model: v?.model || "",
    version: v?.version || "",
    style: v?.style || "",
    color: v?.color || "",

    // số chỗ và odo - field name khác nhau trong DTO
    numberOfSeat: Number(v?.numberofseat ?? 0),
    odo: Number(v?.odo ?? 0),
    status: Number(v?.odo ?? 0) > 0 ? "old" : "new",

    // các thông số kỹ thuật - field name khác nhau trong DTO
    batteryType: "", // không có trong VehicleDTO hiện tại
    batteryCapacity: v?.batterycapacity != null ? `${v.batterycapacity} kWh` : "",
    range: v?.range != null ? `${v.range} km` : "",
    chargingTime: v?.chargingtime != null ? `${v.chargingtime} h` : "",
    year: Number(v?.yearmanufacture ?? 0),

    // ảnh & người bán
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
  const [vehicles, setVehicles] = useState([]);  // danh sách xe đã map
  const [loading, setLoading] = useState(true);  // trạng thái loading
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
        setVehicles(mapped);
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
    () => Array.from(new Set(vehicles.map((v) => v.model))).sort(),
    [vehicles]
  );
  const colors = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.color))).sort(),
    [vehicles]
  );
  const styles = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.style))).sort(),
    [vehicles]
  );
  const seats = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.numberOfSeat))).sort(
        (a, b) => a - b
      ),
    [vehicles]
  );
  const years = useMemo(
    () =>
      Array.from(
        new Set(vehicles.map((v) => v.year).filter(Boolean))
      ).sort((a, b) => b - a),
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
      const inColor = !f.color || v.color === f.color;
      const inStyle = !f.style || v.style === f.style;
      const inStatus = !f.status || v.status === f.status;
      const inSeats = !f.seats || String(v.numberOfSeat) === String(f.seats);
      const inYear = !f.year || String(v.year) === String(f.year);

      // khoảng giá
      const minOK = !f.minPrice || v.price >= Number(f.minPrice);
      const maxOK = !f.maxPrice || v.price <= Number(f.maxPrice);

      return (
        matchSearch &&
        inBrand &&
        inModel &&
        inColor &&
        inStyle &&
        inStatus &&
        inSeats &&
        inYear &&
        minOK &&
        maxOK
      );
    });
  }, [vehicles, appliedSearch, appliedFilters]);

  // ===================== PHÂN TRANG =====================
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVehicles = filtered.slice(startIndex, endIndex);

  // ===================== HANDLERS UI =====================
  const handleFavoriteClick = (postID) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.postID === postID ? { ...v, isFavorite: !v.isFavorite } : v
      )
    );
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
  const formatBasicInfo = (v) => [
    v.batteryCapacity || "Điện",
    `${v.numberOfSeat} chỗ`,
    v.range || "",
    v.odo > 0 ? `${v.odo.toLocaleString()} km` : "Mới",
  ].filter(Boolean); // Loại bỏ các giá trị rỗng
  
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
    <div className="vehicles-page">
      {/* Top search bar */}
      <div className="topbar">
        <select className="topbar-select" defaultValue="">
          <option value="">— All cities —</option>
          <option>Hà Nội</option>
          <option>TP. HCM</option>
          <option>Đà Nẵng</option>
        </select>

        {/* Ô search điều khiển bằng draftSearch */}
        <input
          className="topbar-search"
          placeholder="Search by Brand, Model, Seller…"
          value={draftSearch}
          onChange={(e) => setDraftSearch(e.target.value)}
        />
        <button
          className="topbar-btn"
          onClick={() => {
            setAppliedSearch(draftSearch);
            setCurrentPage(1);
          }}
        >
          Search
        </button>
      </div>

      <div className="vehicles-header">
        <h1>Electric Vehicles</h1>
        <p>
          Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {filtered.length !== vehicles.length ? ` (from ${vehicles.length})` : ""}
        </p>
      </div>

      <div className="layout">
        {/* Sidebar filters */}
        <aside className="filters">
          <h3>Filter Electric Cars</h3>

          <label>Brand</label>
          <select
            value={draftFilters.brand}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, brand: e.target.value, model: "" })
            }
          >
            <option value="">— All —</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <label>Model</label>
          <select
            value={draftFilters.model}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, model: e.target.value })
            }
          >
            <option value="">— All —</option>
            {models
              .filter(
                (m) =>
                  !draftFilters.brand ||
                  vehicles.some((v) => v.brand === draftFilters.brand && v.model === m)
              )
              .map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
          </select>

          <label>Color</label>
          <select
            value={draftFilters.color}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, color: e.target.value })
            }
          >
            <option value="">— All —</option>
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label>Style</label>
          <select
            value={draftFilters.style}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, style: e.target.value })
            }
          >
            <option value="">— All —</option>
            {styles.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label>Status</label>
          <select
            value={draftFilters.status}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, status: e.target.value })
            }
          >
            <option value="">— All —</option>
            <option value="new">New</option>
            <option value="old">Used</option>
          </select>

          <label>Seats</label>
          <select
            value={draftFilters.seats}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, seats: e.target.value })
            }
          >
            <option value="">— All —</option>
            {seats.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label>Price range (VND)</label>
          <div className="price-row">
            <input
              type="number"
              placeholder="Min"
              value={draftFilters.minPrice}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, minPrice: e.target.value })
              }
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max"
              value={draftFilters.maxPrice}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, maxPrice: e.target.value })
              }
            />
          </div>

          <label>Year of Manufacture</label>
          <select
            value={draftFilters.year}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, year: e.target.value })
            }
          >
            <option value="">— All —</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <div className="filter-actions">
            <button
              className="btn-apply"
              onClick={() => {
                setAppliedFilters(draftFilters);
                setAppliedSearch(draftSearch);
                setCurrentPage(1);
              }}
            >
              Apply Filter
            </button>
            <button className="btn-reset" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </aside>

        {/* Lưới card xe */}
        <div className="vehicles-grid">
          {currentVehicles.map((v) => (
            <MiniPost
              key={v.postID}
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
          ))}

          {!currentVehicles.length && (
            <div className="empty">
              Không tìm thấy xe phù hợp.
              {vehicles.length === 0
                ? " (API hiện không có bài đăng XE đã APPROVED – có thể dữ liệu đang toàn bài PIN)"
                : " Hãy điều chỉnh bộ lọc."}
            </div>
          )}
        </div>
      </div>

      {/* Phân trang */}
      {filtered.length > 0 && (
        <div className="pagination-container">
          <div className="pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
          <div className="pagination-info">
            {`Showing ${startIndex + 1}-${Math.min(endIndex, filtered.length)} of ${
              filtered.length
            } vehicles`}
          </div>
        </div>
      )}
    </div>
  );
}

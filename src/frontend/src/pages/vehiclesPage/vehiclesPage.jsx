import React, { useEffect, useMemo, useState } from "react";
import MiniPost from "../../components/miniPost/miniPost";
import Pagination from "../../components/pagination/pagination";
import "./vehiclesPage.css";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

// API service functions
const vehicleAPI = {
  // Lấy tất cả vehicles với status APPROVED
  getAllVehicles: async () => {
    try {
      const response = await api.get('/api/post/list/APPROVED');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  // Filter vehicles với parameters
  filterVehicles: async (filters) => {
    try {
      const params = new URLSearchParams();
      
      // Add search term
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add other filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'search') {
          params.append(key, value);
        }
      });

      const response = await api.get(`/api/post/filter?${params.toString()}`);
      return response.data || [];
    } catch (error) {
      console.error('Error filtering vehicles:', error);
      throw error;
    }
  }
};

// Transform backend data to frontend format
const transformVehicleData = (post) => {
  // Safety check for post and vehicle data
  if (!post || !post.vehicle) {
    return null;
  }
  
  const vehicle = post.vehicle;
  const images = vehicle.images || [];
  
  return {
    postID: post.id || post.postid,
    title: post.title || `${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.version || ''}`,
    description: post.description || '',
    price: post.price || 0,
    address: post.address || '',
    createdAt: post.createdAt,
    status: post.status,
    
    // Vehicle specific data
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    version: vehicle.version || '',
    odo: vehicle.odo || 0,
    batteryCapacity: vehicle.batteryCapacity || 0,
    range: vehicle.range || 0,
    chargingTime: vehicle.chargingTime || 0,
    color: vehicle.color || '',
    numberOfSeat: vehicle.numberOfSeat || 5,
    style: vehicle.style || '',
    bodyInsurance: vehicle.bodyInsurance || false,
    vehicleInspection: vehicle.vehicleInspection || false,
    licensePlate: vehicle.licensePlate || '',
    origin: vehicle.origin || '',
    yearManufacture: vehicle.yearManufacture || new Date().getFullYear(),
    year: vehicle.yearManufacture || vehicle.year || new Date().getFullYear(),
    
    // Images
    images: images.map(img => img.imageUrl || img.url),
    image: images.length > 0 ? (images[0].imageUrl || images[0].url) : '/default-vehicle.jpg',
    
    // Additional UI data
    sellerName: post.user?.fullName || post.user?.username || 'Unknown Seller',
    isFavorite: false, // This should come from user's favorites
    batteryType: 'Lithium-ion', // Default value, adjust if you have this data
  };
};

// API data integration - mock data replaced with real backend calls

const ITEMS_PER_PAGE = 12;

const initialFilters = {
  brand: "",
  model: "",
  color: "",
  style: "",
  status: "", // new | old
  seats: "", // 4 | 5 | 7 ...
  minPrice: "",
  maxPrice: "",
  year: "",
};

export default function VehiclesPage() {
  // data + loading
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ======= TÁCH DRAFT vs APPLIED =======
  const [draftSearch, setDraftSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Fetch all vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const vehiclesData = await vehicleAPI.getAllVehicles();
      // Transform and ensure it's an array, filter out null values
      const transformedData = Array.isArray(vehiclesData) 
        ? vehiclesData.map(post => transformVehicleData(post)).filter(Boolean)
        : [];
      setVehicles(transformedData);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filtered vehicles when search/filters change
  useEffect(() => {
    const hasSearch = appliedSearch.trim();
    const hasFilters = Object.values(appliedFilters).some(val => val);
    
    if (hasSearch || hasFilters) {
      fetchFilteredVehicles();
    } else {
      // Reset to all vehicles if no filters
      fetchVehicles();
    }
  }, [appliedSearch, appliedFilters]);

  // Fetch filtered vehicles
  const fetchFilteredVehicles = async () => {
    try {
      setLoading(true);
      const filteredData = await vehicleAPI.filterVehicles({
        search: appliedSearch,
        ...appliedFilters
      });
      // Transform and ensure it's an array, filter out null values
      const transformedData = Array.isArray(filteredData) 
        ? filteredData.map(post => transformVehicleData(post)).filter(Boolean)
        : [];
      setVehicles(transformedData);
    } catch (error) {
      console.error('Error fetching filtered vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // derive options từ data - ensure vehicles is always an array
  const vehicles_safe = Array.isArray(vehicles) ? vehicles : [];
  
  const brands = useMemo(
    () => Array.from(new Set(vehicles_safe.map((v) => v.brand).filter(Boolean))).sort(),
    [vehicles_safe]
  );
  const models = useMemo(
    () => Array.from(new Set(vehicles_safe.map((v) => v.model).filter(Boolean))).sort(),
    [vehicles_safe]
  );
  const colors = useMemo(
    () => Array.from(new Set(vehicles_safe.map((v) => v.color).filter(Boolean))).sort(),
    [vehicles_safe]
  );
  const styles = useMemo(
    () => Array.from(new Set(vehicles_safe.map((v) => v.style).filter(Boolean))).sort(),
    [vehicles_safe]
  );
  const seats = useMemo(
    () => Array.from(new Set(vehicles_safe.map((v) => v.numberOfSeat).filter(Boolean))).sort((a, b) => a - b),
    [vehicles_safe]
  );
  const years = useMemo(
    () => Array.from(new Set(vehicles_safe.map((v) => v.yearManufacture || v.year).filter(Boolean))).sort((a, b) => b - a),
    [vehicles_safe]
  );

  // Since filtering is now done by API, just return all vehicles
  const filtered = useMemo(() => vehicles, [vehicles]);

  // paginate
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVehicles = filtered.slice(startIndex, endIndex);

  // actions
  const handleFavoriteClick = (postID) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.postID === postID ? { ...v, isFavorite: !v.isFavorite } : v
      )
    );
  };

  const handleCardClick = (vehicle) => {
    // TODO: navigate(`/vehicles/${vehicle.postID}`)
    console.log("Clicked vehicle:", vehicle.postID);
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

  const formatBasicInfo = (v) => [
    `${v.batteryType}`,
    `${v.numberOfSeat} chỗ`,
    `${v.range}`,
    v.odo > 0 ? `${v.odo.toLocaleString()} km` : "Mới",
  ];
  const formatProductName = (v) => `${v.brand} ${v.model} ${v.version}`;

  // ====== UI ======
  if (loading) {
    return (
      <div className="vehicles-page">
        <div className="vehicles-header">
          <h1>Electric Vehicles</h1>
          <p>Explore modern electric vehicle models</p>
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

        {/* SEARCH điều khiển bằng draftSearch */}
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
              .filter((m) =>
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

        {/* Cards grid */}
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
            <div className="empty">Không tìm thấy xe phù hợp. Hãy điều chỉnh bộ lọc.</div>
          )}
        </div>
      </div>

      {/* Pagination */}
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

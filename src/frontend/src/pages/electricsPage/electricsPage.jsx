import React, { useEffect, useMemo, useState } from "react";
import MiniPost from "../../components/miniPost/miniPost";
import Pagination from "../../components/pagination/pagination";
import "./electricsPage.css";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

// API service functions for batteries
const batteryAPI = {
  // Lấy tất cả batteries với status APPROVED
  getAllBatteries: async () => {
    try {
      const response = await api.get('/api/post/list/APPROVED');
      const posts = response.data || [];
      // Filter chỉ lấy posts có battery data
      return posts.filter(post => post.battery && post.battery.id);
    } catch (error) {
      console.error('Error fetching batteries:', error);
      throw error;
    }
  },

  // Filter batteries với parameters
  filterBatteries: async (filters) => {
    try {
      const params = new URLSearchParams();
      
      // Add search term
      if (filters.search) {
        params.append('keyword', filters.search);
      }
      
      // Add other filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'search') {
          // Map frontend filter names to backend parameter names
          const paramMapping = {
            type: 'batteryType',
            minPrice: 'minPrice',
            maxPrice: 'maxPrice',
            minCapacity: 'minOriginCapacity',
            maxCapacity: 'maxOriginCapacity',
            minVoltage: 'minVoltage',
            maxVoltage: 'maxVoltage',
            minCycles: 'minCycleCount',
            maxCycles: 'maxCycleCount'
          };
          
          const paramName = paramMapping[key] || key;
          params.append(paramName, value);
        }
      });

      const response = await api.get(`/api/post/filter/batteries?${params.toString()}`);
      return response.data || [];
    } catch (error) {
      console.error('Error filtering batteries:', error);
      throw error;
    }
  }
};

// Transform backend data to frontend format
const transformBatteryData = (post) => {
  // Safety check for post and battery data
  if (!post || !post.battery) {
    return null;
  }
  
  const battery = post.battery;
  const images = battery.images || [];
  
  return {
    id: post.id || post.postid,
    postID: post.id || post.postid,
    title: post.title || `${battery.batteryType || 'Battery'} ${battery.serialNumber || ''}`,
    description: post.description || '',
    price: post.price || 0,
    address: post.address || '',
    createdAt: post.createdAt,
    status: post.status,
    
    // Battery specific data
    productName: post.title || `${battery.batteryType || 'Battery'} Pack`,
    basicInfo: [
      battery.batteryType || 'Li-ion',
      `${battery.originCapacity || 0}kWh`,
      `${battery.cycleCount || 0} cycles`
    ],
    sellerName: post.user?.fullName || post.user?.username || 'Unknown Seller',
    isNew: post.status === 'new' || battery.cycleCount < 100,
    isFavorite: false, // This should come from user's favorites
    
    // Images
    images: images.map(img => img.imageUrl || img.url),
    image: images.length > 0 ? (images[0].imageUrl || images[0].url) : '/default-battery.jpg',
    
    // Battery details for detailed view
    batteryDetails: {
      batteryType: battery.batteryType || 'Lithium-ion',
      serialNumber: battery.serialNumber || '',
      originalCapacity: `${battery.originCapacity || 0}kWh`,
      remainingCapacity: `${battery.remainingCapacity || 0}kWh`,
      mileageCovered: `${battery.mileageCovered || 0}km`,
      voltage: `${battery.voltage || 0}V`,
      cycleCount: battery.cycleCount || 0,
      warranty: battery.warranty || '',
      weight: `${battery.weight || 0}kg`,
      lifeCycle: battery.lifeCycle || ''
    }
  };
};

// API data integration - mock data replaced with real backend calls

const ITEMS_PER_PAGE = 12;

// Helpers parse số từ chuỗi như "85kWh", "400V", "15000km"
const parseNumber = (text) => {
  if (!text && text !== 0) return NaN;
  if (typeof text === "number") return text;
  const m = String(text).match(/[\d.]+/);
  return m ? Number(m[0]) : NaN;
};

// ====================================
//            COMPONENT
// ====================================
export default function ElectricsPage() {
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // TÁCH DRAFT vs APPLIED (giống trang Vehicles)
  const initialFilters = {
    type: "",          // batteryDetails.batteryType
    isNew: "",         // "", "new", "used"
    minPrice: "",
    maxPrice: "",
    minCapacity: "",   // kWh từ originalCapacity
    maxCapacity: "",
    minVoltage: "",
    maxVoltage: "",
    minCycles: "",
    maxCycles: "",
    seller: "",        // exact sellerName
  };

  const [draftSearch, setDraftSearch] = useState("");     // search theo productName/sellerName
  const [appliedSearch, setAppliedSearch] = useState("");

  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch batteries on component mount
  useEffect(() => {
    fetchBatteries();
  }, []);

  // Fetch all batteries
  const fetchBatteries = async () => {
    try {
      setLoading(true);
      const batteriesData = await batteryAPI.getAllBatteries();
      // Transform and ensure it's an array, filter out null values
      const transformedData = Array.isArray(batteriesData) 
        ? batteriesData.map(post => transformBatteryData(post)).filter(Boolean)
        : [];
      setBatteries(transformedData);
    } catch (error) {
      console.error('Error fetching batteries:', error);
      setBatteries([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filtered batteries when search/filters change
  useEffect(() => {
    const hasSearch = appliedSearch.trim();
    const hasFilters = Object.values(appliedFilters).some(val => val);
    
    if (hasSearch || hasFilters) {
      fetchFilteredBatteries();
    } else {
      // Reset to all batteries if no filters
      fetchBatteries();
    }
  }, [appliedSearch, appliedFilters]);

  // Fetch filtered batteries
  const fetchFilteredBatteries = async () => {
    try {
      setLoading(true);
      const filteredData = await batteryAPI.filterBatteries({
        search: appliedSearch,
        ...appliedFilters
      });
      // Transform and ensure it's an array, filter out null values
      const transformedData = Array.isArray(filteredData) 
        ? filteredData.map(post => transformBatteryData(post)).filter(Boolean)
        : [];
      setBatteries(transformedData);
    } catch (error) {
      console.error('Error fetching filtered batteries:', error);
      setBatteries([]);
    } finally {
      setLoading(false);
    }
  };

  // OPTIONS cho select - ensure batteries is always an array
  const batteries_safe = Array.isArray(batteries) ? batteries : [];
  
  const types = useMemo(
    () =>
      Array.from(
        new Set(
          batteries_safe
            .map((b) => b.batteryDetails?.batteryType)
            .filter(Boolean)
        )
      ).sort(),
    [batteries_safe]
  );

  const sellers = useMemo(
    () =>
      Array.from(new Set(batteries_safe.map((b) => b.sellerName).filter(Boolean))).sort(),
    [batteries_safe]
  );

  // Since filtering is now done by API, just return all batteries
  const filtered = useMemo(() => batteries, [batteries]);

  // Pagination dựa trên filtered
  const totalPages = Math.ceil((filtered.length || 0) / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBatteries = filtered.slice(startIndex, endIndex);

  // Favorite
  const handleFavoriteClick = (batteryId) => {
    setBatteries((prev) =>
      prev.map((b) => (b.id === batteryId ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  };

  // Card click
  const handleCardClick = (battery) => {
    navigate(`/battery/${battery.id}`);
  };

  // Page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset cả draft & applied
  const resetFilters = () => {
    setDraftFilters(initialFilters);
    setDraftSearch("");
    setAppliedFilters(initialFilters);
    setAppliedSearch("");
    setCurrentPage(1);
  };

  // ====== UI ======
  if (loading) {
    return (
      <div className="electrics-page">
        <div className="electrics-header">
          <h1>EV Batteries</h1>
          <p>Explore high-quality EV battery packs and modules</p>
        </div>

        <div className="layout">
          {/* Sidebar skeleton để khung giống vehicles */}
          <aside className="filters skeleton-box" />

          {/* Grid skeleton 12 items */}
          <div className="electrics-grid">
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
    <div className="electrics-page">
      {/* Top bar: Search + quick summary */}
      <div className="topbar">
        <select className="topbar-select" defaultValue="">
          <option value="">— All cities —</option>
          <option>Hà Nội</option>
          <option>TP. HCM</option>
          <option>Đà Nẵng</option>
        </select>

        <input
          className="topbar-search"
          placeholder="Search batteries by type, brand, seller…"
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

      {/* Page header */}
      <div className="electrics-header">
        <h1>EV Batteries</h1>
        <p>
          Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {filtered.length !== batteries.length ? ` (from ${batteries.length})` : ""}
        </p>
      </div>

      <div className="layout">
        {/* Sidebar filters */}
        <aside className="filters">
          <h3>Filter Batteries</h3>

          <label>Battery Type</label>
          <select
            value={draftFilters.type}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, type: e.target.value })
            }
          >
            <option value="">— All —</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label>Condition</label>
          <select
            value={draftFilters.isNew}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, isNew: e.target.value })
            }
          >
            <option value="">— All —</option>
            <option value="new">New</option>
            <option value="used">Used</option>
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

          <label>Capacity (kWh)</label>
          <div className="price-row">
            <input
              type="number"
              placeholder="Min"
              value={draftFilters.minCapacity}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, minCapacity: e.target.value })
              }
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max"
              value={draftFilters.maxCapacity}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, maxCapacity: e.target.value })
              }
            />
          </div>

          <label>Voltage (V)</label>
          <div className="price-row">
            <input
              type="number"
              placeholder="Min"
              value={draftFilters.minVoltage}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, minVoltage: e.target.value })
              }
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max"
              value={draftFilters.maxVoltage}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, maxVoltage: e.target.value })
              }
            />
          </div>

          <label>Cycle Count</label>
          <div className="price-row">
            <input
              type="number"
              placeholder="Min"
              value={draftFilters.minCycles}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, minCycles: e.target.value })
              }
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max"
              value={draftFilters.maxCycles}
              onChange={(e) =>
                setDraftFilters({ ...draftFilters, maxCycles: e.target.value })
              }
            />
          </div>

          <label>Seller</label>
          <select
            value={draftFilters.seller}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, seller: e.target.value })
            }
          >
            <option value="">— All —</option>
            {sellers.map((s) => (
              <option key={s} value={s}>
                {s}
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

        {/* Main content: batteries grid */}
        <div className="electrics-grid">
          {currentBatteries.map((battery) => (
            <MiniPost
              key={battery.id}
              image={battery.image}
              productName={battery.productName}
              basicInfo={battery.basicInfo}
              sellerName={battery.sellerName}
              price={battery.price}
              isNew={battery.isNew}
              isFavorite={battery.isFavorite}
              onFavoriteClick={() => handleFavoriteClick(battery.id)}
              onClick={() => handleCardClick(battery)}
            />
          ))}

          {!currentBatteries.length && (
            <div className="empty">Không tìm thấy pin phù hợp. Hãy điều chỉnh bộ lọc.</div>
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
            {`Showing ${startIndex + 1}-${Math.min(endIndex, filtered.length)} of ${filtered.length} batteries`}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MiniPost from "../../components/miniPost/miniPost";
import Pagination from "../../components/pagination/pagination";
import "../../components/pagination/pagination.css";
import api from "../../config/api";
import "./electricsPage.css";

const ElectricsPage = () => {
  const navigate = useNavigate();
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  const itemsPerPage = 12;

  // Fetch batteries từ API
  useEffect(() => {
    const fetchBatteries = async () => {
      try {
        setLoading(true);
        console.log("📋 Fetching batteries from API...");
        
        const response = await api.get('/api/post/public/batteries');
        
        console.log("📋 API Response:", response.data);
        
        if (response.data && Array.isArray(response.data)) {
          const mappedData = response.data.map(post => {
            // Handle price conversion more carefully
            let processedPrice = 0;
            if (post.price !== null && post.price !== undefined) {
              if (typeof post.price === 'string') {
                processedPrice = parseFloat(post.price.replace(/[^\d.]/g, '')) || 0;
              } else {
                processedPrice = Number(post.price) || 0;
              }
            }
            
            return {
              postID: String(post.postId || ""),
              image: post.thumbnail || (post.imageUrls && post.imageUrls[0]) || "https://via.placeholder.com/400x300/667eea/ffffff?text=Battery+Pack",
              productName: post.title || `${post.battery?.batteryTypeId?.typename || 'Battery'} Pack`,
              basicInfo: [
                post.battery?.batteryTypeId?.typename || 'Li-ion',
                post.battery?.originCapacity ? `${post.battery.originCapacity}kWh` : 'N/A',
                post.battery?.voltage ? `${post.battery.voltage}V` : 'N/A',
                post.battery?.cycleCount ? `${post.battery.cycleCount} cycles` : 'N/A'
              ],
              sellerName: post.location || "Battery Seller",
              price: processedPrice,
              isNew: (post.battery?.cycleCount || 0) < 100, // Consider low cycle count as "new"
            isFavorite: false,
            // Additional battery info for detail view
            batteryDetails: {
              serialNumber: post.battery?.serialNumber,
              originCapacity: post.battery?.originCapacity,
              remainingCapacity: post.battery?.remainingCapacity,
              mileageCovered: post.battery?.mileageCovered,
              voltage: post.battery?.voltage,
              cycleCount: post.battery?.cycleCount,
              warranty: post.battery?.warranty,
              weight: post.battery?.weight,
              lifeCycle: post.battery?.lifeCycle,
              batteryType: post.battery?.batteryTypeId?.typename,
              technical: post.battery?.batteryTypeId?.technical,
              description: post.battery?.batteryTypeId?.description
            }
          };
          });
          
          setBatteries(mappedData);
          console.log("✅ Batteries loaded:", mappedData.length);
        } else {
          console.log("⚠️ No battery data found, using test data");
          // Add test data if no real data
          const testData = [
            {
              postID: "test-1",
              image: "https://via.placeholder.com/400x300/667eea/ffffff?text=Tesla+Battery",
              productName: "Tesla Model S Battery Pack",
              basicInfo: ["Lithium-ion", "100kWh", "400V", "172 cycles"],
              sellerName: "Tesla Parts Dealer",
              price: 15000,
              isNew: true,
              isFavorite: false
            },
            {
              postID: "test-2", 
              image: "https://via.placeholder.com/400x300/10b981/ffffff?text=BMW+Battery",
              productName: "BMW i3 Battery Pack",
              basicInfo: ["Li-ion", "42kWh", "350V"],
              sellerName: "BMW Certified",
              price: 8500,
              isNew: false,
              isFavorite: false
            },
            {
              postID: "test-3",
              image: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Nissan+Battery",
              productName: "Nissan Leaf Battery",
              basicInfo: ["Li-ion", "62kWh", "350V"],
              sellerName: "Green Auto Parts",
              price: 12000,
              isNew: true,
              isFavorite: false
            }
          ];
          setBatteries(testData);
        }
      } catch (error) {
        console.error("❌ Failed to fetch batteries:", error);
        console.log("🔧 Using test data due to API error");
        // Use test data on error
        const errorFallbackData = [
          {
            postID: "test-1",
            image: "https://via.placeholder.com/400x300/667eea/ffffff?text=Tesla+Battery",
            productName: "Tesla Model S Battery Pack",
            basicInfo: ["Lithium-ion", "100kWh", "400V", "172 cycles"],
            sellerName: "Tesla Parts Dealer", 
            price: 15000,
            isNew: true,
            isFavorite: false
          },
          {
            postID: "test-2", 
            image: "https://via.placeholder.com/400x300/10b981/ffffff?text=BMW+Battery",
            productName: "BMW i3 Battery Pack",
            basicInfo: ["Li-ion", "42kWh", "350V", "256 cycles"],
            sellerName: "BMW Certified",
            price: 8500,
            isNew: false,
            isFavorite: false
          },
          {
            postID: "test-3",
            image: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Nissan+Battery",
            productName: "Nissan Leaf Battery", 
            basicInfo: ["Li-ion", "62kWh", "350V", "68 cycles"],
            sellerName: "Green Auto Parts",
            price: 12000,
            isNew: true,
            isFavorite: false
          }
        ];
        setBatteries(errorFallbackData);
        console.log("🧪 Test data loaded with prices:", [15000, 8500, 12000]);
      } finally {
        setLoading(false);
      }
    };

    fetchBatteries();
  }, []);

  // Filter batteries
  const filteredBatteries = batteries.filter(battery =>
    battery.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    battery.basicInfo.some(info => info.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredBatteries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBatteries = filteredBatteries.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBatteryClick = (battery) => {
    navigate(`/electrics/${battery.postID}`);
  };

  const formatPrice = (price) => {
    if (!price || price === null || price === undefined) return "Contact for Price";
    
    let numPrice;
    if (typeof price === 'string') {
      // Remove any non-numeric characters except decimal point
      const cleanPrice = price.replace(/[^\d.]/g, '');
      numPrice = parseFloat(cleanPrice);
    } else {
      numPrice = Number(price);
    }
    
    if (isNaN(numPrice) || numPrice === 0) return "Contact for Price";
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  return (
    <div className="electrics-page modern-enhanced">
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
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="search-input"
              placeholder="Search by Battery Type, Capacity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  // Trigger search on Enter
                }
              }}
            />
          </div>
          
          <button className="search-btn" onClick={() => {}}>
            Search
          </button>
        </div>
      </div>

      {/* Compact Header */}
      <div className="compact-header">
        <h1>Electric Batteries</h1>
        <p>Quality batteries for electric vehicles</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading batteries...</p>
        </div>
      )}

      {/* Results Header */}
      {!loading && (
        <div className="results-header">
          <div className="results-info">
            <h2>Electric Battery Collection</h2>
            <p className="results-count">
              {filteredBatteries.length} batter{filteredBatteries.length !== 1 ? "ies" : "y"} available
              {filteredBatteries.length !== batteries.length && (
                <span className="filter-indicator"> (filtered from {batteries.length})</span>
              )}
              {searchTerm && <span className="search-term"> for "{searchTerm}"</span>}
            </p>
          </div>
          
          <div className="view-controls">
            <button className="view-btn active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              Grid
            </button>
          </div>
        </div>
      )}

      {/* Main Layout */}
      {!loading && (
        <div className="layout enhanced-layout">
          {/* Sidebar Filters */}
          <aside className="filters modern-filters">
            <div className="filters-header">
              <h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
                </svg>
                Battery Filters
              </h3>
              <button className="clear-filters" onClick={() => setSearchTerm("")}>
                Clear All
              </button>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
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

            <div className="filter-group">
              <label className="filter-label">Capacity Range (kWh)</label>
              <div className="range-group">
                <input type="number" placeholder="Min kWh" className="range-input" />
                <span className="range-separator">to</span>
                <input type="number" placeholder="Max kWh" className="range-input" />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Price Range ($)</label>
              <div className="range-group">
                <input type="number" placeholder="Min Price" className="range-input" />
                <span className="range-separator">to</span>
                <input type="number" placeholder="Max Price" className="range-input" />
              </div>
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
                  onFavoriteClick={() => {}}
                  onClick={() => handleBatteryClick(battery)}
                />
              ))}

              {currentBatteries.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
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
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredBatteries.length)} of {filteredBatteries.length} batteries
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default ElectricsPage;
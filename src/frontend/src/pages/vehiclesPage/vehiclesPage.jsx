import React, { useEffect, useMemo, useState } from "react";
import MiniPost from "../../components/miniPost/miniPost";
import Pagination from "../../components/pagination/pagination";
import "./vehiclesPage.css";
import { useNavigate } from "react-router-dom";

// ===== Mock data (giữ nguyên của bạn, chỉ dán lại) =====
const mockVehiclesData = [
  {
    postID: "VH001",
    batteryType: "Lithium-ion",
    brand: "Tesla",
    model: "Model 3",
    version: "Standard Range Plus",
    status: "new",
    odo: 0,
    batteryCapacity: "75 kWh",
    range: "448 km",
    chargingTime: "8h (AC) / 30min (DC)",
    color: "Pearl White",
    numberOfSeat: 5,
    style: "Sedan",
    image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400",
    sellerName: "Nguyễn Văn A",
    price: 1200000000,
    isFavorite: false,
    year: 2024,
  },
  {
    postID: "VH002",
    batteryType: "LFP",
    brand: "VinFast",
    model: "VF8",
    version: "Plus",
    status: "old",
    odo: 15000,
    batteryCapacity: "87.7 kWh",
    range: "420 km",
    chargingTime: "7h (AC) / 35min (DC)",
    color: "Ocean Blue",
    numberOfSeat: 7,
    style: "SUV",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
    sellerName: "Trần Thị B",
    price: 1350000000,
    isFavorite: true,
    year: 2022,
  },
  {
    postID: "VH003",
    batteryType: "Lithium-ion",
    brand: "BMW",
    model: "iX3",
    version: "xDrive30",
    status: "new",
    odo: 0,
    batteryCapacity: "80 kWh",
    range: "460 km",
    chargingTime: "7.5h (AC) / 34min (DC)",
    color: "Mineral Grey",
    numberOfSeat: 5,
    style: "SUV",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400",
    sellerName: "Lê Văn C",
    price: 2100000000,
    isFavorite: false,
    year: 2024,
  },
  {
    postID: "VH004",
    batteryType: "Lithium-ion",
    brand: "Hyundai",
    model: "Kona Electric",
    version: "Premium",
    status: "old",
    odo: 25000,
    batteryCapacity: "64 kWh",
    range: "305 km",
    chargingTime: "9.5h (AC) / 47min (DC)",
    color: "Pulse Red",
    numberOfSeat: 5,
    style: "Crossover",
    image: "https://images.unsplash.com/photo-1617654112656-f5d77f16fc71?w=400",
    sellerName: "Phạm Thị D",
    price: 820000000,
    isFavorite: false,
    year: 2020,
  },
  {
    postID: "VH005",
    batteryType: "Lithium-ion",
    brand: "Audi",
    model: "e-tron GT",
    version: "Quattro",
    status: "new",
    odo: 0,
    batteryCapacity: "93.4 kWh",
    range: "388 km",
    chargingTime: "5.5h (AC) / 22min (DC)",
    color: "Daytona Grey",
    numberOfSeat: 4,
    style: "Coupe",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400",
    sellerName: "Hoàng Văn E",
    price: 4500000000,
    isFavorite: true,
    year: 2025,
  },
  {
    postID: "VH006",
    batteryType: "Lithium-ion",
    brand: "Nissan",
    model: "Leaf",
    version: "e+ Tekna",
    status: "old",
    odo: 18000,
    batteryCapacity: "62 kWh",
    range: "226 km",
    chargingTime: "11.5h (AC) / 60min (DC)",
    color: "Gun Metallic",
    numberOfSeat: 5,
    style: "Hatchback",
    image:

      "data:image/webp;base64,UklGRiAwAABXRUJQVlA4IBQwAADQ4wCdASrAAf0APp1EnEslo6knqJHsiSATiWduH65M5uMXlWxt51xv39X3P/qtZ+XjeG/…", // rút gọn cho ngắn

    sellerName: "Võ Thị F",
    price: 950000000,
    isFavorite: false,
    year: 2021,
  },
  {
    postID: "VH007",
    batteryType: "Lithium-ion",
    brand: "Porsche",
    model: "Taycan",
    version: "Turbo",
    status: "old",
    odo: 8000,
    batteryCapacity: "93.4 kWh",
    range: "450 km",
    chargingTime: "5.5h (AC) / 22min (DC)",
    color: "Racing Yellow",
    numberOfSeat: 4,
    style: "Sedan",
    image:
      "https://www.motortrend.com/uploads/2022/12/2023-Porsche-Taycan-GTS-001.jpg",
    sellerName: "Đặng Văn G",
    price: 6200000000,
    isFavorite: false,
    year: 2023,
  },
  {
    postID: "VH008",
    batteryType: "Lithium-ion",
    brand: "Mercedes-Benz",
    model: "EQS",
    version: "450+",
    status: "new",
    odo: 0,
    batteryCapacity: "107.8 kWh",
    range: "770 km",
    chargingTime: "6h (AC) / 31min (DC)",
    color: "Obsidian Black",
    numberOfSeat: 5,
    style: "Sedan",
    image:
      "https://tla-image.azureedge.net/api/v1/image/vehicle/Car/Mercedes-Benz/Mercedes-Benz/2/123889/1256",
    sellerName: "Bùi Thị H",
    price: 5500000000,
    isFavorite: true,
    year: 2024,
  },
  {
    postID: "VH009",
    batteryType: "LFP",
    brand: "VinFast",
    model: "VF6",
    version: "Plus",
    status: "old",
    odo: 12000,
    batteryCapacity: "59.6 kWh",
    range: "380 km",
    chargingTime: "8.5h (AC) / 40min (DC)",
    color: "Deep Ocean Blue",
    numberOfSeat: 5,
    style: "Crossover",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    sellerName: "Ngô Văn I",
    price: 765000000,
    isFavorite: false,
    year: 2022,
  },
  {
    postID: "VH010",
    batteryType: "Lithium-ion",
    brand: "Ford",
    model: "Mustang Mach-E",
    version: "Extended Range",
    status: "new",
    odo: 0,
    batteryCapacity: "98.8 kWh",
    range: "491 km",
    chargingTime: "6.5h (AC) / 38min (DC)",
    color: "Rapid Red",
    numberOfSeat: 5,
    style: "SUV",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400",
    sellerName: "Đinh Thị K",
    price: 1650000000,
    isFavorite: false,
    year: 2024,
  },
  {
    postID: "VH011",
    batteryType: "Lithium-ion",
    brand: "Lucid",
    model: "Air",
    version: "Dream Edition",
    status: "new",
    odo: 0,
    batteryCapacity: "118 kWh",
    range: "832 km",
    chargingTime: "4.5h (AC) / 20min (DC)",
    color: "Stellar White",
    numberOfSeat: 5,
    style: "Sedan",
    image: "https://images.unsplash.com/photo-1619976215249-4d1c3b3e3db4?w=400",
    sellerName: "Trương Văn L",
    price: 7800000000,
    isFavorite: true,
    year: 2025,
  },
  {
    postID: "VH012",
    batteryType: "Lithium-ion",
    brand: "Jaguar",
    model: "I-PACE",
    version: "HSE",
    status: "old",
    odo: 22000,
    batteryCapacity: "90 kWh",
    range: "470 km",
    chargingTime: "7h (AC) / 40min (DC)",
    color: "Yulong White",
    numberOfSeat: 5,
    style: "SUV",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400",
    sellerName: "Lý Thị M",
    price: 3200000000,
    isFavorite: false,
    year: 2021,
  },
  {
    postID: "VH012",
    batteryType: "Lithium-ion",
    brand: "Jaguar",
    model: "I-PACE",
    version: "HSE",
    status: "old",
    odo: 22000,
    batteryCapacity: "90 kWh",
    range: "470 km",
    chargingTime: "7h (AC) / 40min (DC)",
    color: "Yulong White",
    numberOfSeat: 5,
    style: "SUV",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400",
    sellerName: "Lý Thị M",
    price: 3200000000,
    isFavorite: false,
  },
  {
    postID: "VH012",
    batteryType: "Lithium-ion",
    brand: "Jaguar",
    model: "I-PACE",
    version: "HSE",
    status: "old",
    odo: 22000,
    batteryCapacity: "90 kWh",
    range: "470 km",
    chargingTime: "7h (AC) / 40min (DC)",
    color: "Yulong White",
    numberOfSeat: 5,
    style: "SUV",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400",
    sellerName: "Lý Thị M",
    price: 3200000000,
    isFavorite: false,
  },
];

const ITEMS_PER_PAGE = 12;

export default function VehiclesPage() {
  // data + loading
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // search + filters
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    color: "",
    style: "",
    status: "", // new | old
    seats: "", // 4 | 5 | 7 ...
    minPrice: "",
    maxPrice: "",
    year: "",
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // fake fetch
  useEffect(() => {
    (async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      setVehicles(mockVehiclesData);
      setLoading(false);
    })();
  }, []);

  // derive options từ data
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
    () => Array.from(new Set(vehicles.map((v) => v.numberOfSeat))).sort((a, b) => a - b),
    [vehicles]
  );
  const years = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.year))).sort((a, b) => b - a),
    [vehicles]
  );

  // lọc + search
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return vehicles.filter((v) => {
      const matchSearch =
        !s ||
        `${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(s) ||
        v.sellerName.toLowerCase().includes(s);

      const inBrand = !filters.brand || v.brand === filters.brand;
      const inModel = !filters.model || v.model === filters.model;
      const inColor = !filters.color || v.color === filters.color;
      const inStyle = !filters.style || v.style === filters.style;
      const inStatus = !filters.status || v.status === filters.status;
      const inSeats = !filters.seats || String(v.numberOfSeat) === String(filters.seats);
      const inYear = !filters.year || String(v.year) === String(filters.year);

      const minOK = !filters.minPrice || v.price >= Number(filters.minPrice);
      const maxOK = !filters.maxPrice || v.price <= Number(filters.maxPrice);

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
  }, [vehicles, search, filters]);

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
    setFilters({
      brand: "",
      model: "",
      color: "",
      style: "",
      status: "",
      seats: "",
      minPrice: "",
      maxPrice: "",
      year: "",
    });
    setSearch("");
    setCurrentPage(1);
  };


  // pagination buttons (giữ logic gọn)
  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    if (currentPage > 1)
      pages.push(
        <button key="prev" className="pg-btn pg-nav" onClick={() => handlePageChange(currentPage - 1)}>
          ‹
        </button>
      );

    if (start > 1) {
      pages.push(
        <button key={1} className="pg-btn" onClick={() => handlePageChange(1)}>
          1
        </button>
      );
      if (start > 2) pages.push(<span key="e1" className="pg-ellipsis">…</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`pg-btn ${i === currentPage ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="e2" className="pg-ellipsis">…</span>);
      pages.push(
        <button key={totalPages} className="pg-btn" onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </button>
      );
    }

    if (currentPage < totalPages)
      pages.push(
        <button key="next" className="pg-btn pg-nav" onClick={() => handlePageChange(currentPage + 1)}>
          ›
        </button>
      );
    return pages;
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
        <input
          className="topbar-search"
          placeholder="Search by Brand, Model, Seller…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button className="topbar-btn" onClick={() => setCurrentPage(1)}>Search</button>
      </div>

      <div className="vehicles-header">
        <h1>Electric Vehicles</h1>
        <p>
          Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}{filtered.length !== vehicles.length ? ` (from ${vehicles.length})` : ""}
        </p>
      </div>

      <div className="layout">
        {/* Sidebar filters */}
        <aside className="filters">
          <h3>Filter Electric Cars</h3>

          <label>Brand</label>
          <select
            value={filters.brand}
            onChange={(e) => { setFilters({ ...filters, brand: e.target.value, model: "" }); setCurrentPage(1); }}
          >
            <option value="">— All —</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          <label>Model</label>
          <select
            value={filters.model}
            onChange={(e) => { setFilters({ ...filters, model: e.target.value }); setCurrentPage(1); }}
          >
            <option value="">— All —</option>
            {models
              .filter((m) => !filters.brand || vehicles.some(v => v.brand === filters.brand && v.model === m))
              .map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <label>Color</label>
          <select
            value={filters.color}
            onChange={(e) => { setFilters({ ...filters, color: e.target.value }); setCurrentPage(1); }}
          >
            <option value="">— All —</option>
            {colors.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <label>Style</label>
          <select
            value={filters.style}
            onChange={(e) => { setFilters({ ...filters, style: e.target.value }); setCurrentPage(1); }}
          >
            <option value="">— All —</option>
            {styles.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setCurrentPage(1); }}
          >
            <option value="">— All —</option>
            <option value="new">New</option>
            <option value="old">Used</option>
          </select>

          <label>Seats</label>
          <select
            value={filters.seats}
            onChange={(e) => { setFilters({ ...filters, seats: e.target.value }); setCurrentPage(1); }}
          >
            <option value="">— All —</option>
            {seats.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <label>Price range (VND)</label>
          <div className="price-row">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              onBlur={() => setCurrentPage(1)}
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              onBlur={() => setCurrentPage(1)}
            />
          </div>

          <label>Year of Manufacture</label>
          <select
            value={filters.year}
            onChange={(e) => { setFilters({ ...filters, year: e.target.value }); setCurrentPage(1); }}
          >
            <option value="">— All —</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <div className="filter-actions">
            <button className="btn-apply" onClick={() => setCurrentPage(1)}>Apply Filter</button>
            <button className="btn-reset" onClick={resetFilters}>Reset</button>
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
            <div className="empty">
              Không tìm thấy xe phù hợp. Hãy điều chỉnh bộ lọc.
            </div>
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
            Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of {filtered.length} vehicles
          </div>
        </div>
      )}
    </div>
  );
}

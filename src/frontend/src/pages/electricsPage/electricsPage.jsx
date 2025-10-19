import React, { useEffect, useMemo, useState } from "react";
import MiniPost from "../../components/miniPost/miniPost";
import Pagination from "../../components/pagination/pagination";
import "./electricsPage.css";

// Mock data cho pin điện (giữ nguyên của bạn)
const mockElectricsData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558618047-3c8c6c8b1c0e?w=400",
    productName: "Tesla Model S Battery Pack",
    basicInfo: ["Li-ion", "85kWh", "8000 cycles"],
    sellerName: "Tesla Service Center",
    price: 450000000,
    isNew: true,
    isFavorite: false,
    batteryDetails: {
      batteryType: "Lithium-ion",
      serialNumber: "TSL-85-2023-001",
      originalCapacity: "85kWh",
      remainingCapacity: "82kWh",
      mileageCovered: "15000km",
      voltage: "400V",
      cycleCount: 245,
      warranty: "8 năm",
      weight: "540kg",
      lifeCycle: "8000 cycles"
    }
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1620935235621-9b2ac3086999?w=400",
    productName: "VinFast VF8 Battery Module",
    basicInfo: ["LFP", "87.7kWh", "6000 cycles"],
    sellerName: "VinFast Official",
    price: 380000000,
    isNew: false,
    isFavorite: true,
    batteryDetails: {
      batteryType: "LiFePO4",
      serialNumber: "VF8-87-2023-012",
      originalCapacity: "87.7kWh",
      remainingCapacity: "84.2kWh",
      mileageCovered: "28000km",
      voltage: "355V",
      cycleCount: 456,
      warranty: "10 năm",
      weight: "485kg",
      lifeCycle: "6000 cycles"
    }
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400",
    productName: "BMW iX3 Battery Pack",
    basicInfo: ["NCM", "80kWh", "2500 cycles"],
    sellerName: "BMW Service",
    price: 520000000,
    isNew: true,
    isFavorite: false,
    batteryDetails: {
      batteryType: "NCM (Nickel Cobalt Manganese)",
      serialNumber: "BMW-IX3-80-024",
      originalCapacity: "80kWh",
      remainingCapacity: "79.1kWh",
      mileageCovered: "8500km",
      voltage: "400V",
      cycleCount: 128,
      warranty: "8 năm",
      weight: "510kg",
      lifeCycle: "2500 cycles"
    }
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1564866657315-503d0c136fc3?w=400",
    productName: "Hyundai Kona Electric Battery",
    basicInfo: ["Li-ion", "64kWh", "3000 cycles"],
    sellerName: "Hyundai Motors",
    price: 320000000,
    isNew: false,
    isFavorite: false,
    batteryDetails: {
      batteryType: "Lithium-ion Polymer",
      serialNumber: "HYU-KE-64-089",
      originalCapacity: "64kWh",
      remainingCapacity: "58.9kWh",
      mileageCovered: "45000km",
      voltage: "356V",
      cycleCount: 782,
      warranty: "8 năm",
      weight: "457kg",
      lifeCycle: "3000 cycles"
    }
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400",
    productName: "Audi e-tron GT Battery",
    basicInfo: ["Li-ion", "93.4kWh", "2800 cycles"],
    sellerName: "Audi Center Vietnam",
    price: 680000000,
    isNew: true,
    isFavorite: true,
    batteryDetails: {
      batteryType: "Lithium-ion",
      serialNumber: "AUD-GT-93-156",
      originalCapacity: "93.4kWh",
      remainingCapacity: "91.8kWh",
      mileageCovered: "12000km",
      voltage: "800V",
      cycleCount: 198,
      warranty: "8 năm",
      weight: "630kg",
      lifeCycle: "2800 cycles"
    }
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
    productName: "Mercedes EQS Battery Pack",
    basicInfo: ["NCM", "107.8kWh", "3200 cycles"],
    sellerName: "Mercedes-Benz Vietnam",
    price: 750000000,
    isNew: false,
    isFavorite: false,
    batteryDetails: {
      batteryType: "NCM811",
      serialNumber: "MER-EQS-107-203",
      originalCapacity: "107.8kWh",
      remainingCapacity: "103.2kWh",
      mileageCovered: "22000km",
      voltage: "400V",
      cycleCount: 365,
      warranty: "10 năm",
      weight: "695kg",
      lifeCycle: "3200 cycles"
    }
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    productName: "Porsche Taycan Battery",
    basicInfo: ["Li-ion", "93.4kWh", "2600 cycles"],
    sellerName: "Porsche Center",
    price: 850000000,
    isNew: true,
    isFavorite: false,
    batteryDetails: {
      batteryType: "Lithium-ion",
      serialNumber: "POR-TAY-93-078",
      originalCapacity: "93.4kWh",
      remainingCapacity: "92.1kWh",
      mileageCovered: "9800km",
      voltage: "800V",
      cycleCount: 156,
      warranty: "8 năm",
      weight: "625kg",
      lifeCycle: "2600 cycles"
    }
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=400",
    productName: "Nissan Leaf Battery Module",
    basicInfo: ["Li-Mn", "62kWh", "2200 cycles"],
    sellerName: "Nissan Vietnam",
    price: 280000000,
    isNew: false,
    isFavorite: true,
    batteryDetails: {
      batteryType: "Lithium Manganese Oxide",
      serialNumber: "NIS-LEF-62-445",
      originalCapacity: "62kWh",
      remainingCapacity: "54.8kWh",
      mileageCovered: "68000km",
      voltage: "360V",
      cycleCount: 1245,
      warranty: "8 năm",
      weight: "303kg",
      lifeCycle: "2200 cycles"
    }
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
    productName: "Jaguar I-PACE Battery",
    basicInfo: ["Li-ion", "90kWh", "2400 cycles"],
    sellerName: "Jaguar Land Rover",
    price: 580000000,
    isNew: false,
    isFavorite: false,
    batteryDetails: {
      batteryType: "Lithium-ion Pouch",
      serialNumber: "JAG-IPC-90-321",
      originalCapacity: "90kWh",
      remainingCapacity: "86.7kWh",
      mileageCovered: "31000km",
      voltage: "400V",
      cycleCount: 523,
      warranty: "8 năm",
      weight: "606kg",
      lifeCycle: "2400 cycles"
    }
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=400",
    productName: "Volvo XC40 Recharge Battery",
    basicInfo: ["NCM", "78kWh", "2800 cycles"],
    sellerName: "Volvo Cars Vietnam",
    price: 420000000,
    isNew: true,
    isFavorite: false,
    batteryDetails: {
      batteryType: "NCM622",
      serialNumber: "VOL-XC40-78-167",
      originalCapacity: "78kWh",
      remainingCapacity: "76.2kWh",
      mileageCovered: "16500km",
      voltage: "400V",
      cycleCount: 287,
      warranty: "8 năm",
      weight: "520kg",
      lifeCycle: "2800 cycles"
    }
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400",
    productName: "Kia EV6 Battery Pack",
    basicInfo: ["NCM", "77.4kWh", "3000 cycles"],
    sellerName: "Kia Motors Vietnam",
    price: 390000000,
    isNew: false,
    isFavorite: true,
    batteryDetails: {
      batteryType: "NCM811",
      serialNumber: "KIA-EV6-77-254",
      originalCapacity: "77.4kWh",
      remainingCapacity: "73.1kWh",
      mileageCovered: "35000km",
      voltage: "800V",
      cycleCount: 612,
      warranty: "10 năm",
      weight: "477kg",
      lifeCycle: "3000 cycles"
    }
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=400",
    productName: "Ford Mustang Mach-E Battery",
    basicInfo: ["NCM", "88kWh", "2700 cycles"],
    sellerName: "Ford Vietnam",
    price: 490000000,
    isNew: true,
    isFavorite: false,
    batteryDetails: {
      batteryType: "NCM811",
      serialNumber: "FOR-MCE-88-132",
      originalCapacity: "88kWh",
      remainingCapacity: "85.6kWh",
      mileageCovered: "19000km",
      voltage: "400V",
      cycleCount: 334,
      warranty: "8 năm",
      weight: "580kg",
      lifeCycle: "2700 cycles"
    }
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=400",
    productName: "Ford Mustang Mach-E Battery",
    basicInfo: ["NCM", "88kWh", "2700 cycles"],
    sellerName: "Ford Vietnam",
    price: 490000000,
    isNew: true,
    isFavorite: false,
    batteryDetails: {
      batteryType: "NCM811",
      serialNumber: "FOR-MCE-88-132",
      originalCapacity: "88kWh",
      remainingCapacity: "85.6kWh",
      mileageCovered: "19000km",
      voltage: "400V",
      cycleCount: 334,
      warranty: "8 năm",
      weight: "580kg",
      lifeCycle: "2700 cycles"
    }
  },
  {
    id: 14,
    image: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=400",
    productName: "Ford Mustang Mach-E Battery",
    basicInfo: ["NCM", "88kWh", "2700 cycles"],
    sellerName: "Ford Vietnam",
    price: 490000000,
    isNew: true,
    isFavorite: false,
    batteryDetails: {
      batteryType: "NCM811",
      serialNumber: "FOR-MCE-88-132",
      originalCapacity: "88kWh",
      remainingCapacity: "85.6kWh",
      mileageCovered: "19000km",
      voltage: "400V",
      cycleCount: 334,
      warranty: "8 năm",
      weight: "580kg",
      lifeCycle: "2700 cycles"
    }
  },
];

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

  // Fetch giả lập
  useEffect(() => {
    (async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      setBatteries(mockElectricsData);
      setLoading(false);
    })();
  }, []);

  // OPTIONS cho select
  const types = useMemo(
    () =>
      Array.from(
        new Set(
          batteries
            .map((b) => b.batteryDetails?.batteryType)
            .filter(Boolean)
        )
      ).sort(),
    [batteries]
  );

  const sellers = useMemo(
    () =>
      Array.from(new Set(batteries.map((b) => b.sellerName).filter(Boolean))).sort(),
    [batteries]
  );

  // FILTER chỉ dựa trên APPLIED
  const filtered = useMemo(() => {
    const s = appliedSearch.trim().toLowerCase();
    const f = appliedFilters;

    return batteries.filter((b) => {
      const name = (b.productName || "").toLowerCase();
      const seller = (b.sellerName || "").toLowerCase();
      const type = b.batteryDetails?.batteryType || "";

      const capacity = parseNumber(b.batteryDetails?.originalCapacity); // kWh
      const voltage = parseNumber(b.batteryDetails?.voltage);           // V
      const cycles = Number(b.batteryDetails?.cycleCount ?? NaN);

      const matchSearch = !s || name.includes(s) || seller.includes(s);
      const matchType = !f.type || type === f.type;

      const matchIsNew =
        !f.isNew ||
        (f.isNew === "new" && b.isNew === true) ||
        (f.isNew === "used" && b.isNew === false);

      const priceOKMin = !f.minPrice || b.price >= Number(f.minPrice);
      const priceOKMax = !f.maxPrice || b.price <= Number(f.maxPrice);

      const capOKMin = !f.minCapacity || (!isNaN(capacity) && capacity >= Number(f.minCapacity));
      const capOKMax = !f.maxCapacity || (!isNaN(capacity) && capacity <= Number(f.maxCapacity));

      const voltOKMin = !f.minVoltage || (!isNaN(voltage) && voltage >= Number(f.minVoltage));
      const voltOKMax = !f.maxVoltage || (!isNaN(voltage) && voltage <= Number(f.maxVoltage));

      const cyclesOKMin = !f.minCycles || (!isNaN(cycles) && cycles >= Number(f.minCycles));
      const cyclesOKMax = !f.maxCycles || (!isNaN(cycles) && cycles <= Number(f.maxCycles));

      const sellerOK = !f.seller || b.sellerName === f.seller;

      return (
        matchSearch &&
        matchType &&
        matchIsNew &&
        priceOKMin &&
        priceOKMax &&
        capOKMin &&
        capOKMax &&
        voltOKMin &&
        voltOKMax &&
        cyclesOKMin &&
        cyclesOKMax &&
        sellerOK
      );
    });
  }, [batteries, appliedSearch, appliedFilters]);

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
    console.log("Clicked battery:", battery.id);
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
    placeholder="Search by product or seller…"
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

   <div className="electrics-header">
  <h1>EV Batteries</h1>
  <p>Explore high-quality EV battery packs and modules</p>
</div>

      <div className="layout">
        {/* Sidebar Filters (dùng draft*) */}
        <aside className="filters">
          <h3>Filter Batteries</h3>

          <label>Type</label>
          <select
            value={draftFilters.type}
            onChange={(e) => setDraftFilters({ ...draftFilters, type: e.target.value })}
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
            onChange={(e) => setDraftFilters({ ...draftFilters, isNew: e.target.value })}
          >
            <option value="">— All —</option>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>

          <label>Seller</label>
          <select
            value={draftFilters.seller}
            onChange={(e) => setDraftFilters({ ...draftFilters, seller: e.target.value })}
          >
            <option value="">— All —</option>
            {sellers.map((s) => (
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
              onChange={(e) => setDraftFilters({ ...draftFilters, minPrice: e.target.value })}
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max"
              value={draftFilters.maxPrice}
              onChange={(e) => setDraftFilters({ ...draftFilters, maxPrice: e.target.value })}
            />
          </div>

          <label>Capacity (kWh)</label>
          <div className="price-row">
            <input
              type="number"
              placeholder="Min"
              value={draftFilters.minCapacity}
              onChange={(e) => setDraftFilters({ ...draftFilters, minCapacity: e.target.value })}
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max"
              value={draftFilters.maxCapacity}
              onChange={(e) => setDraftFilters({ ...draftFilters, maxCapacity: e.target.value })}
            />
          </div>

          <label>Voltage (V)</label>
          <div className="price-row">
            <input
              type="number"
              placeholder="Min"
              value={draftFilters.minVoltage}
              onChange={(e) => setDraftFilters({ ...draftFilters, minVoltage: e.target.value })}
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max"
              value={draftFilters.maxVoltage}
              onChange={(e) => setDraftFilters({ ...draftFilters, maxVoltage: e.target.value })}
            />
          </div>

          <label>Cycle count</label>
          <div className="price-row">
            <input
              type="number"
              placeholder="Min"
              value={draftFilters.minCycles}
              onChange={(e) => setDraftFilters({ ...draftFilters, minCycles: e.target.value })}
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max"
              value={draftFilters.maxCycles}
              onChange={(e) => setDraftFilters({ ...draftFilters, maxCycles: e.target.value })}
            />
          </div>

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

        {/* Grid */}
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
            <div className="empty">No batteries found. Try adjusting the filters.</div>
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

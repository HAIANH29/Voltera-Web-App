import React, { useState, useEffect } from "react";
import MiniPost from "../../components/miniPost/miniPost";
import "./vehiclesPage.css";

// Mock data cho xe điện dựa trên thuộc tính Vehicle
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
      "data:image/webp;base64,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",
    sellerName: "Võ Thị F",
    price: 950000000,
    isFavorite: false,
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
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setVehicles(mockVehiclesData);
      setLoading(false);
    };

    fetchVehicles();
  }, []);

  // Tính toán pagination
  const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVehicles = vehicles.slice(startIndex, endIndex);

  // Xử lý favorite
  const handleFavoriteClick = (postID) => {
    setVehicles((prev) =>
      prev.map((vehicle) =>
        vehicle.postID === postID
          ? { ...vehicle, isFavorite: !vehicle.isFavorite }
          : vehicle
      )
    );
  };

  // Xử lý click vào card
  const handleCardClick = (vehicle) => {
    console.log("Clicked vehicle:", vehicle);
    // navigate(`/vehicles/${vehicle.postID}`);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format basic info từ thuộc tính Vehicle
  const formatBasicInfo = (vehicle) => {
    return [
      `${vehicle.batteryType}`,
      `${vehicle.numberOfSeat} chỗ`,
      `${vehicle.range}`,
      vehicle.odo > 0 ? `${vehicle.odo.toLocaleString()} km` : "Mới",
    ];
  };

  // Format product name từ thuộc tính Vehicle
  const formatProductName = (vehicle) => {
    return `${vehicle.brand} ${vehicle.model} ${vehicle.version}`;
  };

  // Render pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="pagination-btn pagination-nav"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ‹
        </button>
      );
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pagination-btn"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === currentPage ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          className="pagination-btn"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="pagination-btn pagination-nav"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          ›
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="vehicles-page">
        <div className="vehicles-header">
          <h1>Electric Vehicles</h1>
          <p>Explore modern electric vehicle models</p>
        </div>
        <div className="loading-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="loading-card">
              <div className="loading-image"></div>
              <div className="loading-content">
                <div className="loading-line long"></div>
                <div className="loading-line medium"></div>
                <div className="loading-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="vehicles-page">
      {/* Header */}
      <div className="vehicles-header">
        <h1>Electric Vehicles</h1>
        <p>Explore {vehicles.length} modern electric vehicle models</p>
      </div>

      {/* Vehicles Grid */}
      <div className="vehicles-grid">
        {currentVehicles.map((vehicle) => (
          <MiniPost
            key={vehicle.postID}
            image={vehicle.image}
            productName={formatProductName(vehicle)}
            basicInfo={formatBasicInfo(vehicle)}
            sellerName={vehicle.sellerName}
            price={vehicle.price}
            isNew={vehicle.status === "new"}
            isFavorite={vehicle.isFavorite}
            onFavoriteClick={() => handleFavoriteClick(vehicle.postID)}
            onClick={() => handleCardClick(vehicle)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">{renderPagination()}</div>
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(endIndex, vehicles.length)} of{" "}
            {vehicles.length} electric vehicles
          </div>
        </div>
      )}
    </div>
  );
}

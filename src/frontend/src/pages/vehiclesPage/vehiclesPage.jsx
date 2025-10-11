import React, { useState, useEffect } from "react";
import MiniPost from "../../components/miniPost/miniPost";
import Pagination from "../../components/pagination/pagination";
import "./vehiclesPage.css";
import { useNavigate } from "react-router-dom";

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
      "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400",
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
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    navigate(`/vehicles/${vehicle.postID}`);
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
          <div className="pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(endIndex, vehicles.length)} of{" "}
            {vehicles.length} electric vehicles
          </div>
        </div>
      )}
    </div>
  );
}

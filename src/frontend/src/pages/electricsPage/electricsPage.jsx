import React, { useState, useEffect } from "react";
import MiniPost from "../../components/miniPost/miniPost";
import Pagination from "../../components/pagination/pagination";
import "./electricsPage.css";

// Mock data cho pin điện
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

const ITEMS_PER_PAGE = 12; // 4x3 grid

export default function ElectricsPage() {
  const [batteries, setBatteries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập việc fetch data
    const fetchBatteries = async () => {
      setLoading(true);
      // Giả lập delay API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBatteries(mockElectricsData);
      setLoading(false);
    };

    fetchBatteries();
  }, []);

  // Tính toán pagination
  const totalPages = Math.ceil(batteries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBatteries = batteries.slice(startIndex, endIndex);

  // Xử lý favorite
  const handleFavoriteClick = (batteryId) => {
    setBatteries(prev =>
      prev.map(battery =>
        battery.id === batteryId
          ? { ...battery, isFavorite: !battery.isFavorite }
          : battery
      )
    );
  };

  // Xử lý click vào card
  const handleCardClick = (battery) => {
    console.log("Clicked battery:", battery);
    // Có thể navigate đến trang chi tiết
    // navigate(`/batteries/${battery.id}`);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="electrics-page">
        <div className="electrics-header">
          <h1>Pin Điện</h1>
          <p>Khám phá các loại pin xe điện chất lượng cao</p>
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
    <div className="electrics-page">
      {/* Header */}
      <div className="electrics-header">
        <h1>Pin Điện</h1>
        <p>Khám phá {batteries.length} loại pin xe điện chất lượng cao và bền bỉ</p>
      </div>

      {/* Batteries Grid */}
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
            Hiển thị {startIndex + 1}-{Math.min(endIndex, batteries.length)} trong tổng số {batteries.length} pin điện
          </div>
        </div>
      )}
    </div>
  );
}
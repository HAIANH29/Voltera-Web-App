import React from "react";
import ContractList from "../../components/contract/contractList";

export default function ContractsPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý hợp đồng</h1>
        <p className="text-gray-600 mt-1">
          Xem và quản lý tất cả hợp đồng mua bán của bạn
        </p>
      </div>
      
      <ContractList />
    </div>
  );
}
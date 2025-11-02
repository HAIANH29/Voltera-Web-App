import React from "react";
import ContractList from "../../components/contract/contractList";

export default function ContractsPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Contract Management
        </h1>
        <p className="text-gray-600 mt-1">
          View and manage all your sales contracts
        </p>
      </div>

      <ContractList />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import api from "../../config/api";
import Cookies from "js-cookie";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import ContractInfoPreview from "../contractInfoPreview/ContractInfoPreview";
import PostInfo from "../postInfo/postInfo";
import "./contractPreview.css";

export default function ContractPreview({ postId, contractId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [contractData, setContractData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Get token from cookies like in headerAfter
  const token = Cookies.get("accessToken");

  // Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/me");
      setCurrentUser(res.data);
      console.log("👤 Current user:", res.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // Fetch contract data for preview with cleanup
  useEffect(() => {
    // Reset state when contractId or postId changes
    setContractData(null);
    setPostData(null);
    setLoading(false);
    
    console.log("🔄 ContractPreview useEffect triggered:", { contractId, postId });
    
    // Fetch current user info
    fetchCurrentUser();
    
    if (contractId) {
      fetchContractData();
    } else if (postId) {
      fetchPostData();
    }
  }, [contractId, postId]);

  const fetchContractData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/contract/${contractId}`);
      const contractInfo = res.data;
      setContractData(contractInfo);
      
      console.log("📋 Contract data loaded:", {
        contractId: contractInfo.contractId,
        postId: contractInfo.postId,
        contractType: contractInfo.contractType,
        postTitle: contractInfo.postTitle,
        sellerName: contractInfo.sellerName,
        buyerName: contractInfo.buyerName
      });
      
      // If contract has postId, always fetch fresh post data to ensure correct display
      if (contractInfo.postId) {
        console.log("🔄 Fetching post data for contract:", contractInfo.postId);
        try {
          const postRes = await api.get(`/api/post/detail/${contractInfo.postId}`);
          const rawPostData = postRes.data;
          
          // Add type detection to postData
          const enhancedData = {
            ...rawPostData,
            type: rawPostData.battery ? 'battery' : rawPostData.vehicle ? 'vehicle' : 'unknown'
          };
          
          console.log("📊 Post data loaded from contract:", {
            postId: contractInfo.postId,
            hasBattery: !!rawPostData.battery,
            hasVehicle: !!rawPostData.vehicle,
            detectedType: enhancedData.type,
            rawData: rawPostData
          });
          
          setPostData(enhancedData);
        } catch (postErr) {
          console.error("Error fetching post data from contract:", postErr);
        }
      }
    } catch (err) {
      console.error("Error fetching contract:", err);
      alert("Unable to load contract information.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPostData = async () => {
    try {
      const res = await api.get(`/api/post/detail/${postId}`);
      const rawData = res.data;
      
      // Add type detection to postData
      const enhancedData = {
        ...rawData,
        type: rawData.battery ? 'battery' : rawData.vehicle ? 'vehicle' : 'unknown'
      };
      
      console.log("📊 Post data loaded:", {
        postId: postId,
        hasBattery: !!rawData.battery,
        hasVehicle: !!rawData.vehicle,
        detectedType: enhancedData.type,
        rawData: rawData
      });
      
      setPostData(enhancedData);
    } catch (err) {
      console.error("Error fetching post data:", err);
    }
  };

  // Check if current user is the buyer
  const isCurrentUserBuyer = () => {
    if (!currentUser || !contractData) return false;
    
    // API /me returns { username, roles }
    // Primary check: username comparison
    const usernameMatch = currentUser.username === contractData.buyerEmail || 
                         currentUser.username === contractData.buyerName ||
                         currentUser.username === contractData.buyerUsername;
    
    // Secondary check: if user has BUYER role
    const hasRole = currentUser.roles && currentUser.roles.some(role => 
      role.authority === 'ROLE_BUYER' || role.authority === 'BUYER'
    );
    
    console.log("🔍 Buyer check:", {
      currentUser: currentUser,
      contractData: contractData,
      usernameMatch: usernameMatch,
      hasRole: hasRole,
      roles: currentUser.roles,
      usernameVsBuyerEmail: currentUser.username === contractData.buyerEmail,
      usernameVsBuyerName: currentUser.username === contractData.buyerName,
      usernameVsBuyerUsername: currentUser.username === contractData.buyerUsername
    });
    
    // For now, use username match as primary logic
    // Can be enhanced later with better buyer identification
    return usernameMatch;
  };

  // Check if current user is the seller
  const isCurrentUserSeller = () => {
    if (!currentUser || !contractData) return false;
    
    // API /me returns { username, roles }
    // Primary check: username comparison
    const usernameMatch = currentUser.username === contractData.sellerEmail || 
                         currentUser.username === contractData.sellerName ||
                         currentUser.username === contractData.sellerUsername;
    
    // Secondary check: if user has SELLER role
    const hasRole = currentUser.roles && currentUser.roles.some(role => 
      role.authority === 'ROLE_SELLER' || role.authority === 'SELLER'
    );
    
    console.log("🔍 Seller check:", {
      currentUser: currentUser,
      contractData: contractData,
      usernameMatch: usernameMatch,
      hasRole: hasRole,
      roles: currentUser.roles,
      usernameVsSellerEmail: currentUser.username === contractData.sellerEmail,
      usernameVsSellerName: currentUser.username === contractData.sellerName,
      usernameVsSellerUsername: currentUser.username === contractData.sellerUsername
    });
    
    // For now, use username match as primary logic
    // Can be enhanced later with better seller identification
    return usernameMatch;
  };

  // Show contract preview modal
  const showContractPreview = () => {
    setShowPreview(true);
  };

  // Handle contract creation from modal (called after user confirms)
  const handleContractCreated = (newContractData) => {
    setContractData(newContractData);
    setShowPreview(false);
    // Refresh contract data to get latest info
    if (newContractData.contractId) {
      fetchContractData(newContractData.contractId);
    }
  };

  // Sign contract
  const signContract = async () => {
    try {
      setIsSigning(true);
      await api.put(`/api/contract/${contractData.contractId}/sign`);

      // Refresh contract data after signing
      await fetchContractData();
      alert("Contract signed successfully!");
    } catch (err) {
      console.error("Error signing contract:", err);
      alert("Unable to sign contract, please try again.");
    } finally {
      setIsSigning(false);
    }
  };

  // Cancel contract
  const cancelContract = async () => {
    try {
      console.log("🔥 [Cancel] Starting cancel contract...");
      console.log("🔥 [Cancel] Contract ID:", contractData.contractId);
      console.log("🔥 [Cancel] Token:", token ? "Present" : "Missing");

      setIsCanceling(true);

      const response = await api.put(
        `/api/contract/${contractData.contractId}/cancel`
      );

      console.log("✅ [Cancel] Success response:", response.data);

      // Refresh contract data after canceling
      await fetchContractData();
      alert("Contract canceled successfully!");
    } catch (err) {
      console.error("❌ [Cancel] Error canceling contract:", err);
      console.error("❌ [Cancel] Error response:", err.response?.data);
      console.error("❌ [Cancel] Error status:", err.response?.status);

      // Show specific error message
      const errorMessage =
        err.response?.data?.message || err.message || "Unknown error";
      alert(`Unable to cancel contract: ${errorMessage}`);
    } finally {
      setIsCanceling(false);
    }
  };

  // Handle Pay Now button
  const handlePayNow = async () => {
    try {
      setIsPaymentLoading(true);

      // Create transaction ID from contract
      const response = await api.post(
        `/api/contract/${contractData.contractId}/create-payment`
      );
      const transactionId = response.data;

      if (!transactionId) {
        throw new Error("Unable to create payment transaction");
      }

      // Get postId from multiple sources
      const paymentPostId = postData?.postId || postId || contractData.postId;
      
      // Build payment URL
      let paymentUrl = `/payment?contractId=${contractData.contractId}&transactionId=${transactionId}`;
      
      if (paymentPostId) {
        paymentUrl += `&postId=${paymentPostId}`;
      }
      
      if (postData?.price && postData.price > 0) {
        paymentUrl += `&amount=${postData.price}`;
      }
      
      // Use window.location.href to navigate
      window.location.href = paymentUrl;
    } catch (err) {
      console.error("Error creating payment:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Unable to create payment";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  // Download contract as DOCX
  const downloadContract = async () => {
    try {
      if (!contractData) {
        alert("No contract data to download.");
        return;
      }

      // Check if both parties have signed
      if (!contractData.signedByBuyer || !contractData.signedBySeller) {
        alert(
          "Cannot download contract! Both buyer and seller must sign before downloading."
        );
        return;
      }

      setLoading(true);
      console.log("🚀 Starting contract download process...");
      console.log("📋 Contract Data:", contractData);
      console.log("🚗 Post Data:", postData);

      // 2️⃣ Determine contract type and get appropriate template
      // Enhanced detection: check contractData for post type as well
      const hasBatteryInPost = !!postData?.battery;
      const postType = postData?.type;
      const contractPostTitle = contractData?.postTitle || postData?.title || '';
      const isBatteryByTitle = contractPostTitle.toLowerCase().includes('battery') || 
                               contractPostTitle.toLowerCase().includes('pin') ||
                               contractPostTitle.toLowerCase().includes('electric battery');
      
      // Multiple ways to detect battery contract
      const isBattery = hasBatteryInPost || 
                        postType === 'battery' || 
                        isBatteryByTitle ||
                        (contractData?.contractType && contractData.contractType === 'battery');
      
      const templatePath = isBattery 
        ? "/templates/contract/ElectricContract.docx"
        : "/templates/contract/VehicleContract.docx";
      
      console.log("🔍 Enhanced contract type detection:", {
        postData: postData,
        contractData: contractData,
        hasBatteryInPost: hasBatteryInPost,
        postType: postType,
        contractPostTitle: contractPostTitle,
        isBatteryByTitle: isBatteryByTitle,
        contractType: contractData?.contractType,
        finalIsBattery: isBattery,
        templatePath: templatePath,
        postDataKeys: postData ? Object.keys(postData) : 'no postData',
        batteryData: postData?.battery ? 'has battery data' : 'no battery data'
      });
      
      console.log("🔍 Fetching DOCX template from:", templatePath);
      const fileRes = await fetch(templatePath, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      console.log("📄 Template response:", {
        status: fileRes.status,
        statusText: fileRes.statusText,
        ok: fileRes.ok,
        headers: Object.fromEntries(fileRes.headers.entries())
      });

      if (!fileRes.ok) {
        console.error(`❌ Template file request failed: ${fileRes.status} ${fileRes.statusText}`);
        console.log("🔄 Falling back to text download...");
        downloadContractAsText();
        return;
      }

      console.log("✅ Template found, processing DOCX...");
      const buffer = await fileRes.arrayBuffer();
      console.log("📦 Template buffer size:", buffer.byteLength);

      if (buffer.byteLength === 0) {
        console.error("❌ Template file is empty");
        downloadContractAsText();
        return;
      }

      console.log("🔧 Creating PizZip instance...");
      const zip = new PizZip(buffer);
      
      console.log("📝 Creating Docxtemplater instance...");
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // 3️⃣ Prepare data for rendering - Comprehensive data mapping
      const vehicle = postData?.vehicle || {};
      const battery = postData?.battery || {};
      
      console.log("📋 Raw contract data for mapping:", {
        contractData: contractData,
        postData: postData,
        vehicle: vehicle,
        battery: battery,
        emails: {
          sellerEmail: contractData?.sellerEmail,
          buyerEmail: contractData?.buyerEmail
        }
      });
      
      let renderData;
      
      if (isBattery) {
        // Battery contract data mapping
        renderData = {
          // Contract info
          contractId: contractData.contractId || "N/A",
          signedDate: contractData.signedDate
            ? new Date(contractData.signedDate).toLocaleDateString("en-US")
            : "Not signed yet",
          contractSigningDate: contractData.signedDate
            ? new Date(contractData.signedDate).toLocaleDateString("en-US")
            : "Not signed yet",

          // Seller info  
          sellerName: contractData.sellerName || "N/A",
          sellerEmail: contractData.sellerEmail || "seller@voltera.com",
          sellerSigned: contractData.signedBySeller ? "Signed" : "Not signed",
          sellerSignedStatus: contractData.signedBySeller ? "✅ Signed" : "❌ Not signed",

          // Buyer info
          buyerName: contractData.buyerName || "N/A", 
          buyerEmail: contractData.buyerEmail || "buyer@voltera.com",
          buyerSigned: contractData.signedByBuyer ? "Signed" : "Not signed",
          buyerSignedStatus: contractData.signedByBuyer ? "✅ Signed" : "❌ Not signed",

          // Battery info (handle both originCapacity and originalCapacity)
          title: contractData.postTitle || postData?.title || "Battery Pack",
          serialNumber: battery.serialNumber || "N/A",
          originalCapacity: battery.originCapacity || battery.originalCapacity || "N/A",
          remainingCapacity: battery.remainingCapacity || "N/A",
          voltage: battery.voltage || "N/A",
          cycleCount: battery.cycleCount || "0",
          warranty: battery.warranty || "N/A",
          weight: battery.weight || "N/A",
          mileageCovered: battery.mileageCovered || "0",
          batteryType: battery.batteryTypeId?.typename || battery.batteryType || "Li-ion",
          price: postData?.price ? `$${postData.price.toLocaleString()}` : "Contact for price",
          
          // Contract status
          contractStatus: contractData.contractStatus || "PENDING",
          
          // Current date
          date: new Date().toLocaleDateString("en-US"),
          currentDate: new Date().toLocaleDateString("en-US"),
          todayDate: new Date().toLocaleDateString("en-US"),
        };
      } else {
        // Vehicle contract data mapping
        renderData = {
          // Contract info
          contractId: contractData.contractId || "N/A",
          signedDate: contractData.signedDate
            ? new Date(contractData.signedDate).toLocaleDateString("vi-VN")
            : "Not signed yet",
          contractSigningDate: contractData.signedDate
            ? new Date(contractData.signedDate).toLocaleDateString("vi-VN")
            : "Not signed yet",

          // Seller info  
          sellerName: contractData.sellerName || "N/A",
          sellerEmail: contractData.sellerEmail || "seller@voltera.com",
          sellerSigned: contractData.signedBySeller ? "Signed" : "Not signed",
          sellerSignedStatus: contractData.signedBySeller ? "✅ Signed" : "❌ Not signed",

          // Buyer info
          buyerName: contractData.buyerName || "N/A", 
          buyerEmail: contractData.buyerEmail || "buyer@voltera.com",
          buyerSigned: contractData.signedByBuyer ? "Signed" : "Not signed",
          buyerSignedStatus: contractData.signedByBuyer ? "✅ Signed" : "❌ Not signed",

          // Vehicle info
          title: contractData.postTitle || postData?.title || "N/A",
          batteryCapacity: vehicle.batterycapacity
            ? `${vehicle.batterycapacity} kWh`
            : "N/A",
          odo: vehicle.odo ? `${vehicle.odo} km` : "N/A",
          price: postData?.price
            ? new Intl.NumberFormat("vi-VN").format(postData.price) + " VND"
            : "N/A",

          // Additional fields that might be in template
          brand: vehicle.brand || "N/A",
          model: vehicle.model || "N/A", 
          year: vehicle.yearManufacture || "N/A",
          color: vehicle.color || "N/A",
          
          // Contract status
          contractStatus: contractData.contractStatus || "PENDING",
          
          // Current date
          date: new Date().toLocaleDateString("vi-VN"),
          currentDate: new Date().toLocaleDateString("vi-VN"),
          todayDate: new Date().toLocaleDateString("vi-VN"),
        };
      }

      console.log("🎯 Render data for contract:", renderData);
      console.log("📋 Contract data debug:", {
        contractId: contractData.contractId,
        signedDate: contractData.signedDate,
        signedBySeller: contractData.signedBySeller,
        signedByBuyer: contractData.signedByBuyer,
        contractStatus: contractData.contractStatus,
        sellerName: contractData.sellerName,
        buyerName: contractData.buyerName
      });

      // 4️⃣ Render data with error handling
      console.log("🔄 Rendering template with data...");
      try {
        doc.render(renderData);
        console.log("✅ Template rendered successfully");
      } catch (renderError) {
        console.error("❌ Template render error:", renderError);
        console.error("❌ Render error details:", {
          message: renderError.message,
          properties: renderError.properties,
          stack: renderError.stack
        });
        throw new Error(`Template rendering failed: ${renderError.message}`);
      }

      // 5️⃣ Export file with comprehensive error handling
      console.log("📦 Generating DOCX blob...");
      let blob;
      try {
        const zipOutput = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        blob = zipOutput;
        console.log("✅ DOCX blob generated successfully");
      } catch (zipError) {
        console.error("❌ ZIP generation error:", zipError);
        throw new Error(`Failed to generate DOCX file: ${zipError.message}`);
      }

      console.log("💾 Downloading DOCX file...");
      console.log("📁 Blob details:", {
        size: blob.size,
        type: blob.type
      });

      if (blob.size === 0) {
        throw new Error("Generated DOCX file is empty");
      }

      const fileName = isBattery 
        ? `BatterySalesContract_${contractData.contractId}_${new Date().toISOString().split("T")[0]}.docx`
        : `VehicleSalesContract_${contractData.contractId}_${new Date().toISOString().split("T")[0]}.docx`;
      
      console.log("📄 Saving file as:", fileName);
      saveAs(blob, fileName);
      
      console.log("🎉 DOCX download completed successfully!");
      alert(`${isBattery ? 'Battery' : 'Vehicle'} contract downloaded successfully!`);
      
    } catch (err) {
      console.error("❌ Error downloading DOCX contract:", err);
      console.error("❌ Error details:", {
        message: err.message,
        name: err.name,
        stack: err.stack
      });

      // Show specific error to user  
      const errorMsg = err.message || "Unknown error occurred";
      alert(`DOCX creation failed: ${errorMsg}\n\nDownloading as text file instead...`);

      // Fallback if error with DOCX
      try {
        downloadContractAsText();
      } catch (fallbackError) {
        console.error("❌ Even fallback failed:", fallbackError);
        alert("Unable to download contract in any format. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fallback: Download contract as text file
  const downloadContractAsText = () => {
    try {
      // Check if both parties have signed
      if (!contractData.signedByBuyer || !contractData.signedBySeller) {
        alert(
          "Cannot download contract! Both buyer and seller must sign before downloading."
        );
        return;
      }

      const vehicle = postData?.vehicle || {};
      const battery = postData?.battery || {};
      
      // Use same enhanced detection logic as DOCX download
      const hasBatteryInPost = !!postData?.battery;
      const postType = postData?.type;
      const contractPostTitle = contractData?.postTitle || postData?.title || '';
      const isBatteryByTitle = contractPostTitle.toLowerCase().includes('battery') || 
                               contractPostTitle.toLowerCase().includes('pin') ||
                               contractPostTitle.toLowerCase().includes('electric battery');
      
      const isBattery = hasBatteryInPost || 
                        postType === 'battery' || 
                        isBatteryByTitle ||
                        (contractData?.contractType && contractData.contractType === 'battery');
      
      console.log("📄 Text contract type detection:", {
        hasBatteryInPost, postType, isBatteryByTitle, 
        finalIsBattery: isBattery, contractPostTitle
      });

      const contractText = `
SOCIALIST REPUBLIC OF VIETNAM
Independence - Freedom - Happiness
----------------------------------

${isBattery ? 'ELECTRIC BATTERY SALES CONTRACT' : 'ELECTRIC VEHICLE SALES CONTRACT'}

Today, ${
        contractData.signedDate
          ? new Date(contractData.signedDate).toLocaleDateString("en-US")
          : new Date().toLocaleDateString("en-US")
      }, through the Voltera system, we include:

SELLER (Party A):
Full name: ${contractData.sellerName || "N/A"}
Email: ${contractData.sellerEmail || "seller@voltera.com"}
Post owner: ${contractData.postTitle || postData?.title || "N/A"}

BUYER (Party B):
Full name: ${contractData.buyerName || "N/A"}
Email: ${contractData.buyerEmail || "buyer@voltera.com"}

Together agreed to sign an ${isBattery ? 'electric battery' : 'electric vehicle'} sales contract with the following terms:

${isBattery ? `Article 1. Electric battery information
• Battery name: ${contractData.postTitle || postData?.title || "N/A"}
• Serial number: ${battery.serialNumber || "N/A"}
• Original capacity: ${battery.originCapacity || battery.originalCapacity || "N/A"} kWh
• Remaining capacity: ${battery.remainingCapacity || "N/A"} kWh
• Voltage: ${battery.voltage || "N/A"}V
• Cycle count: ${battery.cycleCount || "0"}
• Mileage covered: ${battery.mileageCovered || "0"} km
• Sale price: ${
        postData?.price
          ? new Intl.NumberFormat("en-US").format(postData.price)
          : "N/A"
      } USD` : `Article 1. Electric vehicle information
• Vehicle name: ${contractData.postTitle || postData?.title || "N/A"}
• Battery capacity: ${
        vehicle.batterycapacity ? `${vehicle.batterycapacity} kWh` : "N/A"
      }
• Mileage: ${vehicle.odo || "0"} km
• Sale price: ${
        postData?.price
          ? new Intl.NumberFormat("en-US").format(postData.price)
          : "N/A"
      } USD`}

Article 2. Rights and obligations of the Seller
1. The seller commits that the ${isBattery ? 'electric battery' : 'electric vehicle'} is legally owned, without disputes, mortgages, or pledges.
2. The seller is responsible for providing all documents proving the origin and condition of the ${isBattery ? 'battery' : 'vehicle'}.
3. The seller must deliver the ${isBattery ? 'battery' : 'vehicle'} on time and as described in the listing.

Article 3. Rights and obligations of the Buyer
1. The buyer is responsible for full and timely payment as agreed.
2. The buyer is responsible for carefully inspecting the ${isBattery ? 'battery' : 'vehicle'} condition before taking delivery.
3. The buyer bears full responsibility for the ${isBattery ? 'battery' : 'vehicle'} after completing the transaction.

Article 4. General terms
1. Both parties commit to fully comply with all terms of this contract.
2. This contract is effective from when both parties confirm and sign on the Voltera system.
3. In case of disputes, both parties will resolve through negotiation, if unsuccessful, will be brought to competent authorities for resolution.

Contract number: ${contractData.contractId}
Status: ${contractData.contractStatus}
Created date: ${new Date().toLocaleDateString("en-US")}

SELLER (Signature): ${
        contractData.signedBySeller ? "✅ Signed" : "❌ Not signed"
      }

BUYER (Signature): ${contractData.signedByBuyer ? "✅ Signed" : "❌ Not signed"}

---
Created by Voltera system
`;

      // Create text file and download
      const blob = new Blob([contractText], {
        type: "text/plain;charset=utf-8",
      });
      const fileName = isBattery 
        ? `BatterySalesContract_${contractData.contractId}_${new Date().toISOString().split("T")[0]}.txt`
        : `VehicleSalesContract_${contractData.contractId}_${new Date().toISOString().split("T")[0]}.txt`;
      
      saveAs(blob, fileName);
      alert(`${isBattery ? 'Battery' : 'Vehicle'} contract text downloaded successfully!`);
    } catch (err) {
      console.error("Error creating text contract:", err);
      alert("Unable to create contract. Please try again.");
    }
  };

  if (loading && !contractData) {
    return (
      <div className="contract-preview">
        <div className="contract-header">
          <h2>Loading contract information...</h2>
        </div>
        <div className="contract-loading">
          <div className="contract-skeleton">
            <div className="contract-skeleton-line"></div>
            <div className="contract-skeleton-line medium"></div>
            <div className="contract-skeleton-line short"></div>
            <div className="contract-skeleton-line"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contract-preview">
      <div className="contract-header contract-header--relative">
        <h2>Contract Information</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="contract-close-btn"
          >
            ✕ Close
          </button>
        )}
      </div>

      <div className="contract-content">
        {/* Contract Preview */}
        {contractData ? (
          <>
            <div className="contract-details">
              <h3>Contract Details</h3>
              <div className="contract-info-grid">
                <div className="contract-info-section">
                  <div className="contract-info-item">
                    <span className="contract-info-label">Contract ID</span>
                    <span className="contract-info-value">
                      #{contractData.contractId}
                    </span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Seller</span>
                    <span className="contract-info-value">
                      {contractData.sellerName}
                    </span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Buyer</span>
                    <span className="contract-info-value">
                      {contractData.buyerName}
                    </span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Post</span>
                    <span className="contract-info-value">
                      {contractData.postTitle}
                    </span>
                  </div>
                  {/* Post Information - Using PostInfo Component */}
                  <PostInfo postData={postData} contractData={contractData} />
                </div>
                <div className="contract-info-section">
                  <div className="contract-info-item">
                    <span className="contract-info-label">Status</span>
                    <span
                      className={`contract-status-badge ${contractData.contractStatus.toLowerCase()}`}
                    >
                      {contractData.contractStatus}
                    </span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Buyer Signed</span>
                    <span
                      className={`contract-sign-status ${
                        contractData.signedByBuyer ? "signed" : "unsigned"
                      }`}
                    >
                      {contractData.signedByBuyer
                        ? "✅ Signed"
                        : "❌ Not signed"}
                    </span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Seller Signed</span>
                    <span
                      className={`contract-sign-status ${
                        contractData.signedBySeller ? "signed" : "unsigned"
                      }`}
                    >
                      {contractData.signedBySeller
                        ? "✅ Signed"
                        : "❌ Not signed"}
                    </span>
                  </div>
                  {contractData.signedDate && (
                    <div className="contract-info-item">
                      <span className="contract-info-label">Signed Date</span>
                      <span className="contract-info-value">
                        {new Date(contractData.signedDate).toLocaleDateString(
                          "en-US"
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {contractData.terms && (
                <div className="contract-terms">
                  <h4>Contract Terms</h4>
                  <p>{contractData.terms}</p>
                </div>
              )}
            </div>

            {/* Download Status Info */}
            <div className="contract-download-info">
              {contractData.signedByBuyer && contractData.signedBySeller ? (
                <div className="contract-info-card success">
                  <div className="contract-info-icon">🎉</div>
                  <div className="contract-info-text">
                    <strong>Contract completed!</strong>
                    <p>
                      Both parties have signed the contract. You can download
                      the contract now.
                    </p>
                    <div className="contract-progress-status">
                      <span>Status:</span>
                      <ul>
                        <li className="completed">✅ Seller signed</li>
                        <li className="completed">✅ Buyer signed</li>
                        <li className="completed">🔓 Download available</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="contract-info-card">
                  <div className="contract-info-icon">ℹ️</div>
                  <div className="contract-info-text">
                    <strong>Note about contract download:</strong>
                    <p>
                      Contract can only be downloaded when both buyer and seller
                      have signed.
                    </p>
                    <div className="contract-progress-status">
                      <span>Current status:</span>
                      <ul>
                        <li
                          className={
                            contractData.signedBySeller
                              ? "completed"
                              : "pending"
                          }
                        >
                          {contractData.signedBySeller ? "✅" : "⏳"} Seller
                        </li>
                        <li
                          className={
                            contractData.signedByBuyer ? "completed" : "pending"
                          }
                        >
                          {contractData.signedByBuyer ? "✅" : "⏳"} Buyer
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="contract-actions">
              {/* Sign Contract Button */}
              {contractData.contractStatus === "PENDING" &&
                !contractData.signedByBuyer && (
                  <button
                    onClick={signContract}
                    disabled={isSigning}
                    className="contract-btn primary"
                  >
                    {isSigning && <div className="contract-btn-spinner"></div>}
                    {isSigning ? "Signing..." : "✍️ Sign Contract"}
                  </button>
                )}

              {/* Download Contract Button - Only if both parties signed */}
              {contractData.signedByBuyer && contractData.signedBySeller ? (
                <button
                  onClick={downloadContract}
                  disabled={loading}
                  className="contract-btn secondary"
                >
                  {loading && <div className="contract-btn-spinner"></div>}
                  {loading ? "Generating..." : "📄 Download Contract"}
                </button>
              ) : (
                <button
                  disabled={true}
                  className="contract-btn outline"
                  title="Contract can only be downloaded when both parties have signed"
                >
                  🔒 Download Contract (Waiting for signatures)
                </button>
              )}

              {/* Pay Now Button - Only if both parties signed AND current user is buyer */}
              {contractData.signedByBuyer && contractData.signedBySeller && isCurrentUserBuyer() && (
                <button
                  onClick={handlePayNow}
                  disabled={isPaymentLoading}
                  className="contract-btn success pay-now-btn"
                >
                  {isPaymentLoading && (
                    <div className="contract-btn-spinner"></div>
                  )}
                  {isPaymentLoading ? "Redirecting..." : "💳 Pay Now"}
                </button>
              )}

              {/* Cancel Contract Button */}
              {(() => {
                console.log(
                  "🔍 [Render] Contract status:",
                  contractData.contractStatus
                );
                console.log(
                  "🔍 [Render] Should show cancel button:",
                  contractData.contractStatus === "PENDING"
                );
                console.log("🔍 [Render] Contract data:", contractData);
                return contractData.contractStatus === "PENDING";
              })() && (
                <button
                  onClick={() => {
                    console.log("🖱️ [Click] Cancel button clicked");
                    console.log("🖱️ [Click] isCanceling state:", isCanceling);
                    if (
                      window.confirm(
                        "Are you sure you want to cancel this contract? This action cannot be undone."
                      )
                    ) {
                      console.log("✅ [Confirm] User confirmed cancel");
                      cancelContract();
                    } else {
                      console.log("❌ [Confirm] User cancelled");
                    }
                  }}
                  disabled={isCanceling}
                  className="contract-btn danger contract-btn--debug"
                >
                  {isCanceling && <div className="contract-btn-spinner"></div>}
                  {isCanceling ? "Canceling..." : "❌ Cancel Contract"}
                </button>
              )}


            </div>
          </>
        ) : (
          // Create New Contract
          <div className="contract-create-new">
            <div className="contract-create-icon">📝</div>
            <p>No contract exists for this post yet.</p>
            <button
              onClick={showContractPreview}
              disabled={isCreating}
              className="contract-btn primary"
            >
              📋 Preview & Create Contract
            </button>
          </div>
        )}
      </div>

      {/* Contract Info Preview Modal */}
      <ContractInfoPreview
        postId={postId}
        vehicleData={
          postData
            ? {
                postID: String(postData.postId || ""),
                title: postData.title || "",
                brand: postData.vehicle?.brand || "",
                model: postData.vehicle?.model || "",
                version: postData.vehicle?.version || "",
                year: postData.vehicle?.yearManufacture || "",
                color: postData.vehicle?.color || "",
                odo: postData.vehicle?.odo || 0,
                batteryCapacity: postData.vehicle?.batterycapacity
                  ? `${postData.vehicle.batterycapacity} kWh`
                  : "",
                range: postData.vehicle?.range
                  ? `${postData.vehicle.range} km`
                  : "",
                price: postData.price || 0,
                seller: {
                  address: postData.location || "",
                },
              }
            : null
        }
        show={showPreview}
        onCreateContract={handleContractCreated}
        onCancel={() => setShowPreview(false)}
      />
    </div>
  );
}

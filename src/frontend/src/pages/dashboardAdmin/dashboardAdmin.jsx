// ⚡ MODERN ADMIN DASHBOARD - ALL-IN-ONE FILE ⚡
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import "./modernDashboard.css";
import toast from "react-hot-toast";

// 🎨 Modern SVG Icons
const Icons = {
  Dashboard: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z"
      />
    </svg>
  ),
  Users: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
      />
    </svg>
  ),
  Posts: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14-4H9m4 8H9m8 4H9m-4-8h.01M5 16h.01"
      />
    </svg>
  ),
  Accounts: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Analytics: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  Search: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Bell: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-5 5-5-5h5z"
      />
    </svg>
  ),
  Settings: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  ChevronUp: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  ),
  ChevronDown: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  ),
  Refresh: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
  Eye: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  X: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  Lock: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  ),
  Unlock: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
      />
    </svg>
  ),
  Electric: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  Car: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 6H4L2 4v4l15 1v4c0 1-1 2-2 2H5c-1 0-2-1-2-2v-4"
      />
    </svg>
  ),
  DollarSign: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  ),
  MessageCircle: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  ),
};

export default function DashboardAdmin() {
  // � Hooks
  const navigate = useNavigate();

  // �📊 States
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    pendingPosts: 0,
    totalUsers: 0,
    pendingAccounts: 0,
  });
  const [pendingListings, setPendingListings] = useState([]);
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [approvedAccounts, setApprovedAccounts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 💰 Fee Management States
  const [fees, setFees] = useState([]);
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeStats, setFeeStats] = useState({
    totalFees: 0,
    paidFees: 0,
    pendingFees: 0,
    expiredFees: 0,
    totalRevenue: 0,
  });

  // 🔗 Navigation Configuration
  const navigationItems = [
    {
      section: "main",
      title: "Main",
      items: [{ id: "overview", label: "Overview", icon: Icons.Dashboard }],
    },
    {
      section: "management",
      title: "Management",
      items: [
        {
          id: "listings",
          label: "Listings",
          icon: Icons.Posts,
          badge: pendingListings.length,
        },
        {
          id: "accounts",
          label: "Accounts",
          icon: Icons.Accounts,
          badge: pendingAccounts.length,
        },
        { id: "users", label: "Users", icon: Icons.Users },
        { id: "fees", label: "Fee Management", icon: Icons.DollarSign },
        { id: "complaints", label: "Complaints", icon: Icons.MessageCircle },
      ],
    },
  ];

  // 🚀 Load Data Effects
  useEffect(() => {
    loadDashboardData();
    // 🧪 Test admin auth with a simple call
    testAdminAuth();
  }, []);

  const testAdminAuth = async () => {
    try {
      console.log("🧪 Testing admin auth...");
      const response = await api.get("/api/v1/admin/accounts/all");
      console.log("✅ Admin auth works! User count:", response.data?.length);
    } catch (error) {
      console.log(
        "❌ Admin auth failed:",
        error.response?.status,
        error.response?.data
      );
    }
  };
  useEffect(() => {
    switch (activeSection) {
      case "listings":
        loadPendingListings();
        break;
      case "accounts":
        loadPendingAccounts();
        break;
      case "activeUsers":
        loadApprovedAccounts();
        break;
      case "users":
        loadAllUsers();
        break;
      case "complaints":
        loadComplaints();
        break;
      case "fees":
        loadFees();
        break;
    }
  }, [activeSection]);

  // 📈 API Functions
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 🔍 Debug authentication
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
      };

      const token = getCookie("accessToken");
      console.log("🔐 Admin token exists:", !!token);
      console.log(
        "🔐 Token preview:",
        token ? token.substring(0, 20) + "..." : "No token"
      );
      console.log("🌐 API Base URL:", import.meta.env.VITE_BACK_END_BASE_URL);

      // 🔍 Debug API calls
      console.log("📡 Making API calls to:");
      console.log("  - api/post/admin/list/pending");
      console.log("  - /api/v1/admin/accounts/pending");

      const [postsRes, accountsRes] = await Promise.all([
        api.get("api/post/admin/list/pending"),
        api.get("/api/v1/admin/accounts/pending"),
      ]);

      console.log("✅ API calls successful!");
      console.log("📊 Full Posts response:", postsRes);
      console.log("📊 Posts response status:", postsRes.status);
      console.log("📊 Posts response data:", postsRes.data);
      console.log(
        "📊 Posts type:",
        typeof postsRes.data,
        "isArray:",
        Array.isArray(postsRes.data)
      );
      console.log("👥 Full Accounts response:", accountsRes);
      console.log("👥 Accounts response status:", accountsRes.status);
      console.log("👥 Accounts response data:", accountsRes.data);
      console.log(
        "👥 Accounts type:",
        typeof accountsRes.data,
        "isArray:",
        Array.isArray(accountsRes.data)
      );
      console.log("📊 Posts response:", postsRes.data);
      console.log(
        "� Posts type:",
        typeof postsRes.data,
        "isArray:",
        Array.isArray(postsRes.data)
      );
      console.log("�👥 Accounts response:", accountsRes.data);
      console.log(
        "👥 Accounts type:",
        typeof accountsRes.data,
        "isArray:",
        Array.isArray(accountsRes.data)
      );

      // 🔍 Debug string content if not array
      if (typeof postsRes.data === "string") {
        console.warn("📄 Posts returned string length:", postsRes.data.length);
        console.warn(
          "📄 Posts returned string (first 500 chars):",
          postsRes.data.substring(0, 500)
        );

        if (postsRes.data.length > 200000) {
          console.warn("⚠️ Very large posts JSON response, might be truncated");
        }

        console.warn("🔧 Attempting to parse posts JSON string...");
        try {
          // Try direct parse first
          const parsedPosts = JSON.parse(postsRes.data);
          console.log("✅ Successfully parsed posts JSON:", parsedPosts);
          postsRes.data = parsedPosts;
        } catch (e) {
          console.error("❌ Failed to parse posts JSON:", e);

          // Try to clean up potential circular references
          let cleanedJson = postsRes.data;

          // Remove obvious circular patterns and nested repetitive structures
          cleanedJson = cleanedJson.replace(
            /,"post":\{"id":\d+,"title":"[^"]*","description":[^}]*$/g,
            ""
          );
          cleanedJson = cleanedJson.replace(
            /,"transactions":\[\{"transactionid":\d+,"post":\{"id":\d+[^}]*$/g,
            ""
          );

          // Fix the specific truncation pattern with repeated }]}
          cleanedJson = cleanedJson.replace(/(\}]\}){10,}$/g, "}]}");
          cleanedJson = cleanedJson.replace(/(\}]{2,})+$/g, "}]");

          // Ensure proper JSON closure
          if (!cleanedJson.endsWith("]") && !cleanedJson.endsWith("}")) {
            const lastValidArray = cleanedJson.lastIndexOf("}]");
            const lastValidObject = cleanedJson.lastIndexOf("}}");

            if (lastValidArray > lastValidObject && lastValidArray > -1) {
              cleanedJson = cleanedJson.substring(0, lastValidArray + 2);
            } else if (lastValidObject > -1) {
              cleanedJson = cleanedJson.substring(0, lastValidObject + 2);
              if (cleanedJson.startsWith("[")) {
                cleanedJson += "]";
              }
            }
          }

          try {
            const cleanedPosts = JSON.parse(cleanedJson);
            console.log("✅ Successfully parsed cleaned posts JSON");
            postsRes.data = Array.isArray(cleanedPosts)
              ? cleanedPosts.filter(
                  (post) =>
                    post &&
                    typeof post === "object" &&
                    post.id &&
                    !post.transactions
                )
              : [];
          } catch (cleanupError) {
            console.error(
              "❌ Posts cleanup also failed:",
              cleanupError.message
            );
            postsRes.data = []; // Fallback to empty array
          }
        }
      }
      if (typeof accountsRes.data === "string") {
        console.warn(
          "📄 Accounts returned string length:",
          accountsRes.data.length
        );
        console.warn(
          "📄 Accounts returned string (first 500 chars):",
          accountsRes.data.substring(0, 500)
        );

        if (accountsRes.data.length > 200000) {
          console.warn(
            "⚠️ Very large accounts JSON response, might be truncated"
          );
        }

        console.warn("🔧 Attempting to parse accounts JSON string...");
        try {
          const parsedAccounts = JSON.parse(accountsRes.data);
          console.log("✅ Successfully parsed accounts JSON:", parsedAccounts);
          accountsRes.data = parsedAccounts;
        } catch (e) {
          console.error("❌ Failed to parse accounts JSON:", e);

          // Apply same cleanup logic for accounts
          let cleanedJson = accountsRes.data;

          // Remove circular patterns specific to accounts/users
          cleanedJson = cleanedJson.replace(/,"posts":\[\{"id":\d+[^}]*$/g, "");
          cleanedJson = cleanedJson.replace(
            /,"user":\{"id":\d+,"username":"[^"]*"[^}]*$/g,
            ""
          );

          // Fix truncation patterns
          cleanedJson = cleanedJson.replace(/(\}]\}){10,}$/g, "}]}");
          cleanedJson = cleanedJson.replace(/(\}]{2,})+$/g, "}]");

          // Ensure proper JSON closure
          if (!cleanedJson.endsWith("]") && !cleanedJson.endsWith("}")) {
            const lastValidArray = cleanedJson.lastIndexOf("}]");
            const lastValidObject = cleanedJson.lastIndexOf("}}");

            if (lastValidArray > lastValidObject && lastValidArray > -1) {
              cleanedJson = cleanedJson.substring(0, lastValidArray + 2);
            } else if (lastValidObject > -1) {
              cleanedJson = cleanedJson.substring(0, lastValidObject + 2);
              if (cleanedJson.startsWith("[")) {
                cleanedJson += "]";
              }
            }
          }

          try {
            const cleanedAccounts = JSON.parse(cleanedJson);
            console.log("✅ Successfully parsed cleaned accounts JSON");
            accountsRes.data = Array.isArray(cleanedAccounts)
              ? cleanedAccounts.filter(
                  (account) =>
                    account &&
                    typeof account === "object" &&
                    account.id &&
                    !account.posts
                )
              : [];
          } catch (cleanupError) {
            console.error(
              "❌ Accounts cleanup also failed:",
              cleanupError.message
            );
            accountsRes.data = []; // Fallback to empty array
          }
        }
      }

      // 🔍 Safe array operations
      const postsData = Array.isArray(postsRes.data) ? postsRes.data : [];
      const accountsData = Array.isArray(accountsRes.data)
        ? accountsRes.data
        : [];

      setStats({
        totalPosts: postsData.length, // Posts từ API pending đã được filter
        pendingPosts: postsData.length, // Tất cả posts từ API đều là PENDING + PAID fee
        totalUsers: accountsData.length,
        pendingAccounts: accountsData.length,
      });
    } catch (error) {
      // 🔍 Better error logging
      console.error("❌ API Error Details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code,
        config: error.config?.url,
      });

      // 🔧 Mock data for testing UI
      setStats({
        totalPosts: 25,
        pendingPosts: 8,
        totalUsers: 1250,
        pendingAccounts: 3,
      });

      // 🎯 Better error message
      let errorMessage = "Failed to load dashboard data";
      if (error.response?.status) {
        errorMessage = `API Error ${error.response.status}: ${
          error.response.data?.message || "Check admin permissions"
        }`;
      } else if (
        error.code === "NETWORK_ERROR" ||
        error.message.includes("Network Error")
      ) {
        errorMessage = "Network Error: Cannot connect to backend server";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Backend server is not running. Please start the backend.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingListings = async () => {
    try {
      setLoading(true);
      console.log("📡 Loading pending listings...");

      // 🔧 Try to request with pagination or limited fields to avoid large responses
      const response = await api.get("api/post/admin/list/pending?limit=50");
      console.log(
        "📝 Pending listings response length:",
        typeof response.data === "string" ? response.data.length : "not string"
      );
      console.log("📝 Pending listings response type:", typeof response.data);

      if (response.data && Array.isArray(response.data)) {
        console.log(
          "🔍 First pending listing item structure:",
          response.data[0]
        );
        console.log("📅 Available date fields in first post:", {
          createdAt: response.data[0]?.createdAt,
          createdat: response.data[0]?.createdat,
          updatedAt: response.data[0]?.updatedAt,
          postDate: response.data[0]?.postDate,
          createDate: response.data[0]?.createDate,
        });

        // 🔄 Sort by ID - highest to lowest (newest posts have higher IDs)
        const sortedPosts = response.data.sort((a, b) => {
          const idA = parseInt(a.postId || a.id || 0);
          const idB = parseInt(b.postId || b.id || 0);
          return idB - idA; // Descending order (higher ID first = newer posts first)
        });

        console.log(
          "✅ Sorted posts by createdAt:",
          sortedPosts.length,
          "posts"
        );
        setPendingListings(sortedPosts);
      } else {
        console.warn("⚠️ Expected array but got:", typeof response.data);
        console.warn("📄 Response data content:", response.data);
        console.warn(
          "📄 First 500 chars:",
          typeof response.data === "string"
            ? response.data.substring(0, 500)
            : response.data
        );

        // 🔧 Try to parse if it's a JSON string
        if (typeof response.data === "string") {
          try {
            console.log(
              "🔧 Attempting to parse JSON string length:",
              response.data.length
            );

            // Check if JSON looks truncated or has circular refs
            if (response.data.length > 100000) {
              console.warn("⚠️ Very large JSON response, might be truncated");
            }

            // Try to clean up potential circular references
            let cleanedJson = response.data;

            // Remove obvious circular patterns and nested repetitive structures
            cleanedJson = cleanedJson.replace(
              /,"post":\{"id":\d+,"title":"[^"]*","description":[^}]*$/g,
              ""
            );
            cleanedJson = cleanedJson.replace(
              /,"transactions":\[\{"transactionid":\d+,"post":\{"id":\d+[^}]*$/g,
              ""
            );

            // Fix the specific truncation pattern with repeated }]}
            cleanedJson = cleanedJson.replace(/(\}]\}){10,}$/g, "}]}");
            cleanedJson = cleanedJson.replace(/(\}]{2,})+$/g, "}]");

            // Ensure proper JSON closure - find last complete object/array
            if (!cleanedJson.endsWith("]") && !cleanedJson.endsWith("}")) {
              // Find the last complete structure
              const lastValidArray = cleanedJson.lastIndexOf("}]");
              const lastValidObject = cleanedJson.lastIndexOf("}}");

              if (lastValidArray > lastValidObject && lastValidArray > -1) {
                cleanedJson = cleanedJson.substring(0, lastValidArray + 2);
              } else if (lastValidObject > -1) {
                cleanedJson = cleanedJson.substring(0, lastValidObject + 2);
                // If it was inside an array, close the array
                if (cleanedJson.startsWith("[")) {
                  cleanedJson += "]";
                }
              }
            }

            console.log("🔧 Cleaned JSON length:", cleanedJson.length);
            console.log("🔧 Cleaned JSON ends with:", cleanedJson.slice(-50));

            try {
              const parsed = JSON.parse(cleanedJson);
              console.log("✅ Successfully parsed cleaned JSON");

              // Further ensure it's an array of valid objects
              if (Array.isArray(parsed)) {
                const validPosts = parsed.filter(
                  (post) =>
                    post &&
                    typeof post === "object" &&
                    post.id &&
                    post.title &&
                    !post.transactions // Remove any posts that still have transactions to avoid circular refs
                );

                console.log(
                  `📊 Valid posts after filtering: ${validPosts.length} of ${parsed.length}`
                );

                // 🔄 Sort by ID - highest to lowest (newest posts have higher IDs)
                const sortedValidPosts = validPosts.sort((a, b) => {
                  const idA = parseInt(a.postId || a.id || 0);
                  const idB = parseInt(b.postId || b.id || 0);
                  return idB - idA; // Descending order (higher ID first = newer posts first)
                });

                setPendingListings(sortedValidPosts);
                return;
              }
            } catch (cleanupError) {
              console.log(
                "⚠️ Cleaned JSON still failed:",
                cleanupError.message
              );

              // EMERGENCY: Try to extract valid objects manually
              try {
                // Look for post objects without transactions
                const postMatches = cleanedJson.match(
                  /\{"id":\d+,"title":"[^"]*","description":"[^"]*","price":[\d.]+,"status":"PENDING","createdAt":"[^"]*","updatedAt":"[^"]*"\}/g
                );

                if (postMatches && postMatches.length > 0) {
                  const emergencyPosts = postMatches
                    .map((match) => {
                      try {
                        return JSON.parse(match);
                      } catch (e) {
                        return null;
                      }
                    })
                    .filter(Boolean);

                  console.log(
                    `🚨 Emergency extraction found ${emergencyPosts.length} posts`
                  );

                  // 🔄 Sort by ID - highest to lowest (newest posts have higher IDs)
                  const sortedEmergencyPosts = emergencyPosts.sort((a, b) => {
                    const idA = parseInt(a.postId || a.id || 0);
                    const idB = parseInt(b.postId || b.id || 0);
                    return idB - idA; // Descending order (higher ID first = newer posts first)
                  });

                  setPendingListings(sortedEmergencyPosts);
                  return;
                }
              } catch (emergencyError) {
                console.log(
                  "🚨 Emergency extraction failed:",
                  emergencyError.message
                );
              }
            }
          } catch (e) {
            console.error("❌ Failed to parse pending listings JSON:", e);
            console.error(
              "🔍 JSON snippet around error:",
              response.data.substring(150900, 151000)
            );
          }
        }

        setPendingListings([]);
      }
    } catch (error) {
      console.error("❌ Failed to load pending listings:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });

      // 🔄 Fallback: Try simpler API call without complex relations
      try {
        console.log("🔄 Trying fallback API call...");
        const fallbackResponse = await api.get("/api/post/list/PENDING");

        if (fallbackResponse.data && Array.isArray(fallbackResponse.data)) {
          console.log("✅ Fallback API successful");

          // 🔄 Sort by ID - highest to lowest (newest posts have higher IDs)
          const sortedFallbackPosts = fallbackResponse.data.sort((a, b) => {
            const idA = parseInt(a.postId || a.id || 0);
            const idB = parseInt(b.postId || b.id || 0);
            return idB - idA; // Descending order (higher ID first = newer posts first)
          });

          setPendingListings(sortedFallbackPosts);
          return;
        }
      } catch (fallbackError) {
        console.error("❌ Fallback API also failed:", fallbackError);
      }

      // Set empty array on error
      setPendingListings([]);

      // Show appropriate error message
      if (error.response?.status === 403) {
        toast.error("Access denied. Admin permissions required.");
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to load pending listings.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPendingUsers = async () => {
    try {
      setLoading(true);
      console.log("📡 Loading pending users...");

      const response = await api.get("/api/v1/admin/accounts/pending");
      console.log("👥 Pending users response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setPendingAccounts(response.data);
      } else {
        console.warn("⚠️ Expected array but got:", typeof response.data);

        // 🔧 Try to parse if it's a JSON string
        if (typeof response.data === "string") {
          try {
            const parsed = JSON.parse(response.data);
            if (Array.isArray(parsed)) {
              console.log("✅ Successfully parsed pending users JSON");
              setPendingAccounts(parsed);
              return;
            }
          } catch (e) {
            console.error("❌ Failed to parse pending users JSON:", e);
          }
        }

        setPendingAccounts([]);
      }
    } catch (error) {
      console.error("❌ Failed to load pending users:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });

      // Mock data for testing UI
      setPendingAccounts([
        {
          id: 1,
          accountId: 1,
          username: "newuser1",
          email: "newuser1@example.com",
          role: "USER",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          accountId: 2,
          username: "seller2",
          email: "seller2@example.com",
          role: "SELLER",
          createdAt: new Date().toISOString(),
        },
      ]);

      if (error.response?.status === 403) {
        toast.error("Access denied. Admin permissions required.");
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to load pending users.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPendingAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/admin/accounts/pending");
      if (response.data && Array.isArray(response.data)) {
        setPendingAccounts(response.data);
      }
    } catch (error) {
      console.error("⚠️ API Error (need ADMIN login):", error.response?.status);
      // 🔧 Mock data for testing UI
      setPendingAccounts([
        {
          id: 1,
          accountId: 1,
          username: "newuser1",
          email: "newuser1@example.com",
          role: "USER",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          accountId: 2,
          username: "seller2",
          email: "seller2@example.com",
          role: "SELLER",
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          accountId: 3,
          username: "admin3",
          email: "admin3@example.com",
          role: "ADMIN",
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.error("Need ADMIN login. Using mock data for UI testing.");
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      setLoading(true);
      console.log("[DEBUG] Loading all users from API...");
      const response = await api.get("/api/v1/admin/accounts/all");
      console.log("[DEBUG] All users response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        // Load ALL users (not just approved) and show their actual roles
        const allUsers = response.data.map((user) => ({
          accountId: user.accountId || user.id,
          username: user.username || "Unknown",
          email: user.email || "",
          role: user.role || "USER",
          status: user.status || "UNKNOWN",
          createdAt:
            user.createdAt || user.createat || new Date().toISOString(),
        }));

        console.log("[DEBUG] Mapped users:", allUsers);
        console.log("[DEBUG] Role distribution:", {
          ADMIN: allUsers.filter((u) => u.role === "ADMIN").length,
          SELLER: allUsers.filter((u) => u.role === "SELLER").length,
          USER: allUsers.filter((u) => u.role === "USER").length,
          OTHER: allUsers.filter(
            (u) => !["ADMIN", "SELLER", "USER"].includes(u.role)
          ).length,
        });

        setAllUsers(allUsers);
        setFilteredUsers(allUsers);
        toast.success(
          `Loaded ${allUsers.length} users (${
            allUsers.filter((u) => u.status === "APPROVED").length
          } approved)`
        );
      }
    } catch (error) {
      console.error("Error loading users:", error);
      console.error("Error response:", error.response?.data);
      // 🔧 Mock data with diverse roles for testing
      const mockUsers = [
        {
          accountId: 1,
          username: "admin_main",
          email: "admin@voltera.com",
          role: "ADMIN",
          status: "APPROVED",
          createdAt: "2024-01-01",
        },
        {
          accountId: 2,
          username: "seller_tesla",
          email: "tesla@voltera.com",
          role: "SELLER",
          status: "APPROVED",
          createdAt: "2024-01-15",
        },
        {
          accountId: 3,
          username: "seller_byd",
          email: "byd@voltera.com",
          role: "SELLER",
          status: "APPROVED",
          createdAt: "2024-01-20",
        },
        {
          accountId: 4,
          username: "buyer_john",
          email: "john@gmail.com",
          role: "USER",
          status: "APPROVED",
          createdAt: "2024-01-25",
        },
        {
          accountId: 5,
          username: "buyer_jane",
          email: "jane@gmail.com",
          role: "USER",
          status: "APPROVED",
          createdAt: "2024-02-01",
        },
        {
          accountId: 6,
          username: "seller_vf",
          email: "vf@voltera.com",
          role: "SELLER",
          status: "PENDING",
          createdAt: "2024-02-05",
        },
        {
          accountId: 7,
          username: "buyer_mike",
          email: "mike@yahoo.com",
          role: "USER",
          status: "PENDING",
          createdAt: "2024-02-10",
        },
      ];
      setAllUsers(mockUsers);
      setFilteredUsers(mockUsers);
      toast.error(
        `API Error: ${error.response?.status || "Unknown"}. Using mock data.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Load Complaints Data
  const loadComplaints = async () => {
    try {
      setComplaintsLoading(true);
      console.log("📡 Loading complaints from API...");

      // Try to get all complaints by trying different endpoints
      let response;

      try {
        // Try unresolve complaints first (admin endpoint)
        response = await api.get("/api/reply-complaint/unresolve");
        console.log("✅ Unresolved complaints loaded:", response);
      } catch (error) {
        console.warn(
          "⚠️ Failed to get unresolve complaints, trying alternative endpoint:",
          error.message
        );

        // Fallback: try to get complaints by status
        try {
          response = await api.get("/api/complaints/status/PENDING");
          console.log("✅ Pending complaints loaded:", response);
        } catch (error2) {
          console.warn(
            "⚠️ Failed to get pending complaints, trying search endpoint:",
            error2.message
          );

          // Fallback: try search with empty query to get all
          response = await api.get("/api/reply-complaint/search?problem=");
          console.log("✅ Search complaints loaded:", response);
        }
      }

      if (response && response.data) {
        // Handle different possible response structures from backend
        let complaintsData = [];

        if (Array.isArray(response.data)) {
          complaintsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          complaintsData = response.data.data;
        } else if (
          response.data.content &&
          Array.isArray(response.data.content)
        ) {
          complaintsData = response.data.content;
        } else {
          console.warn(
            "⚠️ Unexpected complaints response format:",
            response.data
          );
          console.warn("⚠️ Response structure:", Object.keys(response.data));
          complaintsData = [];
        }

        // Transform data to match frontend expectations if needed
        const transformedComplaints = complaintsData.map((complaint) => {
          console.log("🔍 Processing complaint:", complaint);

          // Extract user info from various possible paths
          let userName = "System User";
          let userEmail = "";

          if (complaint.account) {
            userName =
              complaint.account.name ||
              complaint.account.username ||
              complaint.account.fullName;
            userEmail = complaint.account.email;
          } else if (complaint.user) {
            userName =
              complaint.user.name ||
              complaint.user.username ||
              complaint.user.fullName;
            userEmail = complaint.user.email;
          } else if (complaint.userName) {
            userName = complaint.userName;
            userEmail = complaint.userEmail;
          } else if (complaint.accountName) {
            userName = complaint.accountName;
            userEmail = complaint.accountEmail;
          } else if (complaint.createdBy) {
            userName = complaint.createdBy;
          }

          // If still no name, try to extract from email
          if (!userName && userEmail) {
            userName = userEmail.split("@")[0];
          }

          return {
            id: complaint.id || complaint.complaintId,
            title:
              complaint.title ||
              complaint.problem ||
              complaint.subject ||
              "Complaint #" + (complaint.id || complaint.complaintId),
            description:
              complaint.description ||
              complaint.content ||
              complaint.message ||
              "",
            complaintType:
              complaint.complaintType ||
              complaint.type ||
              complaint.category ||
              "GENERAL",
            status: complaint.status || complaint.complaintStatus || "PENDING",
            createdAt:
              complaint.createdAt ||
              complaint.createDate ||
              complaint.submittedAt ||
              new Date().toISOString(),
            user: {
              name: userName,
              email: userEmail || "no-email@system.local",
            },
          };
        });

        console.log("📋 Processed complaints data:", transformedComplaints);
        setComplaints(transformedComplaints);

        if (transformedComplaints.length === 0) {
          toast.info("No complaints found in the system.");
        } else {
          toast.success(`Loaded ${transformedComplaints.length} complaints`);
        }
      } else {
        console.warn("⚠️ Empty response from complaints API");
        setComplaints([]);
        toast.info("No complaints data received from server.");
      }
    } catch (error) {
      console.error("❌ All complaint endpoints failed:", error);
      console.error("❌ Final error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      setComplaints([]);

      // Show appropriate error message based on error type
      if (error.response?.status === 401) {
        toast.error(
          "Authentication failed. Please login again to access complaints."
        );
      } else if (error.response?.status === 403) {
        toast.error(
          "Access denied. Admin privileges required to view complaints."
        );
      } else if (error.response?.status === 404) {
        toast.error(
          "Complaints API endpoints not found. Please check backend configuration."
        );
      } else if (error.response?.status === 500) {
        toast.error(
          "Server error while loading complaints. Please try again later."
        );
      } else {
        toast.error(`Failed to load complaints from server: ${error.message}`);
      }
    } finally {
      setComplaintsLoading(false);
    }
  };

  // Handle Resolve Complaint
  const handleResolveComplaint = async (complaintId) => {
    try {
      console.log("🔄 Resolving complaint:", complaintId);

      // Show confirmation
      if (
        !window.confirm(
          "Are you sure you want to mark this complaint as resolved? This action cannot be undone."
        )
      ) {
        return;
      }

      setComplaintsLoading(true);

      // Call API to resolve complaint using the correct endpoint
      await api.put(`/api/complaints/${complaintId}/RESOLVED`);

      toast.success("Complaint marked as resolved successfully!");

      // Reload complaints to remove resolved item
      await loadComplaints();
    } catch (error) {
      console.error("❌ Failed to resolve complaint:", error);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Admin privileges required.");
      } else if (error.response?.status === 404) {
        toast.error("Complaint not found or already resolved.");
      } else {
        toast.error(`Failed to resolve complaint: ${error.message}`);
      }
    } finally {
      setComplaintsLoading(false);
    }
  };

  // 💰 Fee Management Functions
  const loadFees = async () => {
    try {
      setFeeLoading(true);

      console.log("📡 Loading real fee data from backend...");

      // Load fee statistics
      const statsResponse = await api.get("/api/fee/admin/stats");
      if (statsResponse.data) {
        setFeeStats({
          totalFees: statsResponse.data.totalFees || 0,
          paidFees: statsResponse.data.paidFees || 0,
          pendingFees: statsResponse.data.pendingFees || 0,
          expiredFees: statsResponse.data.expiredFees || 0,
          totalRevenue: statsResponse.data.totalRevenue || 0,
        });
        console.log("✅ Fee statistics loaded:", statsResponse.data);
      }

      // Load fee list (limited to avoid large responses)
      const feesResponse = await api.get("/api/fee/admin/all");
      if (feesResponse.data && Array.isArray(feesResponse.data)) {
        // Limit to most recent 50 fees to avoid performance issues
        const limitedFees = feesResponse.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 50);

        setFees(limitedFees);
        console.log(`✅ Fee data loaded: ${limitedFees.length} fees`);
      } else {
        console.warn("⚠️ Unexpected fee data format, using empty array");
        setFees([]);
      }
    } catch (err) {
      console.error("❌ Error loading fees:", err);

      // Fallback to mock data if API fails
      console.log("🔄 Falling back to mock data...");
      const mockFeeStats = {
        totalFees: 0,
        paidFees: 0,
        pendingFees: 0,
        expiredFees: 0,
        totalRevenue: 0,
      };

      setFees([]);
      setFeeStats(mockFeeStats);

      if (err.response?.status === 401) {
        toast.error("Authentication required for fee data");
      } else if (err.response?.status === 403) {
        toast.error("Admin access required for fee management");
      } else {
        toast.error("Failed to load fee data. Please try again.");
      }
    } finally {
      setFeeLoading(false);
    }
  };

  // Handle Reply Complaint
  const handleReplyComplaint = async (complaint) => {
    setSelectedComplaint(complaint);
    setReplyText("");
  };

  const submitReply = async () => {
    console.log("🚀 Submit reply called, replyText:", replyText);
    console.log("🚀 Reply text length:", replyText.length);
    console.log("🚀 Trimmed text:", replyText.trim());

    if (!replyText.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }

    try {
      setReplyLoading(true);
      console.log("📤 Submitting reply for complaint:", selectedComplaint.id);

      const replyRequest = {
        message: replyText.trim(),
      };

      await api.post(
        `/api/reply-complaint/create-reply/${selectedComplaint.id}`,
        replyRequest
      );

      toast.success("Reply sent successfully!");

      // Close modal and reload complaints
      setSelectedComplaint(null);
      setReplyText("");
      await loadComplaints();
    } catch (error) {
      console.error("❌ Failed to send reply:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Request payload:", replyRequest);

      if (error.response?.status === 400) {
        toast.error(
          `Bad request: ${
            error.response?.data?.message || "Invalid data format"
          }`
        );
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Admin privileges required.");
      } else if (error.response?.status === 404) {
        toast.error("Complaint not found.");
      } else {
        toast.error(`Failed to send reply: ${error.message}`);
      }
    } finally {
      setReplyLoading(false);
    }
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    if (role === "ALL") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) => user.role === role);
      setFilteredUsers(filtered);
    }
  };

  // ✅ Action Handlers
  const handleApprovePost = async (postId) => {
    try {
      setLoading(true);
      console.log("[DEBUG] Approving post:", postId);
      await api.put(`/api/post/admin/${postId}/approve`);
      toast.success("Post approved");
      await loadPendingListings();
      await loadDashboardData();
    } catch (error) {
      console.error("Error approving post:", error);
      console.error("Error details:", error.response?.data);
      toast.error(
        error?.response?.status === 401
          ? "Please login again."
          : error?.response?.status === 403
          ? "Admin role required."
          : error?.response?.data?.message || "Failed to approve post"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPost = async (postId) => {
    try {
      setLoading(true);
      const reason =
        window.prompt("Please provide a reason for rejection:") ||
        "Not specified";
      console.log("[DEBUG] Rejecting post:", postId, "with reason:", reason);
      await api.put(`/api/post/admin/${postId}/reject`, { reason });
      toast.success("Post rejected");
      await loadPendingListings();
      await loadDashboardData();
    } catch (error) {
      console.error("Error rejecting post:", error);
      console.error("Error details:", error.response?.data);
      toast.error(
        error?.response?.status === 401
          ? "Please login again."
          : error?.response?.status === 403
          ? "Admin role required."
          : error?.response?.data?.message || "Failed to reject post"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAccount = async (accountId) => {
    try {
      setLoading(true);
      await api.put(`/api/v1/admin/account/${accountId}/approved`);
      toast.success("Account approved successfully");
      await loadPendingAccounts();
      await loadDashboardData();
    } catch (error) {
      console.error("Error approving account:", error);
      toast.error("Failed to approve account");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectAccount = async (accountId) => {
    try {
      setLoading(true);
      await api.put(`/api/v1/admin/account/${accountId}/rejected`);
      toast.success("Account rejected");
      await loadPendingAccounts();
      await loadDashboardData();
    } catch (error) {
      console.error("Error rejecting account:", error);
      toast.error("Failed to reject account");
    } finally {
      setLoading(false);
    }
  };

  const loadApprovedAccounts = async () => {
    try {
      setLoading(true);
      console.log("🔍 [DEBUG] Loading approved accounts...");

      // Debug token
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
      };
      const token = getCookie("accessToken");
      console.log("🔐 [DEBUG] Token exists:", !!token);
      console.log(
        "🔐 [DEBUG] Token preview:",
        token ? token.substring(0, 20) + "..." : "No token"
      );

      const response = await api.get("/api/v1/admin/accounts/approved");
      console.log("📊 [DEBUG] Approved accounts response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setApprovedAccounts(response.data);
        console.log(
          "✅ [DEBUG] Loaded " + response.data.length + " approved accounts"
        );
      }
    } catch (error) {
      console.error("⚠️ Error loading approved accounts:", error);
      console.error("⚠️ Error status:", error.response?.status);
      console.error("⚠️ Error data:", error.response?.data);
      toast.error("Failed to load approved accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleLockAccount = async (accountId) => {
    try {
      setLoading(true);
      await api.put(`/api/v1/admin/account/${accountId}/lock`);
      toast.success("Account locked successfully");
      await loadApprovedAccounts();
    } catch (error) {
      console.error("Error locking account:", error);
      toast.error("Failed to lock account");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockAccount = async (accountId) => {
    try {
      setLoading(true);
      await api.put(`/api/v1/admin/account/${accountId}/unlock`);
      toast.success("Account unlocked successfully");
      await loadApprovedAccounts();
    } catch (error) {
      console.error("Error unlocking account:", error);
      toast.error("Failed to unlock account");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== POST DETAIL ===================== */
  const loadPostDetail = async (postId) => {
    setLoadingDetail(true);
    try {
      const res = await api.get(`/api/post/detail/${postId}`);
      console.log("[DEBUG] Post detail data:", res.data);
      console.log("[DEBUG] Vehicle data:", res.data?.vehicle);
      console.log("[DEBUG] Battery data:", res.data?.battery);
      setPostDetail(res.data);
    } catch (error) {
      console.error("[Admin] Error loading post detail:", error);
      toast.error("Failed to load post details");
      setPostDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleViewPost = async (post) => {
    setSelectedPost(post);
    await loadPostDetail(post.postId || post.id);
  };

  // 🎨 RENDER UI
  return (
    <div className="modern-admin-dashboard">
      {/* 📱 Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">V</div>
            <span>Voltera Admin</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navigationItems.map((section) => (
            <div key={section.section} className="sidebar-section">
              <div className="sidebar-section-title">{section.title}</div>
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className={`sidebar-nav-item ${
                    activeSection === item.id ? "active" : ""
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <item.icon />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="sidebar-nav-badge">{item.badge}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* 💻 Main Content */}
      <div className="main-content">
        {/*  Dashboard Content */}
        <div className="dashboard-content">
          {/* 📈 Overview Section */}
          {activeSection === "overview" && (
            <div className="fade-in">
              <div className="dashboard-stats">
                <div className="stat-card">
                  <div className="stat-card-header">
                    <div className="stat-card-title">Total Posts</div>
                    <div className="stat-card-icon blue">
                      <Icons.Posts />
                    </div>
                  </div>
                  <div className="stat-card-value">{stats.totalPosts}</div>
                  <div className="stat-card-change positive">
                    <Icons.ChevronUp />
                    <span>+12.5%</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <div className="stat-card-title">Pending Posts</div>
                    <div className="stat-card-icon orange">
                      <Icons.Analytics />
                    </div>
                  </div>
                  <div className="stat-card-value">{stats.pendingPosts}</div>
                  <div className="stat-card-change positive">
                    <Icons.ChevronUp />
                    <span>+8.3%</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <div className="stat-card-title">Total Users</div>
                    <div className="stat-card-icon green">
                      <Icons.Users />
                    </div>
                  </div>
                  <div className="stat-card-value">{stats.totalUsers}</div>
                  <div className="stat-card-change positive">
                    <Icons.ChevronUp />
                    <span>+18.7%</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <div className="stat-card-title">Pending Accounts</div>
                    <div className="stat-card-icon purple">
                      <Icons.Accounts />
                    </div>
                  </div>
                  <div className="stat-card-value">{stats.pendingAccounts}</div>
                  <div className="stat-card-change negative">
                    <Icons.ChevronDown />
                    <span>-3.2%</span>
                  </div>
                </div>
              </div>

              <div className="content-grid">
                <div className="content-card">
                  <div className="content-card-header">
                    <div>
                      <div className="content-card-title">Quick Actions</div>
                      <div className="content-card-subtitle">
                        Commonly used admin functions
                      </div>
                    </div>
                  </div>
                  <div className="content-card-body">
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      <button
                        className="modern-btn primary"
                        onClick={() => setActiveSection("listings")}
                      >
                        <Icons.Posts />
                        Review Posts ({stats.pendingPosts})
                      </button>
                      <button
                        className="modern-btn secondary"
                        onClick={() => setActiveSection("accounts")}
                      >
                        <Icons.Accounts />
                        Review Accounts ({stats.pendingAccounts})
                      </button>
                      <button
                        className="modern-btn success"
                        onClick={() => setActiveSection("users")}
                      >
                        <Icons.Users />
                        Manage Users
                      </button>
                      <button
                        className="modern-btn warning"
                        onClick={() => {
                          setActiveSection("activeUsers");
                          loadApprovedAccounts();
                        }}
                      >
                        <Icons.Lock />
                        Ban/Unban Accounts
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 📝 Listings Section */}
          {activeSection === "listings" && (
            <div className="fade-in">
              <div className="content-card">
                <div className="content-card-header">
                  <div>
                    <div className="content-card-title">
                      Pending Listings ({pendingListings.length})
                    </div>
                    <div className="content-card-subtitle">
                      Review and approve/reject pending posts
                    </div>
                  </div>
                </div>
                <div className="content-card-body">
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                      <div className="loading-spinner"></div>
                    </div>
                  ) : pendingListings.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">📝</div>
                      <div className="empty-state-title">
                        No Pending Listings
                      </div>
                      <div className="empty-state-text">
                        All listings have been reviewed
                      </div>
                    </div>
                  ) : (
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Price (VND)</th>
                          <th>Fee Status</th>
                          <th>Created / Post ID</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingListings.map((post, index) => (
                          <tr key={post.postId || post.id || index}>
                            <td>#{String(index + 1).padStart(3, "0")}</td>
                            <td>{post.title || "Untitled"}</td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                {/* Determine type based on post data structure */}
                                {post.type === "electric" || post.battery ? (
                                  <Icons.Electric />
                                ) : (
                                  <Icons.Car />
                                )}
                                <span
                                  className={`modern-badge ${
                                    post.type === "electric" || post.battery
                                      ? "info"
                                      : "success"
                                  }`}
                                >
                                  {post.type === "electric" || post.battery
                                    ? "Electric Battery"
                                    : post.type === "vehicle" || post.vehicle
                                    ? "Vehicle"
                                    : "Unknown"}
                                </span>
                              </div>
                            </td>
                            <td>
                              {post.price
                                ? new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  }).format(post.price)
                                : "N/A"}
                            </td>
                            <td>
                              <span
                                className={`modern-badge ${
                                  post.feeStatus === "PAID"
                                    ? "success"
                                    : post.feeStatus === "PENDING"
                                    ? "warning"
                                    : post.feeStatus === "CANCELLED"
                                    ? "danger"
                                    : post.feeStatus === "NO_FEE"
                                    ? "secondary"
                                    : "info"
                                }`}
                              >
                                {post.feeStatus || "Unknown"}
                              </span>
                            </td>
                            <td>
                              {(() => {
                                // Try multiple possible date fields - backend now returns createdAt properly
                                const dateValue =
                                  post.createdAt ||
                                  post.updatedAt ||
                                  post.createdat ||
                                  post.postDate ||
                                  post.createDate;
                                console.log(
                                  "🔍 Date fields for post",
                                  post.postId || post.id,
                                  ":",
                                  {
                                    createdAt: post.createdAt,
                                    updatedAt: post.updatedAt,
                                    createdat: post.createdat,
                                    postDate: post.postDate,
                                    createDate: post.createDate,
                                    selectedValue: dateValue,
                                  }
                                );
                                if (!dateValue) {
                                  // If no date field, show post ID as indicator of creation order
                                  return (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        fontSize: "0.875rem",
                                      }}
                                    >
                                      <span style={{ color: "#6b7280" }}>
                                        Post #{post.postId || post.id}
                                      </span>
                                      <span
                                        style={{
                                          color: "#9ca3af",
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        (No date available)
                                      </span>
                                    </div>
                                  );
                                }

                                const dateObj = new Date(dateValue);
                                if (isNaN(dateObj.getTime())) {
                                  return (
                                    <span style={{ color: "#ef4444" }}>
                                      Invalid Date: {dateValue}
                                    </span>
                                  );
                                }

                                return (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    <span>
                                      {dateObj.toLocaleDateString("vi-VN")}
                                    </span>
                                    <span
                                      style={{
                                        color: "#6b7280",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      {dateObj.toLocaleTimeString("vi-VN")}
                                    </span>
                                  </div>
                                );
                              })()}
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button
                                  className="modern-btn primary"
                                  onClick={() => handleViewPost(post)}
                                >
                                  <Icons.Eye />
                                </button>
                                <button
                                  className="modern-btn success"
                                  onClick={() =>
                                    handleApprovePost(post.postId || post.id)
                                  }
                                >
                                  <Icons.Check />
                                </button>
                                <button
                                  className="modern-btn danger"
                                  onClick={() =>
                                    handleRejectPost(post.postId || post.id)
                                  }
                                >
                                  <Icons.X />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 👥 Accounts Section */}
          {activeSection === "accounts" && (
            <div className="fade-in">
              <div className="content-card">
                <div className="content-card-header">
                  <div>
                    <div className="content-card-title">
                      Pending Accounts ({pendingAccounts.length})
                    </div>
                    <div className="content-card-subtitle">
                      Review and approve/reject pending account registrations
                    </div>
                  </div>
                </div>
                <div className="content-card-body">
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                      <div className="loading-spinner"></div>
                    </div>
                  ) : pendingAccounts.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">👥</div>
                      <div className="empty-state-title">
                        No Pending Accounts
                      </div>
                      <div className="empty-state-text">
                        All account registrations have been reviewed
                      </div>
                    </div>
                  ) : (
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingAccounts.map((account, index) => (
                          <tr key={account.accountId || account.id}>
                            <td>#{String(index + 1).padStart(3, "0")}</td>
                            <td>{account.username || "Unknown"}</td>
                            <td>{account.email || "N/A"}</td>
                            <td>
                              <span
                                className={`modern-badge ${
                                  account.role === "ADMIN"
                                    ? "danger"
                                    : account.role === "SELLER"
                                    ? "warning"
                                    : "info"
                                }`}
                              >
                                {account.role || "USER"}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button
                                  className="modern-btn success"
                                  onClick={() =>
                                    handleApproveAccount(
                                      account.accountId || account.id
                                    )
                                  }
                                >
                                  <Icons.Check />
                                  Approve
                                </button>
                                <button
                                  className="modern-btn danger"
                                  onClick={() =>
                                    handleRejectAccount(
                                      account.accountId || account.id
                                    )
                                  }
                                >
                                  <Icons.X />
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 🔒 Active Users Section - Ban/Unban Management */}
          {activeSection === "activeUsers" && (
            <div className="fade-in">
              <div className="content-card">
                <div className="content-card-header">
                  <div>
                    <div className="content-card-title">
                      User Account Management ({approvedAccounts.length})
                    </div>
                    <div className="content-card-subtitle">
                      Manage active and banned user accounts (Lock/Unlock)
                    </div>
                  </div>
                  <button
                    className="modern-btn primary"
                    onClick={loadApprovedAccounts}
                  >
                    <Icons.Refresh />
                    Refresh
                  </button>
                </div>
                <div className="content-card-body">
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                      <div className="loading-spinner"></div>
                    </div>
                  ) : approvedAccounts.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">🔓</div>
                      <div className="empty-state-title">
                        No User Accounts Found
                      </div>
                      <div className="empty-state-text">
                        No active or banned users to manage
                      </div>
                    </div>
                  ) : (
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedAccounts.map((account, index) => (
                          <tr key={account.accountId || account.id}>
                            <td>#{String(index + 1).padStart(3, "0")}</td>
                            <td>
                              <strong>{account.username || "Unknown"}</strong>
                            </td>
                            <td>{account.email || "N/A"}</td>
                            <td>
                              <span
                                className={`modern-badge ${
                                  account.role === "ADMIN"
                                    ? "danger"
                                    : account.role === "SELLER"
                                    ? "warning"
                                    : "info"
                                }`}
                              >
                                {account.role || "BUYER"}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`modern-badge ${
                                  account.status === "APPROVE"
                                    ? "success"
                                    : account.status === "INACTIVE"
                                    ? "danger"
                                    : "warning"
                                }`}
                              >
                                {account.status === "APPROVE"
                                  ? "Active"
                                  : account.status === "INACTIVE"
                                  ? "Locked"
                                  : account.status || "Unknown"}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                {account.status === "APPROVE" ? (
                                  <button
                                    className="modern-btn danger"
                                    onClick={() =>
                                      handleLockAccount(
                                        account.accountId || account.id
                                      )
                                    }
                                    title="Lock Account"
                                  >
                                    <Icons.Lock />
                                    Lock
                                  </button>
                                ) : (
                                  <button
                                    className="modern-btn success"
                                    onClick={() =>
                                      handleUnlockAccount(
                                        account.accountId || account.id
                                      )
                                    }
                                    title="Unlock Account"
                                  >
                                    <Icons.Unlock />
                                    Unlock
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 🙋 Users Section */}
          {activeSection === "users" && (
            <div className="fade-in">
              <div className="content-card">
                <div className="content-card-header">
                  <div>
                    <div className="content-card-title">
                      Users Management ({filteredUsers.length})
                    </div>
                    <div className="content-card-subtitle">
                      Manage approved user accounts
                    </div>
                  </div>
                </div>
                <div className="content-card-body">
                  <div className="filter-tabs">
                    {["ALL", "ADMIN", "BUYER", "SELLER"].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleFilter(role)}
                        className={`filter-tab ${
                          selectedRole === role ? "active" : ""
                        }`}
                      >
                        {role === "ALL"
                          ? `All (${allUsers.length})`
                          : `${role} (${
                              allUsers.filter((u) => u.role === role).length
                            })`}
                      </button>
                    ))}
                  </div>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                      <div className="loading-spinner"></div>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">👥</div>
                      <div className="empty-state-title">No Users Found</div>
                      <div className="empty-state-text">
                        No users match the selected filter criteria
                      </div>
                    </div>
                  ) : (
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, index) => (
                          <tr key={user.accountId}>
                            <td>#{String(index + 1).padStart(3, "0")}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                              <span
                                className={`modern-badge ${
                                  user.role === "ADMIN"
                                    ? "danger"
                                    : user.role === "SELLER"
                                    ? "warning"
                                    : "info"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td>
                              <span className="modern-badge success">
                                {user.status}
                              </span>
                            </td>
                            <td>
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/*  Fee Management Section */}
          {activeSection === "fees" && (
            <div className="fade-in">
              <div className="content-card">
                <div className="content-card-header">
                  <div>
                    <div className="content-card-title">
                      Fee Management ({fees.length})
                    </div>
                    <div className="content-card-subtitle">
                      View posting fees and revenue statistics
                    </div>
                  </div>
                  <button
                    className="modern-btn primary"
                    onClick={loadFees}
                    disabled={feeLoading}
                  >
                    {feeLoading ? "Loading..." : "Refresh"}
                  </button>
                </div>

                {/* Fee Statistics */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Total Fees</div>
                    <div className="stat-value text-blue">
                      {feeStats.totalFees}
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Paid</div>
                    <div className="stat-value text-green">
                      {feeStats.paidFees}
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Pending</div>
                    <div className="stat-value text-yellow">
                      {feeStats.pendingFees}
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Expired</div>
                    <div className="stat-value text-red">
                      {feeStats.expiredFees}
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value text-blue">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(feeStats.totalRevenue)}
                    </div>
                  </div>
                </div>

                <div className="content-card-body">
                  {feeLoading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <div className="loading-text">Loading fees...</div>
                    </div>
                  ) : fees.length > 0 ? (
                    <div className="table-container">
                      <table className="modern-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Post Title</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Expires</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fees.map((fee) => (
                            <tr key={fee.id}>
                              <td>#{fee.id}</td>
                              <td>
                                {fee.post?.title || fee.description || "N/A"}
                              </td>
                              <td>
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(fee.amount || 0)}
                              </td>
                              <td>
                                <span
                                  className={`status-badge ${
                                    fee.status?.toLowerCase() || "unknown"
                                  }`}
                                >
                                  {fee.status || "UNKNOWN"}
                                </span>
                              </td>
                              <td>
                                {fee.createdAt
                                  ? new Date(fee.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td>
                                {fee.expiredAt ? (
                                  <span
                                    className={
                                      new Date(fee.expiredAt) < new Date()
                                        ? "text-red"
                                        : new Date(fee.expiredAt) <
                                          new Date(
                                            Date.now() + 3 * 24 * 60 * 60 * 1000
                                          )
                                        ? "text-yellow"
                                        : ""
                                    }
                                  >
                                    {new Date(
                                      fee.expiredAt
                                    ).toLocaleDateString()}
                                  </span>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <Icons.DollarSign />
                      <div className="empty-state-title">No Fees Found</div>
                      <div className="empty-state-text">
                        No posting fees have been created yet.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 📞 Complaints Section */}
          {activeSection === "complaints" && (
            <div className="fade-in">
              <div className="content-card">
                <div className="content-card-header">
                  <div>
                    <div className="content-card-title">
                      Complaints Management ({complaints.length})
                    </div>
                    <div className="content-card-subtitle">
                      Manage customer complaints and support requests
                    </div>
                  </div>
                </div>
                <div className="content-card-body">
                  {complaintsLoading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <div className="loading-text">Loading complaints...</div>
                    </div>
                  ) : complaints.length === 0 ? (
                    <div className="empty-state">
                      <Icons.MessageCircle />
                      <div className="empty-state-title">
                        No Complaints Found
                      </div>
                      <div className="empty-state-text">
                        All complaints have been resolved or no complaints
                        submitted yet.
                      </div>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="modern-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {complaints.map((complaint) => (
                            <tr key={complaint.id} className="table-row">
                              <td className="font-mono">#{complaint.id}</td>
                              <td>
                                <div className="user-info">
                                  <div className="user-name">
                                    {complaint.user?.name || "Unknown User"}
                                  </div>
                                  <div className="user-email">
                                    {complaint.user?.email || "No email"}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="complaint-title">
                                  {complaint.title}
                                </div>
                                <div className="complaint-desc">
                                  {complaint.description?.length > 50
                                    ? complaint.description.substring(0, 50) +
                                      "..."
                                    : complaint.description}
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`type-badge ${complaint.complaintType.toLowerCase()}`}
                                >
                                  {complaint.complaintType.replace("_", " ")}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`status-badge ${complaint.status.toLowerCase()}`}
                                >
                                  {complaint.status}
                                </span>
                              </td>
                              <td className="text-muted">
                                {new Date(
                                  complaint.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                <div className="action-buttons-group">
                                  {complaint.status === "PENDING" ? (
                                    <>
                                      <button
                                        className="modern-btn-sm primary"
                                        title="Reply to complaint"
                                        onClick={() =>
                                          handleReplyComplaint(complaint)
                                        }
                                      >
                                        <Icons.MessageCircle />
                                        <span>Reply</span>
                                      </button>

                                      <button
                                        className="modern-btn-sm success"
                                        title="Mark as resolved"
                                        onClick={() =>
                                          handleResolveComplaint(complaint.id)
                                        }
                                      >
                                        <Icons.Check />
                                        <span>Resolved</span>
                                      </button>
                                    </>
                                  ) : complaint.status === "RESOLVED" ? (
                                    <span className="action-status resolved">
                                      <Icons.Check />
                                      <span>Already Resolved</span>
                                    </span>
                                  ) : (
                                    <span className="action-status rejected">
                                      <Icons.X />
                                      <span>Rejected</span>
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔍 Enhanced Post Detail Modal */}
      {selectedPost && (
        <div
          className="modal-overlay"
          onClick={() => {
            setSelectedPost(null);
            setPostDetail(null);
          }}
        >
          <div
            className="modal-content enhanced-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>📋 Post Review & Approval</h3>
              <button
                onClick={() => {
                  setSelectedPost(null);
                  setPostDetail(null);
                }}
              >
                <Icons.X />
              </button>
            </div>
            <div className="modal-body enhanced-modal-body">
              {loadingDetail ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">
                    Loading detailed information...
                  </div>
                </div>
              ) : (
                <>
                  {/* Basic Info */}
                  <div className="detail-section">
                    <h4 className="section-title">📝 Basic Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <strong>Title:</strong>
                        <span>{postDetail?.title || selectedPost.title}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Type:</strong>
                        <span
                          className={`type-badge ${
                            postDetail?.vehicle
                              ? "vehicle"
                              : postDetail?.battery
                              ? "battery"
                              : "unknown"
                          }`}
                        >
                          {postDetail?.vehicle
                            ? "🚗 Vehicle"
                            : postDetail?.battery
                            ? "🔋 Battery"
                            : "❓ Unknown"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Price:</strong>
                        <span className="price-highlight">
                          $
                          {postDetail?.price?.toLocaleString() ||
                            selectedPost.price?.toLocaleString()}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Status:</strong>
                        <span
                          className={`status-badge ${(
                            postDetail?.status || selectedPost.status
                          )?.toLowerCase()}`}
                        >
                          {postDetail?.status || selectedPost.status}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Location:</strong>
                        <span>
                          {postDetail?.location ||
                            selectedPost?.location ||
                            "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="detail-section">
                    <h4 className="section-title">📄 Description</h4>
                    <div className="description-content">
                      {postDetail?.description ||
                        selectedPost.description ||
                        "No description provided"}
                    </div>
                  </div>

                  {/* Vehicle/Battery Specific Details */}
                  {postDetail?.vehicle && (
                    <div className="detail-section">
                      <h4 className="section-title">🚗 Vehicle Details</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <strong>Brand:</strong>
                          <span>{postDetail.vehicle.brand || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                          <strong>Version:</strong>
                          <span>{postDetail.vehicle.version || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                          <strong>Year:</strong>
                          <span>
                            {postDetail.vehicle.yearmanufacture || "N/A"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>Odometer:</strong>
                          <span>
                            {postDetail.vehicle.odo
                              ? `${postDetail.vehicle.odo.toLocaleString()} km`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>Range:</strong>
                          <span>
                            {postDetail.vehicle.range
                              ? `${postDetail.vehicle.range} km`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>Color:</strong>
                          <span>{postDetail.vehicle.color || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                          <strong>Origin:</strong>
                          <span>{postDetail.vehicle.origin || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                          <strong>Style:</strong>
                          <span>{postDetail.vehicle.style || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                          <strong>Seats:</strong>
                          <span>
                            {postDetail.vehicle.numberofseat || "N/A"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>Insurance:</strong>
                          <span
                            className={
                              postDetail.vehicle.bodyinsurance
                                ? "status-active"
                                : "status-inactive"
                            }
                          >
                            {postDetail.vehicle.bodyinsurance
                              ? "✅ Yes"
                              : "❌ No"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>Inspection:</strong>
                          <span
                            className={
                              postDetail.vehicle.vehicleinspection
                                ? "status-active"
                                : "status-inactive"
                            }
                          >
                            {postDetail.vehicle.vehicleinspection
                              ? "✅ Yes"
                              : "❌ No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {postDetail?.battery && (
                    <div className="detail-section">
                      <h4 className="section-title">🔋 Battery Details</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <strong>Type:</strong>
                          <span>
                            {postDetail.battery.batteryTypeId?.name ||
                              postDetail.battery.batteryTypeId?.typename ||
                              "N/A"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>Serial Number:</strong>
                          <span>
                            {postDetail.battery.serialNumber || "N/A"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>Original Capacity:</strong>
                          <span>
                            {postDetail.battery.originCapacity
                              ? `${postDetail.battery.originCapacity} kWh`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>Remaining Capacity:</strong>
                          <span>
                            {postDetail.battery.remainingCapacity
                              ? `${postDetail.battery.remainingCapacity} kWh`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>Voltage:</strong>
                          <span>
                            {postDetail.battery.voltage
                              ? `${postDetail.battery.voltage}V`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>Cycle Count:</strong>
                          <span>{postDetail.battery.cycleCount || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                          <strong>Mileage Covered:</strong>
                          <span>
                            {postDetail.battery.mileageCovered
                              ? `${postDetail.battery.mileageCovered.toLocaleString()} km`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>Weight:</strong>
                          <span>
                            {postDetail.battery.weight
                              ? `${postDetail.battery.weight} kg`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <strong>Life Cycle:</strong>
                          <span>{postDetail.battery.lifeCycle || "N/A"}</span>
                        </div>
                        <div className="detail-item">
                          <strong>Warranty:</strong>
                          <span>{postDetail.battery.warranty || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Images */}
                  {postDetail?.imageUrls && postDetail.imageUrls.length > 0 && (
                    <div className="detail-section">
                      <h4 className="section-title">
                        🖼️ Images ({postDetail.imageUrls.length})
                      </h4>
                      <div className="image-gallery">
                        {postDetail.imageUrls.map((img, idx) => (
                          <div key={`${img}-${idx}`} className="image-item">
                            <img
                              src={img}
                              alt={`Post image ${idx + 1}`}
                              onClick={() => window.open(img, "_blank")}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin Review Section */}
                  <div className="detail-section admin-review">
                    <h4 className="section-title">⚡ Admin Review</h4>
                    <div className="review-checklist">
                      <div className="checklist-item">
                        <input type="checkbox" id="content" />
                        <label htmlFor="content">
                          Content is appropriate and complete
                        </label>
                      </div>
                      <div className="checklist-item">
                        <input type="checkbox" id="images" />
                        <label htmlFor="images">
                          Images are clear and relevant
                        </label>
                      </div>
                      <div className="checklist-item">
                        <input type="checkbox" id="price" />
                        <label htmlFor="price">Price seems reasonable</label>
                      </div>
                      <div className="checklist-item">
                        <input type="checkbox" id="info" />
                        <label htmlFor="info">
                          Technical information is complete
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer enhanced-footer">
              <button
                className="modern-btn secondary"
                onClick={() => {
                  setSelectedPost(null);
                  setPostDetail(null);
                }}
              >
                Close
              </button>
              <button
                className="modern-btn danger"
                onClick={() => {
                  handleRejectPost(selectedPost.postId || selectedPost.id);
                  setSelectedPost(null);
                  setPostDetail(null);
                }}
                disabled={loadingDetail}
              >
                <Icons.X />
                Reject
              </button>
              <button
                className="modern-btn success"
                onClick={() => {
                  handleApprovePost(selectedPost.postId || selectedPost.id);
                  setSelectedPost(null);
                  setPostDetail(null);
                }}
                disabled={loadingDetail}
              >
                <Icons.Check />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💬 Reply Complaint Modal */}
      {selectedComplaint && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!replyLoading) {
              setSelectedComplaint(null);
              setReplyText("");
            }
          }}
        >
          <div
            className="modal-content reply-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">
                💬 Reply to Complaint #{selectedComplaint.id}
              </h3>
              <button
                className="modal-close"
                onClick={() => {
                  if (!replyLoading) {
                    setSelectedComplaint(null);
                    setReplyText("");
                  }
                }}
                disabled={replyLoading}
              >
                <Icons.X />
              </button>
            </div>

            <div className="modal-body reply-modal-body">
              {/* Complaint Info */}
              <div className="complaint-info-section">
                <h4>📋 Complaint Details</h4>
                <div className="complaint-summary">
                  <div className="summary-row">
                    <strong>User:</strong> {selectedComplaint.user?.name}
                  </div>
                  <div className="summary-row">
                    <strong>Email:</strong> {selectedComplaint.user?.email}
                  </div>
                  <div className="summary-row">
                    <strong>Type:</strong>
                    <span
                      className={`type-badge ${selectedComplaint.complaintType.toLowerCase()}`}
                    >
                      {selectedComplaint.complaintType.replace("_", " ")}
                    </span>
                  </div>
                  <div className="summary-row">
                    <strong>Title:</strong> {selectedComplaint.title}
                  </div>
                  <div className="summary-row">
                    <strong>Description:</strong>
                  </div>
                  <div className="complaint-description">
                    {selectedComplaint.description}
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              <div className="reply-form-section">
                <h4>✍️ Admin Response</h4>
                <textarea
                  className="reply-textarea"
                  placeholder="Write your response to the customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                  disabled={replyLoading}
                />
                <div className="character-count">
                  {replyText.length}/1000 characters
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modern-btn outline"
                onClick={() => {
                  setSelectedComplaint(null);
                  setReplyText("");
                }}
                disabled={replyLoading}
              >
                Cancel
              </button>
              <button
                className="modern-btn primary"
                onClick={submitReply}
                disabled={replyLoading || replyText.trim().length === 0}
              >
                {replyLoading ? (
                  <>
                    <div className="loading-spinner-sm"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Reply</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Styles for Complaints Actions */}
      <style jsx>{`
        .action-buttons-group {
          display: flex;
          gap: 6px;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
        }

        .modern-btn-sm {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          font-size: 11px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          min-width: 60px;
          justify-content: center;
        }

        .modern-btn-sm.primary {
          background: #3b82f6;
          color: white;
        }

        .modern-btn-sm.primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .modern-btn-sm.success {
          background: #10b981;
          color: white;
        }

        .modern-btn-sm.success:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .action-status {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }

        .action-status.resolved {
          background: #dcfce7;
          color: #166534;
        }

        .action-status.rejected {
          background: #fef2f2;
          color: #dc2626;
        }

        .type-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .type-badge.billing {
          background: #fef3c7;
          color: #92400e;
        }

        .type-badge.account_problem {
          background: #fee2e2;
          color: #991b1b;
        }

        .type-badge.product_issue {
          background: #ddd6fe;
          color: #5b21b6;
        }

        .type-badge.general {
          background: #e5e7eb;
          color: #374151;
        }

        .status-badge {
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.resolved {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.rejected {
          background: #fef2f2;
          color: #dc2626;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-name {
          font-weight: 500;
          font-size: 13px;
          color: #1f2937;
        }

        .user-email {
          font-size: 11px;
          color: #6b7280;
        }

        .complaint-title {
          font-weight: 500;
          font-size: 13px;
          color: #1f2937;
          margin-bottom: 2px;
        }

        .complaint-desc {
          font-size: 11px;
          color: #6b7280;
          line-height: 1.3;
        }

        /* Reply Modal Styles */
        .reply-modal {
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
        }

        .reply-modal-body {
          padding: 0;
          max-height: 60vh;
          overflow-y: auto;
        }

        .complaint-info-section {
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .complaint-info-section h4 {
          margin: 0 0 12px 0;
          color: #1f2937;
          font-size: 14px;
        }

        .complaint-summary {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .summary-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .complaint-description {
          background: white;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          margin-top: 8px;
          font-size: 13px;
          line-height: 1.4;
        }

        .reply-form-section h4 {
          margin: 0 0 12px 0;
          color: #1f2937;
          font-size: 14px;
        }

        .reply-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          min-height: 120px;
          transition: border-color 0.2s ease;
        }

        .reply-textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .reply-textarea:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .character-count {
          text-align: right;
          font-size: 11px;
          color: #6b7280;
          margin-top: 6px;
        }

        .modern-btn.outline {
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .modern-btn.outline:hover {
          background: #f9fafb;
          color: #374151;
        }

        .loading-spinner-sm {
          width: 14px;
          height: 14px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .modern-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          justify-content: center;
        }

        .modern-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modern-btn.primary:not(:disabled) {
          background: #3b82f6;
          color: white;
        }

        .modern-btn.primary:not(:disabled):hover {
          background: #2563eb;
        }

        /* Fee Management Status Badges */
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .status-badge.paid {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.expired {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.cancelled,
        .status-badge.unknown {
          background: #f3f4f6;
          color: #374151;
        }

        /* Fee Table Styles */
        .table-container {
          overflow-x: auto;
          border-radius: 8px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .modern-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        .modern-table th {
          background: #f8fafc;
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #475569;
          font-size: 13px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modern-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #64748b;
          font-size: 14px;
        }

        .modern-table tr:hover {
          background: #f8fafc;
        }

        .modern-table tr:last-child td {
          border-bottom: none;
        }

        /* Stats Grid for Fees */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #f1f5f9;
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .stat-value.text-blue {
          color: #3b82f6;
        }

        .stat-value.text-green {
          color: #10b981;
        }

        .stat-value.text-yellow {
          color: #f59e0b;
        }

        .stat-value.text-red {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}

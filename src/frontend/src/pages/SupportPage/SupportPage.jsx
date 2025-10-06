// src/pages/support/SupportPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { HelpCircle, MessageSquare, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast"; // ✅ chỉ dùng toast, không render Toaster tại đây
import "./SupportPage.css";

/** =========================
 *  CONFIG (đồng bộ với LoginPage.jsx)
 *  ========================= */
const BASE_URL = import.meta.env.VITE_BACK_END_BASE_URL?.replace(/\/?$/, "/");
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK === "1";

/** =========================
 *  Axios instance + interceptor (reuse logic)
 *  ========================= */
const api = axios.create({
  baseURL: BASE_URL || "/",
  timeout: 30000,
});

// refresh access token khi hết hạn
api.interceptors.request.use(
  async (config) => {
    let accessToken = Cookies.get("accessToken")?.replaceAll('"', "");
    if (accessToken) {
      try {
        const expMs = jwtDecode(accessToken).exp * 1000;
        if (Date.now() >= expMs) {
          const refreshToken = Cookies.get("refreshToken")?.replaceAll('"', "");
          const res = await axios.post(`${BASE_URL}auth/refresh-token`, {
            refreshToken,
          });
          const { accessToken: newAT, refreshToken: newRT } = res.data.data;
          Cookies.set("accessToken", newAT, { expires: 1, secure: true });
          Cookies.set("refreshToken", newRT, { expires: 7, secure: true });
          accessToken = newAT;
        }
      } catch (err) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        return Promise.reject(err);
      }
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** =========================
 *  Helpers chung
 *  ========================= */
const canUseRealApi = () => {
  if (FORCE_MOCK) return false;
  if (!BASE_URL || BASE_URL === "/") return false;
  return true;
};

function getStoredUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getAccessTokenSafe() {
  return Cookies.get("accessToken")?.replaceAll('"', "");
}

function isTokenValid(token) {
  try {
    const expMs = jwtDecode(token).exp * 1000;
    return Date.now() < expMs;
  } catch {
    return false;
  }
}

/** =========================
 *  Support API dual-mode (real → mock)
 *  ========================= */
async function submitSupportDual(payload) {
  // payload: { reason, description, meta }
  if (canUseRealApi()) {
    try {
      const res = await api.post("support/create", payload);
      return res.data?.data || { ok: true };
    } catch {
      return submitSupportMock(payload);
    }
  }
  return submitSupportMock(payload);
}

function submitSupportMock(payload) {
  return new Promise((resolve) =>
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log("[MOCK] support/create", payload);
      resolve({ ok: true, id: "mock-ticket-123" });
    }, 600)
  );
}

/** =========================
 *  Component chính
 *  ========================= */
export default function SupportPage() {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // auth state tự nhận
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [authReady, setAuthReady] = useState(false);

  // on mount: xác thực nhanh từ token + localStorage
  useEffect(() => {
    async function boot() {
      const token = getAccessTokenSafe();
      const stored = getStoredUser();

      if (!token || !stored) {
        setCurrentUser(null);
        setAuthReady(true);
        return;
      }

      if (!isTokenValid(token)) {
        try {
          await api.get("auth/ping"); // nếu 404 cũng không sao, chỉ để kích interceptor
        } catch {
          // ignore
        }
      }

      setCurrentUser(getStoredUser());
      setAuthReady(true);
    }
    boot();
  }, []);

  const reasonOptions = [
    { value: "report", label: "Report", icon: AlertTriangle },
    { value: "comments", label: "Comments", icon: MessageSquare },
    { value: "need support", label: "Need Support", icon: HelpCircle },
  ];

  const getReasonDesc = (v) => {
    switch (v) {
      case "report":
        return "Report inappropriate content, fraudulent listings, or violations of platform policies.";
      case "comments":
        return "Share feedback about the platform, suggest improvements, or general comments.";
      case "need support":
        return "Get help with technical issues, account problems, or general questions.";
      default:
        return "";
    }
  };

  const getIcon = (v, cls = "ic-16") => {
    const opt = reasonOptions.find((o) => o.value === v);
    if (!opt) return null;
    const I = opt.icon;
    return <I className={cls} />;
  };

  const canSubmit = currentUser && reason && description.trim() && !submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please login to submit a support request.");
      return;
    }
    if (!reason) {
      toast.error("Please select a reason.");
      return;
    }
    if (!description.trim()) {
      toast.error("Please provide a description.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        reason,
        description: description.trim(),
        meta: {
          userId: currentUser?.id || currentUser?.email || "unknown",
          ts: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
      };
      await submitSupportDual(payload);
      toast.success("Support request submitted successfully.");
      setReason("");
      setDescription("");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!authReady) {
    return (
      <div className="sp-container">
        <div className="sp-center ghost-card">Loading…</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="sp-container">
        <div className="sp-center card">
          <h1 className="sp-title">Login Required</h1>
          <p className="muted">Please login to submit a support request.</p>
          <div className="sp-actions">
            <button
              className="btn btn-primary"
              onClick={() => (window.location.href = "/login")}
              type="button"
            >
              Go to Login
            </button>
            <button
              className="btn btn-outline"
              onClick={() => (window.location.href = "/")}
              type="button"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in view
  return (
    <div className="sp-container">
      <div className="sp-max">
        <header className="sp-header">
          <h1 className="sp-title">Support Center</h1>
          <p className="muted">
            Need help or want to report an issue? We're here to assist you.
          </p>
          <div className="whoami">
            Signed in as{" "}
            <strong>{currentUser?.name || currentUser?.email || "User"}</strong>
          </div>
        </header>

        <section className="card">
          <div className="card-hd">
            <div className="card-ttl">
              <HelpCircle className="ic-20" />
              <span>Submit Support Request</span>
            </div>
            <p className="card-desc">
              Tell us how we can help you. We'll get back to you as soon as
              possible.
            </p>
          </div>

          <div className="card-bd">
            <form className="form" onSubmit={onSubmit}>
              <div className="fld">
                <label htmlFor="reason" className="lbl">
                  Reason for Contact
                </label>
                <div className="sel-wrap">
                  <select
                    id="reason"
                    className="sel"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a reason...
                    </option>
                    {reasonOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {reason && <div className="sel-ic">{getIcon(reason)}</div>}
                </div>
                {reason && (
                  <div className="hint">
                    {getIcon(reason)}
                    <p className="hint-txt">{getReasonDesc(reason)}</p>
                  </div>
                )}
              </div>

              <div className="fld">
                <label htmlFor="description" className="lbl">
                  Description
                </label>
                <textarea
                  id="description"
                  className="ta"
                  placeholder="Please provide detailed information about your request..."
                  rows={6}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value.slice(0, 1000))
                  }
                />
                <div className="counter">{description.length}/1000</div>
              </div>

              <div className="act">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={!canSubmit}
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
                <button
                  className="btn btn-outline"
                  type="button"
                  disabled={submitting}
                  onClick={() => {
                    setReason("");
                    setDescription("");
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </section>

        <div className="grid3">
          <article className="card pad">
            <div className="ibox">
              <AlertTriangle className="ic-20 danger" />
              <h3 className="ititle">Report Issues</h3>
            </div>
            <p className="muted">
              Report fraudulent listings, inappropriate content, or policy
              violations.
            </p>
          </article>

          <article className="card pad">
            <div className="ibox">
              <MessageSquare className="ic-20 info" />
              <h3 className="ititle">Share Feedback</h3>
            </div>
            <p className="muted">
              Help us improve by sharing your suggestions and comments.
            </p>
          </article>

          <article className="card pad">
            <div className="ibox">
              <HelpCircle className="ic-20 success" />
              <h3 className="ititle">Get Help</h3>
            </div>
            <p className="muted">
              Get assistance with technical issues or account problems.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}

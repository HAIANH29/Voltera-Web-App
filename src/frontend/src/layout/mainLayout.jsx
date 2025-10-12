import React, { useEffect, useMemo, useState } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import HeaderBefore from "../components/headerBefore/headerBefore";
import HeaderAfter from "../components/headerAfter/headerAfter";
import FooterComponent from "../components/footer/footer";

const { Content } = Layout;

export default function MainLayout({ children }) {
  const location = useLocation();

  // === Auth state: đọc từ cookie ===
  const [isAuthed, setIsAuthed] = useState(() => !!Cookies.get("accessToken"));

  // === User info: đọc từ localStorage (để truyền xuống HeaderAfter nếu cần) ===
  const currentUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [isAuthed, location.key]);

  // === Hàm refresh trạng thái đăng nhập ===
  const refreshAuth = () => setIsAuthed(!!Cookies.get("accessToken"));

  // 1) Mỗi lần chuyển route, re-check token (đảm bảo đổi header ngay sau login/logout + điều hướng)
  useEffect(() => {
    refreshAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // 2) Khi đổi tab / logout ở tab khác → nghe sự kiện storage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "currentUser") {
        refreshAuth();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3) Khi tab quay lại (visibilitychange), re-check cookie
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshAuth();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // (tuỳ chọn) 4) Nếu bạn có phát custom event từ HeaderAfter: window.dispatchEvent(new Event("auth:logout"))
  // có thể mở block sau để nghe:
  // useEffect(() => {
  //   const onAuthEvent = () => refreshAuth();
  //   window.addEventListener("auth:login", onAuthEvent);
  //   window.addEventListener("auth:logout", onAuthEvent);
  //   return () => {
  //     window.removeEventListener("auth:login", onAuthEvent);
  //     window.removeEventListener("auth:logout", onAuthEvent);
  //   };
  // }, []);

  return (
    <Layout style={{ minHeight: "100vh" }} key={isAuthed ? "auth" : "guest"}>
      {/* Header tự động đổi theo trạng thái đăng nhập */}
      {isAuthed ? (
        <HeaderAfter user={currentUser ?? undefined} />
      ) : (
        <HeaderBefore />
      )}

      <Content
        style={{
          flex: 1,
          background: "#ffffff",
          minHeight: "calc(100vh - 120px)", // trừ header + footer
        }}
      >
        {children ?? <Outlet />}
      </Content>

      <FooterComponent />
    </Layout>
  );
}

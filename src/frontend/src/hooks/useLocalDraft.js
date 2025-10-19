// src/hooks/useLocalDraft.js
import { useEffect, useState, useRef } from "react";

export function useLocalDraft(key, initialValue) {
  // chỉ đọc localStorage 1 lần (lazy init) -> tránh reset khi re-render
  const [draft, setDraft] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // tránh ghi vòng lặp vô hạn khi key đổi
  const keyRef = useRef(key);
  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  // lưu lại mỗi khi draft đổi (debounce nhẹ)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(keyRef.current, JSON.stringify(draft));
      } catch {}
    }, 80);
    return () => clearTimeout(t);
  }, [draft]);

  const clearDraft = () => {
    try { localStorage.removeItem(keyRef.current); } catch {}
    setDraft(initialValue);
  };

  return { draft, setDraft, clearDraft };
}

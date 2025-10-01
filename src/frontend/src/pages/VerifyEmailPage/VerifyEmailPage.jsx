import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VerifyEmailPage.css";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyEmailPage() {
  const { state } = useLocation();
  const email = state?.email || "";
  const navigate = useNavigate();

  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputsRef = useRef([]);

  const [left, setLeft] = useState(RESEND_SECONDS);
  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [left]);

  // Focus ô đầu tiên
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (i, value) => {
    const v = value.replace(/\D/g, "");
    if (!v) {
      setCode(prev => prev.map((c, idx) => (idx === i ? "" : c)));
      return;
    }
    setCode(prev => {
      const next = [...prev];
      next[i] = v[0];
      return next;
    });
    if (i < CODE_LENGTH - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
    if (e.key === "ArrowRight" && i < CODE_LENGTH - 1) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!text) return;
    const arr = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < Math.min(text.length, CODE_LENGTH); i++) {
      arr[i] = text[i];
    }
    setCode(arr);
    const last = Math.min(text.length - 1, CODE_LENGTH - 1);
    inputsRef.current[last]?.focus();
  };

  const joined = code.join("");
  const isComplete = joined.length === CODE_LENGTH;

  const submit = () => {
    if (!isComplete) return;
    console.log("Verify code:", { email, code: joined });
    navigate("/welcome"); // hoặc call API verify
  };

  const resend = () => {
    if (left > 0) return;
    console.log("Resend code to:", email);
    setLeft(RESEND_SECONDS);
  };

  return (
    <div className="t-register t-otp-container">
      <div className="t-step">Step 3 of 3</div>
      <h1 className="t-heading">Verify Your Email</h1>

      <p className="t-otp-sub">
        Enter the code sent to <strong>{email || "your email"}</strong>
      </p>

      <div className="t-otp-boxes" onPaste={handlePaste}>
        {code.map((val, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            className="t-otp-input"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>

      <button
        className={`t-btn ${isComplete ? "t-btn-primary" : "t-btn-disabled"}`}
        onClick={submit}
        disabled={!isComplete}
        style={{ marginTop: 24 }}
      >
        Continue
      </button>

      <button
        type="button"
        className="t-btn t-btn-outline"
        onClick={resend}
        disabled={left > 0}
        style={{ marginTop: 12 }}
      >
        {left > 0 ? `Resend Code in ${left}s` : "Resend Code"}
      </button>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { otpService } from "../../services/otpService.jsx";
import api from "../../config/api";
import "./VerifyEmailPage.css";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyEmailPage() {
  const { state } = useLocation();
  const email = state?.email || "";
  const purpose = state?.purpose || "signup"; // "signup" | "reset"
  const registrationData = state?.registrationData || null; // Dữ liệu register
  const navigate = useNavigate();

  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputsRef = useRef([]);
  const [left, setLeft] = useState(RESEND_SECONDS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fallback: nếu không có email thì đưa về trang tương ứng
  useEffect(() => {
    if (!email) {
      navigate(purpose === "reset" ? "/forgot-password" : "/register", {
        replace: true,
      });
    }
  }, [email, navigate, purpose]);

  // Countdown resend
  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [left]);

  // Focus ô đầu tiên
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (i, value) => {
    setError("");
    const v = value.replace(/\D/g, "");
    if (!v) {
      setCode((prev) => prev.map((c, idx) => (idx === i ? "" : c)));
      return;
    }
    setCode((prev) => {
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
    if (e.key === "ArrowLeft" && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < CODE_LENGTH - 1)
      inputsRef.current[i + 1]?.focus();
    if (e.key === "Enter") submit(); // enter để submit nhanh
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!text) return;
    const arr = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < Math.min(text.length, CODE_LENGTH); i++)
      arr[i] = text[i];
    setCode(arr);
    const last = Math.min(text.length - 1, CODE_LENGTH - 1);
    inputsRef.current[last]?.focus();
  };

  const joined = code.join("");
  const isComplete =
    joined.length === CODE_LENGTH && code.every((c) => c !== "");

  // Auto submit khi đủ 6 số
  useEffect(() => {
    if (isComplete && !submitting) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  async function submit() {
    if (!isComplete || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      if (purpose === "signup") {
        // Bước 1: Verify OTP bằng endpoint mới
        const res = await otpService.verifyRegisterOtp(email, joined);

        // Bước 2: Nếu có dữ liệu registration, tạo account sau khi verify thành công
        if (registrationData) {
          const registerRes = await api.post(
            "/api/v1/auth/register",
            registrationData
          );
        }

        navigate("/login", {
          replace: true,
          state: {
            message:
              "Registration successful! Please wait for admin approval to login.",
            type: "success",
          },
        });
      } else {
        // reset password flow - xác thực OTP với backend trước khi chuyển bước
        // Gọi verifyOtp, nếu đúng thì chuyển sang bước đổi mật khẩu
        await otpService.verifyOtp(email, joined);
        navigate("/reset-password", {
          replace: true,
          state: { email, verifiedOtp: joined },
        });
      }
    } catch (e) {
      setError("The code you entered is incorrect or expired.");
      setSubmitting(false);
      // focus lại ô đầu để gõ lại
      inputsRef.current[0]?.focus();
    }
  }

  const resend = async () => {
    if (left > 0) return;
    try {
      await otpService.resendOtp(email);
      setLeft(RESEND_SECONDS);
    } catch (e) {
      setError("Unable to resend code. Please try again later.");
    }
  };

  const heading =
    purpose === "reset" ? "Verify to Change Password" : "Verify Your Email";
  const subtitle =
    purpose === "reset" ? (
      <>
        Enter the 6-digit code to change password for{" "}
        <strong>{email || "your email"}</strong>
      </>
    ) : (
      <>
        Enter the 6-digit code sent to <strong>{email || "your email"}</strong>
      </>
    );

  return (
    <div className="t-otp-container">
      <div className="t-step">
        Step {purpose === "reset" ? "1 of 2" : "2 of 2"}
      </div>
      <h1 className="t-heading">{heading}</h1>

      <p className="t-otp-sub">{subtitle}</p>

      <div className="t-otp-boxes" onPaste={handlePaste}>
        {code.map((val, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            className="t-otp-input"
            inputMode="numeric"
            aria-label={`Digit ${i + 1}`}
            pattern="[0-9]*"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={submitting}
          />
        ))}
      </div>

      {error && (
        <div className="t-error" role="alert">
          {error}
        </div>
      )}

      <button
        className={`t-btn ${isComplete ? "t-btn-primary" : "t-btn-disabled"}`}
        onClick={submit}
        disabled={!isComplete || submitting}
        style={{ marginTop: 24 }}
      >
        {submitting ? "Verifying…" : "Continue"}
      </button>

      <button
        type="button"
        className="t-btn t-btn-outline"
        onClick={resend}
        disabled={left > 0 || submitting}
        style={{ marginTop: 12 }}
      >
        {left > 0 ? `Resend Code in ${left}s` : "Resend Code"}
      </button>
    </div>
  );
}

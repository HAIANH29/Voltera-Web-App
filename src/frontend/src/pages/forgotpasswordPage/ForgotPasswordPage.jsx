import { useNavigate } from "react-router-dom";
import "./ForgotPasswordPage.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.currentTarget.elements.email.value.trim();
    if (!email) return;
    // TODO: gọi API gửi OTP tại đây (await sendOTP(email))
    navigate("/verify-email", { state: { email } }); // hoặc routes.verifyEmail
  };

  return (
    <div className="forgot-page">
      <div className="card">
        <h1>Forgot Password</h1>
        <p>Please enter your email address to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" required />
          <button type="submit">Send OTP</button>
        </form>
      </div>
    </div>
  );
}

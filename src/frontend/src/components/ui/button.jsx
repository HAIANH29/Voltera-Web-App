import React from "react";
import { Button as AntdButton } from "antd";

// Mapping từ variant + size sang style
const variantStyles = {
  default: {
    backgroundColor: "var(--primary)",
    color: "var(--primary-foreground)",
  },
  destructive: {
    backgroundColor: "var(--destructive)",
    color: "#fff",
  },
  outline: {
    border: "1px solid var(--border)",
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
  },
  secondary: {
    backgroundColor: "var(--secondary)",
    color: "var(--secondary-foreground)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--foreground)",
  },
  link: {
    background: "none",
    color: "var(--primary)",
    textDecoration: "underline",
  },
};

const sizeStyles = {
  default: { height: "36px", padding: "0 16px", fontSize: "14px" },
  sm: { height: "32px", padding: "0 12px", fontSize: "13px" },
  lg: { height: "40px", padding: "0 20px", fontSize: "15px" },
  icon: { width: "36px", height: "36px", padding: 0 },
};

const Button = ({
  text,
  onClick,
  type = "default",
  variant = "default",
  size = "default",
  style,
  ...props
}) => {
  return (
    <AntdButton
      type={type}
      onClick={onClick}
      style={{
        borderRadius: "6px",
        transition: "all 0.3s ease-in-out",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {text}
    </AntdButton>
  );
};

export default Button;

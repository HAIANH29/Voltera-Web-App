import React from "react";
import "./miniPost.css";

export default function MiniPost({
  image,
  productName,
  basicInfo = [],
  sellerName,
  price,
  isNew,
  isFavorite,
  onFavoriteClick,
  onClick,
}) {
  // Format price as VND
  const formatPriceVND = (price) => {
    if (typeof price === "string" && price.includes("VND")) {
      return price; // Already formatted
    }
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (!numPrice || numPrice === 0) return "Contact for price";
    
    return new Intl.NumberFormat("vi-VN").format(numPrice) + " VND";
  };

  const priceFmt = formatPriceVND(price);

  return (
    <article className="mini-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="mini-media">
        <img src={image} alt={productName} loading="lazy" />
        {isNew && <span className="badge-new">NEW</span>}
        <button
          type="button"
          className={`fav ${isFavorite ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteClick?.();
          }}
          aria-label="favorite"
          title="Save to favorites"
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="mini-body">
        <h3 className="mini-title" title={productName}>
          {productName}
        </h3>

        <ul className="mini-specs">
          {basicInfo.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>

        <div className="mini-meta">
          <span className="seller" title={sellerName}>
            {sellerName}
          </span>
          <span className="price">
            {priceFmt}
          </span>
        </div>
      </div>
    </article>
  );
}

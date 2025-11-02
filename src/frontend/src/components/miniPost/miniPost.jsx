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
  // Use the pre-formatted price string if it's already formatted, otherwise format as VND
  const priceFmt =
    typeof price === "string" && price.includes("$")
      ? price
      : new Intl.NumberFormat("vi-VN").format(price);

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
            {typeof price === "string" && price.includes("$")
              ? priceFmt
              : `${priceFmt} ₫`}
          </span>
        </div>
      </div>
    </article>
  );
}

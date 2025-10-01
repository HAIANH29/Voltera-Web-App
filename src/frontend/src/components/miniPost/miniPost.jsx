import React, { useState } from 'react';
import './miniPost.css';

const MiniPost = ({ 
  image,
  productName,
  basicInfo,
  sellerName,
  price,
  isNew = false,
  isFavorite = false,
  onFavoriteClick,
  onClick
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onFavoriteClick) {
      onFavoriteClick();
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
      }).format(price);
    }
    return price;
  };

  return (
    <div className="mini-post-card" onClick={onClick}>
      {/* Badge cho sản phẩm mới */}
      {isNew && (
        <div className="new-badge">
          New
        </div>
      )}

      {/* Nút yêu thích */}
      <button 
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label="Add to favorites"
      >
        <svg 
          className="heart-icon" 
          fill={isFavorite ? "currentColor" : "none"} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </button>

      {/* Ảnh sản phẩm */}
      <div className="post-image-container">
        {isImageLoading && (
          <div className="image-skeleton">
            <div className="skeleton-animation"></div>
          </div>
        )}
        
        {!imageError ? (
          <img
            src={image}
            alt={productName}
            className="post-image"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: isImageLoading ? 'none' : 'block' }}
          />
        ) : (
          <div className="image-placeholder">
            <svg className="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <span>No Image</span>
          </div>
        )}
      </div>

      {/* Nội dung bài đăng */}
      <div className="post-content">
        {/* Tên sản phẩm */}
        <h3 className="product-name" title={productName}>
          {productName}
        </h3>

        {/* Thông tin cơ bản */}
        <div className="basic-info">
          {Array.isArray(basicInfo) ? (
            basicInfo.map((info, index) => (
              <span key={index} className="info-item">
                {info}
              </span>
            ))
          ) : (
            <span className="info-item">{basicInfo}</span>
          )}
        </div>

        {/* Thông tin người bán */}
        <div className="seller-info">
          <svg className="seller-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
          <span className="seller-name" title={sellerName}>
            {sellerName}
          </span>
        </div>

        {/* Giá tiền */}
        <div className="price-section">
          <span className="price">
            {formatPrice(price)}
          </span>
        </div>
      </div>

      {/* Overlay cho hover effect */}
      <div className="card-overlay"></div>
    </div>
  );
};

export default MiniPost;

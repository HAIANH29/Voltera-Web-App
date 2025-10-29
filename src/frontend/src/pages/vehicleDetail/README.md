# Vehicle Detail Page

## Overview
Modern vehicle detail page designed with Tesla-inspired theme and optimized UX/UI.

## Backend Integration
- **Endpoint**: `/api/post/detail/{postId}`
- **Response**: PostResponse with nested VehicleDTO
- **Fields Mapped**:
  - Vehicle specs: battery, range, charging time, seats, color, style
  - Post info: title, description, price, images, seller location
  - Computed fields: odometer status (new/used), specifications table

## Features
- 📱 **Responsive Design**: Mobile-first with tablet and desktop optimizations
- 🖼️ **Image Gallery**: Main image + thumbnail navigation
- ⭐ **Favorite System**: Heart button with persistence (ready for backend)
- 📞 **Contact Flow**: Direct seller contact via phone/messaging
- 🎨 **Tesla Theme**: Clean design with Tesla red accent (#e82127)
- 🔄 **Loading States**: Skeleton loading and error handling
- 🏷️ **Badge System**: "New" badge for zero-odometer vehicles

## Data Mapping
```javascript
PostResponse -> VehicleDetail {
  vehicle.brand -> brand
  vehicle.batterycapacity -> batteryCapacity
  vehicle.range -> range (km)
  vehicle.chargingtime -> chargingTime (hours)
  vehicle.odo -> odometer status
  location -> seller.address
  imageUrls -> image gallery
}
```

## Theme Variables
```css
--accent: #e82127      /* Tesla red */
--text: #0b0f13        /* Dark text */
--muted: #6b7280       /* Muted text */
--card-radius: 12px    /* Rounded corners */
--shadow: soft shadows /* Depth */
```

## UX Improvements
- Sticky pricing/contact sidebar
- Breadcrumb navigation
- Hover effects and transitions
- Professional typography (Inter font)
- Accessible color contrast
- Touch-friendly button sizes

## Usage
```jsx
<VehicleDetail />  // Uses postID from URL params
```

The component automatically fetches vehicle data and renders a complete product detail page suitable for modern electric vehicle marketplaces.
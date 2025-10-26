import React from 'react';

// Simple test component to check if basic functionality works
export default function TestMap({ isOpen, onClose, onLocationSelect }) {
  const handleConfirm = () => {
    // Mock location data for testing
    onLocationSelect({
      coords: { lat: 10.762622, lng: 106.660172 },
      address: "Ho Chi Minh City, Vietnam"
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h3>Test Map Picker</h3>
        <p>This is a test version without Leaflet to check basic functionality.</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleConfirm} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>
            Select Test Location
          </button>
        </div>
      </div>
    </div>
  );
}
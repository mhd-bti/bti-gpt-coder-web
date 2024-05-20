// LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ onClose }) => {
    return (
        <div className="spinner-overlay" onClick={onClose}>
            <div className="loading-spinner" onClick={onClose}></div>
        </div>
    );
};

export default LoadingSpinner;

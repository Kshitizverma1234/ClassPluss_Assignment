import React from 'react';
import './premiumModal.css'; 

const PremiumModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-box">
        <button className="close" onClick={onClose}>&times;</button>
        <h2> Unlock Premium Access</h2>
        <p>This is a premium template. Upgrade your account to unlock this design and many more exclusive features!</p>
        <ul>
          <li> Unlimited Premium Templates</li>
          <li> Drag-and-Drop Image Editing</li>
          <li> High-Resolution Downloads</li>
          <li> Remove Watermarks</li>
        </ul>
        <button className="btn" style={{width: '100%', marginTop: '15px'}} onClick={() => alert("Payment gateway here!")}>
          Upgrade to Premium - $4.99/mo
        </button>
      </div>
    </div>
  );
};

export default PremiumModal;
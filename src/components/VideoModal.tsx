// src/components/VideoModal.jsx
import { X } from 'lucide-react';
import './VideoModal.css';

export function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="video-container">
          <video controls autoPlay className="showreel-video">
            <source src="crew/bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
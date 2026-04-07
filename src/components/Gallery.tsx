import { useState, useEffect } from 'react';
import './Gallery.css';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  date: string;
}

export function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Moments', icon: '' },
    { id: 'bts', name: 'Behind Scenes', icon: '' },
    { id: 'workshop', name: 'Workshops', icon: '' },
    { id: 'event', name: 'Events', icon: '' },
    { id: 'team', name: 'Team', icon: '' },
    { id: 'achievement', name: 'Achievements', icon: '' }
  ];

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/gallery');
      const data = await response.json();
      
      console.log('Fetched gallery data:', data); // Debug log
      
      if (data.success) {
        setImages(data.images);
        setError(null);
      } else {
        setError('Failed to load gallery');
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  // Function to get image URL
  const getImageUrl = (url: string) => {
    // If URL already starts with http, use it as is
    if (url.startsWith('http')) {
      return url;
    }
    // Otherwise, prepend the backend URL
    return `http://localhost:5000${url}`;
  };

  if (loading) {
    return (
      <section id="gallery" className="gallery-section">
        <div className="gallery-container">
          <div style={{ textAlign: 'center', width: '100%' }}>
            <h2 className="section-title">
              Our <span className="primary-gradient-text">Gallery</span>
            </h2>
            <p className="gallery-subtitle">
              Capturing memories, one frame at a time 🎬
            </p>
          </div>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="gallery" className="gallery-section">
        <div className="gallery-container">
          <div style={{ textAlign: 'center', width: '100%' }}>
            <h2 className="section-title">
              Our <span className="primary-gradient-text">Gallery</span>
            </h2>
            <p className="gallery-subtitle">
              Capturing memories, one frame at a time 🎬
            </p>
          </div>
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={fetchGallery} className="retry-btn">Retry</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-container">
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h2 className="section-title">
            Our <span className="primary-gradient-text">Gallery</span>
          </h2>
          <p className="gallery-subtitle">
            Capturing memories, one frame at a time 🎬
          </p>
        </div>

        {/* Category Filters */}
        <div className="gallery-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="filter-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="no-images">
            <p>📸 No images found in this category</p>
            <p>Be the first to upload photos!</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredImages.map(image => {
              const imageUrl = getImageUrl(image.url);
              console.log('Loading image:', imageUrl); // Debug log
              
              return (
                <div 
                  key={image.id} 
                  className="gallery-item"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="gallery-image-wrapper">
                    <img 
                      src={imageUrl} 
                      alt={image.title}
                      onError={(e) => {
                        console.error('Failed to load image:', imageUrl);
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                    <div className="gallery-overlay">
                      <span className="view-icon">🔍</span>
                      <p>{image.title}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="lightbox" onClick={() => setSelectedImage(null)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedImage(null)}>✕</button>
              <img 
                src={getImageUrl(selectedImage.url)} 
                alt={selectedImage.title} 
              />
              <div className="lightbox-caption">
                <h3>{selectedImage.title}</h3>
                <p>{new Date(selectedImage.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
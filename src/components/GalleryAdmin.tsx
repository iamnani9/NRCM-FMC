import { useState } from 'react';
import './GalleryAdmin.css';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  date: string;
  filename: string;
}

export function GalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('bts');
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const ADMIN_PASSWORD = 'nani1234'; // Change this to a strong password

  const fetchGallery = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gallery');
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchGallery();
    } else {
      showMessage('error', 'Wrong password!');
    }
  };

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title) {
      showMessage('error', 'Please select a file and enter a title');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', title);
    formData.append('category', category);

    try {
      const response = await fetch('http://localhost:5000/api/gallery/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Image uploaded successfully!');
        setSelectedFile(null);
        setTitle('');
        setCategory('bts');
        fetchGallery();
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        showMessage('error', data.message || 'Upload failed');
      }
    } catch (error) {
      showMessage('error', 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, _filename: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/gallery/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          showMessage('success', 'Image deleted successfully');
          fetchGallery();
        } else {
          showMessage('error', 'Delete failed');
        }
      } catch (error) {
        showMessage('error', 'Error deleting image');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="gallery-admin-login">
        <div className="login-box">
          <h2>🎨 Gallery Admin</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-admin">
      <div className="admin-header">
        <h2>📸 Gallery Management</h2>
        <button onClick={() => setIsAuthenticated(false)} className="logout-btn">
          Logout
        </button>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Upload Form */}
      <div className="upload-form">
        <h3>Upload New Image</h3>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label>Image Title</label>
            <input
              type="text"
              placeholder="e.g., Behind the Scenes - Short Film"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="bts">Behind Scenes</option>
              <option value="workshop">Workshops</option>
              <option value="event">Events</option>
              <option value="team">Team</option>
              <option value="achievement">Achievements</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select Image (Max 5MB)</label>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleFileSelect}
              required
            />
          </div>

          <button type="submit" disabled={uploading} className="upload-btn">
            {uploading ? 'Uploading...' : '📤 Upload Image'}
          </button>
        </form>
      </div>

      {/* Gallery Images */}
      <div className="admin-gallery-grid">
        <h3>Gallery Images ({images.length})</h3>
        <div className="images-grid">
          {images.map(image => (
            <div key={image.id} className="admin-image-card">
              <img src={`http://localhost:5000${image.url}`} alt={image.title} />
              <div className="image-info">
                <h4>{image.title}</h4>
                <p>Category: {image.category}</p>
                <p>Date: {new Date(image.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDelete(image.id, image.filename)}
                className="delete-image-btn"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
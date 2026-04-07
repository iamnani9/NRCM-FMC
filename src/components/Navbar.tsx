import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';
{/* Add this link in your navbar */}
<a href="/admin/gallery" className="admin-link" style={{ color: '#e6b800' }}>
  📸 Admin
</a>
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="nav-container">
        <div className="logo">
          <img src="/logo.png" alt="NRCM-FMC Logo" className="logo-image" />
          <span className="logo-text">NRCM<span className="highlight">-FMC</span></span>
        </div>

        <div className="nav-links desktop-only">
          <a href="#hero" className="nav-link">Home</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#portfolio" className="nav-link">Films</a>
          <a href="#crew" className="nav-link">The Crew</a>
        </div>

        <div className="nav-actions desktop-only">
          <a href="#join" className="join-btn pulse-hover">Join Us</a>
        </div>

        <button 
          className="mobile-menu-btn mobile-only"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open glass-panel' : ''}`}>
        <a href="#hero" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#portfolio" onClick={() => setMenuOpen(false)}>Films</a>
        <a href="#crew" onClick={() => setMenuOpen(false)}>The Crew</a>
        <a href="#join" className="join-btn" onClick={() => setMenuOpen(false)}>Join Us</a>
      </div>
    </nav>
  );
}

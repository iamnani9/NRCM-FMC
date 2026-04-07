import './SocialMedia.css';

export function SocialMedia() {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: '📸',
      url: 'https://instagram.com/nrcm.fmc',
      username: '@nrcm.fmc',
      color: '#E4405F',
      description: 'Daily BTS, updates, and behind the scenes'
    },
    {
      name: 'YouTube',
      icon: '🎥',
      url: 'https://youtube.com/@nrcmfmc',
      username: 'NRCM FMC',
      color: '#FF0000',
      description: 'Short films, workshops, and tutorials'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: 'https://linkedin.com/company/nrcmfmc',
      username: 'NRCM Film Club',
      color: '#0A66C2',
      description: 'Professional network and alumni'
    },
    {
      name: 'Twitter',
      icon: '',
      url: 'https://twitter.com/nrcmfmc',
      username: '@nrcmfmc',
      color: '#1DA1F2',
      description: 'Quick updates and announcements'
    }
  ];

  return (
    <section id="social" className="social-section">
      <div className="social-container">
        <h2 className="section-title">
          Connect With <span className="primary-gradient-text">Us</span>
        </h2>
        <p className="social-subtitle">
          Follow our journey on social media
        </p>

        <div className="social-grid">
          {socialLinks.map(platform => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card"
              style={{ '--hover-color': platform.color } as React.CSSProperties}
            >
              <div className="social-icon">{platform.icon}</div>
              <div className="social-info">
                <h3>{platform.name}</h3>
                <p className="social-username">{platform.username}</p>
                <p className="social-description">{platform.description}</p>
              </div>
              <div className="social-arrow">→</div>
            </a>
          ))}
        </div>

        {/* Instagram Feed Preview (Optional) */}
        <div className="instagram-feed">
          <h3>Latest from Instagram 📸</h3>
          <div className="feed-placeholder">
            <p>Follow us on Instagram for real-time updates!</p>
            <a href="https://instagram.com/nrcmfmc" target="_blank" rel="noopener noreferrer" className="follow-btn">
              Follow @nrcmfmc
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
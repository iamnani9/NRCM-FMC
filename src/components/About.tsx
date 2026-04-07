import { Camera, Film, Users, Video, TrendingUp, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import './About.css';

export function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('about');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const stats = [
    {
      icon: <Users className="stat-icon" />,
      value: "25+",
      label: "Active Members",
      description: "Passionate filmmakers"
    },
    {
      icon: <Film className="stat-icon" />,
      value: "3+",
      label: "Projects",
      description: "In production"
    },
    {
      icon: <Video className="stat-icon" />,
      value: "2+",
      label: "Workshops",
      description: "Planned"
    },
    {
      icon: <Camera className="stat-icon" />,
      value: "Pro",
      label: "Equipment",
      description: "Professional gear"
    },
    {
      icon: <TrendingUp className="stat-icon" />,
      value: "Growing",
      label: "Every Week",
      description: "New talents join"
    },
    {
      icon: <Sparkles className="stat-icon" />,
      value: "Fresh",
      label: "Perspective",
      description: "Creative ideas"
    }
  ];

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-content">
          <div className={`fade-in-up ${isVisible ? 'visible' : ''}`}>
            <div className="about-badge">
              <span className="badge-dot"></span>
              Welcome to Our Journey
            </div>
            
            <h2 className="section-title">
              Redefining <span className="primary-gradient-text">Cinema</span> 
              <br />on Campus.
            </h2>
            
            <p className="about-description">
              NRCM-FMC (Film Making Club) is a fresh, passionate collective of students who believe 
              in the power of visual storytelling. Though we're new, our energy and creativity know 
              no bounds.
            </p>
            
            <p className="about-description">
              Whether you're an aspiring director, a writer with stories to tell, or someone who just 
              loves being behind the camera, we're building a community where every creative voice 
              matters. Join us as we write the first chapter of our cinematic journey.
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className={`stats-grid-container ${isVisible ? 'visible' : ''}`}>
            <div className="stats-header">
              <h3>Our Beginning</h3>
              <p>Just started, but dreaming big ✨</p>
            </div>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="stat-card glass-panel"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {stat.icon}
                  <h3>{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                  <span className="stat-description">{stat.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Visual Gallery */}
        <div className={`about-visuals ${isVisible ? 'visible' : ''}`}>
          <div className="visual-grid">
            <div className="visual-item main-visual">
              <div className="visual-overlay">
                <div className="play-icon">🎬</div>
                <p>Our First Meeting</p>
              </div>
            </div>
            <div className="visual-item">
              <div className="visual-overlay">
                <p>Planning Session</p>
              </div>
            </div>
            <div className="visual-item">
              <div className="visual-overlay">
                <p>First Shoot</p>
              </div>
            </div>
            <div className="visual-item">
              <div className="visual-overlay">
                <p>Team Building</p>
              </div>
            </div>
            <div className="visual-item">
              <div className="visual-overlay">
                <p>Creative Discussions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="mission-vision">
        <div className="mission-card">
          <div className="mission-icon"></div>
          <h3>Our Mission</h3>
          <p>To create a vibrant filmmaking community where students can learn, experiment, and bring their creative visions to life, regardless of experience level.</p>
        </div>
        <div className="vision-card">
          <div className="vision-icon"></div>
          <h3>Our Vision</h3>
          <p>To become the heartbeat of campus creativity, producing meaningful content and nurturing the next generation of filmmakers, storytellers, and artists.</p>
        </div>
      </div>
    </section>
  );
}
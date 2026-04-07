import { Play, ArrowRight } from 'lucide-react';
import { useState } from 'react'; // ADD THIS
import { VideoModal } from './VideoModal'; // ADD THIS
import './Hero.css';

export function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false); // ADD THIS

  return (
    <section id="hero" className="hero">
      <div className="hero-overlay"></div>
      
      {/* Dynamic background element simulating light leak */}
      <div className="light-leak"></div>

      <div className="hero-content">
        <div className="hero-badge animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <span className="badge-dot"></span>
          NRCM Film Making Club
        </div>
        
        <h1 className="hero-title animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Framing <span className="primary-gradient-text">Stories</span>,<br />
          Behind <span className="gradient-text">Classrooms</span>.
        </h1>
        
        <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.6s' }}>
          Join the premier community of student filmmakers, directors, and creatives pushing the boundaries of visual storytelling.
        </p>

        <div className="hero-actions animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <a 
            href="#portfolio" 
            className="btn-primary"
            onClick={(e) => {
              e.preventDefault(); // ADD THIS - prevents page jump
              setIsVideoOpen(true); // ADD THIS - opens video modal
            }}
          >
            <Play size={20} className="icon-left" />
            Watch Showreel
          </a>
          <a href="#about" className="btn-secondary">
            Explore Club
            <ArrowRight size={20} className="icon-right" />
          </a>
        </div>
      </div>

      {/* ADD THIS - Video Modal */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </section>
  );
}
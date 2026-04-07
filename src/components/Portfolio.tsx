import { Play } from 'lucide-react';
import './Portfolio.css';

const projects = [
  {
    id: 1,
    title: 'The Vision Unites',
    category: 'Short Film',
    image: '/projects/pstr.jpg',
    director: 'N A N I'
  },
  {
    id: 2,
    title: 'Farewell Tribute',
    category: 'Music Video',
    image: '/projects/cmngg.jpg',
    director: 'Team FMC'
  }

];

export function Portfolio() {
  return (
    <section id="portfolio" className="portfolio-section">
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h2 className="section-title">Featured <span className="primary-gradient-text">Films</span></h2>
          <p className="portfolio-subtitle">Explore our latest award-winning student productions.</p>
        </div>

        <div className="portfolio-grid">
          {projects.map((project) => (
            <div key={project.id} className="portfolio-card">
              <div 
                className="portfolio-image" 
                style={{ backgroundImage: `url(${project.image})` }}
              >
                <div className="portfolio-overlay">
                  <button className="play-btn">
                    <Play fill="currentColor" size={32} />
                  </button>
                  <div className="portfolio-info">
                    <span className="portfolio-category">{project.category}</span>
                    <h3 className="portfolio-title">{project.title}</h3>
                    <p className="portfolio-director">Dir. {project.director}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="portfolio-footer">
          <button className="btn-secondary">View Complete Archive</button>
        </div>
      </div>
    </section>
  );
}

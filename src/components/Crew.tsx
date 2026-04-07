import { Globe, Mail, Link } from 'lucide-react';
import './Crew.css';

const crew = [
  { id: 1, name: 'Praveen', role: 'Faculty Coordinator  ', image: 'crew/praveen.png' },
  { id: 2, name: 'NANI', role: 'Creative Director', image: '/crew/nani.png' },
  { id: 3, name: 'Mojesh', role: 'Executive Producer', image: 'crew/mojesh.png' },
  { id: 4, name: 'Shoyab', role: 'Production Head', image: 'crew/shoyab.png' },
  { id: 5, name: 'Ashwitha', role: 'Production Sub Lead', image: 'crew/ashwitha.png' },
  { id: 6, name: 'Veda', role: 'Operation Head', image: 'crew/veda.png' },
  { id: 7, name: 'Manjusha', role: 'Operation Sub Lead', image: 'crew/manjusha.png' },
  { id: 8, name: 'Gowtham', role: 'Cinematography  Lead', image: 'crew/gowtham.png' },
  { id: 9, name: 'Abhi', role: 'Cinematography Sub Lead', image: 'crew/abhi.png' },
  { id: 10, name: 'Hari', role: 'Screen Writing Lead', image: 'crew/hari.png' },
  { id: 11, name: 'Manish', role: 'Visual Design Lead', image: 'crew/manish.png' },
  { id: 12, name: 'Priya', role: 'Visual Design Sub Lead', image: 'crew/friya.png' },
  { id: 13, name: 'Akshith', role: 'Post Production Lead', image: 'crew/akshith.png' },
  { id: 14, name: 'Bharat', role: 'Post Production Sub Lead', image: 'crew/bharat.png' },
  { id: 15, name: 'Chanchal', role: 'Marketing Lead', image: 'crew/chanchal.jpg' },
  { id: 16, name: 'Nikitha  ', role: 'Marketing Sub Lead', image: 'crew/Nikitha.png' },
  { id: 17, name: 'Vamshi', role: 'Content Creation Lead', image: 'crew/vamshi.png' }

];

export function Crew() {
  return (
    <section id="crew" className="crew-section">
      <div className="crew-container">
        <div className="crew-header">
          <h2 className="section-title">The <span className="primary-gradient-text">Crew</span></h2>
          <p className="crew-subtitle">Meet the visionary leaders behind NRCM-FMC.</p>
        </div>

        <div className="crew-grid">
          {crew.map((member) => (
            <div key={member.id} className="crew-card">
              <div 
                className="crew-image"
                style={{ backgroundImage: `url(${member.image})` }}
              >
                <div className="crew-socials">
                  <a href="#" className="social-icon"><Globe size={20} /></a>
                  <a href="#" className="social-icon"><Mail size={20} /></a>
                  <a href="#" className="social-icon"><Link size={20} /></a>
                </div>
              </div>
              <div className="crew-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

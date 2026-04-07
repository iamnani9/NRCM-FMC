// src/components/Join.tsx
import { useState } from 'react';
import './Join.css';

export function Join() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    year: '',
    branch: '',
    section: '',
    role: '',
    reason: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: '✨ Application submitted successfully! Check your email for confirmation.'
        });
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          year: '',
          branch: '',
          section: '',
          role: '',
          reason: ''
        });
        
        // Scroll to top of form
        document.querySelector('.join-form')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: '❌ Failed to submit application. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: '' });
      }, 5000);
    }
  };

  return (
    <section id="join" className="join-section">
      <div className="join-container">
        <div className="join-content">
          <h2 className="section-title">
            Ready to <span className="primary-gradient-text">Take Action?</span>
          </h2>
          <p className="join-subtitle">
            Auditions and backend crew recruitments are now open. Step into the spotlight or take charge behind the lens.
          </p>

          {submitStatus.type && (
            <div className={`alert ${submitStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {submitStatus.message}
            </div>
          )}

          <form className="join-form glass-panel" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="John Doe" 
                  value={formData.fullName}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Year *</label>
                <select 
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select year...</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              <div className="form-group">
                <label>Branch *</label>
                <select 
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select branch...</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="IT">IT</option>
                  <option value="AIML">AI & ML</option>
                  <option value="DS">Data Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Section *</label>
                <input 
                  type="text" 
                  name="section"
                  placeholder="e.g. A, B, C..." 
                  value={formData.section}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Role of Interest *</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a role...</option>
                  <option value="Director">Director</option>
                  <option value="Actor">Actor</option>
                  <option value="Cinematographer">Cinematographer</option>
                  <option value="Video Editor">Video Editor</option>
                  <option value="Script Writer">Script Writer</option>
                  <option value="Sound Designer">Sound Designer</option>
                  <option value="Production Manager">Production Manager</option>
                  <option value="Other">Other / General</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Why do you want to join NRCM-FMC? *</label>
              <textarea 
                name="reason"
                rows={4} 
                placeholder="Tell us about your passion, experience, and what you hope to contribute..." 
                value={formData.reason}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className={`submit-btn primary-btn pulse-hover ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                '🚀 Submit Application'
              )}
            </button>
          </form>
        </div>
      </div>
      
      <footer className="footer border-t border-white/10 mt-20 pt-10 pb-10 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} NRCM Film Making Club. All Rights Reserved.</p>
      </footer>
    </section>
  );
}
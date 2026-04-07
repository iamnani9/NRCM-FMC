import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Portfolio } from './components/Portfolio';
import { VideoModal } from './components/VideoModal';
import { Crew } from './components/Crew';
import { Join } from './components/Join';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { SocialMedia } from './components/SocialMedia';
import { GalleryAdmin } from './components/GalleryAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Hero />
            <About />
            <VideoModal/>
            <Portfolio />
            <Crew />
            <Gallery />
            <SocialMedia />
            <Contact />
            <Join />
          </>
        } />
        <Route path="/admin/gallery" element={<GalleryAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;

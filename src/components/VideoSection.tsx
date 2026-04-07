// src/components/VideoSection.tsx

const VideoSection = () => {
  return (
    <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      >
        <source src='crew/bg.mp4' type="video/mp4" />
      </video>
      <div style={{ 
        position: 'relative', 
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
        <h2>Your Text Overlay Here</h2>
      </div>
    </div>
  );
};

export default VideoSection;
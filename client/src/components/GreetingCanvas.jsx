import React, { useRef, useEffect, useState } from 'react';
import './greetingCanvas.css';

const GreetingCanvas = ({ template, user, onShare }) => {
  const canvasRef = useRef(null);
  const bgImgRef = useRef(new Image());
  const profImgRef = useRef(new Image());
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [customText, setCustomText] = useState("Your custom\nmessage here...");
  const [textPos, setTextPos] = useState({ x: 300, y: 550 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setImagesLoaded(false);
    
    // Load Background
    bgImgRef.current.crossOrigin = "anonymous";
    bgImgRef.current.src = template.imageKitUrl;

    // Safely load profile picture or fallback to initials
    profImgRef.current.crossOrigin = "anonymous";
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&size=150`;
    profImgRef.current.src = (user && user.profilePic) ? user.profilePic : fallbackAvatar;

    Promise.all([
      new Promise(resolve => { bgImgRef.current.onload = resolve; }),
      new Promise(resolve => { 
        profImgRef.current.onload = resolve;
        profImgRef.current.onerror = () => {
          profImgRef.current.src = fallbackAvatar; // Ultimate fallback
          resolve();
        }
      })
    ]).then(() => {
      canvasRef.current.width = 600; 
      canvasRef.current.height = 750; 
      setImagesLoaded(true);
    });
  }, [template, user]);

  const drawCanvas = () => {
    if (!imagesLoaded) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Header
    const headerHeight = 100;
    ctx.fillStyle = '#1e293b'; 
    ctx.fillRect(0, 0, canvas.width, headerHeight);

    // Name
    ctx.font = '600 26px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(user.name || "Guest User", canvas.width / 2, headerHeight / 2);

    // Background Image
    ctx.drawImage(bgImgRef.current, 0, headerHeight, canvas.width, canvas.height - headerHeight);

    // Profile Picture (Fix for the empty ring)
    const profileRadius = 45;
    const profileX = 100; 
    const profileY = headerHeight; 

    ctx.save();
    ctx.beginPath();
    ctx.arc(profileX, profileY, profileRadius, 0, Math.PI * 2); 
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#10b981'; 
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(profImgRef.current, profileX - profileRadius, profileY - profileRadius, profileRadius * 2, profileRadius * 2);
    ctx.restore();

    // Custom Text
    if (customText.trim() !== '') {
      ctx.font = '600 28px system-ui, sans-serif';
      ctx.textAlign = 'center';
      
      const lines = customText.split('\n');
      const lineHeight = 38;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; 
      const textBlockWidth = 460;
      const textBlockHeight = (lines.length * lineHeight) + 20;
      ctx.fillRect(textPos.x - (textBlockWidth / 2), textPos.y - 30, textBlockWidth, textBlockHeight);

      ctx.fillStyle = '#ffffff';
      lines.forEach((line, index) => {
        ctx.fillText(line, textPos.x, textPos.y + (index * lineHeight)); 
      });
    }
  };

  useEffect(() => { drawCanvas(); }, [imagesLoaded, textPos, customText]);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);
  const handleMouseMove = (e) => {
    if (dragging) {
      const pos = getMousePos(e);
      setTextPos({ x: pos.x, y: pos.y });
    }
  };

  return (
    <div className="editor-layout">
      {/* LEFT SIDE: Preview */}
      <div className="canvas-pane">
        {!imagesLoaded && (
          <div style={{ color: '#64748b', fontWeight: '500' }}>
            Loading High-Res Canvas...
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          className="interactive-canvas"
          style={{ display: imagesLoaded ? 'block' : 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* RIGHT SIDE: Controls */}
      {imagesLoaded && (
        <div className="controls-pane">
          <div className="control-group">
            <label>Custom Message</label>
            <textarea 
              className="control-input"
              value={customText} 
              onChange={(e) => setCustomText(e.target.value)} 
              rows="4"
              placeholder="Write something beautiful..."
            />
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.75rem', lineHeight: '1.4' }}>
              💡 <strong>Tip:</strong> Click and drag the text block directly on the image to move it.
            </p>
          </div>

          <button className="btn" style={{ width: '100%', padding: '0.75rem' }} onClick={() => onShare(canvasRef.current.toDataURL("image/png"))}>
            Download & Share
          </button>
        </div>
      )}
    </div>
  );
};

export default GreetingCanvas;
import React, { useRef, useEffect, useState } from 'react';
import './greetingCanvas.css';

const GreetingCanvas = ({ template, user, onShare }) => {
  const canvasRef = useRef(null);
  
  // Store raw images in refs to prevent reloading on every drag frame
  const bgImgRef = useRef(new Image());
  const profImgRef = useRef(new Image());
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // State for interactive editing
  const [customText, setCustomText] = useState(user.name);
  const [customColor, setCustomColor] = useState(template.overlayConfig?.fontColor || '#ffffff');
  const [textPos, setTextPos] = useState({ x: 150, y: 150 });
  const [imgPos, setImgPos] = useState({ x: 150, y: 250, radius: 50 });
  
  // Dragging State
  const [draggingItem, setDraggingItem] = useState(null); // 'text', 'image', or null

  useEffect(() => {
    setImagesLoaded(false);
   
    if (template.overlayConfig) {
      if (template.overlayConfig.textPosition) setTextPos(template.overlayConfig.textPosition);
      if (template.overlayConfig.imagePosition) setImgPos(template.overlayConfig.imagePosition);
      if (template.overlayConfig.fontColor) setCustomColor(template.overlayConfig.fontColor);
    }

    bgImgRef.current.crossOrigin = "anonymous";
    bgImgRef.current.src = template.imageKitUrl;

    profImgRef.current.crossOrigin = "anonymous";
    profImgRef.current.src = user.profilePic || 'https://via.placeholder.com/150';

    Promise.all([
      new Promise(resolve => { bgImgRef.current.onload = resolve; }),
      new Promise(resolve => { 
        profImgRef.current.onload = resolve;
        profImgRef.current.onerror = () => {
          profImgRef.current.src = 'https://via.placeholder.com/150';
          resolve();
        }
      })
    ]).then(() => {
      const canvas = canvasRef.current;
      canvas.width = bgImgRef.current.width;
      canvas.height = bgImgRef.current.height;
      setImagesLoaded(true);
    });
  }, [template, user]);

  // 2. Draw Function (Runs when images load OR when coordinates/text change)
  const drawCanvas = () => {
    if (!imagesLoaded) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImgRef.current, 0, 0);

    // Draw Profile Picture
    ctx.save();
    ctx.beginPath();
    ctx.arc(imgPos.x, imgPos.y, imgPos.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(profImgRef.current, imgPos.x - imgPos.radius, imgPos.y - imgPos.radius, imgPos.radius * 2, imgPos.radius * 2);
    ctx.restore();

    // Draw Text
    ctx.font = `bold ${template.overlayConfig?.fontSize || 40}px Arial`;
    ctx.fillStyle = customColor;
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(customText, textPos.x, textPos.y);
  };

  // Trigger draw whenever state changes
  useEffect(() => {
    drawCanvas();
  }, [imagesLoaded, textPos, imgPos, customText, customColor]);


  // Mouse Events for Drag and Drop
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Calculate scaling because CSS makes the canvas responsive
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    
    // Check if clicked near Image
    const distToImg = Math.sqrt(Math.pow(pos.x - imgPos.x, 2) + Math.pow(pos.y - imgPos.y, 2));
    if (distToImg <= imgPos.radius) {
      setDraggingItem('image');
      return;
    }

    // Check if clicked near Text (rough bounding box)
    if (Math.abs(pos.x - textPos.x) < 150 && Math.abs(pos.y - textPos.y) < 50) {
      setDraggingItem('text');
      return;
    }
  };

  const handleMouseMove = (e) => {
    if (!draggingItem) return;
    const pos = getMousePos(e);
    
    if (draggingItem === 'text') {
      setTextPos({ x: pos.x, y: pos.y });
    } else if (draggingItem === 'image') {
      setImgPos({ ...imgPos, x: pos.x, y: pos.y });
    }
  };

  const handleMouseUp = () => {
    setDraggingItem(null);
  };

  // Export Final Image
  const handleShareClick = () => {
    const finalDataUrl = canvasRef.current.toDataURL("image/png");
    onShare(finalDataUrl);
  };

  return (
    <div className="editor-layout">
  
      {imagesLoaded && (
        <div className="editor-controls">
          <div className="control-group">
            <label><strong>Edit Text:</strong></label>
            <input 
              type="text" 
              value={customText} 
              onChange={(e) => setCustomText(e.target.value)} 
              style={{padding: '5px', borderRadius: '4px', border: '1px solid #ccc'}}
            />
          </div>
          <div className="control-group">
            <label><strong>Color:</strong></label>
            <input 
              type="color" 
              value={customColor} 
              onChange={(e) => setCustomColor(e.target.value)} 
              style={{cursor: 'pointer'}}
            />
          </div>
          <div style={{color: '#666', fontStyle: 'italic', marginLeft: 'auto'}}>
            ✨ Tip: You can drag the text and image directly on the canvas!
          </div>
        </div>
      )}


      <div className="canvas-wrapper">
        {!imagesLoaded && <div style={{ padding: '100px', textAlign: 'center' }}>Loading high-res editor...</div>}
        
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

      {imagesLoaded && (
        <button className="btn btn-green" onClick={handleShareClick}>
          Share & Download Final Image
        </button>
      )}
    </div>
  );
};

export default GreetingCanvas;
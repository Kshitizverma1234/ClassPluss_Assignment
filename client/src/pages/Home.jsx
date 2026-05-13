import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GreetingCanvas from '../components/GreetingCanvas';
import PremiumModal from '../components/PremiumModal';
import './home.css';

const CATEGORIES = ['All', 'Shayari', 'Birthday', 'Love', 'Festival', 'Updesh'];

const Home = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/templates');
        const data = await res.json();
        setTemplates(data);
      } catch (err) {
        console.error("Failed to fetch templates", err);
      }
    };
    fetchTemplates();
  }, []);

  const handleShare = async (base64Image) => {
    const blob = await (await fetch(base64Image)).blob();
    const file = new File([blob], "custom-greeting.png", { type: "image/png" });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'My Custom Greeting',
          text: 'Check out this greeting I made!',
          files: [file]
        });
      } catch (error) {
        console.log("Native share cancelled");
      }
    } else {
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = 'custom-greeting.png';
      link.click();
      alert("Image downloaded! You can now share it manually.");
    }
  };

  const handleTemplateClick = (template) => {
    if (template.isPremium && !user.isPremium) {
      setIsModalOpen(true);
      return;
    }
    setSelectedTemplate(template);
  };

  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="container">
      {selectedTemplate ? (
        <div className="editor-view">
          <button className="btn" onClick={() => setSelectedTemplate(null)} style={{marginBottom: '20px', background: 'var(--text)'}}>
            &larr; Back to Templates
          </button>
          <GreetingCanvas template={selectedTemplate} user={user} onShare={handleShare} />
        </div>
      ) : (
        <div>
          {/* Category Filter Bar */}
          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="grid">
            {filteredTemplates.map(template => (
              <div key={template._id} className="card" onClick={() => handleTemplateClick(template)}>
                {template.isPremium && <span className="badge">👑 Premium</span>}
                <img src={template.imageKitUrl} alt={template.name} />
                <div className="info">{template.name}</div>
              </div>
            ))}
            {filteredTemplates.length === 0 && <p>No templates found for this category.</p>}
          </div>
        </div>
      )}

      <PremiumModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
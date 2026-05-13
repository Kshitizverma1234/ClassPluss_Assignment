import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GreetingCanvas from '../components/GreetingCanvas';
import PremiumModal from '../components/PremiumModal';
import "./home.css"

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
      try { await navigator.share({ title: 'My Greeting', files: [file] }); } 
      catch (error) { console.log("Native share cancelled"); }
    } else {
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = 'custom-greeting.png';
      link.click();
    }
  };

  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="container">
      {selectedTemplate ? (
        <div className="editor-container" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <div className="editor-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', width: '100%' }}>
            <button className="btn btn-secondary" onClick={() => setSelectedTemplate(null)}>
              &larr; Back
            </button>
            <h3 style={{ margin: 0, alignSelf: 'center' }}>Customize Template</h3>
          </div>
          <GreetingCanvas template={selectedTemplate} user={user} onShare={handleShare} />
        </div>
      ) : (
        <>
          <header className="hero">
            <h1>Create Greetings</h1>
            <p>Select a template, customize your message, and share.</p>
          </header>

          <nav className="category-nav">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className={`pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>
          
          <main className="template-grid">
            {filteredTemplates.map(template => (
              <div 
                key={template._id} 
                className="template-card" 
                onClick={() => template.isPremium && !user.isPremium ? setIsModalOpen(true) : setSelectedTemplate(template)}
              >
                <div className="template-img-wrapper">
                  {template.isPremium && <span className="premium-badge">Premium</span>}
                  <img className="template-img" src={template.imageKitUrl} alt={template.name} />
                </div>
                <div className="template-info">{template.name}</div>
              </div>
            ))}
          </main>
        </>
      )}
      <PremiumModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
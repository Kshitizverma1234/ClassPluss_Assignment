
const mockTemplates = [
    {
      _id: "t1",
      name: "Romantic Sunset",
      category: "Love",
      imageKitUrl: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=800&auto=format&fit=crop",
      isPremium: false,
      overlayConfig: {
        imagePosition: { x: 400, y: 150, radius: 80 }, // Center-topish
        textPosition: { x: 400, y: 300 },
        fontSize: 48,
        fontColor: "#ffffff"
      }
    },
    {
      _id: "t2",
      name: "Golden Birthday",
      category: "Birthday",
      imageKitUrl: "https://images.unsplash.com/photo-1530103862676-de8892795bf0?q=80&w=800&auto=format&fit=crop",
      isPremium: true, 
      overlayConfig: {
        imagePosition: { x: 400, y: 400, radius: 100 }, // Center
        textPosition: { x: 400, y: 560 },
        fontSize: 55,
        fontColor: "#f1c40f"
      }
    }
  ];
  
  export const getTemplates = async (req, res) => {
    try {
      res.json(mockTemplates);
    } catch (err) {
      res.status(500).json({ message: "Server error fetching templates" });
    }
  };
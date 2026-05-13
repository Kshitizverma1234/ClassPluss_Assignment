const mockTemplates = [
  { _id: "t1", name: "Romantic Sunset", category: "Love", isPremium: false, imageKitUrl: "https://images.unsplash.com/photo-1658851866325-49fb8b7fbcb2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cm9tYW50aWMlMjBzdW5zZXR8ZW58MHx8MHx8fDA%3D" },
  { _id: "t2", name: "Classic Rose", category: "Love", isPremium: true, imageKitUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80" },
  { _id: "t3", name: "Golden Birthday", category: "Birthday", isPremium: true, imageKitUrl: "https://plus.unsplash.com/premium_photo-1663839412165-0d60a57e7a91?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmlydGhkYXklMjBjYXJkJTIwaW1hZ2VzfGVufDB8fDB8fHww" },
  { _id: "t4", name: "Party Balloons", category: "Birthday", isPremium: false, imageKitUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80" },
  { _id: "t5", name: "Midnight Thoughts", category: "Shayari", isPremium: false, imageKitUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80" },
  { _id: "t6", name: "Vintage Poetry", category: "Shayari", isPremium: true, imageKitUrl: "https://plus.unsplash.com/premium_photo-1668124454489-ff9592308fd8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dmludGFnZSUyMHBvZXRyeSUyMGNhcmQlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww" },
  { _id: "t7", name: "Divine Diyas", category: "Festival", isPremium: false, imageKitUrl: "https://images.unsplash.com/photo-1619410676080-5be7b3befc21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRpdmluZSUyMGRpeWFzfGVufDB8fDB8fHww" },
  { _id: "t8", name: "Colors of Joy", category: "Festival", isPremium: true, imageKitUrl: "https://images.unsplash.com/photo-1667940111959-9d550abe8d8d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvbG9ycyUyMG9mJTIwam95fGVufDB8fDB8fHww" },
  { _id: "t9", name: "Morning Peace", category: "Updesh", isPremium: false, imageKitUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80" }
];

export const getTemplates = async (req, res) => {
  try {
    res.json(mockTemplates);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching templates" });
  }
};
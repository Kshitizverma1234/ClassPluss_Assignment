# Custom Greetings & Wishes App

A full-stack web application that empowers users to create, personalize, and seamlessly share custom greeting cards. Built using the **MERN stack**, this application leverages the native **HTML5 Canvas API** for highly performant, client-side image processing and drag-and-drop personalization.

<img width="1919" height="891" alt="image" src="https://github.com/user-attachments/assets/2aee69f0-52d3-48fa-9011-31793e6a6622" />

---

## Live Demo & Documentation
* **Video Demo:** [Insert Link to your Video Demo here]
* Technical Approach Document: https://drive.google.com/file/d/1eS_br6BuN4zAoLd7iFeCRrzRkhqU5XGE/view?usp=sharing

---

## Key Features

* **Advanced Image Personalization (HTML5 Canvas):** * Merges high-resolution background templates with user profile pictures and custom text entirely on the client side.
  * Features an interactive **Drag-and-Drop Editor** allowing users to freely position their text and profile picture over the template in real-time without layout thrashing.
* **Robust Authentication System:** * Secure, stateless JWT-based manual login and registration (password hashing via `bcrypt`).
  * **Google OAuth 2.0** integration verified securely on the backend via `google-auth-library`.
  * Frictionless "Continue as Guest" flow for immediate user onboarding.
* **Smart Content Discovery:** * Dynamic grid layout with category-based filtering (e.g., All, Shayari, Birthday, Love, Festival) for rapid template discovery.
* **Monetization & Access Control:** * Premium template gating. Intercepts clicks on premium assets to present a highly polished, responsive subscription upsell modal.
* **Cross-Platform Native Sharing:** * Utilizes the **Web Share API** (`navigator.share`) for seamless sharing to native mobile apps (WhatsApp, Instagram, etc.), with an automated intelligent fallback that triggers direct file downloads on unsupported desktop browsers.

---

## Technology Stack

### Frontend
* **React.js (Vite):** Chosen for lightning-fast HMR and optimized production builds.
* **React Router DOM:** For declarative, protected client-side routing.
* **@react-oauth/google:** Standardized Google Identity Services integration.
* **Vanilla CSS:** Custom-built, dependency-free styling system utilizing CSS variables and component-level scoping for maximum performance and maintainability.

### Backend & Database
* **Node.js & Express.js:** Lightweight and fast REST API architecture.
* **MongoDB & Mongoose:** Flexible NoSQL document structure, ideal for storing highly variable template metadata (X/Y coordinates, radius sizes, dynamic font configs).
* **Security:** `jsonwebtoken` (JWT) for session management, `bcrypt` for credential hashing.

---

## Local Setup & Installation

Follow these steps to run the project locally on your machine.

### Prerequisites
* Node.js (v16 or higher)
* MongoDB (Local instance or MongoDB Atlas cluster)
* A Google Cloud Console account (for OAuth Client ID)

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/custom-greetings-app.git](https://github.com/yourusername/custom-greetings-app.git)
cd custom-greetings-app

```
### 2. Backend Setup
Navigate to the server directory, install dependencies, and configure your environment.

```bash
cd server
npm install
```

Create a .env file in the root of the server/ directory:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```
Start the backend development server:
```bash
npm run dev
```

3. Frontend Setup
Open a new terminal tab, navigate to the client directory, and install dependencies.
```bash
cd client
npm install
```

Create a .env file in the root of the client/ directory:
```
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```
Start the Vite frontend server:
```bash
npm run dev
```
The application will now be running at http://localhost:5173.

```
custom-greetings-app/
├── server/                     # Node.js Backend
│   ├── controllers/            # Request handling logic (auth, templates)
│   ├── models/                 # Mongoose schemas (User, Template)
│   ├── routes/                 # Express API routes
│   └── server.js               # Application entry point
│
└── client/                     # React Frontend (Vite)
    ├── src/
    │   ├── components/         # Reusable UI (Navbar, GreetingCanvas, Modals)
    │   ├── context/            # Global state (AuthContext)
    │   ├── pages/              # Main view components (Home, Login, Profile)
    │   ├── App.jsx             # Main routing configuration
    │   └── index.css           # Global theme variables and resets
    └── package.json
```

💡 System Architecture Highlights
1. Zero-Flicker Canvas Rendering: To achieve smooth drag-and-drop functionality, external template images and user avatars are cached within React useRef hooks upon initial load. The canvas strictly repaints coordinates on mouse movement rather than triggering expensive DOM re-renders.

2. CORS-Safe External Image Loading: All HTML5 Image objects are explicitly instantiated with crossOrigin = "anonymous" to ensure the canvas does not become "tainted," allowing the final composited image to be successfully exported via toDataURL().

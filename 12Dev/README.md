# 12Dev - Full Stack LeetCode Clone 🚀

A comprehensive, production-grade coding platform meticulously built to replicate and enhance the LeetCode experience. Features real-time problem solving, live coding contests, an AI-powered hint assistant, and structured problem sheets.

## ✨ Core Features

- **Integrated Coding Environment**: A fully functional browser-based code editor using Monaco Editor with syntax highlighting.
- **Contest Arena & Live Leaderboards**: Compete in coding contests, track real-time scoreboards, and view contest analytics.
- **AI-Powered "Hint" System**: Seamlessly integrated Google GenAI to act as a coding mentor, providing context-aware hints and debugging assistance.
- **Problem Sheets**: Curated problem sets (e.g., grouped by company or topic) to structure interview preparation effectively.
- **Daily Streaks & Activity Tracking**: Gamified elements to keep users motivated through daily coding streaks and activity heatmaps.
- **Admin Dashboard**: Comprehensive problem management system allowing admins to create, update, manage test cases, and delete coding challenges.
- **Robust Authentication**: Secure JWT-based authentication with role-based access control (Admin/User).

## 🛠️ Technology Stack

### Frontend Architecture
- **React.js** (Bootstrapped with Vite)
- **Redux Toolkit** (Global state management)
- **Tailwind CSS & DaisyUI** (Responsive, modern component styling)
- **Monaco Editor** (VS Code-like editing experience)
- **React Router v7** (Client-side routing)
- **React Hook Form + Zod** (Performant form handling and validation)

### Backend Architecture
- **Node.js & Express.js** (Robust API development)
- **MongoDB & Mongoose** (Scalable NoSQL database schemas)
- **Redis** (High-speed caching layer)
- **Google GenAI API** (AI chat & hint generation)
- **JWT & Bcrypt** (Security and user sessions)
- **Cors & Cookie Parser** (Cross-origin resource sharing and cookie handling)

## 📂 Project Structure

### `/backend`
- `src/controllers/` - API logic for auth, problems, contests, submissions, etc.
- `src/models/` - Mongoose schemas (`User`, `Problem`, `Contest`, `Submission`, `DailyActivity`, `HintUsage`).
- `src/routes/` - Express routing (`userAuth`, `problemCreator`, `submit`, `aiChatting`, `streak`, `sheet`, `contest`).
- `src/config/` - Database and Redis connections.

### `/frontend`
- `src/pages/` - Key views (`Dashboard`, `ProblemPage`, `ContestArena`, `Admin`, `ProfilePage`, etc.).
- `src/components/` - Reusable UI elements (`AdminPanel`, `Navbar`, etc.).
- `src/store/` & `src/slices/` - Redux store configuration and state slices.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI
- Redis server running locally (Port 6379)
- Google GenAI API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd 12Dev
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   
   # Create a .env file based on the required environment variables:
   # DB_CONNECT_STRING=<your-mongodb-uri>
   # PORT=3000
   # JWT_SECRET=<your-secret>
   # FRONTEND_URL=http://localhost:5173
   # GENAI_API_KEY=<your-google-genai-key>
   
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Launch:** Open `http://localhost:5173` in your browser.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

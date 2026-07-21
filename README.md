# SmartHire AI 🚀

SmartHire AI is an intelligent, full-stack recruitment platform designed to help candidates perfectly align their resumes with job descriptions, while organizing their entire application pipeline in a visual Kanban board.

## ✨ Features

- **Semantic Job Matching:** Upload your PDF resume and paste a job description. SmartHire uses Google Gemini AI to analyze semantic overlaps, giving you a Match Score (%) and a detailed list of missing skills you need to add to bypass Applicant Tracking Systems (ATS).
- **Application Pipeline Board:** A fully interactive, drag-and-drop Kanban board (powered by `@dnd-kit`) to visually track your job applications across various stages: *Applied, Screening, Interview, Offer, and Rejected*.
- **Enterprise-Grade UI:** A sleek, fully responsive, mobile-first design built with Tailwind CSS and Framer Motion, featuring dynamic sidebars and modern aesthetics.
- **Secure Authentication:** Seamless Google OAuth 2.0 integration for fast and secure sign-ins.
- **Zero-Downtime Architecture:** Designed for the cloud. Frontend deployed on Vercel and backend containerized for Render.

## 🛠️ Tech Stack

**Frontend:**
- [Next.js (App Router)](https://nextjs.org/)
- [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://zustand-demo.pmnd.rs/) (State Management)
- [React-OAuth/Google](https://www.npmjs.com/package/@react-oauth/google)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- [Google Gemini API](https://ai.google.dev/) (For semantic PDF analysis)
- [PDF.js](https://mozilla.github.io/pdf.js/) (Server-side PDF parsing)

**Infrastructure:**
- [Turborepo](https://turbo.build/) (Monorepo Management)
- [Docker](https://www.docker.com/) & Docker Compose

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v22.x recommended)
- pnpm / npm
- Docker (optional, for local DB)
- Google Cloud Console Account (for OAuth Client ID)
- Google Gemini API Key
- MongoDB Atlas URI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AliveCore729/smarthire.git
   cd smarthire
   ```

2. **Install dependencies:**
   *(Note: This project uses standard npm workspaces)*
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   You will need to set up two `.env` files.

   **Frontend** (`apps/client/.env.local`):
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

   **Backend** (`apps/server/.env`):
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   This command uses Turborepo to simultaneously start the Next.js frontend on `http://localhost:3000` and the Express backend on `http://localhost:5000`.

## 🐳 Running with Docker

You can spin up the entire backend stack locally using Docker Compose:
```bash
docker-compose up -d
```

## 🌐 Deployment

- **Frontend:** Optimized for 1-click deployment on [Vercel](https://vercel.com). Just ensure you set `NEXT_PUBLIC_API_URL` to your production backend URL and configure your Google OAuth Javascript Origins.
- **Backend:** Configured for seamless deployment on [Render](https://render.com/) via the included `render.yaml` infrastructure-as-code file. Requires Node 22.x for native `DOMMatrix` support during PDF parsing.

## 📄 License

This project is open-source and available under the MIT License.

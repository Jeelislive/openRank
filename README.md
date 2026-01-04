# OpenRank - Open Source Project Finder

A beautiful, single-page application to discover high-impact open source projects tailored to your skills. No login, no friction, just pure coding.

## Project Structure

This is a monorepo containing both frontend and backend:

```
openRank/
├── frontend/          # Next.js Frontend Application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── lib/          # Utilities and API client
│   ├── contexts/     # React contexts
│   ├── hooks/        # Custom React hooks
│   └── package.json  # Frontend dependencies
│
└── backend/          # NestJS Backend API
    ├── src/          # Source code
    │   ├── projects/ # Projects module
    │   ├── stats/    # Stats module
    │   └── github/   # GitHub service
    └── package.json  # Backend dependencies
```

## Features

✨ **Modern UI with 3D Effects**
- Animated particle background
- Smooth transitions and hover effects
- Glass morphism design
- Responsive layout

🔍 **Advanced Search & Filters**
- Real-time search with keyboard shortcuts (⌘K / Ctrl+K)
- Filter by category, language, stars, and more
- Sort by rank, stars, forks, activity
- Quick filter tags

📊 **Project Discovery**
- Beautiful project cards with animations
- Detailed project information
- Real-time stats and metrics
- Status indicators

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Three.js** - 3D effects
- **Lucide React** - Icons

### Backend
- **NestJS** - Node.js framework
- **TypeORM** - Database ORM
- **PostgreSQL** - Database (via Supabase)
- **GitHub API** - Project data source

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Supabase account)

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/openrank
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
GITHUB_TOKEN=your_github_token_here
```

4. Run development server:
```bash
npm run start:dev
```

The backend will be available at [http://localhost:3001](http://localhost:3001)

## Development

### Running Both Frontend and Backend

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run start:dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

## Deployment

### Frontend (Vercel)

1. Deploy to Vercel with root directory set to `frontend`
2. Add environment variables:
   - `NEXT_PUBLIC_SITE_URL` - Your frontend URL
   - `NEXT_PUBLIC_API_URL` - Your backend URL

### Backend (Railway/Render)

1. Deploy to Railway or Render with root directory set to `backend`
2. Add environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `FRONTEND_URL` - Your frontend URL
   - `NODE_ENV=production`
   - `GITHUB_TOKEN` - GitHub API token (optional)

See `vercel.json` for Vercel configuration.

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects with filters
- `GET /api/projects/details/:owner/:repo` - Get project details
- `GET /api/projects/newly-added` - Get newly added projects

### Stats
- `GET /api/stats` - Get platform statistics
- `POST /api/stats/visit` - Track visit
- `GET /api/stats/users-visited` - Get unique users count

### Categories & Languages
- `GET /api/categories` - Get all categories
- `GET /api/languages` - Get all languages

## Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_SITE_URL` - Frontend URL
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `FRONTEND_URL` - Frontend URL (for CORS)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `GITHUB_TOKEN` - GitHub API token (optional, for higher rate limits)

## License

MIT

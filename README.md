# OpenRank - Open Source Project Finder

A beautiful, single-page application to discover high-impact open source projects tailored to your skills. No login, no friction, just pure coding.

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

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Three.js** - 3D effects (ready for integration)
- **Lucide React** - Icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
openRank/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx         # Main page component
│   └── globals.css      # Global styles
├── components/
│   ├── ProjectCard.tsx  # Project card component
│   ├── FilterPanel.tsx  # Filter sidebar
│   ├── SearchModal.tsx  # Search modal
│   ├── Hero3D.tsx       # 3D hero effects
│   └── StatsSection.tsx # Stats display
└── ...
```

## Backend Integration

This is a frontend-only application. Connect it to your NestJS backend by:

1. Update API endpoints in `app/page.tsx`
2. Replace mock data with API calls
3. Add environment variables for API URLs

## Suggested Features

- **AI-Powered Matching**: Match projects based on user skills
- **Health Score**: Advanced analytics on PR response times
- **Global Contributor Pulse**: Real-time visualization of commits
- **Project Bookmarks**: Save favorite projects (localStorage)
- **Export Results**: Export filtered projects to CSV/JSON
- **Dark/Light Mode Toggle**: Theme switcher
- **Project Preview**: Quick preview without leaving the page
- **Contributor Profiles**: View contributor statistics
- **Trending Analysis**: See what's trending in real-time

## License

MIT


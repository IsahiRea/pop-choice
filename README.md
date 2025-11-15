# PopChoice

A personalized movie recommendation app that helps groups discover their next favorite film together. PopChoice collects preferences from multiple people and uses AI to find the perfect movie that everyone will enjoy.

## Features

- **Group Movie Selection**: Collect preferences from multiple people (1-N participants)
- **Multi-Person Question Flow**: Each person answers personalized questions sequentially
- **AI-Powered Recommendations**: Analyzes group preferences using AI/Vector DB to find consensus picks
- **Mood-Based Selection**: Choose from Fun, Serious, Inspiring, or Scary moods
- **Simple Interface**: Clean, mobile-first design with step-by-step guidance

## Tech Stack

- **React 19.2.0** - UI library with latest hooks
- **React Router DOM 7.9.6** - Client-side routing with data loader pattern
- **Vite 7.2.2** - Modern build tool with HMR
- **ESLint 9.39.1** - Code quality
- **Google Fonts** - Carter One (headings) & Roboto Slab (body)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd pop-choice

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## How It Works

1. **Start Page** (`/`): Enter number of people and available time
2. **Questions Page** (`/questions`): Each person answers 4 questions:
   - Favorite movie and why
   - New or classic preference
   - Current mood (Fun/Serious/Inspiring/Scary)
   - Which famous film person they'd want on an island
3. **Results Page** (`/results`): AI-powered recommendations based on group consensus

### Multi-Person Flow

The app collects answers from each person **sequentially**:
- Person 1 answers → clicks "Next Person"
- Person 2 answers → clicks "Next Person"
- Person N answers → clicks "Get Recommendations"
- All answers sent to AI for processing

## Project Structure

```
pop-choice/
├── src/
│   ├── pages/
│   │   ├── Start.jsx          # Landing page for initial setup
│   │   ├── Questions.jsx      # Multi-person questionnaire
│   │   └── MovieOutput.jsx    # AI recommendations display
│   ├── actions/
│   │   └── movieActions.js    # Router action for API integration
│   ├── styles/
│   │   ├── index.css          # Global styles & design tokens
│   │   └── Start.css          # Page-specific styles
│   └── main.jsx               # Entry point with router config
├── public/
│   └── popchoice-logo.png     # App logo/branding
└── index.html                 # HTML template
```

## Architecture

### Routing Pattern

Uses React Router v7's data router with action handlers:

```javascript
{
  path: '/results',
  element: <MovieOutput />,
  action: loadMovieRecommendations  // Runs before component renders
}
```

### Data Flow

- **Start → Questions**: Navigation state (`location.state`)
- **Questions → Results**: Form submission triggers route action
- **Action → MovieOutput**: `useActionData()` provides recommendations

### API Integration

The action handler expects an endpoint at `/api/recommendations`:

**Request:**
```json
{
  "numberOfPeople": "3",
  "duration": "120",
  "allAnswers": [
    {
      "person": 1,
      "favoriteMovie": "The Shawshank Redemption\nBecause...",
      "newOrClassic": "classic",
      "mood": "inspiring",
      "islandPerson": "Tom Hanks because..."
    }
  ]
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "title": "Movie Title",
      "description": "...",
      "rating": "PG-13",
      "genre": "Drama"
    }
  ]
}
```

## Development

### Design System

- **Mobile-first approach**: Default layouts for 393px viewport
- **Color palette**:
  - Background: `#000C36` (navy)
  - Primary action: `#51E08A` (green)
  - Input fields: `#3B4877` (muted blue)
- **Typography**: Carter One (headings), Roboto Slab (body)

### Git Workflow

**Important**: Always work on feature branches. Do not commit to `main`.

```bash
git checkout -b feature/your-feature-name
# Make changes
git add .
git commit -m "Description"
git push -u origin feature/your-feature-name
```

### Adding New Pages

1. Create component in `src/pages/`
2. Create corresponding CSS in `src/styles/`
3. Add route to `src/main.jsx`
4. Add action handler in `src/actions/` if needed

## Current Status

✅ **Completed:**
- Routing architecture
- Start page with form collection
- Multi-person question flow
- Router action setup
- Mobile-first styling for Start page

🚧 **In Progress:**
- AI/Vector DB integration (action handler ready, needs endpoint)
- Questions page styling
- MovieOutput page implementation

## License

MIT

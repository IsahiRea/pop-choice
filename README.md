# PopChoice

A personalized movie recommendation app that helps groups discover their next favorite film together. PopChoice collects preferences from multiple people and uses AI-powered vector search to find the perfect movie that everyone will enjoy.

## Features

- **Group Movie Selection**: Collect preferences from multiple people (1-N participants)
- **Multi-Person Question Flow**: Each person answers personalized questions sequentially
- **AI-Powered Recommendations**: Uses OpenAI embeddings and Supabase vector DB for intelligent movie matching
- **Mood-Based Selection**: Choose from Fun, Serious, Inspiring, or Scary moods
- **Simple Interface**: Clean, mobile-first design with step-by-step guidance
- **Smart Matching**: Vector similarity search finds movies that align with group preferences

## Tech Stack

- **React 19.2.0** - UI library with latest hooks
- **React Router DOM 7.9.6** - Client-side routing with data loader pattern
- **Vite 7.2.2** - Modern build tool with HMR
- **Supabase** - Vector database with pgvector for semantic search
- **OpenAI API** - Text embeddings for preference matching
- **ESLint 9.39.1** - Code quality
- **Google Fonts** - Carter One (headings) & Roboto Slab (body)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for vector database)
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd pop-choice

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_OPENAI_API_KEY=your_openai_api_key

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Database Setup

The app uses Supabase with pgvector for semantic movie search. The database schema includes:

- `movies` table: Movie metadata (title, description, genre, rating, etc.)
- Vector embeddings: Stored using pgvector for similarity matching
- RPC functions: Custom similarity search queries

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

### AI Integration Flow

The app uses a sophisticated AI-powered recommendation system:

1. **User Preferences Collection**: Gathers responses from all participants
2. **Embedding Generation**: Creates OpenAI text embeddings from combined preferences
3. **Vector Search**: Queries Supabase pgvector for semantically similar movies
4. **Result Filtering**: Applies duration and group size constraints
5. **Recommendation Display**: Shows top matches with metadata

**Data Processing:**

```javascript
// Input from Questions page
{
  "numberOfPeople": "3",
  "duration": "120",
  "allAnswers": [
    {
      "person": 1,
      "favoriteMovie": "The Shawshank Redemption",
      "newOrClassic": "classic",
      "mood": "inspiring",
      "islandPerson": "Tom Hanks"
    }
  ]
}

// Vector search query
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: combinedPreferences
});

// Supabase similarity search
const { data } = await supabase.rpc('match_movies', {
  query_embedding: embedding,
  match_threshold: 0.7,
  match_count: 10
});
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
- Routing architecture with React Router v7
- Start page with group setup form
- Multi-person sequential question flow
- Supabase vector database integration
- OpenAI embeddings API integration
- MovieOutput page with recommendations display
- Mobile-first responsive styling
- Git workflow on feature branches

🚧 **In Progress:**
- Enhanced UI/UX improvements
- Additional filtering options
- Performance optimizations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Important**: Never commit directly to `main`. Always work on feature branches.

## License

MIT

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start Vite dev server at localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture Overview

### Routing and Data Flow

This app uses **React Router v7's data router pattern** with three main routes:

1. **Start (`/`)** → Questions (`/questions`) → Results (`/results`)

**Data passing between routes:**

- **Start → Questions**: Uses `navigate('/questions', { state: data })`
  - Access via `useLocation().state`
  - Contains: `numberOfPeople`, `duration`

- **Questions → Results**: Uses `<Form method="post" action="/results">`
  - Triggers route action: `loadMovieRecommendations` in `/src/actions/movieActions.js`
  - Data serialized as JSON in hidden field `allAnswers`
  - Action receives all people's responses and sends to AI/Vector DB
  - Results available via `useActionData()` in MovieOutput component

### Multi-Person Question Flow

The Questions page collects answers from multiple people **sequentially**:

```javascript
// State pattern:
currentPerson    // 1-indexed counter (1, 2, 3...)
allAnswers       // Array accumulating each person's responses

// Form submission logic:
onSubmit={(e) => {
  // Save current person's answers
  if (!isLastPerson) {
    e.preventDefault();           // Block form submission
    setCurrentPerson(prev => prev + 1);  // Next person
    resetFormFields();
  }
  // If isLastPerson, DON'T preventDefault - let form submit to action
}}
```

**Data structure sent to action:**
```javascript
{
  numberOfPeople: "3",
  duration: "120",
  allAnswers: [
    {
      person: 1,
      favoriteMovie: "...",
      newOrClassic: "new"|"classic",
      mood: "fun"|"serious"|"inspiring"|"scary",
      islandPerson: "..."
    },
    // ... person 2, 3, etc.
  ]
}
```

### Form Handling Patterns

**Two different form patterns used:**

1. **Start page**: Native form action (React 19)
   ```javascript
   <form action={handleSubmit}>
     // handleSubmit receives FormData
     // Manually calls navigate()
   ```

2. **Questions page**: React Router Form + Action
   ```javascript
   <Form method="post" action="/results">
     // Auto-submits to route action
     // Uses useNavigation() for loading states
   ```

### Router Actions (Server-Side Pattern)

Action handlers in `/src/actions/movieActions.js` run **before** the component renders:

```javascript
export async function loadMovieRecommendations({ request }) {
  const formData = await request.formData();
  const allAnswers = JSON.parse(formData.get('allAnswers'));

  // Make API call to AI/Vector DB
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    body: JSON.stringify({ numberOfPeople, duration, allAnswers })
  });

  return { recommendations, preferences };  // Available via useActionData()
}
```

**Navigation states available:**
```javascript
const navigation = useNavigation();
navigation.state === 'idle'       // Not navigating
navigation.state === 'submitting' // Form submitting
navigation.state === 'loading'    // Action running
```

## Styling System

### CSS Architecture

- **Global styles**: `/src/styles/index.css`
  - CSS custom properties for design tokens
  - `--font-heading`: "Carter One"
  - `--font-body`: "Roboto Slab"
  - Dark theme default (`#000C36` background)

- **Page-specific**: `/src/styles/[PageName].css`
  - Import in component: `import '../styles/Start.css'`

### Design Tokens

```css
/* Colors */
#000C36  /* Dark navy background */
#3B4877  /* Input backgrounds */
#51E08A  /* Primary action (green) */
#3BC36F  /* Hover state */
#FFF     /* Text on dark backgrounds */

/* Typography */
font-heading: "Carter One"      /* Headings and branding */
font-body: "Roboto Slab"        /* Body text, inputs, buttons */

/* Spacing */
Forms max-width: 325px
Form gap: 23px
Input height: 60px
Button height: 71px
```

### Mobile-First Approach

**IMPORTANT**: Always create layouts with mobile-first approach, then add responsive design for larger screens using media queries.

```css
/* Mobile first (default) */
.container {
  flex-direction: column;
  max-width: 325px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    max-width: 600px;
  }
}
```

## Git Workflow

**IMPORTANT**: Always work on feature branches. Do not commit to `main`.

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make commits
git add .
git commit -m "Description"

# Push and create PR
git push -u origin feature/your-feature-name
```

## AI/Vector DB Integration

The action handler expects an API endpoint at `/api/recommendations`:

**Request:**
```json
{
  "numberOfPeople": "3",
  "duration": "120",
  "allAnswers": [
    { "person": 1, "favoriteMovie": "...", ... },
    { "person": 2, "favoriteMovie": "...", ... }
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

## Key Non-Obvious Patterns

### JSON Serialization in Hidden Fields

Complex state is passed through forms using JSON serialization:

```javascript
<input
  type="hidden"
  name="allAnswers"
  value={JSON.stringify(allAnswers)}
/>

// In action:
const allAnswers = JSON.parse(formData.get('allAnswers'));
```

This avoids route state loss while keeping state local to components.

### Controlled Components with Toggle Buttons

Question buttons use state-based selection (not radio inputs):

```javascript
<button
  type="button"
  className={`choice-button ${mood === 'fun' ? 'selected' : ''}`}
  onClick={() => setMood('fun')}
>
  Fun
</button>
```

Benefits:
- Visual feedback without form elements
- Easier styling control
- State updates on click, not on form submit

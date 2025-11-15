import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/index.css'
import Start from './pages/Start'
import Questions from './pages/Questions'
import MovieOutput from './pages/MovieOutput'
import { loadMovieRecommendations } from './actions/movieActions'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Start />,
  },
  {
    path: '/questions',
    element: <Questions />,
  },
  {
    path: '/results',
    element: <MovieOutput />,
    action: loadMovieRecommendations,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

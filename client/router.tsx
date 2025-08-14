import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router'

import App from './components/App'
import Home from './components/Home'
import Blog from './components/Blog'
import Dodgeball from './components/Dodgeball'
import GamesPage from './components/GamesPage'
import NotFoundPage from './components/NotFoundPage'
import Flappy from './components/Flappy'
import Geo from './components/Geo'

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="/Blog" element={<Blog />} />
    <Route path="/Dodgeball" element={<Dodgeball />} />
    <Route path="/Games" element={<GamesPage />} />
    <Route path="/Flappy" element={<Flappy />} />
    <Route path="/Geo" element={<Geo />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
)

const router = createBrowserRouter(routes)

export default router
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router'

import App from './components/App'
import Home from './components/Home'
import Blog from './components/Blog'
import AboutMe from './components/AboutMe'
import Games from './components/Games'

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="/Blog" element={<Blog />} />
    <Route path="/About-Me" element={<AboutMe />} />
    <Route path="/Games" element={<Games />} />
  </Route>
)

const router = createBrowserRouter(routes)

export default router
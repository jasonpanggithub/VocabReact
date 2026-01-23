import Home from '../pages/Home'
import List from '../pages/List'
import Edit from '../pages/Edit'
import About from '../pages/About'

const navItems = [
  { path: '/', label: 'Home', element: <Home /> },
  { path: '/list', label: 'List', element: <List /> },
  { path: '/edit', label: 'Edit', element: <Edit /> },
  { path: '/about', label: 'About', element: <About /> },
]

export default navItems

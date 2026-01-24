import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Menu from './components/Menu/Menu'
import Content from './components/Content/Content'
import navItems from './navigation/navItems'

function App() {
  const routes = navItems.flatMap((item) =>
    item.children ? item.children : item
  )

  return (
    <Router>
      <Menu />
      <Content>
        <Routes>
          {routes.map((item) => (
            <Route key={item.path} path={item.path} element={item.element} />
          ))}
        </Routes>
      </Content>
    </Router>
  )
}

export default App

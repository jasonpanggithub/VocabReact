import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Menu from './components/Menu/Menu'
import Content from './components/Content/Content'
import navItems from './navigation/navItems'

function App() {
  return (
    <Router>
      <Menu />
      <Content>
        <Routes>
          {navItems.map((item) => (
            <Route key={item.path} path={item.path} element={item.element} />
          ))}
        </Routes>
      </Content>
    </Router>
  )
}

export default App

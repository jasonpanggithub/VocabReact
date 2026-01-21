import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Menu from './components/Menu/Menu'
import Content from './components/Content/Content'
import Home from './pages/Home'
import Practice from './pages/Practice'
import Lists from './pages/Lists'
import About from './pages/About'

function App() {
  return (
    <Router>
      <Menu />
      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Content>
    </Router>
  )
}

export default App

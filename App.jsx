import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Home from './components/Home'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import Admin from './components/Admin'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'portfolio':
        return <Portfolio />
      case 'contact':
        return <Contact />
      case 'admin':
        return <Admin />
      default:
        return <Home />
    }
  }

  return (
    <div className="App">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App

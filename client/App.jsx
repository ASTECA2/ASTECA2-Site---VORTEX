import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import HomeUpdated from './components/HomeUpdated'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import AdminUpdated from './components/AdminUpdated'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeUpdated setCurrentPage={setCurrentPage} />
      case 'portfolio':
        return <Portfolio />
      case 'contact':
        return <Contact />
      case 'admin':
        return <AdminUpdated />
      default:
        return <HomeUpdated setCurrentPage={setCurrentPage} />
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


import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AdSenseScript } from '@/components/GoogleAdsense'
import { HomePage } from '@/pages/HomePage'
import { FaqPage } from '@/pages/FaqPage'
import { TrendsPage } from '@/pages/TrendsPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Google AdSense Script */}
        <AdSenseScript />
        
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trends" element={<TrendsPage />} />
            <Route path="/faq" element={<FaqPage />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  )
}

export default App

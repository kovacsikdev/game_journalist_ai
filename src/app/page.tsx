'use client'

import { useState } from 'react'
import Chatbot from '@/components/Chatbot'
import HamburgerMenu from '@/components/HamburgerMenu'

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <main style={{ height: '100%', width: '100%' }}>
      <HamburgerMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
      <Chatbot onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
    </main>
  )
}

export default Home

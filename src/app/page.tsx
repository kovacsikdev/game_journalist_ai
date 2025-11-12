'use client'

import { useState } from 'react'
import Chatbot from '@/components/Chatbot'
import HamburgerMenu from '@/components/HamburgerMenu'

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <main>
      <HamburgerMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
      <Chatbot onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
    </main>
  )
}

export default Home

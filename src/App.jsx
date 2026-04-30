import React from 'react'
import { Routes, Route } from "react-router-dom";
import Lenis from 'lenis'

import HeroPage from './Main/HeroPage'
import NotFound from './Pages/NotFound'

const App = () => {

  // Initialize Lenis
  const lenis = new Lenis({
    autoRaf: true,
    duration: 2,
  });

  // Listen for the scroll event and log the event data
  lenis.on('scroll', (e) => {
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App

import React from 'react';
import Header from './components/common/Header'
import CategoriesSection from './components/home/CategoriesSection'
import HeroSection from './components/home/HeroSection'
import RecentListings from './components/home/RecentListings'



function App() {
  return (
     <>
     <Header />
     <HeroSection />
     <CategoriesSection />
     <RecentListings />

     </>
  )
}

export default App

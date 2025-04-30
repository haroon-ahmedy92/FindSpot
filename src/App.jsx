import React from 'react';
import Header from './components/common/Header'
import CategoriesSection from './components/home/CategoriesSection'
import HeroSection from './components/home/HeroSection'
import RecentListings from './components/home/RecentListings'
import HowItWorks from './components/home/HowItWorks';
import StatisticsSection from './components/home/StatisticsSection';
import Footer from './components/common/Footer';



function App() {
  return (
     <>

     <Header />
     <HeroSection />
     <CategoriesSection />
     <RecentListings />
     <HowItWorks />
     <StatisticsSection />
     <Footer />

     </>
  )
}

export default App

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HeroSection from './components/home/HeroSection';
import CategoriesSection from './components/home/CategoriesSection';
import RecentListings from './components/home/RecentListings';
import HowItWorks from './components/home/HowItWorks';
import StatisticsSection from './components/home/StatisticsSection';
import ReportLostPage from './pages/ReportLostPage';
import TestimonialsSection from './components/home/TestimonialsSection';
import AboutPage from './pages/AboutPage';
import ReportFoundPage from './pages/ReportFoundPage';
import MyItemsPage from './pages/MyItemsPage';
import ItemDetail from './components/items/ItemDetail';
import AllListings from './components/items/AllListings';
import CategoriesPage from './components/home/CategoriesPage';
import { lostItems } from './data/lostItems';
import { foundItems } from './data/foundItems';

function App() {
    const allItems = [...lostItems, ...foundItems];

    return (
        <Router>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <HeroSection />
                            <CategoriesSection />
                            <RecentListings />
                            <HowItWorks />
                            <StatisticsSection />
                            <TestimonialsSection />
                        </>
                    }
                />
                <Route path="/report-lost" element={<ReportLostPage />} />
                <Route path="/report-found" element={<ReportFoundPage />} />
                <Route path="/my-items" element={<MyItemsPage />} />
                <Route path="/About" element={<AboutPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/listings/:type" element={<AllListings />} />
                <Route path="/item/:id" element={<ItemDetail items={allItems} />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
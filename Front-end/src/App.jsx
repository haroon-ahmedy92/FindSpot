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
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { lostItems } from './data/lostItems';
import { foundItems } from './data/foundItems';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage'; // Import the new UserProfilePage
import FaqPage from './pages/FaqPage'; // Add this line
import TermsOfServicePage from './pages/TermsOfServicePage'; // Add this line
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // Add this line

function App() {
    const allItems = [...lostItems, ...foundItems];

    return (
        <Router>
            <Routes>
                {/* Public routes with Header and Footer */}
                <Route
                    path="/"
                    element={
                        <>
                            <Header />
                            <HeroSection />
                            <CategoriesSection />
                            <RecentListings />
                            <HowItWorks />
                            <StatisticsSection />
                            <TestimonialsSection />
                            <Footer />
                        </>
                    }
                />
                <Route path="/report-lost" element={
                    <>
                        <Header />
                        <ReportLostPage />
                        <Footer />
                    </>
                } />
                <Route path="/report-found" element={
                    <>
                        <Header />
                        <ReportFoundPage />
                        <Footer />
                    </>
                } />
                <Route path="/my-items" element={
                    <>
                        <Header />
                        <MyItemsPage />
                        <Footer />
                    </>
                } />
                <Route path="/about" element={
                    <>
                        <Header />
                        <AboutPage />
                        <Footer />
                    </>
                } />
                <Route path="/contact" element={
                    <>
                        <Header />
                        <div className="pt-20 min-h-screen flex items-center justify-center">
                            <h1 className="text-2xl font-bold">Contact Page - Coming Soon</h1>
                        </div>
                        <Footer />
                    </>
                } />
                <Route path="/categories" element={
                    <>
                        <Header />
                        <CategoriesPage />
                        <Footer />
                    </>
                } />
                <Route path="/listings/:type" element={
                    <>
                        <Header />
                        <AllListings />
                        <Footer />
                    </>
                } />
                <Route path="/item/:id" element={
                    <>
                        <Header />
                        <ItemDetail items={allItems} />
                        <Footer />
                    </>
                } />
                <Route path="/login" element={
                    <>
                        <Header />
                        <Login />
                        <Footer />
                    </>
                } />
                <Route path="/register" element={
                    <>
                        <Header />
                        <Register />
                        <Footer />
                    </>
                } />
                <Route path="/faq" element={
                    <>
                        <Header />
                        <FaqPage />
                        <Footer />
                    </>
                } />
                <Route path="/terms-of-service" element={
                    <>
                        <Header />
                        <TermsOfServicePage />
                        <Footer />
                    </>
                } />
                <Route path="/privacy-policy" element={
                    <>
                        <Header />
                        <PrivacyPolicyPage />
                        <Footer />
                    </>
                } />
                
                {/* logged-in dashboard route */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="profile" element={<UserProfilePage />} /> {/* Add route for UserProfilePage */}
                  <Route path="browse" element={<AllListings isDashboard={true} />} /> {/* Pass isDashboard prop to AllListings when in dashboard context */}
                  <Route path="report-lost" element={<ReportLostPage />} />
                  <Route path="report-found" element={<ReportFoundPage />} />
                  <Route path="my-posts" element={<MyItemsPage />} />
                  <Route path="item/:id" element={<ItemDetail items={allItems} />} /> {/* Added dashboard item detail route */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
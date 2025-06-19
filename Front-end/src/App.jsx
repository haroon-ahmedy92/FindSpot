import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AxiosAuthProvider } from './utils/axiosAuth';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
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
import ForgotPassword from './components/auth/ForgotPassword';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import SettingsPage from './pages/SettingsPage';
import FaqPage from './pages/FaqPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

// App content wrapper component
const AppContent = () => {
    const { isDarkMode } = useTheme();
    
    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
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
                            <ContactPage />
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
                            <ItemDetail />
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
                    <Route path="/forgot-password" element={
                        <>
                            <Header />
                            <ForgotPassword />
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
                    
                    {/* Protected Dashboard routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                      <Route index element={<DashboardPage />} />
                      <Route path="profile" element={<UserProfilePage />} />
                      <Route path="browse" element={<AllListings isDashboard={true} />} />
                      <Route path="report-lost" element={<ReportLostPage />} />
                      <Route path="report-found" element={<ReportFoundPage />} />
                      <Route path="my-posts" element={<MyItemsPage />} />
                      <Route path="item/:id" element={<ItemDetail />} />
                      <Route path="settings" element={<SettingsPage />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <AxiosAuthProvider>
                <ThemeProvider>
                    <ToastProvider>
                        <AppContent />
                    </ToastProvider>
                </ThemeProvider>
            </AxiosAuthProvider>
        </AuthProvider>
    );
}

export default App;
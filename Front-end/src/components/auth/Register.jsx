import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Register = () => {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuth();
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [currentStep, setCurrentStep] = useState(1);
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) clearError();
        setLocalError('');
        setSuccessMessage('');
    };

    const nextStep = () => {
        // Basic validation for Step 1
        if (!formData.fullName || !formData.email) {
            setLocalError('Full Name and Email are required');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setLocalError('Please enter a valid email address');
            return;
        }
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => setCurrentStep(currentStep - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');

        // Validate Step 2
        if (!formData.username || !formData.password || !formData.confirmPassword) {
            setLocalError('All fields are required');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        try {
            // Prepare data for backend (exclude confirmPassword)
            const registrationData = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                username: formData.username,
                password: formData.password,
            };

            const response = await register(registrationData);
            
            // Backend returns "User registered successfully!" as plain text
            setSuccessMessage(response.message || 'Registration successful!');
            
            // Since your backend doesn't auto-login after registration,
            // redirect to login page after a brief delay
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: 'Registration successful! Please log in with your credentials.' 
                    } 
                });
            }, 2000);

        } catch (registrationError) {
            // Error is already handled by AuthContext, but we can show additional feedback
            console.error('Registration failed:', registrationError);
            setLocalError(registrationError.message || 'Registration failed. Please try again.');
        }
    };

    // Display either AuthContext error or local validation error
    const displayError = error || localError;

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${
            isDarkMode 
                ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
                : 'bg-gradient-to-b from-[#F8F9FA] to-white'
        }`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
            >
                {/* Welcome Section */}
                <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-[#3D348B] to-[#F35B04] p-10 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                    >
                        <h2 className="text-4xl font-bold mb-4">Join Us!</h2>
                        <p className="text-white/80 mb-8">
                            Create an account to help reunite lost items with their owners.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                    <FaCheck />
                                </div>
                                <p className="text-sm">Report lost or found items</p>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                    <FaEnvelope />
                                </div>
                                <p className="text-sm">Get notifications for matches</p>
                            </div>
                        </div>
                    </motion.div>
                    <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-white/10"></div>
                </div>

                {/* Form Section */}
                <div className={`w-full md:w-1/2 p-8 md:p-12 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-3xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-[#212529]'
                        }`}>Create Account</h2>
                        <div className="flex">
                            <div className={`w-3 h-3 rounded-full mx-1 ${currentStep >= 1 ? 'bg-[#00AFB9]' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')}`}></div>
                            <div className={`w-3 h-3 rounded-full mx-1 ${currentStep >= 2 ? 'bg-[#00AFB9]' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')}`}></div>
                        </div>
                    </div>
                    
                    <AnimatePresence>
                        {displayError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`p-3 rounded-lg mb-4 ${
                                    isDarkMode 
                                        ? 'bg-red-900/50 text-red-300 border border-red-700/50' 
                                        : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {displayError}
                            </motion.div>
                        )}
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`p-3 rounded-lg mb-4 ${
                                    isDarkMode 
                                        ? 'bg-green-900/50 text-green-300 border border-green-700/50' 
                                        : 'bg-green-100 text-green-700'
                                }`}
                            >
                                {successMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={currentStep === 1 ? (e) => { e.preventDefault(); nextStep(); } : handleSubmit}>
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="space-y-4"
                                >
                                    <div className="relative">
                                        <FaUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                                        }`} />
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Full Name"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#00AFB9] focus:bg-gray-600' 
                                                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#00AFB9] focus:bg-white'
                                            }`}
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <FaEnvelope className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                                        }`} />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#00AFB9] focus:bg-gray-600' 
                                                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#00AFB9] focus:bg-white'
                                            }`}
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <FaPhone className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                                        }`} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number (Optional)"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#00AFB9] focus:bg-gray-600' 
                                                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#00AFB9] focus:bg-white'
                                            }`}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#00AFB9] to-[#3D348B] text-white py-3 rounded-lg font-semibold hover:from-[#008B94] hover:to-[#2E2A6B] transition-all duration-300 transform hover:scale-105"
                                    >
                                        Next Step
                                    </button>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="space-y-4"
                                >
                                    <div className="relative">
                                        <FaUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                                        }`} />
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#00AFB9] focus:bg-gray-600' 
                                                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#00AFB9] focus:bg-white'
                                            }`}
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <FaLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                                        }`} />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#00AFB9] focus:bg-gray-600' 
                                                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#00AFB9] focus:bg-white'
                                            }`}
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <FaLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                                        }`} />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#00AFB9] focus:bg-gray-600' 
                                                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#00AFB9] focus:bg-white'
                                            }`}
                                            required
                                        />
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-gradient-to-r from-[#00AFB9] to-[#3D348B] text-white py-3 rounded-lg font-semibold hover:from-[#008B94] hover:to-[#2E2A6B] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Creating Account...' : 'Create Account'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <div className="mt-6 text-center">
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="text-[#00AFB9] hover:text-[#008B94] font-semibold transition-colors"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;




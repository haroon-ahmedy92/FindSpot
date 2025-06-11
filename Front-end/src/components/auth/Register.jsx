import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuth();
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F8F9FA] to-white p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white flex flex-col md:flex-row"
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
                <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-[#212529]">Create Account</h2>
                        <div className="flex">
                            <div className={`w-3 h-3 rounded-full mx-1 ${currentStep >= 1 ? 'bg-[#00AFB9]' : 'bg-gray-300'}`}></div>
                            <div className={`w-3 h-3 rounded-full mx-1 ${currentStep >= 2 ? 'bg-[#00AFB9]' : 'bg-gray-300'}`}></div>
                        </div>
                    </div>
                    
                    <AnimatePresence>
                        {displayError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-100 text-red-700 p-3 rounded-lg mb-4"
                            >
                                {displayError}
                            </motion.div>
                        )}
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-green-100 text-green-700 p-3 rounded-lg mb-4"
                            >
                                {successMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="relative">
                                        <FaUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#3D348B]" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Full Name"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-3 border-b-2 border-[#E9ECEF] text-[#212529] focus:border-[#F35B04] focus:outline-none transition-all duration-300 placeholder-gray-400"
                                        />
                                    </div>
                                    <div className="relative mt-6">
                                        <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#3D348B]" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-3 border-b-2 border-[#E9ECEF] text-[#212529] focus:border-[#F35B04] focus:outline-none transition-all duration-300 placeholder-gray-400"
                                        />
                                    </div>
                                    <div className="relative mt-6">
                                        <FaPhone className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#3D348B]" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 border-b-2 border-[#E9ECEF] text-[#212529] focus:border-[#F35B04] focus:outline-none transition-all duration-300 placeholder-gray-400"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full py-3 mt-6 rounded-full bg-[#3D348B] text-white font-medium hover:bg-gradient-to-r hover:from-[#FFBE0B] hover:to-[#F35B04] transition-all duration-300"
                                    >
                                        Continue
                                    </button>
                                </motion.div>
                            )}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="relative">
                                        <FaUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#3D348B]" />
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-3 border-b-2 border-[#E9ECEF] text-[#212529] focus:border-[#F35B04] focus:outline-none transition-all duration-300 placeholder-gray-400"
                                        />
                                    </div>
                                    <div className="relative mt-6">
                                        <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#3D348B]" />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-3 border-b-2 border-[#E9ECEF] text-[#212529] focus:border-[#F35B04] focus:outline-none transition-all duration-300 placeholder-gray-400"
                                        />
                                    </div>
                                    <div className="relative mt-6">
                                        <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#3D348B]" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-3 border-b-2 border-[#E9ECEF] text-[#212529] focus:border-[#F35B04] focus:outline-none transition-all duration-300 placeholder-gray-400"
                                        />
                                    </div>
                                    <div className="flex space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="w-1/3 py-3 rounded-full border-2 border-[#3D348B] text-[#3D348B] font-medium hover:bg-[#3D348B]/10 transition-all duration-300"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-2/3 py-3 rounded-full bg-[#F35B04] text-white font-medium hover:bg-gradient-to-r hover:from-[#FFBE0B] hover:to-[#F35B04] transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                                        >
                                            {isLoading && (
                                                <svg
                                                    className="animate-spin mr-2 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                            )}
                                            {isLoading ? 'Creating Account...' : 'Register'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                    <div className="mt-6 text-center text-[#212529]">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#3D348B] hover:text-[#F35B04] transition-colors duration-300">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
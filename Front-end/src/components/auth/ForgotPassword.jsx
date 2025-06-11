import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import AuthService from '../../api/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError('Email is required');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await AuthService.requestPasswordReset(email);
            setMessage(response.message || 'Password reset instructions sent to your email.');
        } catch (resetError) {
            setError(resetError.message || 'Failed to send password reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F8F9FA] to-white p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white p-8"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#212529] mb-2">Forgot Password</h2>
                    <p className="text-gray-600">
                        Enter your email address and we'll send you instructions to reset your password.
                    </p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-100 text-red-700 p-3 rounded-lg mb-4"
                        >
                            {error}
                        </motion.div>
                    )}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-green-100 text-green-700 p-3 rounded-lg mb-4"
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#3D348B]" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                                setMessage('');
                            }}
                            required
                            className="w-full pl-12 pr-4 py-3 border-b-2 border-[#E9ECEF] text-[#212529] focus:border-[#F35B04] focus:outline-none transition-all duration-300 placeholder-gray-400"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-full bg-[#F35B04] text-white font-medium hover:bg-gradient-to-r hover:from-[#FFBE0B] hover:to-[#F35B04] transition-all duration-300 flex items-center justify-center disabled:opacity-50"
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
                        {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-[#3D348B] hover:text-[#F35B04] transition-colors duration-300"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
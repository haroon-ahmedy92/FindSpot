import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "University Student",
        content: "I lost my wallet on campus and thought it was gone forever. Thanks to FindSpot, a kind stranger found it and returned it with all my cards and cash intact!",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
        id: 2,
        name: "Michael Kato",
        role: "Local Business Owner",
        content: "As a shop owner, we frequently find items left behind. FindSpot makes it so easy to connect with the owners. We've reunited over 50 items this year!",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
        id: 3,
        name: "Grace Mwakasege",
        role: "Community Leader",
        content: "This platform has strengthened our community. People are more willing to help each other now, knowing there's a trusted system to return lost items.",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    }
];

const TestimonialsSection = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-[#F8F9FA]">
            <div className="container max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#212529] mb-4">
                        What Our <span className="text-[#F35B04]">Community</span> Says
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Hear from people who have used FindSpot to recover lost items or help others.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex flex-col h-full">
                                <FaQuoteLeft className="text-[#3D348B] text-3xl mb-6 opacity-30" />
                                <p className="text-gray-600 mb-6 flex-grow">{testimonial.content}</p>
                                <div className="flex items-center">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-[#F35B04]"
                                    />
                                    <div>
                                        <h4 className="font-bold text-[#212529]">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
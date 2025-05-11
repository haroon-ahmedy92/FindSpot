import React from 'react';
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaSearchLocation, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerLinks = [
    {
      title: "Quick Links",
      links: ["Home", "Report Lost", "Report Found", "My Items", "About"]
    },
    {
      title: "Support",
      links: ["Help Center", "Safety Tips", "Community Guidelines", "Contact Us"]
    },
    {
      title: "Legal",
      links: ["Terms of Service", "Privacy Policy", "Cookie Policy"]
    }
  ];

  return (
      <footer className="bg-[#212529] text-white pt-16 pb-8">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo and Description */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1"
            >
              <div className="flex items-center mb-4">
                <FaSearchLocation className="w-6 h-6 mr-2 text-[#F35B04]" />
                <span className="font-bold text-xl">FindSpot</span>
              </div>
              <p className="text-gray-400 mb-6">
                Connecting the Dodoma community to reunite lost items with their owners.
              </p>
              <div className="flex space-x-4">
                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                    <motion.a
                        key={index}
                        href="#"
                        className="w-10 h-10 rounded-full bg-[#3D348B] flex items-center justify-center text-white hover:bg-[#F35B04] transition-colors duration-300"
                        whileHover={{ y: -3 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerLinks.map((section, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                    className="lg:col-span-1"
                >
                  <h3 className="text-lg font-semibold mb-4 text-[#F35B04]">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                              href="#"
                              className="text-gray-400 hover:text-white transition-colors duration-300"
                          >
                            {link}
                          </a>
                        </li>
                    ))}
                  </ul>
                </motion.div>
            ))}

            {/* Newsletter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-1"
            >
              <h3 className="text-lg font-semibold mb-4 text-[#F35B04]">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to get updates on lost items in your area.
              </p>
              <div className="flex">
                <input
                    type="email"
                    placeholder="Your email"
                    className="px-4 py-2 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#F35B04] w-full"
                />
                <button className="bg-[#F35B04] hover:bg-[#d95203] text-white px-4 py-2 rounded-r-lg transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500"
          >
            <p>© {new Date().getFullYear()} FindSpot. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
  );
};

export default Footer;
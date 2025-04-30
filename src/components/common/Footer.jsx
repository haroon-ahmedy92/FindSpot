// src/components/common/Footer.jsx
import React from 'react';
import FacebookIcon from '../../assets/icons/facebook.svg';
import TwitterIcon from '../../assets/icons/twitter.svg';
import InstagramIcon from '../../assets/icons/instagram.svg';
import LocationIcon from '../../assets/icons/location.svg';
import EmailIcon from '../../assets/icons/email.svg';
import PhoneIcon from '../../assets/icons/phone.svg';

const Footer = () => {
  return (
    <footer className="bg-[#444444] text-white">
      <div className="container max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FindSpot</h3>
            <p className="text-gray-400 mb-4">A community-driven lost and found platform for the Dodoma community.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <img src={FacebookIcon} alt="Facebook" className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <img src={TwitterIcon} alt="Twitter" className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <img src={InstagramIcon} alt="Instagram" className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Report Lost Item</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Report Found Item</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Browse Items</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">My Account</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <img src={LocationIcon} alt="Location" className="mt-1 mr-2 w-4 h-4" />
                <span>University of Dodoma<br />Dodoma, Tanzania</span>
              </li>
              <li className="flex items-center">
                <img src={EmailIcon} alt="Email" className="mr-2 w-4 h-4" />
                <span>info@findspot.com</span>
              </li>
              <li className="flex items-center">
                <img src={PhoneIcon} alt="Phone" className="mr-2 w-4 h-4" />
                <span>+255 123 456 789</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6">
          <p className="text-center text-gray-400">&copy; 2025 FindSpot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
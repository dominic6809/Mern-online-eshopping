/* eslint-disable no-unused-vars */
import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { About, FAQ, Contact} from './MoreLinks'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Our Store</h3>
            <p className="text-gray-400">Providing quality products since 2024</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500 transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-pink-500 transition-colors duration-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors duration-300">Shop</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors duration-300">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors duration-300">Contact</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors duration-300">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@ourstore.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+254 730 200 500</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>123 Store Street, City, Country</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Newsletter</h3>
            <p className="text-gray-400">Subscribe to receive updates about our products</p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Our Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
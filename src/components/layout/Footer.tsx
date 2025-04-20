
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Mail, 
  MapPin,
  Phone
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="section-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Logo & Description */}
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="relative h-8 w-8 overflow-hidden">
                  <div className="absolute inset-0 bg-nature-600 rounded-full"></div>
                  <div className="absolute inset-[2px] bg-white rounded-full"></div>
                  <div className="absolute inset-[4px] bg-nature-600 rounded-full opacity-80"></div>
                </div>
                <span className="font-bold text-xl tracking-tight">Green Bridge</span>
              </Link>
              <p className="text-gray-600 mb-6 text-sm">
                Green Bridge is a farm-to-table marketplace connecting local farmers with consumers, ensuring fresh, organic produce delivered right to your doorstep.
              </p>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="text-gray-500 hover:text-nature-600 transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-nature-600 transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-nature-600 transition-colors" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-nature-600 transition-colors" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-nature-600 transition-colors" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
            
            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-nature-600 transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-600 hover:text-nature-600 transition-colors">Products</Link>
                </li>
                <li>
                  <Link to="/farmers" className="text-gray-600 hover:text-nature-600 transition-colors">Our Farmers</Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-nature-600 transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-nature-600 transition-colors">Contact</Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-nature-600 transition-colors">Blog</a>
                </li>
              </ul>
            </div>
            
            {/* Column 3: Customer Service */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Customer Service</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-nature-600 transition-colors">Help Center</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-nature-600 transition-colors">How to Order</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-nature-600 transition-colors">Shipping & Delivery</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-nature-600 transition-colors">Returns & Refunds</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-nature-600 transition-colors">FAQ</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-nature-600 transition-colors">Terms & Conditions</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-nature-600 transition-colors">Privacy Policy</a>
                </li>
              </ul>
            </div>
            
            {/* Column 4: Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-nature-600 mr-3 mt-0.5" />
                  <span className="text-gray-600">
                    IIT Patna<br />
                    Bihta 801103<br />
                    India
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-nature-600 mr-3" />
                  <span className="text-gray-600">(+91) 9014918500</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-nature-600 mr-3" />
                  <a href="mailto:info@Green Bridge.com" className="text-gray-600 hover:text-nature-600 transition-colors">
                    info@Green Bridge.com
                  </a>
                </li>
              </ul>
              <div className="mt-6">
                <h4 className="font-medium mb-3">Subscribe to Our Newsletter</h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-grow rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent"
                  />
                  <button className="bg-nature-600 text-white rounded-r-lg px-4 hover:bg-nature-700 transition-colors">
                    <Mail size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-gray-200 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Green Bridge. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-nature-600 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-nature-600 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-nature-600 transition-colors text-sm">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

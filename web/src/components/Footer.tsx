import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, ArrowUpRight, Phone, Mail, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';
  const [showEnquiry, setShowEnquiry] = useState(false);
  return (
    <>
      <footer className="bg-[#1c1a17] text-gray-300 py-16 px-8 lg:px-16 border-t border-[#d4af37]/20 relative z-10 overflow-hidden">
        {/* Background Image Overlay (Subtle) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none">
          <img src="/logo.png" alt="Background Element" className="w-full h-full object-cover object-left" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          
          {/* Column 1: Reach Us */}
          <div className="space-y-6">
            <h3 className="text-[#d4af37] text-xl font-serif mb-4">Reach Us</h3>
            
            <div>
              <p className="font-bold text-gray-200 mb-1">Corporate Address:</p>
              <p className="text-sm leading-relaxed text-gray-400">
                SK Buildings Corporate Office,<br />
                [Your Address Here],<br />
                City, State, Pincode
              </p>
            </div>
            
            <div>
              <p className="font-bold text-gray-200 mb-1">For enquiries:</p>
              <p className="text-sm font-semibold">9110443387</p>
            </div>

            <div>
              <p className="font-bold text-gray-200 mb-1">Email:</p>
              <a href="mailto:info@skbuildings.com" className="text-sm hover:text-[#d4af37] transition-colors">
                info@skbuildings.com
              </a>
            </div>

            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Column 2: Quick Menu */}
          <div>
            <h3 className="text-[#d4af37] text-xl font-serif mb-6">Quick Menu</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/properties" className="hover:text-[#d4af37] transition-colors block">Properties</Link></li>
              <li><Link to="/login" className="hover:text-[#d4af37] transition-colors block">Customer Login</Link></li>
            </ul>
            {!isAboutPage && (
              <div className="mt-8 inline-block">
                <Link to="/about" className="inline-block bg-gradient-to-r from-[#d4af37] to-[#a88c3a] hover:from-[#e5c354] hover:to-[#b89b43] text-[#1c1a17] font-bold text-sm py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  About Us
                </Link>
              </div>
            )}
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-[#d4af37] text-xl font-serif mb-6">Legal</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#d4af37] transition-colors block">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#d4af37] transition-colors block">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Floating Enquire Now Section */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center">
        {showEnquiry && (
          <div className="bg-white shadow-2xl rounded-l-xl p-6 border-y border-l border-[#d4af37]/30 mr-0 w-72 relative">
            <button 
              onClick={() => setShowEnquiry(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
            <h4 className="text-xl font-bold text-[#1c1a17] mb-5 border-b pb-2">Contact Us</h4>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <a href="mailto:info@skbuildings.com" className="bg-[#d4af37]/10 p-2 rounded-lg text-[#d4af37] hover:bg-[#d4af37] hover:text-white transition-colors">
                  <Mail size={20} />
                </a>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                  <a href="mailto:info@skbuildings.com" className="text-sm font-medium text-gray-800 hover:text-[#d4af37]">info@skbuildings.com</a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <a href="tel:9110443387" className="bg-[#d4af37]/10 p-2 rounded-lg text-[#d4af37] hover:bg-[#d4af37] hover:text-white transition-colors">
                  <Phone size={20} />
                </a>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</p>
                  <a href="tel:9110443387" className="text-sm font-medium text-gray-800 hover:text-[#d4af37]">9110443387</a>
                </div>
              </div>
            </div>
          </div>
        )}
        <button 
          onClick={() => setShowEnquiry(!showEnquiry)}
          className="bg-[#a88c3a] hover:bg-[#d4af37] text-white py-4 px-2 font-semibold tracking-wider text-sm shadow-lg transition-colors rounded-l-md cursor-pointer" 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Enquire Now
        </button>
      </div>
    </>
  );
};

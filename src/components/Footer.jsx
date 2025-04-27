import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white mt-10 py-6 border-t">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm text-center">
        
        {/* Copyright */}
        <p className="mb-4 md:mb-0 text-center md:text-left">
          &copy; {new Date().getFullYear()} Miraç Market. Tüm hakları saklıdır.
        </p>
        
        {/* Menü Linkleri */}
        <div className="flex gap-6">
          <Link to="/contact" className="hover:text-blue-600 hover:underline">İletişim</Link>
          <Link to="/about" className="hover:text-blue-600 hover:underline">Hakkımızda</Link>
          <Link to="/privacy" className="hover:text-blue-600 hover:underline">Gizlilik</Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

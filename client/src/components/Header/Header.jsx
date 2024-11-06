"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
  ];

  return (
    <header className="bg-purple-700 text-white">
      <div className="px-4 py-1 flex justify-between w-screen items-center">
        <div className="text-2xl font-bold">LifeFlow</div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links for Desktop */}
        <nav className="hidden md:flex gap-2 bg-transparent bg-opacity-95 w-full py-4 px-4 transition-all duration-300 ease-in-out">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block font-bold cursor-pointer p-3 border border-transparent rounded-md text-[#D3CCCC] hover:text-[#ff5e5e] hover:border-[#ff5e5e] transform transition-all duration-300 ease-in-out"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Navigation Links */}
      {isMenuOpen && (
        <nav className="md:hidden flex flex-col items-center bg-purple-800 py-4 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block font-bold cursor-pointer p-3 w-full text-center text-[#D3CCCC] hover:text-[#ff5e5e] hover:bg-purple-600 transition-all duration-300 ease-in-out"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;

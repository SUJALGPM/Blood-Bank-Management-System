import React from "react";
import Header_logo from "../../assets/header_logo.svg";
import Home_icon from "../../assets/Footer/Home_icon.svg";
import Phone_icon from "../../assets/Footer/Phone_icon.svg";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">LifeFlow</h3>
            <p>Empowering communities through the gift of life.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  Donation Process
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-300 transition duration-300"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-orange-300 transition duration-300"
              >
                Facebook
              </a>
              <a
                href="#"
                className="hover:text-orange-300 transition duration-300"
              >
                Twitter
              </a>
              <a
                href="#"
                className="hover:text-orange-300 transition duration-300"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          © {new Date().getFullYear()} LifeFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

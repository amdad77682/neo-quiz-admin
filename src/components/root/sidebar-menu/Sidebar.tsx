"use client";
import React, { useState, useEffect } from "react";

const Sidebar = () => {
  const [smallMenu, setSmallMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const savedMenu =
      JSON.parse(localStorage.getItem("smallMenu") as string) || false;
    setSmallMenu(savedMenu);

    const handleResize = () => {
      const isSmall = window.innerWidth < 1280;
      setSmallMenu(isSmall);
      setMobileMenu(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("smallMenu", JSON.stringify(smallMenu));
  }, [smallMenu]);

  return (
    <aside
      className={`transition-transform duration-500 ${
        mobileMenu
          ? "fixed translate-x-0 opacity-100 w-64 bg-gray-800 text-gray-400"
          : smallMenu
          ? "-translate-x-64 sm:translate-x-0 w-16 bg-gray-800 text-gray-400"
          : "-translate-x-64 sm:translate-x-0 sm:w-64 bg-gray-800 text-gray-400"
      }`}
      onClick={() => mobileMenu && setMobileMenu(false)}
    >
      {/* Mobile Menu Toggle */}
      <button
        className="absolute top-4 left-4 flex items-center justify-center w-8 h-8 p-1 text-gray-400 bg-white rounded-full sm:hidden hover:bg-gray-100"
        onClick={() => setMobileMenu(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <span className="sr-only">Open Menu</span>
      </button>

      {/* Sidebar Content */}
      <div className="h-full overflow-y-auto">
        {/* Collapse/Expand Button */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
          <h2 className="font-bold text-xl">Neo Quiz</h2>
          <button
            className="flex items-center justify-center p-2 text-gray-400 bg-gray-800 rounded-full hover:text-blue-600 hover:bg-gray-700"
            onClick={() => setSmallMenu(!smallMenu)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 ${smallMenu ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
            <span className="sr-only">
              {smallMenu ? "Expand menu" : "Collapse menu"}
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-4">
          <ul>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                Elements
              </a>
            </li>
            {/* Nested Menu Example */}
            <li>
              <button className="flex items-center w-full px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Pages
              </button>
              <ul className="ml-6">
                <li>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-blue-500"
                  >
                    Account
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-blue-500"
                  >
                    Projects
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

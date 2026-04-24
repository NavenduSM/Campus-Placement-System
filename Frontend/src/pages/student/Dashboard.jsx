import React, { useContext, useState } from 'react'

import { Outlet, NavLink } from 'react-router-dom'
import SessionContext from '../../context/Context.jsx'
import SignoutConfirmation from '../../components/SignoutConfirmation.jsx'
const Dashboard = () => {
  const { mobileMenuOpen, setMobileMenuOpen, closeAllMenus } = useContext(SessionContext);
  const [showSignoutModal, setShowSignoutModal] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = () => {
    closeAllMenus();
  };
  return (
    <>
      {/* Fixed Navbar */}
      <div className="flex items-center justify-between md:pl-4 border-b-2 border-blue-100 shadow-md fixed top-0 left-0 right-0 bg-white z-10">
        <img src="/logo.png" alt="Logo" className="h-16 md:h-24 w-auto inline-block ml-2 md:ml-10" />
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 mr-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={handleMenuToggle}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 lg:gap-10 font-semibold text-base lg:text-xl mr-8 lg:mr-20">
          <NavLink to="/student/company-list" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-700 hover:text-blue-600"}>Company List</NavLink>
          <NavLink to="/student/applied-list" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-700 hover:text-blue-600"}>Applied List</NavLink>
          <NavLink to="/student/upcoming-session" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-700 hover:text-blue-600"}>Upcoming Session</NavLink>
          <NavLink to="/student/offer-letter" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-700 hover:text-blue-600"}>Offer Letter</NavLink>
          <NavLink to="/student/profile" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-700 hover:text-blue-600"}>Profile</NavLink>
          <button onClick={() => setShowSignoutModal(true)} className="text-gray-700 hover:text-blue-600 cursor-pointer">Logout</button>
        </div>
      </div>

      {/* Mobile Navigation Menu - vertical on right side */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 right-0 w-64 bg-white shadow-lg z-20 border-t border-gray-200">
          <div className="flex flex-col p-4 space-y-3 font-semibold">
            <NavLink 
              to="/student/company-list" 
              className={({ isActive }) => isActive ? "text-blue-600 bg-blue-50 p-3 rounded" : "text-gray-700 p-3 hover:bg-gray-50"}
              onClick={handleNavClick}
            >Company List</NavLink>
            <NavLink 
              to="/student/applied-list" 
              className={({ isActive }) => isActive ? "text-blue-600 bg-blue-50 p-3 rounded" : "text-gray-700 p-3 hover:bg-gray-50"}
              onClick={handleNavClick}
            >Applied List</NavLink>
            <NavLink 
              to="/student/upcoming-session" 
              className={({ isActive }) => isActive ? "text-blue-600 bg-blue-50 p-3 rounded" : "text-gray-700 p-3 hover:bg-gray-50"}
              onClick={handleNavClick}
            >Upcoming Session</NavLink>
            <NavLink 
              to="/student/offer-letter" 
              className={({ isActive }) => isActive ? "text-blue-600 bg-blue-50 p-3 rounded" : "text-gray-700 p-3 hover:bg-gray-50"}
              onClick={handleNavClick}
            >Offer Letter</NavLink>
            <NavLink 
              to="/student/profile" 
              className={({ isActive }) => isActive ? "text-blue-600 bg-blue-50 p-3 rounded" : "text-gray-700 p-3 hover:bg-gray-50"}
              onClick={handleNavClick}
            >Profile</NavLink>
            <button 
              onClick={() => { handleNavClick(); setShowSignoutModal(true); }}
              className="text-gray-700 p-3 hover:bg-gray-50 text-left"
            >Logout</button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="pt-20 md:pt-22">
        <Outlet />
      </div>
      <SignoutConfirmation isOpen={showSignoutModal} onClose={() => setShowSignoutModal(false)} />
    </>
  )
}

export default Dashboard
import { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'

function App() {
 return(
   <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
    <div className="text-center">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
        Campus Placement System
      </h1>
      <p className="text-gray-600 text-base md:text-lg mb-8">
        Welcome to the Training and Placement Office Portal
      </p>
      <Link 
        to="/tpo-dashboard" 
        className="inline-block bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-600 cursor-pointer text-base md:text-lg transition-colors"
        >
        Go to TPO Dashboard
      </Link>
    </div>
  </div>
 )
}

export default App





import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthToken, getAuthRole } from "./utils/auth.js";
import SignoutConfirmation from "./components/SignoutConfirmation.jsx";

export default function Landing() {
    const [authRole, setAuthRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showSignoutModal, setShowSignoutModal] = useState(false);

    useEffect(() => {
        setIsAuthenticated(Boolean(getAuthToken()));
        setAuthRole(getAuthRole());
    }, []);

    const dashboardLink = authRole === "tpo" ? "/tpo/view-jobs" : "/student/company-list";
    const dashboardLabel = authRole === "tpo" ? "TPO Dashboard" : "Student Dashboard";

    return (
        <div className="bg-white min-h-screen">

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-sm bg-opacity-95">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-4 md:px-10">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            CP
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            Campus Placements
                        </h1>
                    </div>

                    <div className="hidden md:flex gap-8 items-center">
                        <a href="#features" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Features</a>
                        <a href="#how" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">How it Works</a>

                        {!isAuthenticated ? (
                            <Link
                                to="/signup"
                                className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium"
                            >
                                Login
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to={dashboardLink}
                                    className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium"
                                >
                                    {dashboardLabel}
                                </Link>
                                <button
                                    onClick={() => setShowSignoutModal(true)}
                                    className="border-2 border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-medium cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        {!isAuthenticated ? (
                            <Link
                                to="/signup"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Login
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to={dashboardLink}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    {dashboardLabel}
                                </Link>
                                <button
                                    onClick={() => setShowSignoutModal(true)}
                                    className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden px-6 md:px-10 py-16 md:py-24">
                <div className="max-w-7xl mx-auto flex flex-col-reverse gap-16 md:flex-row items-center md:items-start">
                    <div className="absolute top-0 right-0 w-52 h-52 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 hidden xl:block"></div>
                    <div className="absolute bottom-0 left-0 w-52 h-52 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 hidden xl:block"></div>

                    <div className="w-full md:w-1/2 z-10">
                        <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-gray-900">
                            Your Gateway to <span className="bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Campus Placements</span>
                        </h2>

                        <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed max-w-xl">
                            A centralized platform where students can explore job opportunities,
                            apply for companies, attend placement sessions, and track their
                            application status with ease.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/signup"
                                        className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-center"
                                    >
                                        👤 Student Login
                                    </Link>

                                    <Link
                                        to="/signup"
                                        className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-semibold text-center hover:border-blue-700"
                                    >
                                        🏢 TPO Login
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to={dashboardLink}
                                        className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-center"
                                    >
                                        {dashboardLabel}
                                    </Link>
                                    <button
                                        onClick={() => setShowSignoutModal(true)}
                                        className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-semibold text-center hover:border-blue-700 cursor-pointer"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex justify-center">
                        <img
                            src="/nanobananas-1775996891341.png"
                            alt="placement"
                            className="w-full max-w-sm sm:max-w-md md:max-w-xl object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-linear-to-br from-blue-50 to-indigo-50 py-20 px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">

                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 text-center">
                        <div className="inline-block bg-linear-to-br from-blue-400 to-blue-500 text-white rounded-lg p-3 mb-4">
                            <span className="text-2xl">👥</span>
                        </div>
                        <h3 className="text-5xl font-bold bg-linear-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">500+</h3>
                        <p className="text-gray-600 mt-3 font-medium">Students Registered</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 text-center">
                        <div className="inline-block bg-linear-to-br from-green-500 to-green-600 text-white rounded-lg p-3 mb-4">
                            <span className="text-2xl">🏢</span>
                        </div>
                        <h3 className="text-5xl font-bold bg-linear-to-r from-green-500 to-green-700 bg-clip-text text-transparent">120+</h3>
                        <p className="text-gray-600 mt-3 font-medium">Companies</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 text-center">
                        <div className="inline-block bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-lg p-3 mb-4">
                            <span className="text-2xl">📜</span>
                        </div>
                        <h3 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">350+</h3>
                        <p className="text-gray-600 mt-3 font-medium">Offers Made</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 text-center">
                        <div className="inline-block bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-lg p-3 mb-4">
                            <span className="text-2xl">🎤</span>
                        </div>
                        <h3 className="text-5xl font-bold bg-linear-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">40+</h3>
                        <p className="text-gray-600 mt-3 font-medium">Placement Sessions</p>
                    </div>

                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 px-6 md:px-10 max-w-7xl mx-auto">

                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Platform Features
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Everything you need for successful campus placements
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="bg-linear-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-blue-200">
                        <div className="text-5xl mb-4">📋</div>
                        <h3 className="font-bold text-lg mb-3 text-gray-900">Job Listings</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Browse and apply for jobs posted by top companies looking for talent.
                        </p>
                    </div>

                    <div className="bg-linear-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-green-200">
                        <div className="text-5xl mb-4">📊</div>
                        <h3 className="font-bold text-lg mb-3 text-gray-900">Application Tracking</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Track the status of your job applications and get real-time notifications.
                        </p>
                    </div>

                    <div className="bg-linear-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-purple-200">
                        <div className="text-5xl mb-4">🎤</div>
                        <h3 className="font-bold text-lg mb-3 text-gray-900">Placement Sessions</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Attend company sessions and placement drives with easy registration.
                        </p>
                    </div>

                    <div className="bg-linear-to-br from-orange-50 to-orange-100 p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-orange-200">
                        <div className="text-5xl mb-4">📄</div>
                        <h3 className="font-bold text-lg mb-3 text-gray-900">Offer Letters</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Download and manage offer letters after successful selection.
                        </p>
                    </div>

                </div>
            </section>

            {/* How it works */}
            <section id="how" className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-24 px-6 md:px-10 text-white">

                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            How It Works
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Follow these simple steps to get placed at your dream company
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4 md:gap-2">

                        {/* Step 1 */}
                        <div className="relative flex flex-col items-center">
                            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg mb-4">
                                1
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 text-center flex-1 border border-gray-700">
                                <p className="font-semibold mb-2">Create Profile</p>
                                <p className="text-gray-400 text-sm leading-relaxed">Build your student profile with resume and skills</p>
                            </div>
                            <div className="hidden md:block absolute top-10 left-2/3 w-full h-1 bg-linear-to-r from-blue-600  via-blue-700 to-transparent"></div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex flex-col items-center">
                            <div className="w-20 h-20 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg mb-4 md:mt-8">
                                2
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 text-center flex-1 border border-gray-700">
                                <p className="font-semibold mb-2">TPO Posts Jobs</p>
                                <p className="text-gray-400 text-sm leading-relaxed">TPO posts job openings from partner companies</p>
                            </div>
                            <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-linear-to-r from-transparent via-green-500 to-transparent"></div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex flex-col items-center">
                            <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg mb-4">
                                3
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 text-center flex-1 border border-gray-700">
                                <p className="font-semibold mb-2">Students Apply</p>
                                <p className="text-gray-400 text-sm leading-relaxed">Students apply for jobs matching their skills</p>
                            </div>
                            <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent"></div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative flex flex-col items-center">
                            <div className="w-20 h-20 bg-linear-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg mb-4 md:mt-8">
                                4
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 text-center flex-1 border border-gray-700">
                                <p className="font-semibold mb-2">Companies Shortlist</p>
                                <p className="text-gray-400 text-sm leading-relaxed">Companies review and shortlist suitable candidates</p>
                            </div>
                            <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-linear-to-r from-transparent via-pink-500 to-transparent"></div>
                        </div>

                        {/* Step 5 */}
                        <div className="relative flex flex-col items-center">
                            <div className="w-20 h-20 bg-linear-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg mb-4">
                                ✓
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 text-center flex-1 border border-gray-700">
                                <p className="font-semibold mb-2">Get Offers</p>
                                <p className="text-gray-400 text-sm leading-relaxed">Receive and download offer letters</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 md:px-10 text-center bg-linear-to-r from-blue-50 to-indigo-50">

                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        Start Your Placement Journey Today
                    </h2>

                    <p className="text-gray-600 mb-10 text-base sm:text-lg leading-relaxed">
                        Join thousands of students who have successfully landed jobs through our platform. 
                        Explore opportunities, showcase your skills, and take the next step in your career.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/signup"
                                    className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg text-center"
                                >
                                    👤 Student Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 px-6 py-4 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-semibold text-lg text-center hover:border-blue-700"
                                >
                                    🏢 TPO Login
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={dashboardLink}
                                    className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg text-center"
                                >
                                    {dashboardLabel}
                                </Link>
                                <button
                                    onClick={() => setShowSignoutModal(true)}
                                    className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 px-6 py-4 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-semibold text-lg text-center hover:border-blue-700 cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 px-6 md:px-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    CP
                                </div>
                                <h3 className="font-bold text-white text-lg">Campus Placements</h3>
                            </div>
                            <p className="text-gray-400 text-sm">Connecting students with career opportunities</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#features" className="hover:text-blue-400 transition">Features</a></li>
                                <li><a href="#how" className="hover:text-blue-400 transition">How It Works</a></li>
                                <li><Link to="/signup" className="hover:text-blue-400 transition">Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-3">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="mailto:support@campusplacements.com" className="hover:text-blue-400 transition">Email Support</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition">FAQs</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-6 text-center text-sm">
                        <p className="text-gray-400">
                            © 2026 Campus Placement Portal. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            <SignoutConfirmation isOpen={showSignoutModal} onClose={() => setShowSignoutModal(false)} />
        </div>
    );
}
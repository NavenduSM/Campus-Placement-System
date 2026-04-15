import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "./Loading.jsx";
import toast, { Toaster } from "react-hot-toast";
import { getAuthToken, getAuthRole } from "../utils/auth.js";

export default function AuthPage() {
    const [isSignup, setIsSignup] = useState(true);
    const [role, setRole] = useState("student");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [otpMode, setOtpMode] = useState(false);

    const [form, setForm] = useState({
        name: "",
        emailId: "",
        enrollmentNo: "",
        course: "",
        phoneNo: "",
        password: "",
        otp: "",
    });

    const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || "http://localhost:8084";
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = getAuthToken();
        const authRole = getAuthRole();
        if (token && authRole) {
            const redirectUrl = authRole === "tpo" ? "/tpo/view-jobs" : "/student/company-list";
            navigate(redirectUrl, { replace: true });
        }
    }, [navigate]);

    const toggleForm = () => {
        setIsSignup(!isSignup);
        setOtpMode(false);
        setError("");
        setSuccess("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const isStudent = role === "student";
            const path = isSignup
                ? isStudent
                    ? "/api/students/signup"
                    : "/api/tpo/signup"
                : isStudent
                    ? "/api/students/login"
                    : "/api/tpo/login";

            const payload = isSignup
                ? isStudent
                    ? {
                        name: form.name,
                        emailId: form.emailId,
                        enrollmentNo: form.enrollmentNo,
                        course: form.course,
                        phoneNo: form.phoneNo,
                        password: form.password,
                    }
                    : {
                        name: form.name,
                        emailId: form.emailId,
                        phoneNo: form.phoneNo,
                        password: form.password,
                    }
                : {
                    emailId: form.emailId,
                    password: form.password,
                };

            const response = await axios.post(`${AUTH_BASE_URL}${path}`, payload);

            if (isSignup) {
                setSuccess("Signup successful. OTP sent to your email.");
                setOtpMode(true);
                toast.success("OTP sent to your email!");

            } else {
                const token = response.data;
                localStorage.setItem("authToken", token);
                localStorage.setItem("authRole", role);
                setSuccess("Login successful.");
                toast.success(`Welcome back, ${role}!`);
                // Redirect to intended page or default dashboard
                const from = location.state?.from?.pathname || (role === "student" ? "/student/company-list" : "/tpo/view-jobs");
                navigate(from, { replace: true });
            }
        } catch (err) {
            const message =
                err?.response?.data ||
                err?.message ||
                "Something went wrong. Please try again.";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const path =
                role === "student"
                    ? "/api/students/verify-otp"
                    : "/api/tpo/verify-otp";

            const payload = {
                emailId: form.emailId,
                otp: form.otp,
            };

            await axios.post(`${AUTH_BASE_URL}${path}`, payload);
            if (!form.password) {
                setError("Password is required to log in.");
                return;
            }

            const loginPath =
                role === "student"
                    ? "/api/students/login"
                    : "/api/tpo/login";

            const loginPayload = {
                emailId: form.emailId,
                password: form.password,
            };

            const loginResponse = await axios.post(`${AUTH_BASE_URL}${loginPath}`, loginPayload);
            const token = loginResponse.data;
            localStorage.setItem("authToken", token);
            localStorage.setItem("authRole", role);

            setSuccess("OTP verified. Logged in.");
            setIsSignup(false);
            setOtpMode(false);
            setForm((prev) => ({ ...prev, otp: "" }));
            toast.success("Verification successful!");
            // Redirect to intended page or default dashboard
            const from = location.state?.from?.pathname || (role === "student" ? "/student/company-list" : "/tpo/view-jobs");
            navigate(from, { replace: true });
        } catch (err) {
            const message =
                err?.response?.data ||
                err?.message ||
                "OTP verification failed. Please try again.";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
            <Toaster position="top-right" />
            {loading ? (
                <Loading />
            ) : (
                <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-gray-100 relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-tr from-indigo-100 to-purple-200 rounded-full opacity-50"></div>

                    {/* Header */}
                    <div className="text-center mb-8 relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {otpMode ? "Verify OTP" : isSignup ? "Create Account" : "Welcome Back"}
                        </h2>
                        <p className="text-gray-600 text-sm">
                            {otpMode
                                ? "Enter the verification code sent to your email"
                                : isSignup
                                    ? "Join our campus placement platform"
                                    : "Sign in to your account"
                            }
                        </p>
                    </div>

                    {/* Role Selector */}
                    {!otpMode && (
                        <div className="flex justify-center gap-2 mb-8 p-1 bg-gray-100 rounded-xl relative z-10">
                            <button
                                className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                                    role === "student"
                                        ? "bg-white text-blue-600 shadow-md transform scale-105"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                                onClick={() => setRole("student")}
                                type="button"
                            >
                                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Student
                            </button>

                            <button
                                className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                                    role === "tpo"
                                        ? "bg-white text-blue-600 shadow-md transform scale-105"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                                onClick={() => setRole("tpo")}
                                type="button"
                            >
                                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                TPO
                            </button>
                        </div>
                    )}

                    <form
                        className="flex flex-col gap-4 relative z-10"
                        onSubmit={otpMode ? handleVerifyOtp : handleSubmit}
                        method="post"
                        action=""
                        noValidate
                    >

                        {/* Name */}
                        {isSignup && !otpMode && (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                name="emailId"
                                value={form.emailId}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Student Only Fields */}
                        {isSignup && !otpMode && role === "student" && (
                            <>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enrollment Number"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        name="enrollmentNo"
                                        value={form.enrollmentNo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Course/Program"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        name="course"
                                        value={form.course}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* Phone */}
                        {isSignup && !otpMode && (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                    name="phoneNo"
                                    value={form.phoneNo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {/* Password */}
                        {!otpMode && (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {/* OTP */}
                        {otpMode && (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-center tracking-widest"
                                    name="otp"
                                    value={form.otp}
                                    onChange={handleChange}
                                    maxLength="6"
                                    required
                                />
                            </div>
                        )}

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
                            disabled={loading}
                            type="submit"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {loading && (
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {otpMode
                                    ? "Verify OTP"
                                    : isSignup
                                        ? "Create Account"
                                        : "Sign In"}
                            </span>
                        </button>
                    </form>

                    {/* Toggle Form */}
                    {!otpMode && (
                        <div className="text-center mt-6 relative z-10">
                            <p className="text-gray-600 text-sm">
                                {isSignup ? "Already have an account?" : "Don't have an account?"}
                                <button
                                    onClick={toggleForm}
                                    className="text-blue-600 hover:text-indigo-700 font-semibold ml-2 transition-colors duration-200"
                                >
                                    {isSignup ? "Sign In" : "Sign Up"}
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Back to Form Link in OTP Mode */}
                    {otpMode && (
                        <div className="text-center mt-6 relative z-10">
                            <button
                                onClick={() => {
                                    setOtpMode(false);
                                    setError("");
                                    setSuccess("");
                                }}
                                className="text-blue-600 hover:text-indigo-700 font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Sign Up
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import toast from "react-hot-toast";

const SignoutConfirmation = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || "http://localhost:8084";

    const handleSignout = async () => {
        setLoading(true);
        const role = localStorage.getItem("authRole");
        const token = localStorage.getItem("authToken");
        const path = role === "tpo" ? "/api/tpo/logout" : "/api/students/logout";
        try {
            await api.post(`${AUTH_BASE_URL}${path}`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            toast.success("Signed out successfully");
        } catch (err) {
            const message = err?.response?.data || err?.message || "Logout failed.";
            toast.error(message);
        } finally {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authRole");
            setLoading(false);
            onClose();
            navigate("/");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Sign Out?</h2>
                <p className="text-gray-600 mb-8 text-base">
                    Are you sure you want to sign out of your account?
                </p>
                <div className="flex gap-3 flex-col sm:flex-row">
                    <button
                        onClick={handleSignout}
                        disabled={loading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? "Signing out..." : "Sign Out"}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-colors duration-300 disabled:opacity-60 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignoutConfirmation;

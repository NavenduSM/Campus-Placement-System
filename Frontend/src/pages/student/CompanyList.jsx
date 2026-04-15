import { useEffect, useState, useContext } from 'react'
import api from '../../utils/api.js'
import { getAuthToken } from '../../utils/auth.js'
import Loading from '../../components/Loading.jsx'
import SessionContext from '../../context/Context.jsx'
import {  useParams, Link } from 'react-router-dom'
import JobDes from '../../components/JobDesc.jsx'
import toast, { Toaster } from 'react-hot-toast'

const CompanyList = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const { mobileSidebarOpen, setMobileSidebarOpen, mobileMenuOpen, closeAllMenus } = useContext(SessionContext)
    // const navigate = useNavigate()
    const { id } = useParams()
    const STUDENT_BASE_URL = import.meta.env.VITE_STUDENT_BASE_URL || "http://localhost:8081"

    useEffect(() => {
        setMobileSidebarOpen(window.innerWidth < 768 && true)
    }, [])

    useEffect(() => {
        // Scroll to top when component renders or when id changes
        window.scrollTo(0, 0)
    }, [id])

    const loadJobs = async () => {
        setLoading(true)
        setError("")
        try {
            if (!getAuthToken()) {
                const msg = "Login required. Please sign in again."
                setError(msg)
                toast.error(msg)
                return
            }

            const res = await api.get(`${STUDENT_BASE_URL}/api/jobs`)
            const jobs = Array.isArray(res.data) ? res.data : []
            setData(jobs)
            if (jobs.length > 0) {
                toast.success(`Loaded ${jobs.length} companies`)
            } else {
                toast.info("No companies available at the moment")
            }
        } catch (err) {
            const status = err?.response?.status
            const msg = err?.response?.data || err?.message || "Failed to load jobs."
            if (status === 403) {
                const errMsg = "Forbidden (403). Token invalid or expired. Please login again."
                setError(errMsg)
                toast.error(errMsg)
            } else {
                setError(msg)
                toast.error(msg)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadJobs()
    }, [])

    const selectedCompany = data.find(company => String(company.id) === String(id))

    const handleMobileSidebarToggle = () => {
        if (mobileMenuOpen) {
            closeAllMenus()
        } else {
            setMobileSidebarOpen(!mobileSidebarOpen)
        }
    }

    return (
        <div className="flex h-[calc(100vh-7rem)] bg-gray-50 overflow-hidden pt-16 md:pt-0 mt-0 md:mt-3">
            <Toaster position="top-right" />
            {/* Mobile Sidebar Toggle Button */}
            {!mobileSidebarOpen && (
                <button 
                    className="md:hidden fixed top-22 left-4 z-30 bg-blue-700 text-white p-3 rounded-full shadow-lg"
                    onClick={handleMobileSidebarToggle}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}

            {/* Sidebar - Desktop */}
            <div className={`hidden md:flex flex-col ${sidebarOpen ? 'w-1/3' : 'w-14'} h-full border-r border-gray-300 transition-all duration-300`}>
                {/* Header with Companies title and toggle button */}
                <div className="flex items-center justify-between p-2 border-b border-gray-300 bg-white flex-shrink-0">
                    {sidebarOpen && <h1 className="text-xl font-semibold text-gray-800">Companies</h1>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`${sidebarOpen ? 'p-2 hover:bg-gray-100' : 'p-3 bg-gray-200'} rounded-lg transition-all font-semibold text-gray-600 hover:text-gray-800`}
                        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                    >
                        {sidebarOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Companies List - scrollable */}
                <div className="overflow-y-auto flex-1">
                    {sidebarOpen && (
                        <div className="p-2 md:p-4 space-y-2 md:space-y-3">
                        {data.map((company) => (
                            <div key={company.id}>
                                <Link 
                                    to={`/student/company-list/job-description/${company.id}`} 
                                    state={{ company }}
                                    className={`block p-2 md:p-4 rounded-lg border-l-4 transition-all duration-200 cursor-pointer ${
                                        String(id) === String(company.id) 
                                            ? 'border-l-blue-600 bg-blue-50 border border-blue-200' 
                                            : 'border-l-gray-300 border border-gray-200 hover:border-l-blue-400 hover:bg-gray-50'
                                    }`}
                                >
                                    <h3 className="font-semibold text-gray-800 text-sm md:text-base">{company.companyName}</h3>
                                    <p className="text-gray-600 text-xs md:text-sm mt-1">{company.role}</p>
                                    <p className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded mt-1 mb-1">ID: {company.id}</p>
                                    <p className="text-gray-500 text-xs mt-1">{company.location}</p>
                                </Link>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar Overlay - opens from left */}
            {mobileSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-20 bg-opacity-50" onClick={closeAllMenus}>
                    <div className="absolute left-0 top-20 h-[calc(100vh-5rem)] w-80 max-w-[85vw] bg-white shadow-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white flex-shrink-0">
                            <h1 className="text-xl font-semibold text-gray-800">Companies</h1>
                            <button
                                onClick={closeAllMenus}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4 space-y-3">
                            {data.map((company) => (
                                <div key={company.id}>
                                    <Link 
                                        to={`/student/company-list/job-description/${company.id}`} 
                                        state={{ company }}
                                        onClick={closeAllMenus}
                                        className={`block p-4 rounded-lg border-l-4 transition-all duration-200 cursor-pointer ${
                                            String(id) === String(company.id) 
                                                ? 'border-l-blue-600 bg-blue-50 border border-blue-200' 
                                                : 'border-l-gray-300 border border-gray-200 hover:border-l-blue-400 hover:bg-gray-50'
                                        }`}
                                    >
                                        <h3 className="font-semibold text-gray-800 text-sm">{company.companyName}</h3>
                                        <p className="text-gray-600 text-xs mt-1">{company.role}</p>
                                        <p className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded mt-1 mb-1">ID: {company.id}</p>
                                        <p className="text-gray-500 text-xs mt-1">{company.location}</p>
                                    </Link>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 h-full overflow-y-auto p-4 md:p-1">
                {loading ? (
                    <Loading />
                ) : error ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-red-600 text-center">{error}</p>
                    </div>
                ) : selectedCompany ? (
                    <JobDes company={selectedCompany} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
                            </svg>
                            <h3 className="text-gray-600 font-semibold">Select a company to view details</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CompanyList


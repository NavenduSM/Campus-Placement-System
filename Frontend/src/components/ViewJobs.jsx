import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import AppliedStudents from "../pages/TPO/AppliedStudents.jsx"
import JobDes from "./JobDesc.jsx";
import { JobDesc } from "./JobDesc.jsx";
import SessionContext from "../context/Context.jsx";
import toast, { Toaster } from "react-hot-toast";
import api from "../utils/api.js";
import Loading from "./Loading.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx";

const ViewJobs = () => {
    const [edit, setEdit] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [uploadMenuOpen, setUploadMenuOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [appliedRefreshKey, setAppliedRefreshKey] = useState(0)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [jobToDelete, setJobToDelete] = useState(null)
    const [deletingJob, setDeletingJob] = useState(false)
    const { mobileSidebarOpen, setMobileSidebarOpen, mobileMenuOpen, closeAllMenus } = useContext(SessionContext)
    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation()
    const isViewingAppliedStudents = location.pathname.includes('/applied-students')
    const TPO_BASE_URL = import.meta.env.VITE_TPO_BASE_URL || "http://localhost:8083";

    useEffect(()=>{
        setMobileSidebarOpen(window.innerWidth < 768 && true )
    },[])

    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        // Scroll to top when component renders or when id changes
        window.scrollTo(0, 0);
    }, [id, isViewingAppliedStudents])

    const loadJobs = async () => {
        try {
            setLoading(true);
            const res = await api.get(`${TPO_BASE_URL}/api/jd`);
            const data = Array.isArray(res.data) ? res.data : [];
            const normalized = data.map((jd) => ({
                id: jd.id,
                company: jd.companyName,
                companyName: jd.companyName,
                title: jd.role,
                role: jd.role,
                description: jd.jobDescription,
                skills: jd.skillsRequired || [],
                dateOfApply: jd.dateOfApply,
                salary: jd.salary,
                location: jd.location,
                bond: jd.bond,
                eligibleDegree: jd.eligibleDegree,
                selectionProcess: jd.selectionProcess,
                specialCriterion: jd.specialCriterion,
            }));
            setJobs(normalized);
        } catch (err) {
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    useEffect(() => {
        if (location?.state?.refresh) {
            loadJobs();
        }
    }, [location?.state?.refresh]);


    const handleDelete = (jobId) => {
        setJobToDelete(jobId);
        setDeleteModalOpen(true);
    }

    const performDelete = async () => {
        try {
            setDeletingJob(true);
            await api.delete(`${TPO_BASE_URL}/api/jd/${jobToDelete}`);
            const updatedJobs = jobs.filter(job => job.id !== jobToDelete);
            setJobs(updatedJobs);
            toast.success("Job deleted successfully");
            if (String(id) === String(jobToDelete)) {
                navigate("/tpo/view-jobs");
            }
            setDeleteModalOpen(false);
            setJobToDelete(null);
        } catch (err) {
            toast.error("Failed to delete job");
        } finally {
            setDeletingJob(false);
        }
    }

    const handleSave = async (job) => {
        try {
            const payload = {
                companyName: job.company,
                jobDescription: job.description,
                skillsRequired: job.skills || [],
                dateOfApply: job.dateOfApply,
                role: job.role,
                salary: job.salary,
                location: job.location,
                bond: job.bond,
                eligibleDegree: job.eligibleDegree,
                selectionProcess: job.selectionProcess,
                specialCriterion: job.specialCriterion,
            };
            const res = await api.put(`${TPO_BASE_URL}/api/jd/${job.id}`, payload);
            const updated = res.data;
            const normalized = {
                id: updated.id,
                company: updated.companyName,
                companyName: updated.companyName,
                title: updated.role,
                role: updated.role,
                description: updated.jobDescription,
                skills: updated.skillsRequired || [],
                dateOfApply: updated.dateOfApply,
                salary: updated.salary,
                location: updated.location,
                bond: updated.bond,
                eligibleDegree: updated.eligibleDegree,
                selectionProcess: updated.selectionProcess,
                specialCriterion: updated.specialCriterion,
            };
            setJobs((prev) => prev.map((j) => (j.id === normalized.id ? normalized : j)));
            toast.success("Job updated");
        } catch (err) {
            toast.error("Failed to update job");
        }
    };

    const selectedJob = jobs.find(job => String(job.id) === String(id))

    const handleMobileSidebarToggle = () => {
        if (mobileMenuOpen) {
            closeAllMenus();
        } else {
            setMobileSidebarOpen(!mobileSidebarOpen);
        }
    };

    const updateStatus = () => {
        setUploadMenuOpen(true)
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
            setSelectedFile(file)
        } else {
            toast.error("Please upload a CSV file")
        }
    }

    const handleUploadSubmit = async () => {
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append("file", selectedFile);
                const res = await api.post(`${TPO_BASE_URL}/api/applications/bulk-update-status`, formData);
                const { totalProcessed, successfulCount, failedCount } = res?.data || {};
                if (typeof successfulCount === "number" && typeof totalProcessed === "number") {
                    toast.success(`Updated ${successfulCount} of ${totalProcessed} records.`);
                    if (failedCount > 0) {
                        toast.error(`${failedCount} rows failed. Check CSV and try again.`);
                    }
                } else {
                    toast.success("File uploaded! Statuses updated.");
                }
                setSelectedFile(null);
                setUploadMenuOpen(false);
                loadJobs(); // Refresh job list & applied students
                setAppliedRefreshKey((prev) => prev + 1);
            } catch (err) {
                toast.error("Failed to upload file");
            }
        } else {
            toast.error('Please select a file first')
        }
    }

    return (
        <div className="flex h-[calc(100vh-7rem)] bg-gray-50 overflow-hidden pt-16 md:pt-0 mt-0 md:mt-3">
            {/* Upload Menu Modal */}
            {uploadMenuOpen && (
                <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => {
                    setUploadMenuOpen(false)
                    setSelectedFile(null)
                }}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-800">Update Status</h2>
                            <button
                                onClick={() => {
                                    setUploadMenuOpen(false)
                                    setSelectedFile(null)
                                }}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <p className="text-gray-600 text-sm">Upload a CSV file to update student placement status.</p>
                            
                            {/* File Input */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                                <p className="text-gray-500 text-sm mt-1">CSV file (.csv)</p>
                            </div>

                            {/* Selected File Display */}
                            {selectedFile && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 16.5a1 1 0 01-1-1V9.707l-3.146 3.147a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L9 9.707V15.5a1 1 0 01-1 1z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-600">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <button
                                onClick={() => {
                                    setUploadMenuOpen(false)
                                    setSelectedFile(null)
                                }}
                                className="flex-1 px-4 py-2 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadSubmit}
                                disabled={!selectedFile}
                                className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors ${
                                    selectedFile 
                                        ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Sidebar Toggle Button - positioned below navbar on top left, hidden when sidebar is open */}
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
                {/* Header with Jobs title and toggle button */}
                <div className="flex items-center justify-between p-2 border-b border-gray-300 bg-white flex-shrink-0">
                    {sidebarOpen && <h1 className="text-xl font-semibold text-gray-800">Jobs</h1>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`${sidebarOpen ? 'p-2 hover:bg-gray-100' : 'p-3 bg-gray-200'} rounded-lg transition-all font-semibold text-gray-600 hover:text-gray-800`}
                        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                    >
                        {sidebarOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Jobs List - scrollable */}
                <div className="overflow-y-auto flex-1">
                    {sidebarOpen && (
                        <div className="p-2 md:p-4 space-y-2 md:space-y-3">
                        {jobs.map((job) => (
                            <div key={job.id}>
                                <Link 
                                    to={`/tpo/view-jobs/job/${job.id}`} 
                                    state={{ job, edit }}
                                    className={`block p-2 md:p-4 rounded-lg border-l-4 transition-all duration-200 cursor-pointer ${
                                        String(id) === String(job.id) 
                                            ? 'border-l-blue-600 bg-blue-50 border border-blue-200' 
                                            : 'border-l-gray-300 border border-gray-200 hover:border-l-blue-400 hover:bg-gray-50'
                                    }`}
                                >
                                    <h3 className="font-semibold text-gray-800 text-sm md:text-base">{job.title}</h3>
                                    <p className="text-gray-600 text-xs md:text-sm mt-1">{job.company}</p>
                                    <p className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded mt-1 mb-1">ID: {job.id}</p>
                                    <p className="text-gray-500 text-xs mt-1">{job.location}</p>
                                </Link>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar Overlay - opens from left */}
            {mobileSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-20  bg-opacity-50" onClick={closeAllMenus}>
                    <div className="absolute left-0 top-20 h-[calc(100vh-5rem)] w-80 max-w-[85vw] bg-white shadow-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white flex-shrink-0">
                            <h1 className="text-xl font-semibold text-gray-800">Jobs</h1>
                            <button
                                onClick={closeAllMenus}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4 space-y-3">
                            {jobs.map((job) => (
                                <div key={job.id}>
                                    <Link 
                                        to={`/tpo/view-jobs/job/${job.id}`} 
                                        state={{ job, edit }}
                                        onClick={closeAllMenus}
                                        className={`block p-4 rounded-lg border-l-4 transition-all duration-200 cursor-pointer ${
                                            String(id) === String(job.id) 
                                                ? 'border-l-blue-600 bg-blue-50 border border-blue-200' 
                                                : 'border-l-gray-300 border border-gray-200 hover:border-l-blue-400 hover:bg-gray-50'
                                        }`}
                                    >
                                        <h3 className="font-semibold text-gray-800 text-sm">{job.title}</h3>
                                        <p className="text-gray-600 text-xs mt-1">{job.company}</p>
                                        <p className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded mt-1 mb-1">ID: {job.id}</p>
                                        <p className="text-gray-500 text-xs mt-1">{job.location}</p>
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
                ) : isViewingAppliedStudents ? (
                    <div className="flex flex-col mt-0 md:mt-2 items-center  lg:w-full">
                        <div className="flex justify-between w-full mb-1">
                            <button
                                onClick={() => navigate(`/tpo/view-jobs/job/${id}`)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold sm:ml-[10%]"
                            >
                                ← Back to Job
                            </button>
                            <button 
                                onClick={updateStatus}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold"
                            > 
                                Update status 
                            </button>
                        </div>
                            <AppliedStudents
                                jobId={id}
                                companyName={selectedJob?.companyName || selectedJob?.company}
                                refreshKey={appliedRefreshKey}
                            />
                    </div>
                ) : selectedJob ? (
                    <JobDesc
                        jobData={selectedJob}
                        onDelete={handleDelete}
                        onSave={handleSave}
                        onAppliedStudents={() => navigate(`/tpo/view-jobs/job/${selectedJob.id}/applied-students`)}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-600 mb-2">Select a Job</h2>
                            <p className="text-gray-500 text-sm md:text-base">Choose a job from the sidebar to view details</p>
                        </div>
                    </div>
                )}
            </div>


            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => { setDeleteModalOpen(false); setJobToDelete(null); }}
                onConfirm={performDelete}
                title="Delete Job?"
                message="Are you sure you want to delete this job? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDangerous={true}
                isLoading={deletingJob}
            />
            
            <Toaster position="top-right" />
        </div>
    )
}

export default ViewJobs


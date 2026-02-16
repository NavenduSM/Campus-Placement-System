import { useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import AppliedStudents from "./AppliedStudents";
import JobDesc from "./JobDesc";

const ViewJobs = () => {
    const [edit, setEdit] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation()
    const isViewingAppliedStudents = location.pathname.includes('/applied-students')

    const [jobs, setJobs] = useState([
        {
            id: 1,
            title: "Software Engineer",
            company: "Tech Corp",
            location: "New York, NY",
            description: "Develop and maintain web applications.",
            salary: "$120,000",
            skills: ["JavaScript", "React", "Node.js"]
        },
        {
            id: 2,
            title: "Data Analyst",
            company: "Data Solutions",
            location: "San Francisco, CA",
            description: "Analyze data to provide business insights.",
            salary: "$100,000"
        },
        {
            id: 3,
            title: "Product Manager",
            company: "Innovate Inc.",
            location: "Austin, TX",
            description: "Lead product development and strategy.",
            salary: "$110,000"
        },
        {
            id: 4,
            title: "UX Designer",
            company: "Creative Studio",
            location: "Seattle, WA",
            description: "Design user interfaces and experiences.",
            salary: "$90,000"
        },
        {
            id: 5,
            title: "DevOps Engineer",
            company: "Cloud Services",
            location: "Boston, MA",
            description: "Manage cloud infrastructure and deployments.",
            salary: "$115,000"
        },
        {
            id: 6,
            title: "Marketing",
            company: "Brand Agency",
            location: "Chicago",
            description: "Develop and execute marketing campaigns.",
            salary: "$80,000"
        },
        {
            id: 7,
            title: "Sales Manager",
            company: "Global Sales",
            location: "Miami, FL",
            description: "Lead sales team and drive revenue growth.",
            salary: "$105,000"
        },
        {
            id: 8,
            title: "HR Specialist",
            company: "People First",
            location: "Denver, CO",
            description: "Manage recruitment and employee relations.",
            salary: "$75,000"
        }
    ])

    const handleDelete = (jobId) => {
        console.log("Deleting job with id:", jobId);
        const updatedJobs = jobs.filter(job => job.id !== jobId);
        setJobs(updatedJobs);
        if (String(id) === String(jobId)) {
            navigate("/tpo-dashboard/view-jobs");
        }
    }

    const selectedJob = jobs.find(job => String(job.id) === String(id))

    return (
        <div className="flex h-full bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <div className={`relative ${sidebarOpen ? ' w-1/3' : 'w-14'} h-full border-r border-gray-300     ${!sidebarOpen ? '' : ""} transition-all duration-300 flex flex-col`}>
                {/* Header with Jobs title and toggle button */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-2 border-b border-t border-gray-300 bg-white">
                    {sidebarOpen && <h1 className="text-xl font-semibold text-gray-800">Jobs</h1>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`${sidebarOpen ? 'p-2 hover:bg-gray-100' : 'p-3 bg-gray-200'} rounded-lg transition-all font-semibold text-gray-600 hover:text-gray-800`}
                        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                    >
                        {sidebarOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Jobs List */}
                <div className="overflow-y-auto flex-1">
                    {sidebarOpen && (
                        <div className="p-4 space-y-3">
                        {jobs.map((job) => (
                            <div key={job.id}>
                                <Link 
                                    to={`/tpo-dashboard/view-jobs/job/${job.id}`} 
                                    state={{ job, edit }}
                                    className={`block p-4 rounded-lg border-l-4 transition-all duration-200 cursor-pointer ${
                                        String(id) === String(job.id) 
                                            ? 'border-l-blue-600 bg-blue-50 border border-blue-200' 
                                            : 'border-l-gray-300 border border-gray-200 hover:border-l-blue-400 hover:bg-gray-50'
                                    }`}
                                >
                                    <h3 className="font-semibold text-gray-800 text-sm">{job.title}</h3>
                                    <p className="text-gray-600 text-xs mt-1">{job.company}</p>
                                    <p className="text-gray-500 text-xs mt-1">{job.location}</p>
                                </Link>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 h-full overflow-y-auto p-8">
                {isViewingAppliedStudents ? (
                    <div className="flex flex-col ">
                        <button
                            onClick={() => navigate(`/tpo-dashboard/view-jobs/job/${id}`)}
                            className="self-start px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold"
                        >
                            ← Back to Job Details
                        </button>
                        <AppliedStudents jobId={id} />
                    </div>
                ) : selectedJob ? (
                    <JobDesc jobData={selectedJob} onDelete={handleDelete} onAppliedStudents={() => navigate(`/tpo-dashboard/view-jobs/job/${selectedJob.id}/applied-students`)}/>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Select a Job</h2>
                            <p className="text-gray-500">Choose a job from the sidebar to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewJobs

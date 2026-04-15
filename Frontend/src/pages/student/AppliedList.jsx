import { useEffect, useState } from 'react'
import api from '../../utils/api.js'
import CompanyListCard from './CompanyListCard'
import { getAuthToken, getEnrollmentNo } from '../../utils/auth.js'
import Loading from '../../components/Loading.jsx'
import toast, { Toaster } from 'react-hot-toast'
import ConfirmationModal from '../../components/ConfirmationModal.jsx'

const AppliedList = () => {
    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const STUDENT_BASE_URL = import.meta.env.VITE_STUDENT_BASE_URL || "http://localhost:8081";

    const loadApplied = async () => {
        setLoading(true);
        setError("");
        try {
            if (!getAuthToken()) {
                const msg = "Login required. Please sign in again.";
                setError(msg);
                toast.error(msg);
                return;
            }
            const enrollmentNo = getEnrollmentNo();
            if (!enrollmentNo) {
                const msg = "Enrollment number not found. Please login again.";
                setError(msg);
                toast.error(msg);
                return;
            }
            const res = await api.get(`${STUDENT_BASE_URL}/api/student/enrollment/${enrollmentNo}/applied-jobs`);
            const data = Array.isArray(res.data) ? res.data : [];
            const mapped = data.map((job) => ({
                id: job.jdId,
                applicationId: job.applicationId,
                companyName: job.companyName,
                role: job.role,
                salary: job.salary,
                location: job.location,
                status: job.status,
            }));
            setJobsData(mapped);
            if (mapped.length > 0) {
                toast.success(`Loaded ${mapped.length} applied job(s)`);
            } else {
                toast.info("No applications yet");
            }
        } catch (err) {
            const msg = "Failed to load applied jobs.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplied();
    }, []);

    const handleWithdrawClick = (company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleWithdrawConfirm = async () => {
        if (!selectedCompany?.applicationId) return;
        try {
            await api.post(`${STUDENT_BASE_URL}/api/applications/${selectedCompany.applicationId}/withdraw`, {});
            setJobsData((prev) => prev.filter((j) => j.applicationId !== selectedCompany.applicationId));
            toast.success(`Withdrawn from ${selectedCompany.companyName}`);
            setIsModalOpen(false);
            setSelectedCompany(null);
        } catch (err) {
            const msg = "Failed to withdraw application.";
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className='w-full px-4 sm:px-6 md:px-8'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl mt-4 md:ml-50 font-semibold mb-4 md:mb-6 text-blue-900 text-center md:text-left'>
                    Applied Jobs
                </h1>
                <div className='flex flex-col items-center gap-4'>
                    {loading && <Loading />}
                    {error && <p className="text-red-600 text-center">{error}</p>}
                    {jobsData.map((company) => (
                        <CompanyListCard
                            key={company.applicationId}
                            company={company}
                            isApplied={true}
                            onWithdrawClick={handleWithdrawClick}
                        />
                    ))}
                </div>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleWithdrawConfirm}
                title="Withdraw Application"
                message={`Are you sure you want to withdraw your application for ${selectedCompany?.role} at ${selectedCompany?.companyName}? This action cannot be undone.`}
                confirmText="Withdraw"
                cancelText="Cancel"
                isDangerous={true}
            />
        </>
    )
}

export default AppliedList

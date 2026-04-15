import { useEffect, useState } from 'react'
import Loading from '../../components/Loading.jsx'
import api from "../../utils/api.js";

const AppliedStudents = ({ jobId, companyName, refreshKey }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); 
    const TPO_BASE_URL = import.meta.env.VITE_TPO_BASE_URL || "http://localhost:8083";
    const STUDENT_BASE_URL = import.meta.env.VITE_STUDENT_BASE_URL || "http://localhost:8081";

    useEffect(() => {
        const load = async () => {
            if (!jobId && !companyName) return;
            setLoading(true);
            setError("");
            try {
                const endpoint = companyName
                    ? `${TPO_BASE_URL}/api/jd/company/${encodeURIComponent(companyName)}/applied-students`
                    : `${TPO_BASE_URL}/api/applications/${jobId}/students`;
                const res = await api.get(endpoint);
                setStudents(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setError("Failed to load applied students.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [jobId, companyName, refreshKey]);

    const downloadResume = async (student) => {
        setError("");
        try {
            const res = await api.get(
                `${STUDENT_BASE_URL}/api/students/${student.id}/resume`,
                { responseType: "blob" }
            );

            const contentDisposition = res.headers?.["content-disposition"] || "";
            const match = contentDisposition.match(/filename="([^"]+)"/i);
            const fallbackName = `${student.name || "student"}-${student.enrollmentNumber || student.id}-resume`;
            const fileName = match?.[1] || fallbackName;

            const blobUrl = window.URL.createObjectURL(res.data);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            const status = err?.response?.status;
            if (status === 404) {
                setError("Resume not found for this student.");
            } else {
                setError("Failed to download resume.");
            }
        }
    };

  return (
    <>
        <div className = " w-full md:w-3/4">
            <h1 className='text-xl md:text-2xl font-semibold text-center mb-4'>Applied Students</h1>
            <div className='flex flex-col gap-4 w-full mt-5 border border-gray-300 p-4 md:p-6 rounded shadow mx-auto'>
                {loading && <Loading />}
                {error && <p className="text-center text-red-600">{error}</p>}
                {students.map(student => (
                    <div key={student.id} className='border border-gray-300 p-3 md:p-4 rounded flex flex-col gap-2'>
                        <div>
                            <h2 className='text-lg md:text-xl font-semibold'>{student.name}</h2>
                            <p className='text-sm text-gray-600'>Email: {student.email}</p>
                            <p className='text-sm text-gray-600'>Enrollment: {student.enrollmentNumber}</p>
                            <p className='text-sm text-gray-600'>Course: {student.course}</p>
                            <p className='text-sm text-gray-700 font-medium'>
                                Status: <span className='font-semibold'>{student.status || "Applied"}</span>
                            </p>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => downloadResume(student)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded"
                            >
                                Download Resume
                            </button>
                        </div>

                        {/* Status update can be added here using /api/applications/{id}/status */}
                    </div>
                ))}
            </div>

        </div>
    </>
  )
}

export default AppliedStudents

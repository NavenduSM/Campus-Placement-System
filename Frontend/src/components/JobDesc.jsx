import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../utils/api.js'
import toast from 'react-hot-toast'
import { getEnrollmentNo } from '../utils/auth.js'

const JobDes = ({company}) => {
    const { state } = useLocation();
    const [loading, setLoading] = useState(false);
    const [applied, setApplied] = useState(false)
    const STUDENT_BASE_URL = import.meta.env.VITE_STUDENT_BASE_URL || "http://localhost:8081";

    // Use company prop first, fall back to state.company for backward compatibility
    const currentCompany = company || state?.company;

    useEffect(() => {
        // Reset applied state when company changes
        setApplied(false);
        
        const fetchAppliedStatus = async () => {
            const enrollmentNo = getEnrollmentNo();
            const jobId = currentCompany?.id;
            if (!enrollmentNo || !jobId) return;

            try {
                const res = await api.get(`${STUDENT_BASE_URL}/api/student/enrollment/${enrollmentNo}/applied-jobs`);
                const appliedJobs = Array.isArray(res.data) ? res.data : [];
                const appliedIds = appliedJobs
                    .map((job) => job.jdId || job.id || job.jobId)
                    .filter((id) => id !== undefined && id !== null);
                if (appliedIds.includes(jobId)) {
                    setApplied(true);
                }
            } catch (err) {
                // ignore errors here; apply button remains available unless server confirms application
            }
        };

        fetchAppliedStatus();
    }, [currentCompany?.id, STUDENT_BASE_URL]);

    const handleApply = async () => {
        const enrollmentNo = getEnrollmentNo();
        const jdId = currentCompany?.id;
        if (!enrollmentNo || !jdId) {
            toast.error("Missing enrollment number or job id.");
            return;
        }
        try {
            setLoading(true);
            const res = await api.post(`${STUDENT_BASE_URL}/api/applications/apply`, {
                enrollmentNo,
                jdId,
            });
            if (res.status === 200) {
                setApplied(true);
                toast.success("Applied successfully!");
            }
            else {
                console.log(res)
            }
        } catch (err) { 
            const message = err?.response?.data || "Failed to apply.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };
    
    if (!currentCompany) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-600">No company selected</p>
            </div>
        );
    }

    return (
        <>
            <div className='flex flex-col gap-8 w-3/4 justify-center items-start mt-5 md:mt-7 mx-auto p-4 md:p-6 border border-gray-300 rounded shadow bg-white '>

                <h1 className='text-4xl font-semibold text-blue-700'>{currentCompany.companyName}</h1>

                <div className='text-lg flex flex-col gap-3 '>
                    <h1 className='font-semibold text-2xl'>Job Description</h1>
                    <hr />
                    <p>{currentCompany.jobDescription}</p>

                    <h2 className=' mt-4 md:mt-8 font-semibold text-2xl'>Skills Required </h2>
                    <hr />
                    <p>{currentCompany.skillsRequired?.join(", ")}</p>


                    <h2 className=' mt-4 md:mt-8 font-semibold text-2xl'>Other Details </h2>
                    <hr />

                    <div className='flex flex-col gap-3'>

                        <h2 className='font-semibold'>Date of Apply : <span className='font-normal'>{currentCompany.dateOfApply}</span></h2>
                        <h2 className='font-semibold'>Role : <span className='font-normal'>{currentCompany.role}</span> </h2>
                        <h2 className='font-semibold'>Salary : <span className='font-normal'>{currentCompany.salary}</span></h2>
                        <h2 className='font-semibold'>Location : <span className='font-normal'>{currentCompany.location}</span></h2>
                        <h2 className='font-semibold'>Bond : <span className='font-normal'>{currentCompany.bond}</span></h2>
                        <h2 className='font-semibold'>Eligible Degree : <span className='font-normal'>{currentCompany.eligibleDegree}</span></h2>
                        <h2 className='font-semibold'>Selection Process : <span className='font-normal'>{currentCompany.selectionProcess}</span></h2>
                        <h2 className='font-semibold'>Special Criterion :<span className='font-normal'>{currentCompany.specialCriterion}</span> </h2>
                    </div>
                </div>
                <div>
                    <button
                        className='bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        onClick={handleApply}
                        disabled={loading || applied}
                    >
                        {applied ? "Applied" : loading ? "Applying..." : "Apply Now"}
                    </button>

                </div>
            </div>


        </>
    )
}



export const JobDesc = ({ jobData, onDelete, onSave, onAppliedStudents }) => {
    const { state } = useLocation();
    const job = jobData || state?.job
    const [edit, setEdit] = useState(state?.edit || false)
    const [jobD, setJob] = useState(job || {})
    const [error, setError] = useState("")
    const ref = useRef(null);
    const descRef = useRef(null);
    const skillsRef = useRef(null);
    
    // Auto-resize textarea based on content
    const autoResize = (element) => {
        if (element) {
            element.style.height = 'auto';
            element.style.height = element.scrollHeight + 'px';
        }
    };
    
    useEffect(() => {
        if (descRef.current) autoResize(descRef.current);
        if (skillsRef.current) autoResize(skillsRef.current);
    }, [jobD?.description, jobD?.skills, edit]);
    
    
    
    useEffect(() => {
        if (ref.current && edit) {
            ref.current.focus();
        }
    }, [edit]);
    
    useEffect(() => {
        setJob(job);
        setEdit(state?.edit || false);
        
    }, [job, state?.edit]);
    
    
    
    
    const editJob = () => {
        setError("")
        setEdit(true);
    }

    const validateJobUpdate = () => {
        const requiredFields = [
            { value: jobD?.company, label: "Company Name" },
            { value: jobD?.description, label: "Job Description" },
            { value: jobD?.role, label: "Role" },
            { value: jobD?.dateOfApply, label: "Date of Apply" },
        ];

        const missingField = requiredFields.find(
            (field) => !field.value || String(field.value).trim() === ""
        );

        if (missingField) {
            setError(`${missingField.label} cannot be empty.`);
            return false;
        }

        setError("");
        return true;
    };

    const saveJob = async () => {
        if (!validateJobUpdate()) {
            return;
        }
        if (onSave) {
            await onSave(jobD);
        }
        setEdit(false);
    }
    const cancelEdit = () => {
        setJob(job); // Revert to original job details
        setError("")
        setEdit(false);
    }
    
    return (
        <>
            <div className="flex flex-col gap-4 w-full md:w-3/4 md:mt-5 mx-auto p-4 md:p-6 border border-gray-300 rounded shadow bg-white">

                {edit && <h1 className='text-xl md:text-2xl font-semibold '>Company Name: </h1>}

                <input className={`text-xl md:text-2xl font-semibold text-blue-700 border ${edit ? 'bg-white focus:border-gray-500 rounded p-2' : 'outline-none focus-none bg-transparent select-none border-none'}`}
                    ref={ref}
                    value={jobD?.company ?? ""} readOnly={edit ? false : true}
                    placeholder="Company Name"
                    onChange={(e) => { setJob({ ...jobD, company: e.target.value }) }} />

                <div className='text-base md:text-lg flex flex-col gap-3'>
                    <h1 className='font-semibold text-xl md:text-xl'>Job Description</h1>
                    {!edit && <hr />}
                    <textarea
                        ref={descRef}
                        className={`w-full p-2 rounded border resize-none overflow-hidden ${edit ? 'bg-white focus:border-gray-500' : 'outline-none focus-none bg-transparent select-none border-none'}`}
                        value={jobD?.description ?? ""}
                        placeholder="Job description"
                        readOnly={edit ? false : true}
                        onChange={(e) => { setJob({ ...jobD, description: e.target.value }) }} />





                    <h2 className='mt-4 font-semibold text-xl md:text-xl'>Skills Required </h2>
                    {!edit && <hr />}
                    <textarea
                        ref={skillsRef}
                        className={`w-full rounded border resize-none overflow-hidden ${edit ? 'bg-white focus:border-gray-500 p-2' : 'outline-none focus-none bg-transparent select-none border-none'}`}
                        value={jobD?.skills?.join(", ") ?? ""}
                        placeholder="JavaScript, React, Node.js"
                        readOnly={edit ? false : true}
                        onChange={(e) => { setJob({ ...jobD, skills: e.target.value.split(",").map(skill => skill.trim()) }) }}
                        />





                    <h1 className='font-semibold text-xl md:text-xl mt-5'>Details</h1>
                    {!edit && <hr />}

                    <div className='gap-3 md:gap-5 flex flex-col'>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Date of Apply : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`}
                                value={jobD?.dateOfApply ?? ""} readOnly={edit ? false : true} placeholder="YYYY-MM-DD" onChange={(e) => { setJob({ ...jobD, dateOfApply: e.target.value }) }} />
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Role : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.role ?? ""} readOnly={edit ? false : true} placeholder="Role" onChange={(e) => { setJob({ ...jobD, role: e.target.value }) }} />
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Salary : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.salary ?? ""} readOnly={edit ? false : true} placeholder="Salary" onChange={(e) => { setJob({ ...jobD, salary: e.target.value }) }} />
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Location : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.location ?? ""} readOnly={edit ? false : true} placeholder="Location" onChange={(e) => { setJob({ ...jobD, location: e.target.value }) }} />
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Bond : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.bond ?? ""} readOnly={edit ? false : true} placeholder="Bond" onChange={(e) => { setJob({ ...jobD, bond: e.target.value }) }} />
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Eligible Degree : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.eligibleDegree ?? ""} readOnly={edit ? false : true} placeholder="Eligible Degree" onChange={(e) => { setJob({ ...jobD, eligibleDegree: e.target.value }) }} />
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Selection Process : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.selectionProcess ?? ""} readOnly={edit ? false : true} placeholder="Selection Process" onChange={(e) => { setJob({ ...jobD, selectionProcess: e.target.value }) }} />
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Special Criterion :</h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.specialCriterion ?? ""} readOnly={edit ? false : true} placeholder="Special Criterion" onChange={(e) => { setJob({ ...jobD, specialCriterion: e.target.value }) }} />
                        </div>
                    </div>


                </div>
                {!edit && <div className='flex flex-wrap justify-center gap-3 md:gap-4 mt-4'>
                    <button
                        onClick={() => { editJob() }}
                        className='bg-indigo-500 text-white px-4 md:px-6 py-2 rounded-md hover:bg-blue-800 cursor-pointer w-full md:w-auto transition-all duration-200'
                        >Edit</button>
                    {onDelete && (
                        <button
                        onClick={() => onDelete(jobD?.id)}
                        className='bg-red-600 text-white px-4 md:px-6 py-2 rounded-md hover:bg-red-700 transition-all duration-200  cursor-pointer w-full md:w-auto '
                        >Delete</button>
                    )}
                    {onAppliedStudents ? (
                        <button
                        onClick={onAppliedStudents}
                            className='bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-md hover:bg-blue-700 cursor-pointer w-full md:w-auto transition-all duration-200'
                        >Applied Students</button>
                    ) : (
                        <Link to={`/tpo-dashboard/job/${jobD?.id}/applied-students`}
                                className='bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-md hover:bg-blue-700 cursor-pointer w-full md:w-auto text-center transition-all duration-200'
                        >Applied Students</Link>
                    )}
                </div>}



                {edit && error && (
                    <div className='text-red-700 bg-red-50 border border-red-200 rounded p-3 text-sm mb-3'>
                        {error}
                    </div>
                )}
                {edit && <div className='flex flex-wrap gap-3 md:gap-4 mt-4 w-full justify-center items-center'>
                    <button onClick={() => { saveJob() }}
                        className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer flex-1 transition-all duration-200'>Save</button>
                    <button onClick={() => cancelEdit()} className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer flex-1 transition-all duration-200'>Cancel</button>
                </div>}
            </div>


        </>
    )
}




export default JobDes

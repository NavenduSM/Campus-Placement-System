import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';

const JobDesc = ({ jobData, onDelete, onAppliedStudents }) => {
    const { state } = useLocation();
    const job = jobData || state?.job
    const [edit, setEdit] = useState(state?.edit || false)
    const [jobD, setJob] = useState(job || {})
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
        setEdit(true);
    }
    const saveJob = () => {
        console.log("Saving job:", jobD);
        setEdit(false);
    }
    const cancelEdit = () => {
        setJob(job); // Revert to original job details
        setEdit(false);
    }

  return (
    <>
            <div className="flex flex-col gap-4 w-full md:w-3/4 md:mt-5 mx-auto p-4 md:p-6 border border-gray-300 rounded shadow bg-white">

                {edit && <h1 className='text-xl md:text-2xl font-semibold '>Company Name: </h1>}

                <input className={`text-xl md:text-2xl font-semibold text-blue-700 border ${edit ? 'bg-white focus:border-gray-500 rounded p-2' : 'outline-none focus-none bg-transparent select-none border-none'}`} 
                ref={ref}
                value={jobD?.company || "Company Name"} readOnly={edit ? false : true} 
                onChange={(e) => {setJob({...jobD, company: e.target.value})}}/>

                <div className='text-base md:text-lg flex flex-col gap-3'>
                    <h1 className='font-semibold text-xl md:text-xl'>Job Description</h1>
                    {!edit && <hr />}
                    <textarea
                        ref={descRef}
                        className={`w-full p-2 rounded border resize-none overflow-hidden ${edit ? 'bg-white focus:border-gray-500' : 'outline-none focus-none bg-transparent select-none border-none'}`}
                    value = {jobD?.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis earum quasi facere repudiandae quod iusto perspiciatis voluptatum voluptatem sunt dolorum vero quidem atque quos rem impedit optio, alias voluptas obcaecati repellat magni explicabo excepturi? Quo voluptatem veritatis quidem laboriosam, atque distinctio iusto, nemo aliquam reprehenderit rem dicta sint saepe non quaerat labore doloribus temporibus excepturi repellat. Odio vitae doloribus, magni explicabo iure voluptatum. Fuga, minima tempore! Placeat dicta nemo aliquam amet facilis facere pariatur nisi, laudantium quisquam maxime ex quasi eum, necessitatibus, itaque voluptatibus expedita recusandae numquam unde. Hic doloribus error id dolor, sint quae quo ad ipsum quas commodi."}
                    readOnly={edit ? false : true}
                    onChange={(e) => {setJob({...jobD, description: e.target.value})}}/>





                    <h2 className='mt-4 font-semibold text-xl md:text-xl'>Skills Required </h2>
                    {!edit && <hr />}
                    <textarea
                        ref={skillsRef}
                        className={`w-full rounded border resize-none overflow-hidden ${edit ? 'bg-white focus:border-gray-500 p-2' : 'outline-none focus-none bg-transparent select-none border-none'}`}
                    value = {jobD?.skills?.join(", ") || "JavaScript, React, Node.js"}
                    readOnly={edit ? false : true}
                    onChange={(e) => {setJob({...jobD, skills: e.target.value.split(",").map(skill => skill.trim())})}}
                    />
                
                    



                    <h1 className='font-semibold text-xl md:text-xl mt-5'>Details</h1>
                    {!edit && <hr />}

                    <div className='gap-3 md:gap-5 flex flex-col'>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Date of Apply : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`}
                             value={jobD?.dateOfApply || "2024-12-31"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, dateOfApply: e.target.value})}}/>
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Role : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.role || "Software Engineer"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, role: e.target.value})}}/>
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Salary : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.salary || "₹5,00,000"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, salary: e.target.value})}}/>
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Location : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.location || "Bangalore"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, location: e.target.value})}}/>
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Bond : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.bond || "adnxcmaendsz"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, bond: e.target.value})}}/>
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Eligible Degree : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.eligibleDegree || "B.Tech"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, eligibleDegree: e.target.value})}}/>
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Selection Process : </h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.selectionProcess || "2024-12-31"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, selectionProcess: e.target.value})}}/>
                        </div>
                        <div className='flex flex-col md:flex-row md:items-center gap-2'>
                            <h2 className='font-semibold text-base md:text-lg whitespace-nowrap'>Special Criterion :</h2>
                            <input className={`text-base md:text-lg font-normal border flex-1 ${edit ? 'bg-white focus:border-gray-500 rounded p-1' : 'outline-none focus-none bg-transparent select-none border-none'}`} value={jobD?.specialCriterion || "2024-12-31"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, specialCriterion: e.target.value})}}/>
                        </div>
                    </div>


                </div>
                { !edit && <div className='flex flex-wrap justify-center gap-3 md:gap-4 mt-4'>
                    <button 
                    onClick={() => {editJob()}}
                    className='bg-blue-700 text-white px-4 md:px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer w-full md:w-auto'
                    >Edit</button>
                    {onDelete && (
                        <button 
                            onClick={() => onDelete(jobD?.id)}
                            className='bg-red-700 text-white px-4 md:px-6 py-2 rounded-md hover:bg-red-600 cursor-pointer w-full md:w-auto'
                        >Delete</button>
                    )}
                    {onAppliedStudents ? (
                        <button 
                            onClick={onAppliedStudents}
                            className='bg-blue-700 text-white px-4 md:px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer w-full md:w-auto'
                        >Applied Students</button>
                    ) : (
                        <Link to={`/tpo-dashboard/job/${jobD?.id}/applied-students`}
                            className='bg-blue-700 text-white px-4 md:px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer w-full md:w-auto text-center'
                        >Applied Students</Link>
                    )}
                </div>}



                {edit && <div className='flex flex-wrap gap-3 md:gap-4 mt-4 w-full'>
                    <button onClick={() => {saveJob()}}
                        className='bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer flex-1'>Save</button>
                    <button onClick={() => cancelEdit() } className='bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer flex-1'>Cancel</button>
                </div>}
            </div>


        </>
  )
}

export default JobDesc

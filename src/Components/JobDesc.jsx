import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';

const JobDesc = ({ jobData, onDelete, onAppliedStudents }) => {
    const { state } = useLocation();
    const job = jobData || state?.job
    const [edit, setEdit] = useState(state?.edit || false)
    const [jobD, setJob] = useState(job || {})
    const ref = useRef(null);



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
            <div className={`flex flex-col gap-4 ${onDelete ? 'w-full' : 'w-3/4 mt-10 mx-auto'} border border-gray-300 p-6 rounded shadow`}>

                {edit && <h1 className='text-2xl font-semibold '>Company Name: </h1>}

                <input className={` text-4xl font-semibold text-blue-700 border  ${edit ? 'bg-white  focus:border-gray-500 rounded p-2' : ' outline-none focus-none bg-transparent select-none border border-none'} `} 
                ref={ref}
                value={jobD?.company || "Company Name"} readOnly={edit ? false : true} 
                onChange={(e) => {setJob({...jobD, company: e.target.value})}}/>

                <div className='text-lg flex flex-col gap-3 '>
                    <h1 className='font-semibold text-2xl'>Job Description</h1>
                    {!edit && <hr />}
                    <input
                        className={`w-full p-2  rounded border ${edit ? 'bg-white  focus:border-gray-500 rounded p-2' : ' outline-none focus-none bg-transparent select-none border border-none'}`}
                    value = {jobD?.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis earum quasi facere repudiandae quod iusto perspiciatis voluptatum voluptatem sunt dolorum vero quidem atque quos rem impedit optio, alias voluptas obcaecati repellat magni explicabo excepturi? Quo voluptatem veritatis quidem laboriosam, atque distinctio iusto, nemo aliquam reprehenderit rem dicta sint saepe non quaerat labore doloribus temporibus excepturi repellat. Odio vitae doloribus, magni explicabo iure voluptatum. Fuga, minima tempore! Placeat dicta nemo aliquam amet facilis facere pariatur nisi, laudantium quisquam maxime ex quasi eum, necessitatibus, itaque voluptatibus expedita recusandae numquam unde. Hic doloribus error id dolor, sint quae quo ad ipsum quas commodi."}
                    readOnly={edit ? false : true}
                    onChange={(e) => {setJob({...jobD, description: e.target.value})}}/>





                    <h2 className=' mt-4 font-semibold text-2xl'>Skills Required </h2>
                    {!edit && <hr />}
                    <input
                        className={`w-full  rounded border ${edit ? 'bg-white  focus:border-gray-500 rounded p-2' : ' outline-none focus-none bg-transparent select-none border border-none'}`}
                    value = {jobD?.skills?.join(", ") || "JavaScript, React, Node.js"}
                    readOnly={edit ? false : true}
                    onChange={(e) => {setJob({...jobD, skills: e.target.value.split(",").map(skill => skill.trim())})}}/>
                
                    



                    <h1 className='font-semibold text-2xl mt-5'>Details</h1>
                    {!edit && <hr />}

                    <div className='gap-5 flex flex-col'>
                        <h2 className='font-semibold'>Date of Apply : <input className='font-normal ' value={jobD?.dateOfApply || "2024-12-31"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, dateOfApply: e.target.value})}}/></h2>
                        <h2 className='font-semibold'>Role : <input className='font-normal ' value={jobD?.role || "Software Engineer"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, role: e.target.value})}}/></h2>
                        <h2 className='font-semibold'>Salary : <input className='font-normal ' value={jobD?.salary || "₹5,00,000"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, salary: e.target.value})}}/></h2>
                        <h2 className='font-semibold'>Location : <input className='font-normal ' value={jobD?.location || "Bangalore"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, location: e.target.value})}}/></h2>
                        <h2 className='font-semibold'>Bond : <input className='font-normal ' value={jobD?.bond || "adnxcmaendsz"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, bond: e.target.value})}}/></h2>
                        <h2 className='font-semibold'>Eligible Degree : <input className='font-normal ' value={jobD?.eligibleDegree || "B.Tech"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, eligibleDegree: e.target.value})}}/></h2>
                        <h2 className='font-semibold'>Selection Process : <input className='font-normal ' value={jobD?.selectionProcess || "2024-12-31"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, selectionProcess: e.target.value})}}/></h2>
                        <h2 className='font-semibold'>Special Criterion :<input className='font-normal ' value={jobD?.specialCriterion || "2024-12-31"} readOnly={edit ? false : true} onChange={(e) => {setJob({...jobD, specialCriterion: e.target.value})}}/></h2>
                    </div>


                </div>
                { !edit && <div className='flex justify-center gap-4'>
                    <button 
                    onClick={() => {editJob()}}
                    className='bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer mt-4'
                    >Edit</button>
                    {onDelete && (
                        <button 
                            onClick={() => onDelete(jobD?.id)}
                            className='bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-600 cursor-pointer mt-4'
                        >Delete</button>
                    )}
                    {onAppliedStudents ? (
                        <button 
                            onClick={onAppliedStudents}
                            className='bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer mt-4'
                        >Applied Students</button>
                    ) : (
                        <Link to={`/tpo-dashboard/job/${jobD?.id}/applied-students`}
                            className='bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer mt-4'
                        >Applied Students</Link>
                    )}
                </div>}



                {edit && <div className='flex gap-4 mt-4 w-full '>
                    <button onClick={() => {saveJob()}}
                        className='bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer  '>Save</button>
                    <button onClick={() => cancelEdit() } className='bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer'>Cancel</button>
                </div>}
            </div>


        </>
  )
}

export default JobDesc

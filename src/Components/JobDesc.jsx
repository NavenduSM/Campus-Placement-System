import React from 'react'
import { useLocation, useParams } from 'react-router-dom';

const JobDesc = () => {
    const { state } = useLocation();
    const job = state?.job;

  return (
    <>
            <div className='flex flex-col gap-4 w-3/4'>

                <h1 className='text-4xl font-semibold text-blue-700'>{job?.company || "Company Name"}</h1>

                <div className='text-lg flex flex-col gap-3 '>
                    <h1 className='font-semibold text-2xl'>Job Description</h1>
                    <hr />
                    <p>{job?.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis earum quasi facere repudiandae quod iusto perspiciatis voluptatum voluptatem sunt dolorum vero quidem atque quos rem impedit optio, alias voluptas obcaecati repellat magni explicabo excepturi? Quo voluptatem veritatis quidem laboriosam, atque distinctio iusto, nemo aliquam reprehenderit rem dicta sint saepe non quaerat labore doloribus temporibus excepturi repellat. Odio vitae doloribus, magni explicabo iure voluptatum. Fuga, minima tempore! Placeat dicta nemo aliquam amet facilis facere pariatur nisi, laudantium quisquam maxime ex quasi eum, necessitatibus, itaque voluptatibus expedita recusandae numquam unde. Hic doloribus error id dolor, sint quae quo ad ipsum quas commodi."}</p>

                    <h2 className=' mt-4 font-semibold text-2xl'>Skills Required </h2>
                    <hr />

                    <h2 className='font-semibold'>Date of Apply : <span className='font-normal '>2024-12-31</span></h2>
                    <h2 className='font-semibold'>Role : <span className='font-normal '>2024-12-31</span> </h2>
                    <h2 className='font-semibold'>Salary : <span className='font-normal '>2024-12-31</span></h2>
                    <h2 className='font-semibold'>Location : <span className='font-normal '>2024-12-31</span></h2>
                    <h2 className='font-semibold'>Bond : <span className='font-normal '>adnxcmaendsz</span></h2>
                    <h2 className='font-semibold'>Eligible Degree : <span className='font-normal '>2024-12-31</span></h2>
                    <h2 className='font-semibold'>Selection Process : <span className='font-normal '>2024-12-31</span></h2>
                    <h2 className='font-semibold'>Special Criterion :<span className='font-normal '>2024-12-31</span> </h2>
                </div>
                <div>
                    <button className='bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer mt-4'>Apply Now</button>

                </div>
            </div>


        </>
  )
}

export default JobDesc

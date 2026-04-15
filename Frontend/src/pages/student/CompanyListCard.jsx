
import React from 'react'
import { Link } from 'react-router-dom'

const CompanyListCard = ({ company, isApplied, onWithdrawClick }) => {

    return (
        <>
            <div className='w-full sm:w-96 md:w-full lg:max-w-3xl border border-blue-700 m-2 sm:m-4 rounded-sm shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300'>
                <div className='flex flex-col md:flex-row md:items-center gap-5 p-4 md:p-6'>
                    {/* Company Name */}
                    <div className='flex-1 min-w-0'>
                        <h2 className='font-semibold text-lg md:text-xl text-gray-800 truncate'>{company.companyName}</h2>
                    </div>

                    {/* Role */}
                    <div className='flex flex-col items-start md:items-center md:flex-col gap-1'>
                        <p className='text-sm text-gray-600'>Role</p>
                        <p className='font-semibold text-base md:text-lg'>{company.role}</p>
                    </div>

                    {/* CTC / Status */}
                    {!isApplied ? (
                        <div className='flex flex-col items-start md:items-center md:flex-col gap-1'>
                            <p className='text-sm text-gray-600'>CTC</p>
                            <p className='font-semibold text-base md:text-lg'>{company.salary}</p>
                        </div>
                    ) : (
                        <div className='flex flex-col items-start md:items-center md:flex-col gap-1'>
                            <p className='text-sm text-gray-600'>Status</p>
                            <p className='font-semibold text-base md:text-lg'>{company.status || "Applied"}</p>
                        </div>
                    )}

                    {/* Location */}
                    {!isApplied && (
                        <div className='flex flex-col items-start md:items-center md:flex-col gap-1 hidden sm:flex'>
                            <p className='text-sm text-gray-600'>Location</p>
                            <p className='font-semibold text-base'>{company.location}</p>
                        </div>
                    )}

                    {/* Button */}
                    <div className='w-full md:w-auto'>
                        {!isApplied ? (
                            <Link 
                                to={`/student/company-list/job-description/${company.id}`} 
                                state={{ company }} 
                                className='block w-full md:w-auto bg-blue-600 text-white px-4 md:px-6 py-2 rounded-sm hover:bg-sky-600 cursor-pointer text-center font-medium transition-colors'
                            >
                                Apply
                            </Link>
                        ) : (
                            <button
                                    className={`w-full md:w-auto  text-white px-4 md:px-6 py-2 rounded-sm   font-medium transition-colors ${company.status === "Withdrawn" ? "opacity-50 cursor-not-allowed bg-gray-700" : "cursor-pointer bg-rose-500 hover:bg-rose-600"}`}
                                onClick={() => onWithdrawClick && onWithdrawClick(company)}
                                disabled={company.status === "Withdrawn"}
                            >
                                {company.status === "Withdrawn" ? "Withdrawn" : "Withdraw"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}


export default CompanyListCard

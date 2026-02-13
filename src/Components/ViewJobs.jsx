import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const card = () => {
    return (
        <>
        </>
    )
}

const ViewJobs = () => {

    const [edit, setEdit] = useState(false)
    const navigate = useNavigate()

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
        }
    ])


    

    const handleDelete = (id) => {
        console.log("Deleting job with id:", id);

        const updatedJobs = jobs.filter(job => job.id !== id);
        setJobs(updatedJobs);
    }
    return (
        <>
            <div>
                <h1 className="text-2xl font-semibold ml-[20%] mt-10 ">Jobs List</h1>

            </div>
            <div className="w-[60%] flex flex-col   mx-auto ">
                {jobs.map((job) => (
                    <div key={job.id} className="border border-blue-800 p-4 px-6 my-4 rounded shadow flex cursor-pointer hover:shadow-md hover:scale-102 transition-all duration-200 relative" >
                        <Link to={`job/${job.id}`} className="w-full " state={{ job, edit }}>
                            <div title="Click to view">
                                <div  className="flex flex-col">
                                    <h2 className="text-2xl font-semibold">{job.title}</h2>
                                    <h3 className="text-xl text-gray-600">{job.company} - {job.location}</h3>
                                    <p className="mt-2">{job.description}</p>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold mt-4">Salary: {job.salary}</h2>
                                </div>
                            </div>

                            <div className="absolute right-35 top-1/2 -translate-y-1/2 flex items-center  " title="Click to edit">
                                <button
                                    className="mt-4 px-6 py-2 bg-sky-600 text-white rounded cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setEdit(true);
                                        navigate(`job/${job.id}`, { state: { job, edit: true } });
                                    }}
                                >Edit</button>
                            </div>
                        </Link>
                        <div className="mx-auto flex items-center absolute right-10 top-1/2 -translate-y-1/2 item-center " title="Click to Delete Job">
                            <button 
                            
                            onClick={() => handleDelete(job.id)}
                            className="mt-4 ml-4 px-4 py-2 bg-red-600 text-white rounded cursor-pointer" >Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ViewJobs

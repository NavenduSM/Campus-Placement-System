import { Link } from "react-router-dom";

const card = () => {
    return (
        <>
        </>
    )
}

const ViewJobs = () => {

    const jobs = [
        {
            id: 1,
            title: "Software Engineer",
            company: "Tech Corp",
            location: "New York, NY",
            description: "Develop and maintain web applications.",
            salary: "$120,000",
        },
        {
            id: 2,
            title: "Data Analyst",
            company: "Data Solutions",
            location: "San Francisco, CA",
            description: "Analyze data to provide business insights.",
            salary: "$100,000"
        }
    ];
    return (
        <>
            <div>
                <h1 className="text-2xl font-semibold ml-[20%] ">Jobs List</h1>

            </div>
            <div className="w-[60%] flex flex-col   mx-auto mt-10">
                {jobs.map((job) => (
                    <div key={job.id} className="border border-blue-800 p-4 px-6 my-4 rounded shadow flex cursor-pointer hover:shadow-md hover:scale-102 transition-all duration-200 relative">
                        <Link to={`job/${job.id}`} className="w-full" state={{job}}>
                            <div  className="flex flex-col">
                                <h2 className="text-2xl font-semibold">{job.title}</h2>
                                <h3 className="text-xl text-gray-600">{job.company} - {job.location}</h3>
                                <p className="mt-2">{job.description}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold mt-4">Salary: {job.salary}</h2>
                            </div>
                            <div className="mx-auto flex items-center absolute right-10 top-1/2 -translate-y-1/2 item-center">
                                <button className="mt-4 px-4 py-2 bg-sky-600 text-white rounded">Apply Now</button>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ViewJobs

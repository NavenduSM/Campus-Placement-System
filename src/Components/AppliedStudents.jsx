import React from 'react'

const AppliedStudents = () => {

    const [students, setStudents] = React.useState([
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        company: "Tech Corp",
        position: "Software Engineer",
        status: "Applied"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        company: "Data Solutions",
        position: "Data Analyst",
        status: "Interviewed"
    },
    {
        id: 3,
        name: "Michael Johnson",
        email: "michael.johnson@example.com",
        company: "Innovate Labs",
        position: "Frontend Developer",
        status: "Hired"
    },
    {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        company: "CloudNet",
        position: "Backend Developer",
        status: "Applied"
    },
    {
        id: 5,
        name: "Daniel Brown",
        email: "daniel.brown@example.com",
        company: "AI Systems",
        position: "Machine Learning Engineer",
        status: "Interviewed"
    },
    {
        id: 6,
        name: "Sophia Wilson",
        email: "sophia.wilson@example.com",
        company: "Cyber Secure",
        position: "Cybersecurity Analyst",
        status: "Rejected"
    },
    {
        id: 7,
        name: "James Anderson",
        email: "james.anderson@example.com",
        company: "FinTech Hub",
        position: "Full Stack Developer",
        status: "Hired"
    },
    {
        id: 8,
        name: "Olivia Martinez",
        email: "olivia.martinez@example.com",
        company: "HealthTech Inc",
        position: "UI/UX Designer",
        status: "Applied"
    },
    {
        id: 9,
        name: "William Taylor",
        email: "william.taylor@example.com",
        company: "Smart Devices",
        position: "Embedded Systems Engineer",
        status: "Interviewed"
    },
    {
        id: 10,
        name: "Ava Thomas",
        email: "ava.thomas@example.com",
        company: "E-Commerce Pro",
        position: "Product Manager",
        status: "Hired"
    }
])


    const handleReject = (id) => {
        console.log("Rejecting student with id:", id);
        // Implement rejection logic here (e.g., update status, notify student, etc.)
        const updatedStudents = students.map(student => {
            if (student.id === id) {
                return { ...student, status: "Rejected" };
            }
            return student;
        });
        setStudents(updatedStudents);
    }

  return (
    <>
        <div>
            <h1 className='text-2xl font-semibold text-center mt-10'>Applied Students</h1>
            <div className='flex flex-col gap-4 w-[50%] mt-10 border border-gray-300 p-6 rounded shadow mx-auto'>
                {students.map(student => (
                    <div key={student.id} className='border border-gray-300 p-4 rounded flex justify-between items-center'>
                        <div className='p-2'>
                            <h2 className='text-xl font-semibold'>{student.name}</h2>
                            <p>Email: {student.email}</p>
                            <p>Company: {student.company}</p>
                            <p>Position: {student.position}</p>
                            <p>Status: {student.status}</p>
                        </div>

                        <div className=' flex mr-[5%] '>
                            {/* <button className='bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer mt-2 mr-2'>Accept</button> */}
                            <button className={`bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600  mt-2 ${student.status === "Rejected" ? "opacity-50 cursor-not-allowed " : "cursor-pointer"}`} onClick={() => handleReject(student.id)}>{student.status === "Rejected" ? "Rejected" : "Reject"}</button>
                        </div>
                    </div>
                ))}
            </div>



        </div>
    </>
  )
}

export default AppliedStudents

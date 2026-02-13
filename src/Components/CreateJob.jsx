import { useEffect, useState } from "react"
import { useContext } from "react";
import { Form, useNavigate } from "react-router-dom";

const CreateJob = () => {

    const navigate = useNavigate();
    const [jobForm, setJobForm] = useState({name: '', description: '', eligibility: '', lastDate: '', role: '', salary: '', criteria: [], location: '', bond: '', process: '', skills: ''})
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Job Created:", jobForm);
        setJobForm({name: '', description: '', eligibility: '', lastDate: '', role: '', salary: '', criteria: [], location: '', bond: '', process: '', skills: ''});
        navigate('/tpo/dashboard/view-jobs');
    }

    return (
        <div className="flex flex-col  mt-10 mb-10">
            <h1 className="text-xl font-medium ml-70">Create Job: </h1>
            <div className="w-[60%] mx-auto border border-gray-300 rounded-md p-6 mt-4 ">
                <form 
                className="grid grid-cols-2 gap-6 p-2 justify-center items-center ">

                    <div className="flex flex-col">
                        <label className="font-semibold">Job Title:</label>
                        <input 
                        type="text" 
                        value={jobForm.name}
                        onChange={(e) => setJobForm({...jobForm, name: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-3/4 ml-2"/>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="font-semibold">Job Description:</label>
                        <textarea 
                        value={jobForm.description}
                        onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-3/4 h-10 ml-2"/>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold">Eligibility Criteria:</label>
                        <input 
                        type="text"
                        value={jobForm.eligibility}
                        onChange={(e) => setJobForm({...jobForm, eligibility: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-3/4 ml-2"/>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold">Last Date to Apply:</label>
                        <input 
                        type="date"
                        value={jobForm.lastDate}
                        onChange={(e) => setJobForm({...jobForm, lastDate: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-3/4 ml-2"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Role:</label>
                        <input 
                        type="text"
                        value={jobForm.role}
                        onChange={(e) => setJobForm({...jobForm, role: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-3/4 ml-2"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Salary:</label>
                        <input 
                        type="text"
                        value={jobForm.salary}
                        onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-3/4 ml-2"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Location:</label>
                        <input 
                        type="text"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-3/4 ml-2"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Bond:</label>
                        <input 
                        type="text"
                        value={jobForm.bond}
                        onChange={(e) => setJobForm({...jobForm, bond: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-3/4 ml-2"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold">Selection Process:</label>
                        <input 
                        type="text"
                        value={jobForm.process}
                        onChange={(e) => setJobForm({...jobForm, process: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-3/4 ml-2"/>
                    </div>

                    
                    
                    <div className="flex flex-col">
                        <label className="font-semibold">Skills Required:</label>
                        <input 
                        type="text"
                        value={jobForm.skills}
                        onChange={(e) => setJobForm({...jobForm, skills: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-3/4 ml-2"/>
                    </div>
                    
                    
                    <div className="flex flex-col">
                        <label className="font-semibold">Special Criteria:</label>
                        {/* <checkboxes 
                        value={jobForm.skills}
                        onChange={(e) => setJobForm({...jobForm, skills: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-3/4 ml-2"/> */}
                        <div className="grid grid-cols-2  ">
                            <label htmlFor="skill1" className="ml-2 cursor-pointer">Maths</label>
                            <input type = "checkbox" id="skill1" name="skill1" value="Maths" onClick={(e) => setJobForm({...jobForm, criteria: [...jobForm.criteria, e.target.value]})} className="ml-2 cursor-pointer w-4 h-4"/> 
                            <label htmlFor="skill2" className="ml-2 cursor-pointer">Computer Science</label>
                            <input type = "checkbox" id = "skill2" name = "skill2" value = "Computer Science" onClick={(e) => setJobForm({...jobForm, criteria: [...jobForm.criteria, e.target.value]})} className="ml-2 cursor-pointer w-4 h-4"/>
                            <label htmlFor="skill3" className="ml-2 cursor-pointer">IP</label>
                            <input type = "checkbox" id = "skill3" name = "skill3" value = "IP" onClick={(e) => setJobForm({...jobForm, criteria: [...jobForm.criteria, e.target.value]})} className="ml-2 cursor-pointer w-4 h-4 "/>
                            
                        </div>
                        <label htmlFor="skill4" className="ml-2 font-medium mt-2">More than 60% in 12th?</label>
                        <div className="grid grid-cols-2">
                            <label htmlFor="skill4" className="ml-2 cursor-pointer">Yes</label>
                            <input type = "checkbox" id = "skill4" name = "skill4" value = "Yes" onClick={(e) => setJobForm({...jobForm, criteria: [...jobForm.criteria, e.target.value]})} className="ml-2 cursor-pointer w-4 h-4"/>
                            <label htmlFor="skill5" className="ml-2 cursor-pointer">No</label>
                            <input type = "checkbox" id = "skill5" name = "skill5" value = "No" onClick={(e) => setJobForm({...jobForm, criteria: [...jobForm.criteria, e.target.value]})} className="ml-2 cursor-pointer w-4 h-4"/>
                        </div>


                        
                    </div> 

                    <br/>
                    <button 
                    onClick={handleSubmit}
                    className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer mt-4 w-1/4 ml-[80%] ">Create Job</button>
                </form>
            </div>
        </div>
    )
}

export default CreateJob
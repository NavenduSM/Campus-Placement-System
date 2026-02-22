import { useEffect, useState } from "react"
import { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Form, useNavigate } from "react-router-dom";

const CreateJob = () => {

    const navigate = useNavigate();
    const [jobForm, setJobForm] = useState({name: '', description: '', eligibility: '', lastDate: '', role: '', salary: '', criteria: [], location: '', bond: '', process: '', skills: ''})
    
    const isFormValid = () => {
        return jobForm.name.trim() !== '' &&
               jobForm.description.trim() !== '' &&
               jobForm.eligibility.trim() !== '' &&
               jobForm.lastDate !== '' &&
               jobForm.role.trim() !== '' &&
               jobForm.salary.trim() !== '' &&
               jobForm.location.trim() !== '' &&
               jobForm.bond.trim() !== '' &&
               jobForm.process.trim() !== '' &&
               jobForm.skills.trim() !== '' &&
               jobForm.criteria.length > 0;
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!isFormValid()) {
            toast.error("Please fill in all fields before submitting.");
            return;
        }
        
        console.log("Job Created:", jobForm);
        toast.success("Job created")
        setJobForm({name: '', description: '', eligibility: '', lastDate: '', role: '', salary: '', criteria: [], location: '', bond: '', process: '', skills: ''});
        navigate('/tpo-dashboard/view-jobs');
    }

    return (
        <div className="flex flex-col mt-10 mb-10 px-4">
            <h1 className="text-xl md:text-2xl font-medium text-center md:text-left ml-[5%] md:ml-[20%]">Create Job: </h1>
            <div className="w-full md:w-[80%] lg:w-[60%] mx-auto border border-gray-300 rounded-md p-4 md:p-6 mt-4 ">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 justify-center items-center ">

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Job Title:</label>
                        <input 
                        type="text" 
                        value={jobForm.name}
                        onChange={(e) => setJobForm({...jobForm, name: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Job Description:</label>
                        <textarea 
                        value={jobForm.description}
                        onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-full h-10 md:h-auto"/>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Eligibility Criteria:</label>
                        <input 
                        type="text"
                        value={jobForm.eligibility}
                        onChange={(e) => setJobForm({...jobForm, eligibility: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Last Date to Apply:</label>
                        <input 
                        type="date"
                        value={jobForm.lastDate}
                        onChange={(e) => setJobForm({...jobForm, lastDate: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Role:</label>
                        <input 
                        type="text"
                        value={jobForm.role}
                        onChange={(e) => setJobForm({...jobForm, role: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Salary:</label>
                        <input 
                        type="text"
                        value={jobForm.salary}
                        onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Location:</label>
                        <input 
                        type="text"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Bond:</label>
                        <input 
                        type="text"
                        value={jobForm.bond}
                        onChange={(e) => setJobForm({...jobForm, bond: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Selection Process:</label>
                        <input 
                        type="text"
                        value={jobForm.process}
                        onChange={(e) => setJobForm({...jobForm, process: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>

                    
                    
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Skills Required:</label>
                        <input 
                        type="text"
                        value={jobForm.skills}
                        onChange={(e) => setJobForm({...jobForm, skills: e.target.value})}
                        className="border border-gray-300 rounded-md p-2 w-full"/>
                    </div>
                    
                    
                    <div className="flex flex-col md:col-span-2">
                        <label className="font-semibold mb-1">Special Criteria:</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <label htmlFor="skill1" className="cursor-pointer flex items-center gap-2">
                                <input type="checkbox" id="skill1" name="skill1" value="Maths" onClick={(e) => setJobForm({...jobForm, criteria: [...jobForm.criteria, e.target.value]})} className="cursor-pointer w-4 h-4"/> 
                                Maths
                            </label>
                            <label htmlFor="skill2" className="cursor-pointer flex items-center gap-2">
                                <input type="checkbox" id="skill2" name="skill2" value="Computer Science" onClick={(e) => setJobForm({...jobForm, criteria: [...jobForm.criteria, e.target.value]})} className="cursor-pointer w-4 h-4"/>
                                Computer Science
                            </label>
                            <label htmlFor="skill3" className="cursor-pointer flex items-center gap-2">
                                <input type="checkbox" id="skill3" name="skill3" value="IP" onClick={(e) => setJobForm({...jobForm, criteria: [...jobForm.criteria, e.target.value]})} className="cursor-pointer w-4 h-4"/>
                                IP
                            </label>
                        </div>
                        <label htmlFor="skill4" className="font-medium mt-2">More than 60% in 12th?</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <label htmlFor="skill4" className="cursor-pointer flex items-center gap-2">
                                <input type="checkbox" id="skill4" name="skill4" value="Yes" onClick={(e) => setJobForm({...jobForm, criteria: [...jobForm.criteria, e.target.value]})} className="cursor-pointer w-4 h-4"/>
                                Yes
                            </label>
                            <label htmlFor="skill5" className="cursor-pointer flex items-center gap-2">
                                <input type="checkbox" id="skill5" name="skill5" value="No" onClick={(e) => setJobForm({...jobForm, criteria: [...jobForm.criteria, e.target.value]})} className="cursor-pointer w-4 h-4"/>
                                No
                            </label>
                        </div>
                    </div> 

                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button 
                        onClick={handleSubmit}
                        disabled={!isFormValid()}
                        className={`px-4 py-2 rounded-md w-full md:w-auto ${isFormValid() ? 'bg-blue-700 text-white hover:bg-blue-600 cursor-pointer' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}>Create Job</button>
                    </div>
                </form>
            </div>
            <Toaster/>
        </div>
    )
}

export default CreateJob

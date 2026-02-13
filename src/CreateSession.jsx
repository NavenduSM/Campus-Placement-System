import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import SessionContext from "./Context";



const SesCard = ({session}) => {

    const isPastSession = session.startDate < new Date().toISOString().split('T')[0] || (session.startDate === new Date().toISOString().split('T')[0] && session.time < new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    return (
        <>
        <div>
                <div className="border w-100  gap-5 h-50 m-4 rounded-sm shadow-md flex flex-col wrap hover:shadow-lg border-blue-700 items-center hover:scale-105 transition-all duration-300 relative">
                    <div className='font-semibold  text-2xl w-40 flex items-center flex-wrap justify-center'>
                    <h2>{session.name}</h2>
                    </div>
                    <div className='font-medium text-lg w-60 flex items-center flex-wrap justify-center'>
                    <h1 className='text-md'>Scheduled On:</h1><span className='ml-2'>{session.startDate}</span>
                    <h1>Starts At: </h1><span className='ml-2'>{session.time}</span>
                    <button 
                    className={`bg-sky-600 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded mt-5 ${isPastSession ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled = {isPastSession}
                    >Join Session</button>

                    </div>



                </div>
            </div>
        </>
    )
}



const CreateSession = () => {

    const [sesForm, setSesForm] = useState({name: '', startDate: '', time: '', url: ''})

    const { sessionDetails, setSessionDetails } = useContext(SessionContext);
    const [sessions, setSessions] = useState([])
    

    useEffect(() => {
        setSessions(sessionDetails || []);
    }, [sessionDetails])

    const navigate = useNavigate();
    const submit = () => {
        setSessionDetails(prev => [...prev, sesForm]);
        setSesForm({name: '', startDate: '', time: '', url: ''});
        setCreateSes(false); 
    }

    const [createSes, setCreateSes] = useState(false)

    
    return (
        <>
        <div className="flex flex-col">

            {!createSes && <div className="flex">
                <button 
                onClick={() => {setCreateSes(true)}}
                className='bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer mt-4 mx-auto mr-10'>Create New Session</button>
            </div>
            }

            {sessions.length > 0 && !createSes?(
                <div className="flex flex-wrap gap-4 mt-4">
                {sessions.map((session, index) => (
                    <SesCard key={index} session={session} />
                ))}
                </div>
            ) : (
                <>{!createSes &&
                    <div className=" text-xl font-semibold justify-center items-center flex">
                        <p>No Session Created Yet</p>
                    </div>
}
                </>
            )}
                

                {createSes && (
                    <div className="flex flex-col justify-center items-center">
                        <h1 className='text-2xl font-semibold'>Create Session</h1>
                        <div className='mt-4 p-4 border border-gray-300 rounded-md w-1/2'>
                            <label className='block font-semibold mb-2'>Session Name:</label>
                            <input type="text" 
                                value={sesForm.name}
                                onChange={(e) => { setSesForm({...sesForm, name: e.target.value})}}
                                className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter session name' />
                        </div>
                        <div className='mt-4 p-4 border border-gray-300 rounded-md w-1/2'>
                            <label className='block font-semibold mb-2'>Start Date:</label>
                            <input type="date" 
                                value={sesForm.startDate}
                                onChange={(e) => {setSesForm({...sesForm, startDate: e.target.value})}}
                                className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                        </div>
                        <div className='mt-4 p-4 border border-gray-300 rounded-md w-1/2'>
                            <label className='block font-semibold mb-2'>Start Time:</label>
                            <input type="time" 
                                value={sesForm.time}
                                onChange={(e) => {setSesForm({...sesForm, time: e.target.value})}}
                                className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                        </div>
                        <div className=" mt-4 p-4 border border-gray-300 rounded-md w-1/2">
                            <label className=" block font-semibold mb-2">Session URL: </label>
                            <input type="text" value={sesForm.url} onChange={(e) => setSesForm({...sesForm, url: e.target.value})} className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter session URL' />
                        </div>
                        <div className='mt-6'>
                            <button onClick={submit} className='bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer'>Create Session</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default CreateSession
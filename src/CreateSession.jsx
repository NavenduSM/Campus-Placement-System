import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import SessionContext from "./Context";



const SesCard = ({session, onRemove}) => {

    const handleRemove = () => {
        onRemove(session);
    }

    const isPastSession = session.startDate < new Date().toISOString().split('T')[0] || (session.startDate === new Date().toISOString().split('T')[0] && session.time < new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));

    // Convert 24-hour time to 12-hour format with AM/PM
    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    return (
        <>
        <div>
            <div className="border w-full gap-3 md:gap-5 h-auto m-2 md:m-4 rounded-sm shadow-md flex flex-col wrap hover:shadow-lg border-blue-700 items-center hover:scale-102 transition-all duration-300 relative p-4">
                <div className='font-semibold text-lg md:text-2xl w-full flex items-center flex-wrap justify-center text-center'>
                    <h2>{session.name}</h2>
                </div>
                <div className='font-medium text-sm md:text-lg w-full flex flex-col items-center flex-wrap justify-center gap-2'>
                    <h1 className='text-sm md:text-md'>Scheduled On:</h1><span className='ml-1'>{session.startDate}</span>
                    <h1 className='text-sm md:text-md'>Starts At: </h1><span className='ml-1'>{formatTime(session.time)}</span>
                    <button 
                    className={`bg-sky-600 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded mt-3 md:mt-5 w-full ${isPastSession ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled = {isPastSession}
                    >Join Session</button>
                    <button
                    className={`bg-red-600 hover:bg-red-900 text-white font-semibold py-2 px-4 rounded w-full `}
                    onClick={handleRemove}
                    >Remove</button>

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
    
    const removeSession = (sessionToRemove) => {
        const updatedSessions = sessions.filter(s => 
            s.name !== sessionToRemove.name || 
            s.startDate !== sessionToRemove.startDate || 
            s.time !== sessionToRemove.time
        );
        setSessions(updatedSessions);
        setSessionDetails(updatedSessions);
    }
    

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
        <div className="flex flex-col px-4 mt-5">

            {!createSes && <div className="flex justify-end">
                <button 
                onClick={() => {setCreateSes(true)}}
                className='bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer mt-4'>Create New Session</button>
            </div>
            }

            {sessions.length > 0 && !createSes?(
                <div className="flex flex-wrap gap-2 md:gap-4 mt-4 justify-center">
                {sessions.map((session, index) => (
                    <SesCard key={index} session={session} onRemove={removeSession} />
                ))}
                </div>
            ) : (
                <>{!createSes &&
                    <div className=" text-base md:text-xl font-semibold justify-center items-center flex mt-8">
                        <p>No Session Created Yet</p>
                    </div>
}
                </>
            )}
                

                {createSes && (
                    <div className="flex flex-col justify-center items-center max-w-md mx-auto w-full">
                        <h1 className='text-xl md:text-2xl font-semibold mt-4'>Create Session</h1>
                        <div className='mt-4 p-4 border border-gray-300 rounded-md w-full'>
                            <label className='block font-semibold mb-2'>Session Name:</label>
                            <input type="text" 
                                value={sesForm.name}
                                onChange={(e) => { setSesForm({...sesForm, name: e.target.value})}}
                                className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter session name' />
                        </div>
                        <div className='mt-4 p-4 border border-gray-300 rounded-md w-full'>
                            <label className='block font-semibold mb-2'>Start Date:</label>
                            <input type="date" 
                                value={sesForm.startDate}
                                onChange={(e) => {setSesForm({...sesForm, startDate: e.target.value})}}
                                className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                        </div>
                        <div className='mt-4 p-4 border border-gray-300 rounded-md w-full'>
                            <label className='block font-semibold mb-2'>Start Time:</label>
                            <input type="time" 
                                value={sesForm.time}
                                onChange={(e) => {setSesForm({...sesForm, time: e.target.value})}}
                                className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                        </div>
                        <div className=" mt-4 p-4 border border-gray-300 rounded-md w-full">
                            <label className=" block font-semibold mb-2">Session URL: </label>
                            <input type="text" value={sesForm.url} onChange={(e) => setSesForm({...sesForm, url: e.target.value})} className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter session URL' />
                        </div>
                        <div className='mt-6 mb-8'>
                            <button onClick={submit} className='bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer w-full'>Create Session</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default CreateSession

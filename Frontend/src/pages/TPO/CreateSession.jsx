import { useEffect, useState } from "react";
import { useContext } from "react";
import SessionContext from "../../context/Context";
import api from "../../utils/api.js";
import Loading from "../../components/Loading.jsx";
import ConfirmationModal from "../../components/ConfirmationModal.jsx";



const SesCard = ({session, onRemoveClick}) => {

    const handleRemoveClick = () => {
        onRemoveClick(session);
    }

    const sessionDateTime = session.startDate && session.time ? new Date(`${session.startDate}T${session.time}`) : null;
    const tenMinutesAfterStart = sessionDateTime ? new Date(sessionDateTime.getTime() + 10 * 60 * 1000) : null;
    const isPastSession = tenMinutesAfterStart ? tenMinutesAfterStart < new Date() : false;

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    return (
        <div className="w-full sm:w-[320px] md:w-90 bg-white border border-blue-200 rounded-xl shadow-sm hover:shadow-xl  transition-all duration-300 p-5 m-3 flex flex-col justify-between">
            <div>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-4 text-center sm:text-left">{session.name}</h2>
                <div className="space-y-3 text-sm md:text-base text-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-medium">Scheduled On:</span>
                        <span>{session.startDate}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-medium">Starts At:</span>
                        <span>{formatTime(session.time)}</span>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
                <a
                    href={session.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex justify-center items-center rounded-xl text-white font-semibold px-4 py-3 transition-colors duration-300 ${isPastSession ? 'bg-slate-600 opacity-50 cursor-not-allowed pointer-events-none' : 'bg-sky-600 hover:bg-blue-700 cursor-pointer'}`}
                >
                    Join Session
                </a>
                <button
                    onClick={handleRemoveClick}
                    className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 transition-colors duration-300 cursor-pointer"
                >
                    Remove
                </button>
            </div>
        </div>
    )
}



const CreateSession = () => {

    const [sesForm, setSesForm] = useState({name: '', startDate: '', time: '', url: ''})
    const [createSes, setCreateSes] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const [deletingSession, setDeletingSession] = useState(false);

    const { sessionDetails, setSessionDetails } = useContext(SessionContext);
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const TPO_BASE_URL = import.meta.env.VITE_TPO_BASE_URL || "http://localhost:8083";
    
    const handleRemoveClick = (session) => {
        setSessionToDelete(session);
        setDeleteModalOpen(true);
    }

    const removeSession = async (sessionToRemove) => {
        if (!sessionToRemove?.id) {
            return;
        }
        try {
            setDeletingSession(true);
            await api.delete(`${TPO_BASE_URL}/api/sessions/${sessionToRemove.id}`);
            const updatedSessions = sessions.filter(s => s.id !== sessionToRemove.id);
            setSessions(updatedSessions);
            setSessionDetails(updatedSessions);
            setDeleteModalOpen(false);
            setSessionToDelete(null);
        } catch (err) {
            console.error("Failed to delete session", err);
        } finally {
            setDeletingSession(false);
        }
    }
    

    const getSessionDateTime = (startDate, time) => {
        if (!startDate) return null;
        const [year, month, day] = startDate.split('-').map(Number);
        const [hour = 0, minute = 0] = time ? time.split(':').map(Number) : [];
        return new Date(year, month - 1, day, hour, minute);
    };

    const isSessionActive = (startDate, time) => {
        const sessionDateTime = getSessionDateTime(startDate, time);
        if (!sessionDateTime) return false;
        const tenMinutesAfterStart = new Date(sessionDateTime.getTime() + 10 * 60 * 1000);
        return tenMinutesAfterStart > new Date();
    };

    const sortSessions = (items) => {
        return items.slice().sort((a, b) => {
            const dateA = getSessionDateTime(a.startDate, a.time);
            const dateB = getSessionDateTime(b.startDate, b.time);
            return dateA - dateB;
        });
    };

    useEffect(() => {
        const loadSessions = async () => {
            try {
                const res = await api.get(`${TPO_BASE_URL}/api/sessions`);
                const data = Array.isArray(res.data) ? res.data : [];
                const mapped = data.map((s) => ({
                    id: s.id,
                    name: s.companyName || "",
                    startDate: s.scheduledOn || "",
                    time: s.startsAt || "",
                    url: s.joinUrl || "",
                }));
                const upcoming = sortSessions(mapped.filter((session) => isSessionActive(session.startDate, session.time)));
                setSessions(upcoming);
                setSessionDetails(upcoming);
            } catch (err) {
                console.error("Failed to load sessions", err);
            }
        };

        loadSessions();
    }, []);

    const validateSessionDateTime = () => {
        if (!sesForm.startDate || !sesForm.time) return true; // Let required field validation handle this

        const sessionDateTime = new Date(`${sesForm.startDate}T${sesForm.time}`);
        const now = new Date();

        if (sessionDateTime <= now) {
            setError("Session date and time must be in the future. Please select a future date and time.");
            return false;
        }

        return true;
    };

    const validateUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const submit = async () => {
        // Clear previous errors
        setError("");

        // Basic validation
        if (!sesForm.name || !sesForm.startDate || !sesForm.time || !sesForm.url) {
            setError("Please fill in all fields.");
            return;
        }

        // Validate URL format
        if (!validateUrl(sesForm.url)) {
            setError("Please enter a valid URL (e.g., https://example.com).");
            return;
        }

        // Validate date/time is not in the past
        if (!validateSessionDateTime()) {
            return;
        }

        try {
            setLoading(true);
            const payload = {
                companyName: sesForm.name,
                scheduledOn: sesForm.startDate,
                startsAt: sesForm.time,
                joinUrl: sesForm.url,
            };
            const res = await api.post(`${TPO_BASE_URL}/api/sessions`, payload);
            const created = res.data;
            const mapped = {
                id: created.id,
                name: created.companyName || sesForm.name,
                startDate: created.scheduledOn || sesForm.startDate,
                time: created.startsAt || sesForm.time,
                url: created.joinUrl || sesForm.url,
            };
            const updated = sortSessions([...sessions, mapped]);
            setSessions(updated);
            setSessionDetails(updated);
            setSesForm({name: '', startDate: '', time: '', url: ''});
            setCreateSes(false);
        } catch (err) {
            console.error("Failed to create session", err);
            setError("Failed to create session. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        {loading ? (
            <Loading />
        ) : (
        <div className="flex flex-col px-4 md:mt-5">

            {!createSes && <div className="flex justify-end">
                <button 
                onClick={() => {setCreateSes(true)}}
                className='bg-blue-700 text-white px-4 py-3 rounded-md hover:bg-blue-600 cursor-pointer mt-4'>Create New Session</button>
            </div>
            }

            {sessions.length > 0 && !createSes?(
                <div className="flex flex-wrap gap-2 md:gap-4 md:mt-4 justify-center">
                {sessions.map((session, index) => (
                    <SesCard key={index} session={session} onRemoveClick={handleRemoveClick} />
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

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md w-full">
                            {error}
                        </div>
                    )}

                    <div className='mt-4 p-4 border border-gray-300 rounded-md w-full'>
                        <label className='block font-semibold mb-2'>Session Name:</label>
                        <input type="text" 
                            value={sesForm.name}
                            onChange={(e) => {
                                setSesForm({...sesForm, name: e.target.value});
                                setError("");
                            }}
                            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter session name' />
                    </div>
                    <div className='mt-4 p-4 border border-gray-300 rounded-md w-full'>
                        <label className='block font-semibold mb-2'>Start Date:</label>
                        <input type="date" 
                            value={sesForm.startDate}
                            onChange={(e) => {
                                setSesForm({...sesForm, startDate: e.target.value});
                                setError("");
                            }}
                            min={new Date().toISOString().split('T')[0]}
                            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>
                    <div className='mt-4 p-4 border border-gray-300 rounded-md w-full'>
                        <label className='block font-semibold mb-2'>Start Time:</label>
                        <input type="time" 
                            value={sesForm.time}
                            onChange={(e) => {
                                setSesForm({...sesForm, time: e.target.value});
                                setError("");
                            }}
                            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
                    </div>
                    <div className="mt-4 p-4 border border-gray-300 rounded-md w-full">
                        <label className="block font-semibold mb-2">Session URL:</label>
                        <input type="text" value={sesForm.url} onChange={(e) => {
                            setSesForm({...sesForm, url: e.target.value});
                            setError("");
                        }} className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter session URL' />
                    </div>
                    <div className='mt-6 mb-8 w-full'>
                        <button onClick={submit} className='bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer w-full' disabled={loading}>
                            {loading ? "Creating..." : "Create Session"}
                        </button>
                        <button onClick={() => setCreateSes(false)} className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer w-full mt-3'>   Cancel</button>
                    </div>
                </div>
            )}
        </div>
        )}
        <ConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => { setDeleteModalOpen(false); setSessionToDelete(null); }}
            onConfirm={() => removeSession(sessionToDelete)}
            title="Delete Session?"
            message="Are you sure you want to delete this session? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            isDangerous={true}
            isLoading={deletingSession}
        />
        </>
    );
};

export default CreateSession;

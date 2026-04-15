import { useEffect, useState } from 'react'
import Loading from '../../components/Loading.jsx'
import api from '../../utils/api.js'

const UpcomingSessionCard = ({ session }) => {
    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    return (
        <div className="w-full sm:w-[320px] md:w-90 bg-white border border-blue-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 m-3 flex flex-col justify-between">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-blue-800 mb-2 text-center sm:text-left">{session.companyName}</h2>
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-medium">Scheduled On:</span>
                        <span>{session.scheduledOn}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-medium">Starts At:</span>
                        <span>{formatTime(session.startsAt)}</span>
                    </div>
                </div>
            </div>
            <a
                href={session.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center rounded-lg bg-sky-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 mt-4 transition-colors duration-300"
            >
                Join Session
            </a>
        </div>
    )
}

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const TPO_BASE_URL = import.meta.env.VITE_TPO_BASE_URL || "http://localhost:8083";

    useEffect(() => {
        const loadSessions = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await api.get(`${TPO_BASE_URL}/api/sessions`);
                setSessions(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setError("Failed to load sessions.");
            } finally {
                setLoading(false);
            }
        };
        loadSessions();
    }, []);

    const isUpcomingSession = (scheduledOn) => {
        if (!scheduledOn) return false;
        const [year, month, day] = scheduledOn.split('-').map(Number);
        const sessionDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return sessionDate >= today;
    };

    const upcomingSessions = sessions
        .filter((session) => isUpcomingSession(session.scheduledOn))
        .sort((a, b) => {
            const [aYear, aMonth, aDay] = a.scheduledOn.split('-').map(Number);
            const [bYear, bMonth, bDay] = b.scheduledOn.split('-').map(Number);
            return new Date(aYear, aMonth - 1, aDay) - new Date(bYear, bMonth - 1, bDay);
        });

    return (
        <div className='flex flex-col px-4 sm:px-6 lg:px-10 py-6'>
            <h1 className='text-3xl font-semibold text-blue-800 mb-6'>Pre Placement Sessions</h1>

            {loading && <Loading />}
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {!loading && !error && upcomingSessions.length === 0 && (
                <p className="text-gray-600">No upcoming sessions are available at the moment.</p>
            )}

            <div className='flex flex-wrap justify-center items-stretch'>
                {upcomingSessions.map((session) => (
                    <UpcomingSessionCard key={session.id} session={session} />
                ))}
            </div>
        </div>
    )
}

export default Sessions

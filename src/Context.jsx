import { createContext, useState } from "react";


const SessionContext = createContext();

const SessionProvider = ({ children }) => {
    const [sessionDetails, setSessionDetails] = useState([]);

    return (
        <SessionContext.Provider value={{ sessionDetails, setSessionDetails }}>
            {children}
        </SessionContext.Provider>
    );
}

export default  SessionContext
export { SessionProvider };
import { createContext, useState } from "react";


const SessionContext = createContext();

const SessionProvider = ({ children }) => {
    const [sessionDetails, setSessionDetails] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const closeAllMenus = () => {
        setMobileMenuOpen(false);
        setMobileSidebarOpen(false);
    };

    return (
        <SessionContext.Provider value={{ 
            sessionDetails, 
            setSessionDetails,
            mobileMenuOpen,
            setMobileMenuOpen,
            mobileSidebarOpen,
            setMobileSidebarOpen,
            closeAllMenus
        }}>
            {children}
        </SessionContext.Provider>
    );
}

export default  SessionContext
export { SessionProvider };

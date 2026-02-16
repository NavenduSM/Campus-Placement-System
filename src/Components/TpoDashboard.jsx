import { NavLink, Outlet } from "react-router-dom"
import NavBar from "./NavBar.jsx"

const TpoDashboard = () => {

    return (
        <>
            
        <div className="flex items-center justify-between p-2 border-b-2 border-blue-100 shadow-md fixed top-0 left-0 right-0 bg-white z-10">
            <img src="https://jimsrohini.org/assets2025/images/logo/logo.png" alt="Logo" className="h-24 w-90 inline-block mr-2 pl-10" />
            <div className="flex gap-10 font-semibold text-xl mr-20  ">
                <NavLink to="create-job" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}>Create Job </NavLink>
                <NavLink to="view-jobs" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}> View Jobs </NavLink>
                
                <NavLink to="create-session" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}> Create Session </NavLink>
                <NavLink to="signout" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}> Signout </NavLink>
            </div>
        </div>
            <div className="h-screen pt-28">
                <Outlet />
            </div>

        </>
    )
}

export default TpoDashboard
import { Link, Outlet } from "react-router-dom"
import NavBar from "./NavBar.jsx"

const TpoDashboard = () => {

    return (
        <>
            
        <div className="flex items-center justify-between p-2 border-b-2 border-blue-100 shadow-md">
            <img src="https://jimsrohini.org/assets2025/images/logo/logo.png" alt="Logo" className="h-24 w-90 inline-block mr-2 pl-10" />
            <div className="flex gap-10 font-semibold text-xl mr-20">
                <Link to="create-job" className=" ">Create Job </Link>
                <Link to="view-jobs" className=" "> View Jobs </Link>
                <Link to="create-session" className=" "> Create Session </Link>
                <Link to="signout" className=" "> Signout </Link>
            </div>
        </div>
            <div className="flex flex-col p-5 m-5">
                <Outlet />
            </div>

        </>
    )
}

export default TpoDashboard
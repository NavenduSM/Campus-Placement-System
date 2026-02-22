
const TpoSignout = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">TPO Signout</h1>
                <p className="text-gray-600 text-base md:text-lg mb-6">Are you sure you want to sign out?</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer w-full sm:w-auto">
                        Confirm Signout
                    </button>
                    <button 
                        onClick={() => window.history.back()}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 cursor-pointer w-full sm:w-auto"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TpoSignout

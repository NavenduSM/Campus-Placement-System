import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-xl w-full bg-white shadow-2xl rounded-3xl border border-slate-200 p-10 text-center">
        <h1 className="text-6xl font-black text-slate-900 mb-4">404</h1>
        <p className="text-xl text-slate-600 mb-6">Page not found.</p>
        <p className="text-slate-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}

export default NotFound

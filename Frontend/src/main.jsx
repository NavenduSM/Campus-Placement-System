import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import TpoDashboard from './pages/TPO/TpoDashboard.jsx'
import CreateJob from './pages/TPO/CreateJob.jsx'
import ViewJobs from './components/ViewJobs.jsx'
import CreateSession from './pages/TPO/CreateSession.jsx'
import Dashboard from './pages/student/Dashboard.jsx'
import CompanyList from './pages/student/CompanyList.jsx'
import AppliedList from './pages/student/AppliedList.jsx'
import Sessions from './pages/student/Sessions.jsx'
import Profile from './pages/student/Profile.jsx'
import NotFound from './pages/NotFound.jsx'
import { SessionProvider } from './context/Context.jsx'
import Landing from './landing.jsx'
import AuthPage from './components/Auth.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
// import Signup from './components/Auth.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path='/signup' element={<AuthPage />} />

          /* TPO Routes */
          <Route path="/tpo" element={
            <ProtectedRoute allowedRoles={['tpo']}>
              <TpoDashboard />
            </ProtectedRoute>
          } >
            <Route index element={<Navigate to="view-jobs" replace />} />
            <Route path="create-job" element={<CreateJob />} />
            <Route path="view-jobs" element={<ViewJobs />} />
            <Route path='view-jobs/job/:id' element={<ViewJobs />} />
            <Route path='view-jobs/job/:id/applied-students' element={<ViewJobs />} />
            <Route path='create-session' element={<CreateSession />} />
          </Route>


          /* Student Routes */
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="company-list" replace />} />
            <Route path="company-list" element={<CompanyList />} />
            <Route path="company-list/job-description/:id" element={<CompanyList />} />
            <Route path="applied-list" element={<AppliedList />} />
            <Route path="upcoming-session" element={<Sessions />} />
            <Route path="profile" element={<Profile />} />
          </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>,
)

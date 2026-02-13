import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TpoDashboard from './Components/TpoDashboard.jsx'
import ViewJobs from './Components/ViewJobs.jsx'
import CreateSession from './CreateSession.jsx'
import TpoSignout from './Components/TpoSignout.jsx'
import CreateJob from './Components/CreateJob.jsx'
import JobDesc from './Components/JobDesc.jsx'
import { SessionProvider } from './Context.jsx'
import AppliedStudents from './Components/AppliedStudents.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <SessionProvider>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/tpo-dashboard" element={<TpoDashboard />} >
        <Route index  element={<CreateJob  />} />
        <Route path="create-job"  element={<CreateJob  />} />
        <Route path="view-jobs" element={<ViewJobs />} />
        <Route path='view-jobs/job/:id' element={<JobDesc />} />
        <Route path='create-session' element={<CreateSession />} />
        <Route path='job/:id/applied-students' element = {<AppliedStudents />} />
        <Route path='signout' element={<TpoSignout />} />
      </Route>

      
    </Routes>
    </SessionProvider>
    </BrowserRouter>
  </StrictMode>,
)

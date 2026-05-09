import { Routes, Route } from 'react-router'
import Dashboard from '@/pages/Dashboard'
import CallSimulator from '@/pages/CallSimulator'
import StudyMaterials from '@/pages/StudyMaterials'
import Scorecard from '@/pages/Scorecard'
import Mentor from '@/pages/Mentor'
import Login from '@/pages/Login'
import WeeklyStats from '@/pages/WeeklyStats'
import EmployeeDirectory from '@/pages/EmployeeDirectory'
import BuyerAcquisition from '@/pages/BuyerAcquisition'
import EmployeeProfile from '@/pages/EmployeeProfile'
import TrainingAssignments from '@/pages/TrainingAssignments'
import SellerTracker from '@/pages/SellerTracker'
import BuyerCRM from '@/pages/BuyerCRM'
import DealPipeline from '@/pages/DealPipeline'
import LandingPage from '@/pages/LandingPage'
import AuthGate from '@/components/AuthGate'

export default function App() {
  return (
    <Routes>
      {/* Root: Landing page for visitors, Dashboard for employees */}
      <Route path="/" element={<AuthGate><Dashboard /></AuthGate>} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/simulator" element={<CallSimulator />} />
      <Route path="/study" element={<StudyMaterials />} />
      <Route path="/scorecard" element={<Scorecard />} />
      <Route path="/mentor" element={<Mentor />} />
      <Route path="/buyer-acquisition" element={<BuyerAcquisition />} />
      <Route path="/employees" element={<EmployeeDirectory />} />
      <Route path="/training" element={<TrainingAssignments />} />
      <Route path="/employee/:id" element={<EmployeeProfile />} />
      <Route path="/weekly" element={<WeeklyStats />} />
      <Route path="/sellers" element={<SellerTracker />} />
      <Route path="/buyers" element={<BuyerCRM />} />
      <Route path="/deals" element={<DealPipeline />} />
    </Routes>
  )
}

import { Routes, Route } from 'react-router'
import Dashboard from '@/pages/Dashboard'
import CallSimulator from '@/pages/CallSimulator'
import StudyMaterials from '@/pages/StudyMaterials'
import Scorecard from '@/pages/Scorecard'
import Mentor from '@/pages/Mentor'
import BuyerAcquisition from '@/pages/BuyerAcquisition'
import SellerTracker from '@/pages/SellerTracker'
import BuyerCRM from '@/pages/BuyerCRM'
import DealPipeline from '@/pages/DealPipeline'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/simulator" element={<CallSimulator />} />
      <Route path="/study" element={<StudyMaterials />} />
      <Route path="/scorecard" element={<Scorecard />} />
      <Route path="/mentor" element={<Mentor />} />
      <Route path="/buyer-acquisition" element={<BuyerAcquisition />} />
      <Route path="/sellers" element={<SellerTracker />} />
      <Route path="/buyers" element={<BuyerCRM />} />
      <Route path="/deals" element={<DealPipeline />} />
    </Routes>
  )
}

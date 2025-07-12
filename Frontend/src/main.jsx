import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Component/Login'
import AdminDashboard from './Pages/AdminDashboard'
import { Toaster } from 'react-hot-toast'
import ReceptionistDashboard from './Pages/ReceptionistDashboard'
import FloorDetails from './Component/FloorDetails'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Toaster />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/admin/dashboard' element={<AdminDashboard />} />
      <Route path='/receptionist/dashboard' element={<ReceptionistDashboard />} />
      <Route path="/floors/:floorId/rooms" element={<FloorDetails />} />
    </Routes>
  </BrowserRouter>
)

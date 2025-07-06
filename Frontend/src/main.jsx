import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Component/Login'
import AdminDashboard from './Pages/AdminDashboard'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Toaster />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/admin/dashboard' element={<AdminDashboard />} />
    </Routes>
  </BrowserRouter>
)

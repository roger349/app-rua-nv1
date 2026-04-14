import { Routes, Route, Navigate } from 'react-router-dom'
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Dashboard from "@/pages/Dashboard"
import Users from '@/pages/Users'
import ProtectedRoute from "@/components/ProtectedRoute"
import "./App.css"
import ResetPassword from './pages/ResetPassword'

export default function App() {
return (
<div className="app-body w-screen h-screen">   
   <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/ResetPassword" element={<ResetPassword />} />
      <Route path="/dashboard/*" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
      <Route path="/users" element={<Users />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
</div> 
)
}



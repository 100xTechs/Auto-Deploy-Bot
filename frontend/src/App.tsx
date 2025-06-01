import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add more routes here as needed */}
      </Routes>
    </BrowserRouter>
  )
}

export default App

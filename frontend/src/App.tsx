import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AuthInitializer from './components/AuthInitializer'

function App() {
  return (
    <RecoilRoot>
      <AuthInitializer>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            {/* Add more protected routes here as needed */}
          </Routes>
        </BrowserRouter>
      </AuthInitializer>
    </RecoilRoot>
  )
}

export default App

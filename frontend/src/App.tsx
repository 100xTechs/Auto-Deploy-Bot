import { useState } from 'react'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Register from './pages/auth/register'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

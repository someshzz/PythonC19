import { Navigate, Route, Routes } from 'react-router-dom'
import { useSession } from './SessionContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'

function RequireAuth({ children }) {
  const { user } = useSession()
  if (!user) return <Navigate to="/signup" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

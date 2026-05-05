import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Rent from './pages/Rent'
import Buy from './pages/Buy'
import CarDetail from './pages/CarDetail'
import BuyDetail from './pages/BuyDetail'
import Transfers from './pages/Transfers'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import ProtectedRoute from './pages/admin/ProtectedRoute'

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes with Navbar + Footer */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/rent" element={<PublicLayout><Rent /></PublicLayout>} />
          <Route path="/rent/:id" element={<PublicLayout><CarDetail /></PublicLayout>} />
          <Route path="/buy" element={<PublicLayout><Buy /></PublicLayout>} />
          <Route path="/buy/:id" element={<PublicLayout><BuyDetail /></PublicLayout>} />
          <Route path="/transfers" element={<PublicLayout><Transfers /></PublicLayout>} />

          {/* Admin routes — no public layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

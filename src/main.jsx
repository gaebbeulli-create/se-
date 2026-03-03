import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute, PublicOnlyRoute } from '@/components/ProtectedRoute'
import '@/styles/global.css'

import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import AppLayout from '@/pages/AppLayout'
import AppHome from '@/pages/AppHome'
import {
  ContractsPage, InventoryPage, DispatchPage,
  IncidentsPage, ClaimsPage,
  NoticesPage, RequestsPage,
  SchedulePage, FilesPage,
} from '@/pages/ChannelPage'
import MeetingsPage from '@/pages/MeetingsPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />

          {/* Protected */}
          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<AppHome />} />
            <Route path="contracts" element={<ContractsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="dispatch" element={<DispatchPage />} />
            <Route path="incidents" element={<IncidentsPage />} />
            <Route path="claims" element={<ClaimsPage />} />
            <Route path="notices" element={<NoticesPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="files" element={<FilesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)

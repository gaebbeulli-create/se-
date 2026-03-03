import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

function LoadingScreen() {
  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F7F8FA', fontFamily: "var(--nw-font, 'Pretendard', sans-serif)",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11, margin: '0 auto 14px',
          background: '#1E1E1E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: 0.5,
          animation: 'pulse 1.5s ease infinite',
        }}>N</div>
        <div style={{ fontSize: 13, color: '#9CA3AF' }}>로딩 중...</div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.95)} }`}</style>
    </div>
  )
}

export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()
  if (loading) return <LoadingScreen />
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export function PublicOnlyRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (session) return <Navigate to="/app" replace />
  return children
}

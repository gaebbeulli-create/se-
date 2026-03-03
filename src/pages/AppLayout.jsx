import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const CHANNELS = [
  { path: '/app', label: '홈', icon: '🏠', exact: true },
  { divider: true, label: '운영' },
  { path: '/app/contracts', label: '계약관리', icon: '📝' },
  { path: '/app/inventory', label: '차량재고', icon: '📦' },
  { path: '/app/dispatch', label: '출고현황', icon: '🚚' },
  { divider: true, label: '이슈' },
  { path: '/app/incidents', label: '사고접수', icon: '⚠️' },
  { path: '/app/claims', label: '클레임', icon: '🧾' },
  { divider: true, label: '소통' },
  { path: '/app/notices', label: '공지사항', icon: '📢' },
  { path: '/app/requests', label: '요청/건의', icon: '💬' },
  { path: '/app/meetings', label: '회의록', icon: '📋' },
  { divider: true, label: '기타' },
  { path: '/app/schedule', label: '일정/스케줄', icon: '📅' },
  { path: '/app/files', label: '파일공유', icon: '📁' },
]

export default function AppLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const sideWidth = collapsed ? 56 : 220

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "var(--nw-font, 'Pretendard', sans-serif)" }}>
      <aside style={{
        width: sideWidth, background: '#1B1D21', display: 'flex', flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.06)', transition: 'width 0.2s', flexShrink: 0, overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '14px 8px' : '14px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 9, justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div onClick={() => setCollapsed(!collapsed)} style={{
            width: 30, height: 30, borderRadius: 7, flexShrink: 0, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 800, color: '#1B1D21', letterSpacing: 0.5, cursor: 'pointer',
          }}>N</div>
          {!collapsed && <span style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 1.5 }}>NETWORK</span>}
        </div>

        {/* Channels */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {CHANNELS.map((item, i) => {
            if (item.divider) {
              if (collapsed) return null
              return <div key={i} style={{ padding: '12px 16px 4px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: 0.8, textTransform: 'uppercase' }}>{item.label}</div>
            }
            const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
            return (
              <div key={item.path} onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: collapsed ? '8px 0' : '8px 12px',
                  margin: '1px 6px', borderRadius: 7, cursor: 'pointer',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.12s',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                title={collapsed ? item.label : ''}
              >
                <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </div>
            )
          })}
        </nav>

        {/* User */}
        <div style={{ padding: collapsed ? '12px 6px' : '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {!collapsed && profile && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{profile.name || '사용자'}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{profile.orgs?.name || ''}</div>
            </div>
          )}
          <button onClick={handleLogout} style={{
            width: '100%', padding: collapsed ? '6px' : '7px 12px', borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
            color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
          }}>{collapsed ? '🚪' : '로그아웃'}</button>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  )
}

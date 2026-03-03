import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const QUICK = [
  { path: '/app/contracts', icon: '📝', label: '계약관리', desc: '렌탈 계약 현황', color: '#3B82F6' },
  { path: '/app/inventory', icon: '📦', label: '차량재고', desc: '재고·배정 현황', color: '#10B981' },
  { path: '/app/dispatch', icon: '🚚', label: '출고현황', desc: '출고·입고 확인', color: '#F59E0B' },
  { path: '/app/incidents', icon: '⚠️', label: '사고접수', desc: '사고 처리 현황', color: '#EF4444' },
  { path: '/app/claims', icon: '🧾', label: '클레임', desc: '클레임 접수·처리', color: '#8B5CF6' },
  { path: '/app/notices', icon: '📢', label: '공지사항', desc: '업무 공지', color: '#EC4899' },
  { path: '/app/requests', icon: '💬', label: '요청/건의', desc: '협의·요청 사항', color: '#06B6D4' },
  { path: '/app/schedule', icon: '📅', label: '일정', desc: '공유 일정', color: '#14B8A6' },
  { path: '/app/files', icon: '📁', label: '파일', desc: '공유 문서', color: '#6366F1' },
  { path: '/app/meetings', icon: '📋', label: '회의록', desc: '회의 내용 관리', color: '#F97316' },
]

export default function AppHome() {
  const { profile, orgName } = useAuth()
  const navigate = useNavigate()
  const greet = () => { const h = new Date().getHours(); return h < 12 ? '좋은 아침이에요' : h < 18 ? '좋은 오후에요' : '수고하셨습니다' }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#F7F8FA', padding: '32px 36px' }}>
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 5 }}>{greet()}, {profile?.name || '사용자'}님 👋</h1>
        <p style={{ fontSize: 13.5, color: '#9CA3AF' }}>{orgName}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: 10, marginBottom: 32 }}>
        {QUICK.map((l, i) => (
          <div key={l.path} onClick={() => navigate(l.path)} style={{
            padding: '16px', borderRadius: 12, background: '#fff', border: '1px solid #ECEDF0',
            cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            animation: `fadeUp 0.3s ease ${i * 0.03}s both`,
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 9, background: l.color + '10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 10 }}>{l.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{l.label}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{l.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: 24, borderRadius: 14, background: '#fff', border: '1px dashed #D1D5DB', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
        📊 대시보드 위젯(정산 요약, 연체 현황 등)이 여기에 추가될 예정입니다.
      </div>
    </div>
  )
}

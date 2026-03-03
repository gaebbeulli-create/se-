import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/app'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? '이메일 또는 비밀번호가 올바르지 않습니다.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width: '100%', padding: '12px 14px', border: '1.5px solid #E5E7EB',
    borderRadius: 10, fontSize: 14, background: '#fff',
    fontFamily: 'inherit', color: '#1E1E1E', transition: 'all 0.15s',
  }

  return (
    <div style={{
      fontFamily: "var(--nw-font, 'Pretendard', sans-serif)",
      minHeight: '100vh', background: '#F5F6F8',
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        input:focus { outline:none; border-color:#1E1E1E !important; box-shadow: 0 0 0 3px rgba(30,30,30,0.06) !important; }
      `}</style>

      {/* Top bar */}
      <div style={{ padding: '18px 28px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: '#1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#fff', letterSpacing: 0.5 }}>N</div>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1.5 }}>NETWORK</span>
        </Link>
      </div>

      {/* Center card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px 60px' }}>
        <div style={{ width: '100%', maxWidth: 400, animation: 'fadeUp 0.4s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: '#1E1E1E' }}>로그인</h1>
            <p style={{ fontSize: 14, color: '#9CA3AF' }}>NETWORK 업무 공간에 접속합니다</p>
          </div>

          <div style={{
            background: '#fff', borderRadius: 16, border: '1px solid #ECEDF0',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)', padding: '28px',
          }}>
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: '#FEF2F2', border: '1px solid #FECACA', fontSize: 13, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 6 }}>⚠️ {error}</div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>이메일</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="발급받은 이메일을 입력하세요" style={inp} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>비밀번호</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={inp} />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
                background: loading ? '#9CA3AF' : '#1E1E1E', color: '#fff',
                fontSize: 14.5, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.15s',
              }}>{loading ? '접속 중...' : '접속하기'}</button>
            </form>
          </div>

          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.6 }}>
              계정은 관리자가 생성합니다.<br/>
              접속 문제 시 <span style={{ color: '#6B7280', fontWeight: 600 }}>본사 운영팀</span>에 문의하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

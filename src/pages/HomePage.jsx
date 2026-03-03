import { Link } from 'react-router-dom'

// ── Slack-style App Preview ──
function AppPreview() {
  const messages = [
    { avatar: "🏢", name: "장비팀", time: "오전 9:00", msg: "CT-202603-0012 홍길동님 OK1 KS 계약 등록 완료했습니다.", badge: { text: "진행", bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" }, file: { name: "계약서_홍길동.pdf", type: "pdf" } },
    { avatar: "🏪", name: "성서지점", time: "오전 9:15", msg: "확인했습니다. 출고는 오후에 가능한가요?" },
    { avatar: "🏢", name: "장비팀", time: "오전 9:20", msg: "오후 2시 출고 준비 완료 예정입니다. 체크리스트 첨부드립니다.", file: { name: "출고_체크리스트.pdf", type: "pdf" } },
    { avatar: "🏢", name: "운영팀", time: "오전 10:30", alert: true, msg: "CT-202603-0008 김철수님 연체 3개월 — 회수 절차 진행합니다.", badge: { text: "연체", bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" } },
    { avatar: "🏪", name: "성서지점", time: "오전 10:45", msg: "연락 시도 중입니다. 내일까지 회신 없으면 회수팀 요청드립니다." },
  ]

  return (
    <div style={{
      background: "#fff", borderRadius: 14, overflow: "hidden",
      border: "1px solid #E5E7EB",
      boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
    }}>
      {/* Window bar */}
      <div style={{ height: 40, background: "#FAFBFC", borderBottom: "1px solid #ECEDF0", display: "flex", alignItems: "center", padding: "0 14px", gap: 6 }}>
        <div style={{ display: "flex", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
        </div>
        <span style={{ marginLeft: 12, fontSize: 11.5, fontWeight: 600, color: "#9CA3AF" }}>NETWORK</span>
      </div>

      <div style={{ display: "flex", height: 360 }}>
        {/* Mini sidebar */}
        <div style={{ width: 160, background: "#1B1D21", padding: "12px 8px", borderRight: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, padding: "0 4px" }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: "#1B1D21" }}>N</div>
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>NETWORK</span>
          </div>
          {["📢 공지사항", "📝 계약관리", "📦 차량재고", "🚚 출고현황", "⚠️ 사고접수", "💬 요청/건의"].map((c, i) => (
            <div key={i} style={{
              padding: "5px 8px", borderRadius: 5, marginBottom: 1,
              background: i === 1 ? "rgba(255,255,255,0.1)" : "transparent",
              color: i === 1 ? "#fff" : "rgba(255,255,255,0.4)",
              fontSize: 11, fontWeight: i === 1 ? 600 : 400,
              display: "flex", alignItems: "center", gap: 5,
            }}>{c}</div>
          ))}
        </div>

        {/* Chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F7F8FA" }}>
          <div style={{ height: 38, borderBottom: "1px solid #ECEDF0", display: "flex", alignItems: "center", padding: "0 14px", background: "#fff", gap: 6 }}>
            <span style={{ fontSize: 13 }}>📝</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1E1E1E" }}>계약관리</span>
          </div>

          <div style={{ flex: 1, padding: "12px 14px", overflowY: "auto" }}>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <span style={{ background: "#E8E9EC", borderRadius: 10, padding: "2px 10px", fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>오늘</span>
            </div>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, animation: `msgSlide 0.3s ease ${0.6 + i * 0.15}s both` }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "#F1F2F4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 1 }}>{m.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#1E1E1E" }}>{m.name}</span>
                    <span style={{ fontSize: 10, color: "#C0C3C8" }}>{m.time}</span>
                  </div>
                  <div style={{ background: m.alert ? "#FEF2F2" : "#fff", border: m.alert ? "1px solid #FECACA" : "1px solid #ECEDF0", borderRadius: "3px 10px 10px 10px", padding: "8px 11px" }}>
                    {m.badge && <span style={{ display: "inline-block", marginBottom: 4, padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: m.badge.bg, color: m.badge.color, border: `1px solid ${m.badge.border}` }}>{m.badge.text}</span>}
                    <div style={{ fontSize: 12, color: m.alert ? "#B91C1C" : "#374151", lineHeight: 1.55, fontWeight: m.alert ? 600 : 400 }}>{m.msg}</div>
                    {m.file && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, padding: "5px 8px", borderRadius: 6, background: "#F9FAFB", border: "1px solid #F0F0F2" }}>
                        <div style={{ width: 22, height: 22, borderRadius: 4, background: "#DC2626", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7.5, fontWeight: 800 }}>PDF</div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>{m.file.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "8px 14px", borderTop: "1px solid #ECEDF0", background: "#fff" }}>
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "#F7F8FA", border: "1px solid #ECEDF0", fontSize: 11.5, color: "#C0C3C8" }}>메시지를 입력하세요...</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div style={{ fontFamily: "var(--nw-font, 'Pretendard', sans-serif)", color: "#1E1E1E", background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes msgSlide { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #F0F0F2" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#1E1E1E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>N</div>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.5 }}>NETWORK</span>
          </div>
          <Link to="/login" style={{ padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", background: "#1E1E1E", color: "#fff", cursor: "pointer" }}>로그인</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ flex: 1, maxWidth: 1060, margin: "0 auto", padding: "64px 28px 48px", display: "flex", alignItems: "center", gap: 48 }}>
        <div style={{ flex: "0 0 340px", animation: "fadeUp 0.5s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px 5px 7px", borderRadius: 20, background: "#F3F4F6", border: "1px solid #E5E7EB", fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 20 }}>
            <span style={{ padding: "2px 6px", borderRadius: 8, background: "#1E1E1E", color: "#fff", fontSize: 10, fontWeight: 700 }}>내부</span>
            업무 전용 시스템
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.3, letterSpacing: -0.8, marginBottom: 14 }}>대화하듯<br/>일합니다</h1>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "#9CA3AF", marginBottom: 32 }}>계약, 출고, 사고, 클레임까지<br/>채널에서 바로 공유하고 처리합니다.</p>
          <Link to="/login" style={{ display: "inline-block", padding: "13px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700, background: "#1E1E1E", color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>접속하기 →</Link>
          <div style={{ display: "flex", gap: 16, marginTop: 24, fontSize: 12, color: "#C0C3C8" }}>
            {["웹 브라우저 접속", "설치 불필요", "모바일 지원"].map(t => <span key={t}>✓ {t}</span>)}
          </div>
        </div>
        <div style={{ flex: 1, animation: "fadeUp 0.6s ease 0.15s both" }}>
          <AppPreview />
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #F0F0F2", padding: "20px 28px", textAlign: "center", fontSize: 12, color: "#C0C3C8" }}>
        NETWORK · 내부 업무용 · 외부 공개 금지
      </footer>
    </div>
  )
}

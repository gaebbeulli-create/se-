import { useAuth } from '@/contexts/AuthContext'

export default function MeetingsPage() {
  const { isHQ } = useAuth()

  const sampleMeetings = [
    {
      title: "3월 정기 운영 회의",
      date: "2026.03.03 (월) 10:00",
      location: "본사 회의실 A",
      attendees: ["김대표", "박매니저", "이과장"],
      status: "확정",
      decisions: "OK1 KS 3월 추가 입고 5대 확정, 연체 회수 절차 강화",
      actionItems: [
        { task: "3월 입고 일정 SE글로벌 확인", assignee: "박매니저", deadline: "03.05" },
        { task: "연체 고객 리스트 정리", assignee: "이과장", deadline: "03.04" },
      ],
    },
    {
      title: "차량 정비 일정 협의",
      date: "2026.02.28 (금) 14:00",
      location: "온라인 (Google Meet)",
      attendees: ["김대표", "정비팀장"],
      status: "공유완료",
      decisions: "매월 1회 전 차량 점검, 정비 체크리스트 표준화",
      actionItems: [
        { task: "점검 체크리스트 양식 작성", assignee: "정비팀장", deadline: "03.07" },
      ],
    },
  ]

  const statusStyle = (s) => {
    if (s === '확정') return { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' }
    if (s === '공유완료') return { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' }
    return { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{
        height: 52, borderBottom: '1px solid #ECEDF0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', background: '#fff', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>📋</span>
          <span style={{ fontSize: 16, fontWeight: 700 }}>회의록</span>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>{sampleMeetings.length}건</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid #E5E7EB', background: '#fff', fontSize: 12.5, fontWeight: 600, color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}>🔍 검색</button>
          <button style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: '#1E1E1E', fontSize: 12.5, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>+ 회의록 작성</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#F7F8FA' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sampleMeetings.map((m, i) => {
            const st = statusStyle(m.status)
            return (
              <div key={i} style={{
                background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0',
                overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#D1D5DB' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#ECEDF0' }}
              >
                {/* Header */}
                <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid #F5F5F7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#1E1E1E' }}>{m.title}</span>
                      <span style={{
                        padding: '2px 7px', borderRadius: 4, fontSize: 10.5, fontWeight: 700,
                        background: st.bg, color: st.color, border: `1px solid ${st.border}`,
                      }}>{m.status}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#9CA3AF' }}>
                    <span>📅 {m.date}</span>
                    <span>📍 {m.location}</span>
                    <span>👥 {m.attendees.join(', ')}</span>
                  </div>
                </div>

                {/* Decisions */}
                <div style={{ padding: '12px 18px' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#6B7280', marginBottom: 6 }}>결정 사항</div>
                  <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{m.decisions}</div>
                </div>

                {/* Action items */}
                {m.actionItems.length > 0 && (
                  <div style={{ padding: '0 18px 14px' }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#6B7280', marginBottom: 6 }}>실행 항목</div>
                    {m.actionItems.map((a, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 10px', borderRadius: 6, background: '#FAFBFC',
                        marginBottom: 4, fontSize: 12.5,
                      }}>
                        <span style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid #D1D5DB', flexShrink: 0 }} />
                        <span style={{ flex: 1, color: '#374151' }}>{a.task}</span>
                        <span style={{ color: '#3B82F6', fontWeight: 600, fontSize: 11.5 }}>{a.assignee}</span>
                        <span style={{ color: '#9CA3AF', fontSize: 11 }}>~{a.deadline}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Placeholder */}
        <div style={{
          marginTop: 16, padding: 24, borderRadius: 12,
          background: '#fff', border: '1px dashed #D1D5DB',
          textAlign: 'center', color: '#9CA3AF', fontSize: 12, lineHeight: 1.6,
        }}>
          Supabase meetings 테이블 연동 후 실제 회의록 CRUD가 동작합니다.<br/>
          이미지/파일 첨부는 Supabase Storage(attachments 버킷)를 사용합니다.
        </div>
      </div>
    </div>
  )
}

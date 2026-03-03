import { useAuth } from '@/contexts/AuthContext'

const DESC = {
  contracts: '전기바이크 렌탈 계약을 관리합니다.',
  inventory: 'OK1 KS, PRO 등 전기바이크 재고 및 배정 현황을 확인합니다.',
  dispatch: '출고 및 입고 현황을 관리합니다.',
  incidents: '차량 사고 접수 및 보험 처리 진행 상황을 추적합니다.',
  claims: '정비·요금·AS 관련 클레임을 접수하고 처리합니다.',
  notices: '업무 공지사항을 공유합니다.',
  requests: '업무 요청 및 건의사항을 주고받습니다.',
  schedule: '공동 일정 및 마감 기한을 관리합니다.',
  files: '계약서·정산서·점검표 등 업무 문서를 공유합니다.',
}

function ChannelPage({ channelId, title, icon }) {
  const { isHQ, orgName } = useAuth()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ height: 52, borderBottom: '1px solid #ECEDF0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{title}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid #E5E7EB', background: '#fff', fontSize: 12.5, fontWeight: 600, color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}>🔍 검색</button>
          <button style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: '#1E1E1E', fontSize: 12.5, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>+ 새로 작성</button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', background: '#F7F8FA' }}>
        <div style={{ padding: 36, borderRadius: 14, background: '#fff', border: '1px dashed #D1D5DB', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>{icon}</div>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
          <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, marginBottom: 16 }}>{DESC[channelId] || ''}</p>
          <div style={{ display: 'inline-block', padding: '10px 16px', background: '#FAFBFC', borderRadius: 8, fontSize: 12, color: '#9CA3AF' }}>
            Supabase 연동 후 실제 데이터가 표시됩니다
          </div>
        </div>
      </div>
    </div>
  )
}

export function ContractsPage() { return <ChannelPage channelId="contracts" title="계약관리" icon="📝" /> }
export function InventoryPage() { return <ChannelPage channelId="inventory" title="차량재고" icon="📦" /> }
export function DispatchPage() { return <ChannelPage channelId="dispatch" title="출고현황" icon="🚚" /> }
export function IncidentsPage() { return <ChannelPage channelId="incidents" title="사고접수" icon="⚠️" /> }
export function ClaimsPage() { return <ChannelPage channelId="claims" title="클레임" icon="🧾" /> }
export function NoticesPage() { return <ChannelPage channelId="notices" title="공지사항" icon="📢" /> }
export function RequestsPage() { return <ChannelPage channelId="requests" title="요청/건의" icon="💬" /> }
export function SchedulePage() { return <ChannelPage channelId="schedule" title="일정/스케줄" icon="📅" /> }
export function FilesPage() { return <ChannelPage channelId="files" title="파일공유" icon="📁" /> }

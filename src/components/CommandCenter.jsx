import { useState, useEffect, useRef } from 'react'
import { C, FONTS } from '../lib/theme.js'
import { LS, exportAllData, importAllData } from '../lib/storage.js'
import { SectionTitle, Card, CardTitle, StatusDot, Btn, Tag, Toast } from './UI.jsx'

export default function CommandCenter({ onNav }) {
  const [counts, setCounts] = useState({ intakes: '—', qa: '—', sessions: '—', tools: '—' })
  const [toast, setToast]   = useState(null)
  const importRef = useRef()

  // Pull live counts from each section's localStorage
  useEffect(() => {
    const intakes  = LS.get('audit_intakes',    []).filter((x) => x.status === 'New').length
    const qa       = LS.get('pipeline_qa',      []).filter((x) => !x.done).length
    const sessions = LS.get('academy_sessions', []).length
    const tools    = LS.get('rd_tools',         [])
    const online   = tools.filter((t) => t.status === 'live').length
    setCounts({ intakes, qa, sessions, tools: tools.length ? `${online}/${tools.length}` : '—' })
  }, [])

  const stats = [
    { label: 'Pending Audits',    key: 'intakes',  accent: C.gold   },
    { label: 'Assets in QA',      key: 'qa',       accent: C.forest },
    { label: 'Upcoming Sessions', key: 'sessions', accent: C.ink    },
    { label: 'Tools Online',      key: 'tools',    accent: C.forest },
  ]

  const activity = [
    { type: 'audit',    msg: 'New intake from Maison Vérité',        time: '4m ago',  dot: 'warn'  },
    { type: 'pipeline', msg: 'Brand Pack v3.2 — QA complete',        time: '1h ago',  dot: 'live'  },
    { type: 'rd',       msg: 'GitHub Actions: deploy-preview failed', time: '2h ago',  dot: 'down'  },
    { type: 'academy',  msg: 'Module 4 unlocked for 3 students',      time: '3h ago',  dot: 'live'  },
  ]

  const quickLinks = {
    'New Audit':    'audit',
    'Upload Asset': 'pipeline',
    'Start Session':'academy',
    'Add Prompt':   'rd',
    'QA Checklist': 'pipeline',
    'CDN Links':    'pipeline',
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    importAllData(file, (ok) => {
      setToast(ok ? 'Data imported successfully — reload to see changes' : 'Import failed: invalid file')
      e.target.value = ''
    })
  }

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <SectionTitle title="Command Centre" subtitle="What needs attention right now" />
        <div style={{ display: 'flex', gap: 8, paddingTop: 6 }}>
          <Btn onClick={exportAllData} style={{ fontSize: 11 }}>Export Backup</Btn>
          <Btn onClick={() => importRef.current?.click()} style={{ fontSize: 11 }}>Import Backup</Btn>
          <input ref={importRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        {stats.map((s) => (
          <Card key={s.label} padding="20px 24px">
            <p style={{ fontFamily: FONTS.sans, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, margin: '0 0 8px' }}>
              {s.label}
            </p>
            <p style={{ fontFamily: FONTS.serif, fontSize: 34, fontWeight: 400, color: s.accent, margin: 0, lineHeight: 1 }}>
              {counts[s.key]}
            </p>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Activity Feed */}
        <Card>
          <CardTitle>Activity Feed</CardTitle>
          {activity.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', padding: '12px 0', borderBottom: i < activity.length - 1 ? `1px solid ${C.stone}` : 'none' }}>
              <StatusDot status={a.dot} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.ink, margin: 0 }}>{a.msg}</p>
                <p style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted, margin: '3px 0 0' }}>{a.time}</p>
              </div>
              <Tag>{a.type}</Tag>
            </div>
          ))}
        </Card>

        {/* Quick Links */}
        <Card>
          <CardTitle>Quick Links</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
            {Object.entries(quickLinks).map(([label, section]) => (
              <Btn key={label} onClick={() => onNav(section)} style={{ textAlign: 'left', fontSize: 12, padding: '9px 14px' }}>
                {label}
              </Btn>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: 16, background: C.bg, borderRadius: 6, border: `1px solid ${C.stone}` }}>
            <p style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted, margin: '0 0 4px', letterSpacing: '0.08em' }}>
              CURRENT FOCUS
            </p>
            <p style={{ fontFamily: FONTS.serif, fontSize: 15, color: C.ink, margin: 0 }}>
              Brand Identity Audit — Maison Vérité
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

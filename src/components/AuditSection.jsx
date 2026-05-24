import { useState, useRef } from 'react'
import { C, FONTS } from '../lib/theme.js'
import { LS, DEFAULTS } from '../lib/storage.js'
import { exportPDF } from '../lib/pdf.js'
import { SectionTitle, Card, CardTitle, Btn, Tag, FInput, FL, MR, Modal, Toast } from './UI.jsx'

export default function AuditSection() {
  const [intakes,      setIntakes]      = useState(() => LS.get('audit_intakes', DEFAULTS.audit_intakes))
  const [notes,        setNotes]        = useState(() => LS.get('audit_notes',   DEFAULTS.audit_notes))
  const [activeClient, setActiveClient] = useState('Maison Vérité')
  const [currentImg,   setCurrentImg]   = useState(null)
  const [proposedImg,  setProposedImg]  = useState(null)
  const [addModal,     setAddModal]     = useState(false)
  const [newIntake,    setNewIntake]    = useState({ client: '', type: '', status: 'New' })
  const [toast,        setToast]        = useState(null)
  const [exporting,    setExporting]    = useState(false)
  const curRef  = useRef()
  const propRef = useRef()

  const saveIntakes = (v) => { setIntakes(v); LS.set('audit_intakes', v) }
  const saveNotes   = (v) => { setNotes(v);   LS.set('audit_notes',   v) }

  // FileReader-based image upload for the Compare Canvas
  const handleImg = (e, setter) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setter(ev.target.result)
    reader.readAsDataURL(file)
  }

  const addIntake = () => {
    if (!newIntake.client.trim()) return
    const now = new Date()
    saveIntakes([
      {
        id: Date.now(),
        ...newIntake,
        received: `Today, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      },
      ...intakes,
    ])
    setNewIntake({ client: '', type: '', status: 'New' })
    setAddModal(false)
    setToast('Intake added')
  }

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
      exportPDF(notes, activeClient)
      setExporting(false)
      setToast('PDF ready — use Print / Save as PDF in the new tab')
    }, 80)
  }

  const statusColor = (s) => ({ New: 'gold', 'In Review': 'forest', Scheduled: 'stone', Complete: 'stone' }[s] || 'stone')

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <SectionTitle title="The Analytical Engine" subtitle="Audit & Strategy — High-density intelligence" />

      {/* Intake Feed */}
      <Card style={{ marginBottom: 24 }}>
        <CardTitle action={
          <Btn onClick={() => setAddModal(true)} style={{ fontSize: 10, padding: '5px 12px' }}>+ New Intake</Btn>
        }>
          Client Intake Feed
        </CardTitle>
        {intakes.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', padding: '13px 0', borderBottom: i < intakes.length - 1 ? `1px solid ${C.stone}` : 'none', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.bg, border: `1px solid ${C.stone}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.serif, fontSize: 13, color: C.ink, flexShrink: 0 }}>
              {c.client[0]}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: FONTS.sans, fontSize: 13, fontWeight: 500, color: C.ink, margin: 0 }}>{c.client}</p>
              <p style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.muted, margin: '2px 0 0' }}>{c.type}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <Tag color={statusColor(c.status)}>{c.status}</Tag>
              <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted }}>{c.received}</span>
            </div>
            <select
              value={c.status}
              onChange={(e) => saveIntakes(intakes.map((x) => x.id === c.id ? { ...x, status: e.target.value } : x))}
              style={{ fontFamily: FONTS.sans, fontSize: 10, border: `1px solid ${C.stone}`, borderRadius: 3, padding: '4px 6px', background: C.bg, color: C.ink, cursor: 'pointer' }}
            >
              {['New', 'In Review', 'Scheduled', 'Complete'].map((s) => <option key={s}>{s}</option>)}
            </select>
            <button
              onClick={() => saveIntakes(intakes.filter((x) => x.id !== c.id))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 15 }}
            >×</button>
          </div>
        ))}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Compare Canvas */}
        <Card>
          <CardTitle>Compare Canvas</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'Current Brand',      img: currentImg,  setter: setCurrentImg,  ref: curRef  },
              { label: 'Proposed Direction', img: proposedImg, setter: setProposedImg, ref: propRef },
            ].map(({ label, img, setter, ref }) => (
              <div key={label}>
                <p style={{ fontFamily: FONTS.sans, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, margin: '0 0 6px' }}>
                  {label}
                </p>
                <div
                  onClick={() => ref.current?.click()}
                  style={{ background: img ? 'transparent' : C.bg, border: `1px dashed ${C.stone}`, borderRadius: 6, height: 155, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}
                >
                  {img
                    ? <img src={img} alt={label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : (
                      <>
                        <span style={{ fontSize: 20, color: C.stone, marginBottom: 6 }}>↑</span>
                        <p style={{ fontFamily: FONTS.sans, fontSize: 10, color: C.muted, margin: 0 }}>Click to upload</p>
                      </>
                    )
                  }
                  <input ref={ref} type="file" accept="image/*" onChange={(e) => handleImg(e, setter)} style={{ display: 'none' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn onClick={() => { setCurrentImg(null); setProposedImg(null) }} style={{ flex: 1, fontSize: 11 }}>Clear</Btn>
            <Btn
              variant="gold"
              disabled={!currentImg || !proposedImg}
              onClick={() => setToast('Both images loaded — ready for comparison')}
              style={{ flex: 1, fontSize: 11 }}
            >
              {currentImg && proposedImg ? 'Ready ✓' : 'Upload Both Images'}
            </Btn>
          </div>
        </Card>

        {/* Report Builder */}
        <Card>
          <CardTitle action={
            <select
              value={activeClient}
              onChange={(e) => setActiveClient(e.target.value)}
              style={{ fontFamily: FONTS.sans, fontSize: 10, border: `1px solid ${C.stone}`, borderRadius: 3, padding: '4px 8px', background: C.bg, color: C.ink }}
            >
              {intakes.map((x) => <option key={x.id}>{x.client}</option>)}
            </select>
          }>
            Report Builder
          </CardTitle>
          <textarea
            value={notes}
            onChange={(e) => saveNotes(e.target.value)}
            style={{ width: '100%', height: 200, fontFamily: FONTS.mono, fontSize: 11, color: C.ink, background: C.bg, border: `1px solid ${C.stone}`, borderRadius: 4, padding: 12, resize: 'vertical', outline: 'none', lineHeight: 1.7, boxSizing: 'border-box' }}
            placeholder="Write audit notes in Markdown… # H1  ## H2  ### H3  - bullets"
          />
          <p style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted, margin: '8px 0 12px' }}>
            Markdown supported: # H1 &nbsp; ## H2 &nbsp; ### H3 &nbsp; - bullets
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn style={{ flex: 1, fontSize: 11 }}>Preview Note</Btn>
            <Btn variant="gold" onClick={handleExport} disabled={exporting} style={{ flex: 1, fontSize: 11 }}>
              {exporting ? 'Preparing…' : 'Export PDF →'}
            </Btn>
          </div>
        </Card>
      </div>

      {/* New Intake Modal */}
      {addModal && (
        <Modal title="New Client Intake" onClose={() => setAddModal(false)}>
          <MR><FL>Client / Brand Name</FL><FInput value={newIntake.client} onChange={(e) => setNewIntake((n) => ({ ...n, client: e.target.value }))} placeholder="e.g. Atelier Nord" /></MR>
          <MR><FL>Audit Type</FL><FInput value={newIntake.type} onChange={(e) => setNewIntake((n) => ({ ...n, type: e.target.value }))} placeholder="e.g. Full Identity Audit" /></MR>
          <MR>
            <FL>Initial Status</FL>
            <select
              value={newIntake.status}
              onChange={(e) => setNewIntake((n) => ({ ...n, status: e.target.value }))}
              style={{ fontFamily: FONTS.sans, fontSize: 12, border: `1px solid ${C.stone}`, borderRadius: 4, padding: '8px 12px', background: C.bg, color: C.ink, width: '100%' }}
            >
              {['New', 'In Review', 'Scheduled'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </MR>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Btn onClick={() => setAddModal(false)}>Cancel</Btn>
            <Btn variant="gold" onClick={addIntake}>Add Intake</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

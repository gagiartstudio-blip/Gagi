import { useState } from 'react'
import { C, FONTS } from '../lib/theme.js'
import { LS, DEFAULTS } from '../lib/storage.js'
import { SectionTitle, Card, CardTitle, StatusDot, Btn, Tag, FInput, FL, MR, Modal, Toast, useCopy } from './UI.jsx'

export default function RDSection() {
  const [tools,       setTools]       = useState(() => LS.get('rd_tools',   DEFAULTS.rd_tools))
  const [prompts,     setPrompts]     = useState(() => LS.get('rd_prompts', DEFAULTS.rd_prompts))
  const [search,      setSearch]      = useState('')
  const [pinging,     setPinging]     = useState(false)
  const [toolModal,   setToolModal]   = useState(false)
  const [promptModal, setPromptModal] = useState(false)
  const [editToolId,  setEditToolId]  = useState(null)
  const [newTool,     setNewTool]     = useState({ name: '', url: '' })
  const [newPrompt,   setNewPrompt]   = useState({ tag: '', text: '' })
  const [toast,       setToast]       = useState(null)
  const { copy, copied } = useCopy()

  const saveTools   = (v) => { setTools(v);   LS.set('rd_tools',   v) }
  const savePrompts = (v) => { setPrompts(v); LS.set('rd_prompts', v) }

  // Real fetch-based health checks
  const pingAll = async () => {
    setPinging(true)
    const updated = await Promise.all(
      tools.map(async (t) => {
        if (!t.url) return { ...t, status: 'idle', ping: 'No URL' }
        const start = Date.now()
        try {
          await fetch(t.url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(5000) })
          return { ...t, status: 'live', ping: `${Date.now() - start}ms` }
        } catch {
          return { ...t, status: 'down', ping: '—' }
        }
      })
    )
    saveTools(updated)
    setPinging(false)
    setToast('Ping complete')
  }

  const saveTool = () => {
    if (!newTool.name.trim()) return
    if (editToolId) {
      saveTools(tools.map((t) => t.id === editToolId ? { ...t, ...newTool } : t))
    } else {
      saveTools([...tools, { id: Date.now(), ...newTool, status: 'idle', ping: '—' }])
    }
    setNewTool({ name: '', url: '' })
    setToolModal(false)
    setEditToolId(null)
  }

  const savePrompt = () => {
    if (!newPrompt.text.trim()) return
    savePrompts([...prompts, { id: Date.now(), ...newPrompt, score: 0 }])
    setNewPrompt({ tag: '', text: '' })
    setPromptModal(false)
    setToast('Prompt registered')
  }

  const filtered = prompts.filter(
    (p) =>
      p.text.toLowerCase().includes(search.toLowerCase()) ||
      (p.tag || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <SectionTitle title="The Prototype Lab" subtitle="R & D — Experimental workspace" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Component Sandbox */}
        <Card>
          <CardTitle>Component Sandbox</CardTitle>
          <div style={{ background: C.bg, border: `1px solid ${C.stone}`, borderRadius: 6, padding: 24, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="gold" style={{ fontSize: 12 }}>Gold CTA</Btn>
              <button style={{ background: C.forest, color: '#fff', border: 'none', borderRadius: 4, padding: '9px 20px', fontFamily: FONTS.sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer' }}>
                Forest CTA
              </button>
              <Btn style={{ fontSize: 12 }}>Ghost CTA</Btn>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Editorial', 'Minimal', 'Authority', 'Live'].map((t) => (
                <span key={t} style={{ padding: '4px 12px', border: `1px solid ${C.stone}`, borderRadius: 20, fontFamily: FONTS.sans, fontSize: 10, color: C.muted, letterSpacing: '0.06em' }}>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {['live', 'warn', 'down'].map((s) => (
                <span key={s} style={{ display: 'flex', alignItems: 'center', fontFamily: FONTS.sans, fontSize: 12, color: C.muted }}>
                  <StatusDot status={s} />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              ))}
            </div>
            <p style={{ fontFamily: FONTS.serif, fontSize: 15, fontStyle: 'italic', color: C.ink, margin: 0, letterSpacing: '0.04em' }}>
              — Playfair Display, 400 —
            </p>
          </div>
        </Card>

        {/* Tech Stack Status */}
        <Card>
          <CardTitle action={
            <>
              <Btn
                onClick={() => { setEditToolId(null); setNewTool({ name: '', url: '' }); setToolModal(true) }}
                style={{ fontSize: 10, padding: '5px 10px' }}
              >
                + Add
              </Btn>
              <Btn onClick={pingAll} disabled={pinging} style={{ fontSize: 10, padding: '5px 10px' }}>
                {pinging ? 'Pinging…' : 'Ping All'}
              </Btn>
            </>
          }>
            Tech Stack Status
          </CardTitle>
          {tools.map((t, i) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', padding: '9px 0', borderBottom: i < tools.length - 1 ? `1px solid ${C.stone}` : 'none' }}>
              <StatusDot status={pinging ? 'pinging' : t.status} />
              <span style={{ flex: 1, fontFamily: FONTS.sans, fontSize: 13, color: C.ink }}>{t.name}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted, marginRight: 10 }}>{t.ping}</span>
              <Tag color={t.status === 'live' ? 'forest' : t.status === 'down' ? 'danger' : 'stone'}>{t.status}</Tag>
              <button
                onClick={() => { setEditToolId(t.id); setNewTool({ name: t.name, url: t.url || '' }); setToolModal(true) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 12, marginLeft: 8 }}
              >✎</button>
              <button
                onClick={() => saveTools(tools.filter((x) => x.id !== t.id))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 15, marginLeft: 4 }}
              >×</button>
            </div>
          ))}
        </Card>
      </div>

      {/* Prompt Registry */}
      <Card>
        <CardTitle action={
          <>
            <FInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search prompts…" style={{ width: 200 }} />
            <Btn variant="gold" onClick={() => setPromptModal(true)} style={{ fontSize: 11, padding: '8px 14px' }}>+ Register</Btn>
          </>
        }>
          AI Prompt Registry
        </CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filtered.map((p) => (
            <div key={p.id} style={{ padding: 16, background: C.bg, borderRadius: 6, border: `1px solid ${C.stone}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                <Tag color="forest">{p.tag || 'General'}</Tag>
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted }}>score: {p.score}</span>
              </div>
              <p style={{ fontFamily: FONTS.mono, fontSize: 11, color: C.ink, margin: 0, lineHeight: 1.65 }}>{p.text}</p>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <Btn onClick={() => { copy(p.text, p.id); setToast('Prompt copied') }} style={{ fontSize: 10, padding: '5px 10px' }}>
                  {copied === p.id ? 'Copied ✓' : 'Copy →'}
                </Btn>
                <button
                  onClick={() => savePrompts(prompts.filter((x) => x.id !== p.id))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 12 }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.muted, gridColumn: '1/-1', textAlign: 'center', padding: '24px 0' }}>
              No prompts match your search.
            </p>
          )}
        </div>
      </Card>

      {/* Tool Modal */}
      {toolModal && (
        <Modal title={editToolId ? 'Edit Tool' : 'Add Tool'} onClose={() => { setToolModal(false); setEditToolId(null) }}>
          <MR><FL>Tool Name</FL><FInput value={newTool.name} onChange={(e) => setNewTool((n) => ({ ...n, name: e.target.value }))} placeholder="e.g. Vercel API" /></MR>
          <MR><FL>Health Check URL (optional)</FL><FInput value={newTool.url} onChange={(e) => setNewTool((n) => ({ ...n, url: e.target.value }))} placeholder="https://…" /></MR>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Btn onClick={() => { setToolModal(false); setEditToolId(null) }}>Cancel</Btn>
            <Btn variant="gold" onClick={saveTool}>{editToolId ? 'Update' : 'Add Tool'}</Btn>
          </div>
        </Modal>
      )}

      {/* Prompt Modal */}
      {promptModal && (
        <Modal title="Register Prompt" onClose={() => setPromptModal(false)}>
          <MR><FL>Tag / Category</FL><FInput value={newPrompt.tag} onChange={(e) => setNewPrompt((n) => ({ ...n, tag: e.target.value }))} placeholder="e.g. Branding" /></MR>
          <MR>
            <FL>Prompt Text</FL>
            <textarea
              value={newPrompt.text}
              onChange={(e) => setNewPrompt((n) => ({ ...n, text: e.target.value }))}
              placeholder="Enter your prompt…"
              style={{ fontFamily: FONTS.mono, fontSize: 11, padding: 12, border: `1px solid ${C.stone}`, borderRadius: 4, background: C.bg, color: C.ink, width: '100%', minHeight: 100, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
          </MR>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Btn variant="gold" onClick={savePrompt}>Register Prompt</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

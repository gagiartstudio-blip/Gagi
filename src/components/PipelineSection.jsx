import { useState } from 'react'
import { C, FONTS } from '../lib/theme.js'
import { LS, DEFAULTS } from '../lib/storage.js'
import { SectionTitle, Card, CardTitle, Btn, Tag, FInput, FL, MR, Modal, Toast, useCopy } from './UI.jsx'

export default function PipelineSection() {
  const [qa,      setQA]      = useState(() => LS.get('pipeline_qa',      DEFAULTS.pipeline_qa))
  const [commits, setCommits] = useState(() => LS.get('pipeline_commits', DEFAULTS.pipeline_commits))
  const [cdn,     setCDN]     = useState(() => LS.get('pipeline_cdn',     DEFAULTS.pipeline_cdn))
  const [toast,   setToast]   = useState(null)
  const [qaModal,     setQAModal]     = useState(false)
  const [cdnModal,    setCDNModal]    = useState(false)
  const [commitModal, setCommitModal] = useState(false)
  const [newQA,     setNewQA]     = useState('')
  const [newCDN,    setNewCDN]    = useState({ name: '', url: '' })
  const [newCommit, setNewCommit] = useState({ message: '', branch: 'main' })
  const { copy, copied } = useCopy()

  const saveQA      = (v) => { setQA(v);      LS.set('pipeline_qa',      v) }
  const saveCommits = (v) => { setCommits(v); LS.set('pipeline_commits', v) }
  const saveCDN     = (v) => { setCDN(v);     LS.set('pipeline_cdn',     v) }

  const toggle  = (id) => saveQA(qa.map((i) => i.id === id ? { ...i, done: !i.done } : i))
  const done    = qa.filter((i) => i.done).length
  const allDone = done === qa.length && qa.length > 0

  const addQAItem = () => {
    if (!newQA.trim()) return
    saveQA([...qa, { id: Date.now(), label: newQA, done: false }])
    setNewQA('')
    setQAModal(false)
  }

  const addCDN = () => {
    if (!newCDN.name.trim() || !newCDN.url.trim()) return
    saveCDN([...cdn, { id: Date.now(), ...newCDN }])
    setNewCDN({ name: '', url: '' })
    setCDNModal(false)
    setToast('CDN link added')
  }

  const addCommit = () => {
    if (!newCommit.message.trim()) return
    const hash = Math.random().toString(16).slice(2, 9)
    saveCommits([{ id: Date.now(), hash, ...newCommit, time: 'Just now' }, ...commits])
    setNewCommit({ message: '', branch: 'main' })
    setCommitModal(false)
    setToast('Commit logged')
  }

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <SectionTitle title="The Factory" subtitle="Production & Asset Pipeline — Version control and distribution" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Version Control Feed */}
        <Card>
          <CardTitle action={
            <Btn onClick={() => setCommitModal(true)} style={{ fontSize: 10, padding: '5px 10px' }}>+ Log Commit</Btn>
          }>
            Version Control Feed
          </CardTitle>
          {commits.map((c, i) => (
            <div key={c.id} style={{ padding: '11px 0', borderBottom: i < commits.length - 1 ? `1px solid ${C.stone}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.forest, background: C.forestLight, padding: '2px 7px', borderRadius: 3 }}>
                  {c.hash}
                </span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted }}>{c.branch}</span>
                <span style={{ marginLeft: 'auto', fontFamily: FONTS.mono, fontSize: 10, color: C.muted }}>{c.time}</span>
                <button
                  onClick={() => saveCommits(commits.filter((x) => x.id !== c.id))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 14 }}
                >×</button>
              </div>
              <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.ink, margin: 0 }}>{c.message}</p>
            </div>
          ))}
        </Card>

        {/* QA Checklist */}
        <Card>
          <CardTitle action={
            <>
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: allDone ? C.forest : C.muted }}>{done}/{qa.length}</span>
              <Btn onClick={() => setQAModal(true)} style={{ fontSize: 10, padding: '5px 10px' }}>+ Add</Btn>
            </>
          }>
            QA Checklist
          </CardTitle>
          {/* Progress bar */}
          <div style={{ marginBottom: 14, height: 3, background: C.stone, borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${qa.length ? (done / qa.length) * 100 : 0}%`, background: C.forest, borderRadius: 2, transition: 'width 300ms ease-in-out' }} />
          </div>
          {qa.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `1px solid ${C.stone}` }}>
              <div
                onClick={() => toggle(item.id)}
                style={{ width: 15, height: 15, border: `1px solid ${item.done ? C.forest : C.stone}`, borderRadius: 3, background: item.done ? C.forest : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all 200ms' }}
              >
                {item.done && <span style={{ color: '#fff', fontSize: 9, fontWeight: 700, lineHeight: 1 }}>✓</span>}
              </div>
              <span
                onClick={() => toggle(item.id)}
                style={{ flex: 1, fontFamily: FONTS.sans, fontSize: 12, color: item.done ? C.muted : C.ink, textDecoration: item.done ? 'line-through' : 'none', cursor: 'pointer' }}
              >
                {item.label}
              </span>
              <button
                onClick={() => saveQA(qa.filter((x) => x.id !== item.id))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 14 }}
              >×</button>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <Btn
              variant="gold"
              disabled={!allDone}
              onClick={() => setToast('Project marked as Done ✓')}
              style={{ width: '100%', fontSize: 11 }}
            >
              {allDone ? 'Mark Project Done ✓' : `Complete ${qa.length - done} remaining item${qa.length - done !== 1 ? 's' : ''}`}
            </Btn>
          </div>
        </Card>
      </div>

      {/* CDN Links */}
      <Card>
        <CardTitle action={
          <Btn onClick={() => setCDNModal(true)} style={{ fontSize: 10, padding: '5px 10px' }}>+ Add Link</Btn>
        }>
          Asset CDN Links
        </CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {cdn.map((link) => (
            <div key={link.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', background: C.bg, borderRadius: 6, border: `1px solid ${C.stone}`, gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 500, color: C.ink, margin: 0 }}>{link.name}</p>
                <p style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted, margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</p>
              </div>
              <Btn
                onClick={() => { copy(link.url, link.id); setToast('URL copied to clipboard') }}
                style={{ fontSize: 10, padding: '5px 10px', flexShrink: 0 }}
              >
                {copied === link.id ? 'Copied ✓' : 'Copy'}
              </Btn>
              <button
                onClick={() => saveCDN(cdn.filter((x) => x.id !== link.id))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 15 }}
              >×</button>
            </div>
          ))}
        </div>
      </Card>

      {/* Modals */}
      {qaModal && (
        <Modal title="Add QA Item" onClose={() => setQAModal(false)}>
          <MR><FL>Requirement</FL><FInput value={newQA} onChange={(e) => setNewQA(e.target.value)} placeholder="e.g. Check dark mode variants" /></MR>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Btn onClick={() => setQAModal(false)}>Cancel</Btn>
            <Btn variant="gold" onClick={addQAItem}>Add Item</Btn>
          </div>
        </Modal>
      )}
      {cdnModal && (
        <Modal title="Add CDN Link" onClose={() => setCDNModal(false)}>
          <MR><FL>Asset Name</FL><FInput value={newCDN.name} onChange={(e) => setNewCDN((n) => ({ ...n, name: e.target.value }))} placeholder="e.g. Logo Dark — SVG" /></MR>
          <MR><FL>URL</FL><FInput value={newCDN.url} onChange={(e) => setNewCDN((n) => ({ ...n, url: e.target.value }))} placeholder="https://cdn.yourbrand.io/…" /></MR>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Btn onClick={() => setCDNModal(false)}>Cancel</Btn>
            <Btn variant="gold" onClick={addCDN}>Add Link</Btn>
          </div>
        </Modal>
      )}
      {commitModal && (
        <Modal title="Log Commit" onClose={() => setCommitModal(false)}>
          <MR><FL>Commit Message</FL><FInput value={newCommit.message} onChange={(e) => setNewCommit((n) => ({ ...n, message: e.target.value }))} placeholder="e.g. Update brand mark — v3 refinement" /></MR>
          <MR><FL>Branch</FL><FInput value={newCommit.branch} onChange={(e) => setNewCommit((n) => ({ ...n, branch: e.target.value }))} placeholder="main" /></MR>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Btn onClick={() => setCommitModal(false)}>Cancel</Btn>
            <Btn variant="gold" onClick={addCommit}>Log Commit</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

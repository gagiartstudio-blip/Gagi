import { useState } from 'react'
import { C, FONTS } from '../lib/theme.js'
import { LS, DEFAULTS } from '../lib/storage.js'
import { SectionTitle, Card, CardTitle, Btn, Tag, FInput, FL, MR, Modal, Toast } from './UI.jsx'

export default function AcademySection() {
  const [modules,  setModules]  = useState(() => LS.get('academy_modules',  DEFAULTS.academy_modules))
  const [sessions, setSessions] = useState(() => LS.get('academy_sessions', DEFAULTS.academy_sessions))
  const [students, setStudents] = useState(() => LS.get('academy_students', DEFAULTS.academy_students))
  const [dragging, setDragging] = useState(null)
  const [toast,    setToast]    = useState(null)
  const [modModal,  setModModal]  = useState(false)
  const [sessModal, setSessModal] = useState(false)
  const [studModal, setStudModal] = useState(false)
  const [editModId, setEditModId] = useState(null)
  const [newMod,  setNewMod]  = useState({ title: '', lessons: 4, status: 'Draft' })
  const [newSess, setNewSess] = useState({ client: '', type: '', date: '', link: '' })
  const [newStud, setNewStud] = useState({ name: '', pack: '' })

  const saveMods  = (v) => { setModules(v);  LS.set('academy_modules',  v) }
  const saveSess  = (v) => { setSessions(v); LS.set('academy_sessions', v) }
  const saveStuds = (v) => { setStudents(v); LS.set('academy_students', v) }

  // Drag-and-drop reorder
  const handleDragStart = (id) => setDragging(id)
  const handleDragOver  = (e, id) => {
    e.preventDefault()
    if (!dragging || dragging === id) return
    const from = modules.findIndex((m) => m.id === dragging)
    const to   = modules.findIndex((m) => m.id === id)
    const arr  = [...modules]
    const [moved] = arr.splice(from, 1)
    arr.splice(to, 0, moved)
    saveMods(arr)
  }

  const saveMod = () => {
    if (!newMod.title.trim()) return
    if (editModId) {
      saveMods(modules.map((m) => m.id === editModId ? { ...m, ...newMod } : m))
    } else {
      saveMods([...modules, { id: Date.now(), ...newMod }])
    }
    setNewMod({ title: '', lessons: 4, status: 'Draft' })
    setModModal(false)
    setEditModId(null)
    setToast(editModId ? 'Module updated' : 'Module added')
  }

  const addSess = () => {
    if (!newSess.client.trim()) return
    saveSess([...sessions, { id: Date.now(), ...newSess }])
    setNewSess({ client: '', type: '', date: '', link: '' })
    setSessModal(false)
    setToast('Session added')
  }

  const addStud = () => {
    if (!newStud.name.trim()) return
    saveStuds([{ id: Date.now(), ...newStud, accessed: 'Today' }, ...students])
    setNewStud({ name: '', pack: '' })
    setStudModal(false)
    setToast('Student record added')
  }

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <SectionTitle title="The Education Portal" subtitle="Academy & Knowledge — Teaching materials and course logic" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Syllabus Manager */}
        <Card>
          <CardTitle action={
            <Btn
              onClick={() => { setEditModId(null); setNewMod({ title: '', lessons: 4, status: 'Draft' }); setModModal(true) }}
              style={{ fontSize: 10, padding: '5px 10px' }}
            >
              + Add Module
            </Btn>
          }>
            Syllabus Manager — drag to reorder
          </CardTitle>
          {modules.map((m, i) => (
            <div
              key={m.id}
              draggable
              onDragStart={() => handleDragStart(m.id)}
              onDragOver={(e) => handleDragOver(e, m.id)}
              onDragEnd={() => setDragging(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: dragging === m.id ? C.forestLight : C.bg, border: `1px solid ${dragging === m.id ? C.forestBorder : C.stone}`, borderRadius: 5, marginBottom: 8, cursor: 'grab', transition: 'background 200ms, border-color 200ms', userSelect: 'none' }}
            >
              <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: C.muted }}>⠿</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted, width: 18 }}>0{i + 1}</span>
              <span style={{ flex: 1, fontFamily: FONTS.sans, fontSize: 13, color: C.ink }}>{m.title}</span>
              <span style={{ fontFamily: FONTS.sans, fontSize: 10, color: C.muted }}>{m.lessons} lessons</span>
              <Tag color={m.status === 'Published' ? 'forest' : 'stone'}>{m.status}</Tag>
              <button
                onClick={() => { setEditModId(m.id); setNewMod({ title: m.title, lessons: m.lessons, status: m.status }); setModModal(true) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 12 }}
              >✎</button>
              <button
                onClick={() => saveMods(modules.filter((x) => x.id !== m.id))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 15 }}
              >×</button>
            </div>
          ))}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Live Session Tracker */}
          <Card>
            <CardTitle action={
              <Btn onClick={() => setSessModal(true)} style={{ fontSize: 10, padding: '5px 10px' }}>+ Add Session</Btn>
            }>
              Live Session Tracker
            </CardTitle>
            {sessions.length === 0 && (
              <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.muted }}>No upcoming sessions.</p>
            )}
            {sessions.map((s, i) => (
              <div key={s.id} style={{ padding: '12px 0', borderBottom: i < sessions.length - 1 ? `1px solid ${C.stone}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontFamily: FONTS.sans, fontSize: 13, fontWeight: 500, color: C.ink, margin: 0 }}>{s.client}</p>
                    <p style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.muted, margin: '2px 0 4px' }}>{s.type}</p>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: C.gold }}>{s.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {s.link
                      ? <a href={s.link} target="_blank" rel="noreferrer" style={{ fontFamily: FONTS.sans, fontSize: 11, color: C.forest, textDecoration: 'none', border: `1px solid ${C.stone}`, borderRadius: 4, padding: '6px 12px' }}>Join →</a>
                      : <span style={{ fontFamily: FONTS.sans, fontSize: 11, color: C.muted }}>No link set</span>
                    }
                    <button
                      onClick={() => saveSess(sessions.filter((x) => x.id !== s.id))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 15 }}
                    >×</button>
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {/* Material Distribution */}
          <Card>
            <CardTitle action={
              <Btn onClick={() => setStudModal(true)} style={{ fontSize: 10, padding: '5px 10px' }}>+ Add Student</Btn>
            }>
              Material Distribution
            </CardTitle>
            {students.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < students.length - 1 ? `1px solid ${C.stone}` : 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.bg, border: `1px solid ${C.stone}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.serif, fontSize: 12, color: C.ink, flexShrink: 0 }}>
                  {s.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 500, color: C.ink, margin: 0 }}>{s.name}</p>
                  <p style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.muted, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.pack}</p>
                </div>
                <span style={{ fontFamily: FONTS.sans, fontSize: 10, color: C.muted, flexShrink: 0 }}>{s.accessed}</span>
                <button
                  onClick={() => saveStuds(students.filter((x) => x.id !== s.id))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 15 }}
                >×</button>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Module Modal */}
      {modModal && (
        <Modal title={editModId ? 'Edit Module' : 'Add Course Module'} onClose={() => { setModModal(false); setEditModId(null) }}>
          <MR><FL>Module Title</FL><FInput value={newMod.title} onChange={(e) => setNewMod((n) => ({ ...n, title: e.target.value }))} placeholder="e.g. Brand Voice & Tone" /></MR>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <FL>Lessons</FL>
              <FInput type="number" value={newMod.lessons} onChange={(e) => setNewMod((n) => ({ ...n, lessons: parseInt(e.target.value) || 1 }))} placeholder="6" />
            </div>
            <div>
              <FL>Status</FL>
              <select
                value={newMod.status}
                onChange={(e) => setNewMod((n) => ({ ...n, status: e.target.value }))}
                style={{ fontFamily: FONTS.sans, fontSize: 12, border: `1px solid ${C.stone}`, borderRadius: 4, padding: '8px 12px', background: C.bg, color: C.ink, width: '100%' }}
              >
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Btn onClick={() => { setModModal(false); setEditModId(null) }}>Cancel</Btn>
            <Btn variant="gold" onClick={saveMod}>{editModId ? 'Update Module' : 'Add Module'}</Btn>
          </div>
        </Modal>
      )}

      {/* Session Modal */}
      {sessModal && (
        <Modal title="Add Live Session" onClose={() => setSessModal(false)}>
          <MR><FL>Client Name</FL><FInput value={newSess.client} onChange={(e) => setNewSess((n) => ({ ...n, client: e.target.value }))} placeholder="e.g. Atelier Nord" /></MR>
          <MR><FL>Session Type</FL><FInput value={newSess.type} onChange={(e) => setNewSess((n) => ({ ...n, type: e.target.value }))} placeholder="e.g. 1:1 Brand Workshop" /></MR>
          <MR><FL>Date & Time</FL><FInput value={newSess.date} onChange={(e) => setNewSess((n) => ({ ...n, date: e.target.value }))} placeholder="e.g. Tomorrow, 14:00" /></MR>
          <MR><FL>Meeting Link</FL><FInput value={newSess.link} onChange={(e) => setNewSess((n) => ({ ...n, link: e.target.value }))} placeholder="https://meet.google.com/…" /></MR>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Btn onClick={() => setSessModal(false)}>Cancel</Btn>
            <Btn variant="gold" onClick={addSess}>Add Session</Btn>
          </div>
        </Modal>
      )}

      {/* Student Modal */}
      {studModal && (
        <Modal title="Add Student Record" onClose={() => setStudModal(false)}>
          <MR><FL>Student Name</FL><FInput value={newStud.name} onChange={(e) => setNewStud((n) => ({ ...n, name: e.target.value }))} placeholder="e.g. J. Moreau" /></MR>
          <MR><FL>Resource Pack</FL><FInput value={newStud.pack} onChange={(e) => setNewStud((n) => ({ ...n, pack: e.target.value }))} placeholder="e.g. Color Workbook" /></MR>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Btn onClick={() => setStudModal(false)}>Cancel</Btn>
            <Btn variant="gold" onClick={addStud}>Add Student</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

import { useState } from 'react'
import { C } from './lib/theme.js'
import Sidebar          from './components/Sidebar.jsx'
import CommandCenter    from './components/CommandCenter.jsx'
import RDSection        from './components/RDSection.jsx'
import AuditSection     from './components/AuditSection.jsx'
import PipelineSection  from './components/PipelineSection.jsx'
import AcademySection   from './components/AcademySection.jsx'

export default function App() {
  const [active, setActive] = useState('home')

  const sections = {
    home:     <CommandCenter onNav={setActive} />,
    rd:       <RDSection />,
    audit:    <AuditSection />,
    pipeline: <PipelineSection />,
    academy:  <AcademySection />,
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.bg, minHeight: '100vh' }}>
      <Sidebar active={active} onNav={setActive} />
      <main style={{ marginLeft: 220, padding: '48px 48px 80px', minHeight: '100vh' }}>
        {sections[active]}
      </main>
    </div>
  )
}

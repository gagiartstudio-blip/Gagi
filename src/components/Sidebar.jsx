import { useState } from 'react'
import { C, FONTS, NAV } from '../lib/theme.js'

export default function Sidebar({ active, onNav }) {
  return (
    <div style={{
      width: 220, background: C.sidebar,
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ padding: '32px 24px 24px' }}>
        <p style={{ fontFamily: FONTS.serif, fontSize: 18, fontWeight: 400, color: '#FFFFFF', margin: 0, letterSpacing: '0.04em' }}>
          Studio OS
        </p>
        <p style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.sidebarText, margin: '4px 0 0', letterSpacing: '0.1em', opacity: 0.6 }}>
          BRAND DASHBOARD v1
        </p>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 24px' }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {NAV.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={active === item.id}
            onClick={() => onNav(item.id)}
          />
        ))}
      </nav>

      <div style={{ padding: '0 24px 28px' }}>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 20 }} />
        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: C.gold,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONTS.serif, fontSize: 13, color: C.ink, fontWeight: 600, flexShrink: 0,
          }}>
            S
          </div>
          <div>
            <p style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 500, color: '#FFFFFF', margin: 0 }}>
              Studio Principal
            </p>
            <p style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.sidebarText, margin: 0, opacity: 0.7 }}>
              Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavItem({ item, isActive, onClick }) {
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: '12px 24px',
        background: isActive ? C.sidebarActive : hover ? C.sidebarHover : 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        transition: 'background 200ms',
        borderLeft: isActive ? `2px solid ${C.gold}` : '2px solid transparent',
      }}
    >
      <span style={{ fontSize: 14, color: isActive ? '#FFFFFF' : C.sidebarText, width: 18, lineHeight: 1 }}>
        {item.icon}
      </span>
      <span style={{ fontFamily: FONTS.sans, fontSize: 13, fontWeight: isActive ? 500 : 400, color: isActive ? '#FFFFFF' : C.sidebarText, letterSpacing: '0.03em' }}>
        {item.label}
      </span>
    </button>
  )
}

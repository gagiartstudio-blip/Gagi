import { useState, useEffect, useCallback } from 'react'
import { C, FONTS } from '../lib/theme.js'

// ─── Section Title ────────────────────────────────────────────────────────────
export function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h1 style={{ fontFamily: FONTS.serif, fontSize: 30, fontWeight: 400, letterSpacing: '0.04em', color: C.ink, margin: 0, lineHeight: 1.2 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontFamily: FONTS.sans, fontSize: 11, color: C.muted, margin: '6px 0 0', letterSpacing: '0.09em', textTransform: 'uppercase' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style = {}, padding = '24px' }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.stone}`, borderRadius: 8, padding, ...style }}>
      {children}
    </div>
  )
}

// ─── Card Title ───────────────────────────────────────────────────────────────
export function CardTitle({ children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <p style={{ fontFamily: FONTS.sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>
        {children}
      </p>
      {action && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{action}</div>
      )}
    </div>
  )
}

// ─── Status Dot ──────────────────────────────────────────────────────────────
export function StatusDot({ status }) {
  const colors = { live: C.forest, warn: C.gold, down: C.danger, idle: '#BBBBBB', pinging: C.gold }
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
      background: colors[status] || '#bbb', marginRight: 8, flexShrink: 0,
      transition: 'background 400ms',
    }} />
  )
}

// ─── Button ──────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'ghost', style = {}, disabled = false, title }) {
  const [hover, setHover] = useState(false)
  const base = {
    fontFamily: FONTS.sans, fontSize: 12, border: 'none', borderRadius: 4,
    padding: '9px 18px', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, transition: 'all 200ms ease-in-out', ...style,
  }

  if (variant === 'gold') {
    return (
      <button
        title={title}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
        disabled={disabled}
        style={{ ...base, background: C.gold, color: C.ink, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: disabled ? 0.4 : hover ? 0.82 : 1 }}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, background: hover ? C.bg : 'transparent', color: C.ink, border: `1px solid ${C.stone}` }}
    >
      {children}
    </button>
  )
}

// ─── Tag / Badge ──────────────────────────────────────────────────────────────
export function Tag({ children, color = 'stone' }) {
  const variants = {
    stone:  { bg: C.bg,         col: C.muted,   br: C.stone        },
    forest: { bg: C.forestLight, col: C.forest,  br: C.forestBorder },
    gold:   { bg: C.warnBg,     col: C.warn,    br: C.warnBorder   },
    danger: { bg: C.dangerBg,   col: C.danger,  br: C.dangerBorder },
  }
  const s = variants[color] || variants.stone
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px', borderRadius: 3,
      fontFamily: FONTS.sans, fontSize: 10, fontWeight: 600,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      background: s.bg, color: s.col, border: `1px solid ${s.br}`,
    }}>
      {children}
    </span>
  )
}

// ─── Form Input ───────────────────────────────────────────────────────────────
export function FInput({ value, onChange, placeholder, style = {}, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        fontFamily: FONTS.sans, fontSize: 12, padding: '8px 12px',
        border: `1px solid ${C.stone}`, borderRadius: 4,
        background: C.bg, outline: 'none', color: C.ink,
        width: '100%', boxSizing: 'border-box', ...style,
      }}
    />
  )
}

// ─── Form Label ───────────────────────────────────────────────────────────────
export function FL({ children }) {
  return (
    <label style={{ fontFamily: FONTS.sans, fontSize: 11, color: C.muted, display: 'block', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {children}
    </label>
  )
}

// ─── Form Row (margin wrapper) ────────────────────────────────────────────────
export function MR({ children }) {
  return <div style={{ marginBottom: 14 }}>{children}</div>
}

// ─── Toast Notification ───────────────────────────────────────────────────────
export function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: C.ink, color: '#fff', fontFamily: FONTS.sans, fontSize: 13,
      padding: '12px 22px', borderRadius: 6,
      animation: 'toastIn 200ms ease-out',
    }}>
      <style>{`@keyframes toastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      {msg}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, maxWidth = 540 }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(26,26,26,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.stone}`, width: '100%', maxWidth, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: `1px solid ${C.stone}` }}>
          <p style={{ fontFamily: FONTS.serif, fontSize: 18, fontWeight: 400, color: C.ink, margin: 0 }}>{title}</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: C.muted, lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Clipboard Hook ───────────────────────────────────────────────────────────
export function useCopy() {
  const [copied, setCopied] = useState(null)

  const copy = useCallback((text, id) => {
    const done = () => {
      setCopied(id)
      setTimeout(() => setCopied(null), 1800)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done)
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      done()
    }
  }, [])

  return { copy, copied }
}

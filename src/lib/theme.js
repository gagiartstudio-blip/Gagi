// ─── Color Palette: "The Modern Atelier" ────────────────────────────────────
export const C = {
  // Backgrounds
  bg:            '#F9F8F6', // Gallery White — primary background
  surface:       '#FFFFFF', // Pure Paper — cards, active sections

  // Text
  ink:           '#1A1A1A', // Ink Black — primary text
  muted:         '#666666', // Technical accents, secondary text

  // Accent
  forest:        '#4A5D4E', // Muted Forest — live indicators, progress
  forestLight:   '#EEF3EF',
  forestBorder:  '#B8CCBA',

  // Neutral
  stone:         '#E5E5E1', // Stone — borders, dividers (1px only)

  // CTA
  gold:          '#D4AF37', // Champagne Gold — primary buttons, authority
  goldLight:     '#FDF6DC',

  // Semantic
  warn:          '#b08000',
  warnBg:        '#FFF8E6',
  warnBorder:    '#E5D59A',
  danger:        '#B04040',
  dangerBg:      '#FDF0F0',
  dangerBorder:  '#E5BABA',

  // Sidebar
  sidebar:       '#2A3530',
  sidebarHover:  '#323F38',
  sidebarActive: '#3A4A3E',
  sidebarText:   '#C8D4CA',
}

// ─── Typography ──────────────────────────────────────────────────────────────
export const FONTS = {
  serif: "'Playfair Display', serif",   // Section titles, major headings
  sans:  "'Inter', sans-serif",         // UI, data tables, buttons, nav
  mono:  "'JetBrains Mono', monospace", // Prompts, hex codes, version numbers
}

// ─── Nav Items ────────────────────────────────────────────────────────────────
export const NAV = [
  { id: 'home',     icon: '⌂', label: 'Command'  },
  { id: 'rd',       icon: '⬡', label: 'R & D'    },
  { id: 'audit',    icon: '◈', label: 'Audit'     },
  { id: 'pipeline', icon: '⬗', label: 'Pipeline' },
  { id: 'academy',  icon: '◉', label: 'Academy'  },
]

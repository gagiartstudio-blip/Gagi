// ─── localStorage helpers ─────────────────────────────────────────────────────
export const LS = {
  get: (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      console.warn('localStorage write failed:', key)
    }
  },
}

// ─── Export all data to a JSON file ──────────────────────────────────────────
export function exportAllData() {
  const keys = [
    'rd_tools', 'rd_prompts',
    'audit_intakes', 'audit_notes',
    'pipeline_qa', 'pipeline_commits', 'pipeline_cdn',
    'academy_modules', 'academy_sessions', 'academy_students',
  ]
  const data = {}
  keys.forEach(k => {
    const v = localStorage.getItem(k)
    if (v) data[k] = JSON.parse(v)
  })
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `studio-os-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Import data from a JSON backup file ─────────────────────────────────────
export function importAllData(file, onDone) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)))
      onDone(true)
    } catch {
      onDone(false)
    }
  }
  reader.readAsText(file)
}

// ─── Default data seeds ───────────────────────────────────────────────────────
export const DEFAULTS = {
  rd_tools: [
    { id: 1, name: 'GitHub Actions',     url: 'https://www.githubstatus.com/api/v2/status.json', status: 'idle', ping: '—' },
    { id: 2, name: 'Figma API',          url: 'https://www.figmastatus.com/api/v2/status.json',  status: 'idle', ping: '—' },
    { id: 3, name: 'Automation Scripts', url: '',                                                  status: 'idle', ping: '—' },
    { id: 4, name: 'CDN Provider',       url: 'https://cloudflare-dns.com/dns-query',             status: 'idle', ping: '—' },
    { id: 5, name: 'AI Design API',      url: 'https://api.anthropic.com',                        status: 'idle', ping: '—' },
    { id: 6, name: 'Deploy Preview',     url: '',                                                  status: 'idle', ping: '—' },
  ],
  rd_prompts: [
    { id: 1, tag: 'Logo',   score: 94, text: 'Generate a wordmark using only negative space and geometric form. Avoid ornamentation.' },
    { id: 2, tag: 'Layout', score: 89, text: 'Design a grid that breathes — 8-column, 12pt baseline, no element touching the edge.' },
    { id: 3, tag: 'Color',  score: 87, text: 'Extract a 5-tone palette from this image. Return as hex codes. No pastels.' },
    { id: 4, tag: 'Copy',   score: 82, text: 'Write three tagline variants. Tone: quiet authority. Max 5 words each.' },
  ],
  audit_intakes: [
    { id: 1, client: 'Maison Vérité',   type: 'Full Identity Audit',      received: 'Today, 09:14', status: 'New'       },
    { id: 2, client: 'Studio Brun',     type: 'Competitor Analysis',       received: 'Yesterday',    status: 'In Review' },
    { id: 3, client: 'Arca Collective', type: 'Brand Guidelines Review',   received: '3 days ago',   status: 'Scheduled' },
  ],
  audit_notes: '## Brand Audit — Maison Vérité\n\n### Current State\n- Wordmark lacks hierarchy at small sizes\n- Color palette: 14 colors, no anchor tone\n\n### Proposed Direction\n- Reduce to 5-tone palette\n- Single geometric mark, no descriptor\n- Editorial type system: Garamond + Grotesk\n',
  pipeline_qa: [
    { id: 1, label: 'SVG files optimized (SVGO)',             done: true  },
    { id: 2, label: 'Naming: brand-asset_v{n}.svg',           done: true  },
    { id: 3, label: 'Color profiles: sRGB only',              done: false },
    { id: 4, label: 'Font curves outlined',                   done: false },
    { id: 5, label: 'Export at 1×, 2×, 3× resolution',       done: false },
    { id: 6, label: 'CDN link verified & accessible',         done: false },
  ],
  pipeline_commits: [
    { id: 1, hash: 'a3f8c12', message: 'Add Maison Vérité lockup — v2 iteration', time: '12m ago',   branch: 'main'          },
    { id: 2, hash: 'b91e445', message: 'Update color token file — stone revised',  time: '2h ago',    branch: 'design/tokens' },
    { id: 3, hash: 'cc0d391', message: 'Export brand icons pack — 48 variants',    time: 'Yesterday', branch: 'main'          },
  ],
  pipeline_cdn: [
    { id: 1, name: 'Logo — SVG',        url: 'https://cdn.yourbrand.io/assets/logo.svg'          },
    { id: 2, name: 'Icon Pack — ZIP',   url: 'https://cdn.yourbrand.io/assets/icons-v3.zip'      },
    { id: 3, name: 'Type Specimen',     url: 'https://cdn.yourbrand.io/assets/type-specimen.pdf' },
    { id: 4, name: 'Brand Guide — PDF', url: 'https://cdn.yourbrand.io/assets/brand-guide.pdf'   },
  ],
  academy_modules: [
    { id: 1, title: 'Brand Foundations',      lessons: 6, status: 'Published' },
    { id: 2, title: 'Color Theory & Systems', lessons: 8, status: 'Published' },
    { id: 3, title: 'Typography Mastery',     lessons: 5, status: 'Draft'     },
    { id: 4, title: 'Identity in Motion',     lessons: 4, status: 'Draft'     },
  ],
  academy_sessions: [
    { id: 1, client: 'Studio Brun',     type: '1:1 Brand Workshop',    date: 'Tomorrow, 14:00', link: '' },
    { id: 2, client: 'Arca Collective', type: 'Color Strategy Session', date: 'Fri, 11:00',      link: '' },
  ],
  academy_students: [
    { id: 1, name: 'M. Laurent',  pack: 'Brand Foundations Kit', accessed: 'Today'      },
    { id: 2, name: 'R. Osei',     pack: 'Type System Pack',      accessed: 'Yesterday'  },
    { id: 3, name: 'S. Nakamura', pack: 'Color Workbook',        accessed: '3 days ago' },
    { id: 4, name: 'A. Moreau',   pack: 'Full Course Bundle',    accessed: '1 week ago' },
  ],
}

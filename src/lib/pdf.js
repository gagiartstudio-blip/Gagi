// ─── Markdown → HTML (minimal, editorial) ────────────────────────────────────
function parseMarkdown(md) {
  return md
    .split('\n')
    .map((line) => {
      if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
      if (line.startsWith('## '))  return `<h2>${line.slice(3)}</h2>`
      if (line.startsWith('# '))   return `<h2 class="h1">${line.slice(2)}</h2>`
      if (line.startsWith('- ') || line.startsWith('* ')) return `<li>${line.slice(2)}</li>`
      if (line.trim() === '') return '<br>'
      return `<p>${line}</p>`
    })
    .join('\n')
}

// ─── Open a print-ready report in a new tab ───────────────────────────────────
export function exportPDF(markdown, clientName) {
  const win = window.open('', '_blank')
  if (!win) {
    alert('Please allow pop-ups to export the PDF.')
    return
  }

  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Brand Audit — ${clientName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #1A1A1A; background: #fff; padding: 64px 80px; max-width: 780px; margin: 0 auto; }
    .bar { width: 40px; height: 2px; background: #D4AF37; margin-bottom: 12px; }
    h1 { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 400; letter-spacing: 0.04em; margin-bottom: 4px; }
    .meta { font-size: 11px; color: #666; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 44px; padding-bottom: 20px; border-bottom: 1px solid #E5E5E1; }
    h2 { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 400; margin: 36px 0 10px; }
    h2.h1 { font-size: 26px; }
    h3 { font-size: 12px; font-weight: 600; letter-spacing: 0.1em; margin: 24px 0 8px; text-transform: uppercase; color: #4A5D4E; }
    p { font-size: 14px; line-height: 1.85; color: #333; margin-bottom: 10px; }
    li { font-size: 14px; line-height: 1.85; color: #333; margin-left: 20px; margin-bottom: 4px; }
    br { display: block; margin-bottom: 6px; }
    .footer { margin-top: 64px; padding-top: 20px; border-top: 1px solid #E5E5E1; font-size: 11px; color: #999; letter-spacing: 0.08em; display: flex; justify-content: space-between; }
    .print-btn { display: block; margin: 28px auto 0; background: #D4AF37; color: #1A1A1A; border: none; padding: 10px 28px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; border-radius: 4px; }
    @media print { .print-btn { display: none !important; } body { padding: 40px 48px; } }
  </style>
</head>
<body>
  <div class="bar"></div>
  <h1>Brand Audit Report</h1>
  <div class="meta">Client: ${clientName} &nbsp;·&nbsp; ${date} &nbsp;·&nbsp; Studio OS</div>
  ${parseMarkdown(markdown)}
  <div class="footer">
    <span>Studio OS — Brand Dashboard</span>
    <span>${date}</span>
  </div>
  <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
</body>
</html>`)

  win.document.close()
}

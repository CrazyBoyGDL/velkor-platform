// ─── Velkor Operational Assessment — PDF-ready HTML Generator ───────────────
// Produces a print-optimized HTML document that renders as a professional PDF
// via window.print() or browser print dialog. No external dependencies required.

import type { AssessmentAnswers, ScoreResult } from './scoring'
import type { LeadClassification } from './classification'

export interface ReportData {
  answers:        AssessmentAnswers
  scores:         ScoreResult
  classification: LeadClassification
  generatedAt:    string
  reportRef:      string
}

function severityColor(s: string): string {
  if (s === 'critical') return '#c04040'
  if (s === 'high')     return '#b07828'
  if (s === 'medium')   return '#5a7a4a'
  return '#4878b0'
}

function severityLabel(s: string): string {
  if (s === 'critical') return 'CRÍTICO'
  if (s === 'high')     return 'ALTO'
  if (s === 'medium')   return 'MEDIO'
  return 'BAJO'
}

function scoreBar(score: number, color: string): string {
  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
      <div style="flex:1;height:6px;background:#1a1a2a;border-radius:3px;overflow:hidden;">
        <div style="height:100%;width:${score}%;background:${color};border-radius:3px;"></div>
      </div>
      <span style="font-family:monospace;font-size:12px;color:#a0a0b8;min-width:36px;text-align:right;">${score}/100</span>
    </div>`
}

export function generateReportHtml(data: ReportData): string {
  const { answers: a, scores: s, classification: c, generatedAt, reportRef } = data
  const date = new Date(generatedAt).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const EXPOSURE_COLOR: Record<string, string> = {
    critical: '#c04040',
    high:     '#b07828',
    medium:   '#7a7050',
    managed:  '#4878b0',
  }
  const expColor = EXPOSURE_COLOR[s.exposureLevel] || '#4878b0'

  const flagsHtml = s.flags.slice(0, 8).map(f => `
    <div style="margin-bottom:16px;padding:14px 16px;border-left:3px solid ${severityColor(f.severity)};background:rgba(255,255,255,0.02);border-radius:0 6px 6px 0;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="font-size:9px;font-family:monospace;font-weight:700;letter-spacing:0.1em;color:${severityColor(f.severity)};padding:2px 7px;border:1px solid ${severityColor(f.severity)}44;border-radius:3px;">${severityLabel(f.severity)}</span>
        <span style="font-size:10px;font-family:monospace;color:#606080;text-transform:uppercase;letter-spacing:0.12em;">${f.category}</span>
      </div>
      <p style="font-size:13px;color:#c8c8d8;margin:0 0 6px;font-weight:500;">${f.finding}</p>
      <p style="font-size:11px;color:#707088;margin:0;font-family:monospace;">→ ${f.recommendation}</p>
    </div>`).join('')

  const prioritiesHtml = s.immediatePriorities.slice(0, 5).map((p, i) => `
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px;">
      <span style="font-family:monospace;font-size:10px;font-weight:700;color:#4878b0;min-width:20px;padding-top:1px;">${String(i + 1).padStart(2, '0')}</span>
      <p style="font-size:13px;color:#b0b0c8;margin:0;">${p}</p>
    </div>`).join('')

  const quickWinsHtml = s.quickWins.map(w => `
    <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
      <span style="color:#3a7858;font-size:12px;margin-top:2px;">✓</span>
      <p style="font-size:12px;color:#909090;margin:0;font-family:monospace;">${w}</p>
    </div>`).join('')

  const obsHtml = s.observations.map(o => `
    <p style="font-size:12px;color:#808098;margin:0 0 10px;line-height:1.7;padding-left:12px;border-left:1px solid #2a2a3a;">${o}</p>`).join('')

  const scoreSection = (label: string, score: number, color: string) => `
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span style="font-size:11px;color:#808098;font-family:monospace;text-transform:uppercase;letter-spacing:0.12em;">${label}</span>
      </div>
      ${scoreBar(score, color)}
    </div>`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Evaluación Operacional — ${a.company} — Velkor System</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: #08090f;
      color: #c8c8d8;
      font-family: 'Inter', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: 14px;
      line-height: 1.6;
    }

    .page {
      max-width: 760px;
      margin: 0 auto;
      padding: 48px 40px;
    }

    .section {
      margin-bottom: 36px;
      padding-bottom: 36px;
      border-bottom: 1px solid rgba(255,255,255,0.055);
    }

    .section-label {
      font-size: 9px;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #505070;
      margin-bottom: 14px;
    }

    h1 { font-size: 28px; font-weight: 800; color: #e8e8f0; letter-spacing: -0.03em; }
    h2 { font-size: 16px; font-weight: 700; color: #d0d0e0; letter-spacing: -0.02em; }

    .meta { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #505070; margin-top: 6px; }

    .score-hero {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin: 16px 0 4px;
    }
    .score-number {
      font-size: 52px;
      font-weight: 800;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: -0.04em;
      line-height: 1;
    }
    .score-denom {
      font-size: 20px;
      font-weight: 400;
      color: #505070;
      font-family: 'JetBrains Mono', monospace;
    }
    .maturity-label {
      font-size: 13px;
      font-weight: 600;
      color: #a0a0b8;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .exposure-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      letter-spacing: 0.08em;
      margin-top: 12px;
    }

    .recommended-phase {
      padding: 16px 20px;
      background: rgba(72,120,176,0.06);
      border: 1px solid rgba(72,120,176,0.18);
      border-radius: 8px;
      font-size: 13px;
      color: #a0b8d0;
      font-style: italic;
    }

    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 24px;
      border-top: 1px solid rgba(255,255,255,0.055);
    }

    .nda-note {
      font-size: 9px;
      font-family: 'JetBrains Mono', monospace;
      color: #383850;
      margin-top: 12px;
      text-align: center;
    }

    @media print {
      body { background: #ffffff; color: #1a1a2a; }
      .page { padding: 24px; }
      .no-print { display: none !important; }

      .section { border-bottom-color: #e0e0e8; }
      .section-label { color: #808098; }
      h1 { color: #0a0a14; }
      h2 { color: #1a1a2a; }
      .meta { color: #909098; }
      .score-number { color: #1a1a2a; }
      .score-denom { color: #909098; }
      .maturity-label { color: #505060; }
      .recommended-phase { background: #f4f4f8; border-color: #c0c8d8; color: #404060; }
      .nda-note { color: #c0c0c8; }
      body { font-size: 12px; }
      .score-number { font-size: 44px; }
    }

    @page {
      size: A4;
      margin: 20mm 16mm;
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- Print button (hidden on print) -->
    <div class="no-print" style="text-align:right;margin-bottom:32px;">
      <button
        onclick="window.print()"
        style="background:rgba(72,120,176,0.12);border:1px solid rgba(72,120,176,0.25);color:#7aa8cc;padding:8px 20px;border-radius:8px;font-size:12px;font-family:monospace;cursor:pointer;"
      >
        Imprimir / Guardar PDF
      </button>
    </div>

    <!-- Header -->
    <div class="section">
      <div class="section-label">Evaluación Operacional de Infraestructura IT</div>
      <h1>${a.company}</h1>
      <div class="meta">${a.step1.industry} · ${a.step1.companySize} empleados · ${date} · Ref: ${reportRef}</div>
      <div class="meta" style="margin-top:4px;">Preparado por: Velkor System · velkor.mx</div>
    </div>

    <!-- Overall score + exposure -->
    <div class="section">
      <div class="section-label">Nivel de Madurez Operacional</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">
        <div>
          <div class="score-hero">
            <span class="score-number" style="color:${expColor};">${s.overall}</span>
            <span class="score-denom">/100</span>
          </div>
          <div class="maturity-label">${s.maturityLabel}</div>
          <p style="font-size:12px;color:#606080;margin-top:8px;line-height:1.6;">${s.maturityDesc}</p>
          <div class="exposure-badge" style="background:${expColor}14;border:1px solid ${expColor}30;color:${expColor};">
            <span>●</span> ${s.exposureLabel}
          </div>
        </div>

        <div style="padding-top:8px;">
          ${scoreSection('Infraestructura', s.infrastructure, '#4878b0')}
          ${scoreSection('Identidad & Gobierno', s.identity, '#3a7858')}
          ${scoreSection('Operaciones', s.operations, '#3d88a5')}
        </div>
      </div>
    </div>

    <!-- Key findings -->
    ${s.flags.length > 0 ? `
    <div class="section">
      <div class="section-label">Hallazgos de Riesgo (${s.flags.length} total · ${s.criticalCount} críticos · ${s.highCount} altos)</div>
      ${flagsHtml}
    </div>` : ''}

    <!-- Immediate priorities -->
    ${s.immediatePriorities.length > 0 ? `
    <div class="section">
      <div class="section-label">Prioridades Inmediatas</div>
      ${prioritiesHtml}
    </div>` : ''}

    <!-- Quick wins -->
    ${s.quickWins.length > 0 ? `
    <div class="section">
      <div class="section-label">Victorias Rápidas (30–90 días)</div>
      ${quickWinsHtml}
    </div>` : ''}

    <!-- Observations -->
    ${s.observations.length > 0 ? `
    <div class="section">
      <div class="section-label">Observaciones Operacionales</div>
      ${obsHtml}
    </div>` : ''}

    <!-- Recommended phase -->
    <div class="section">
      <div class="section-label">Fase Recomendada</div>
      <div class="recommended-phase">${s.recommendedPhase}</div>
      <div style="margin-top:16px;font-size:11px;font-family:monospace;color:#505070;">
        Alcance estimado: ${c.estimatedScope} · Tipo de engagament: ${c.engagementLabel}
      </div>
    </div>

    <!-- Context summary -->
    <div class="section">
      <div class="section-label">Contexto de la Evaluación</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:12px;font-family:monospace;">
        <div>
          <div style="color:#505070;margin-bottom:3px;">Industria</div>
          <div style="color:#9090a8;">${a.step1.industry}</div>
        </div>
        <div>
          <div style="color:#505070;margin-bottom:3px;">Infraestructura</div>
          <div style="color:#9090a8;">${a.step1.infrastructure}</div>
        </div>
        <div>
          <div style="color:#505070;margin-bottom:3px;">Ubicaciones</div>
          <div style="color:#9090a8;">${a.step1.locations}</div>
        </div>
        <div>
          <div style="color:#505070;margin-bottom:3px;">Trabajo remoto</div>
          <div style="color:#9090a8;">${a.step1.remoteWorkforce}</div>
        </div>
        <div>
          <div style="color:#505070;margin-bottom:3px;">Microsoft 365</div>
          <div style="color:#9090a8;">${a.step1.microsoft365}</div>
        </div>
        <div>
          <div style="color:#505070;margin-bottom:3px;">Urgencia declarada</div>
          <div style="color:#9090a8;">${a.step5.urgency}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-row">
      <div>
        <div style="font-size:14px;font-weight:700;color:#e0e0f0;">Velkor System</div>
        <div style="font-size:10px;font-family:monospace;color:#404060;margin-top:2px;">velkor.mx · Consultoría IT Empresarial</div>
      </div>
      <div style="text-align:right;font-size:10px;font-family:monospace;color:#404060;">
        <div>Informe generado: ${date}</div>
        <div>Ref: ${reportRef}</div>
      </div>
    </div>

    <p class="nda-note">Documento confidencial · Generado automáticamente a partir de la evaluación del prospecto · No constituye propuesta formal</p>

  </div>
</body>
</html>`
}

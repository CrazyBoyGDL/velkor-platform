// ─── Velkor System — Post-Assessment Email Template ──────────────────────────
// Generates a complete inline-CSS HTML email for delivery via Resend.
// Table-based layout ensures compatibility across all major email clients.
// Background: light (#f8f8fa) — dark backgrounds are stripped by many clients.

export interface EmailData {
  recipientName:    string
  company:          string
  reportRef:        string
  overallScore:     number
  maturityLabel:    string
  exposureLabel:    string
  exposureLevel:    'critical' | 'high' | 'medium' | 'managed'
  criticalCount:    number
  highCount:        number
  topFlags:         { severity: string; finding: string; recommendation: string }[]  // max 3
  quickWins:        string[]   // max 3
  recommendedPhase: string
  engagementLabel:  string
  followUpLabel:    string
  followUpHours:    number
  pdfUrl?:          string
}

export type OperationalEmailType =
  | 'assessment-follow-up'
  | 'proposal-follow-up'
  | 'evidence-sharing'
  | 'scheduling-reminder'
  | 'nurture'

export interface OperationalEmailSequence {
  type: OperationalEmailType
  label: string
  trigger: string
  cadenceDays: number[]
  owner: 'engineer' | 'account-executive' | 'automated'
  tone: 'technical' | 'consultive' | 'governance'
}

export interface OperationalEmailData {
  type: OperationalEmailType
  recipientName: string
  company: string
  reportRef?: string
  primaryFinding?: string
  recommendedNextStep: string
  evidenceTitle?: string
  schedulingUrl?: string
  artifactUrl?: string
}

export const EMAIL_SEQUENCES: Record<OperationalEmailType, OperationalEmailSequence> = {
  'assessment-follow-up': {
    type: 'assessment-follow-up',
    label: 'Assessment follow-up',
    trigger: 'assessment.completed',
    cadenceDays: [0, 2, 5],
    owner: 'engineer',
    tone: 'technical',
  },
  'proposal-follow-up': {
    type: 'proposal-follow-up',
    label: 'Proposal follow-up',
    trigger: 'proposal.sent',
    cadenceDays: [1, 3, 7, 14],
    owner: 'account-executive',
    tone: 'consultive',
  },
  'evidence-sharing': {
    type: 'evidence-sharing',
    label: 'Evidence sharing',
    trigger: 'lead.requires-evidence',
    cadenceDays: [0, 10],
    owner: 'engineer',
    tone: 'governance',
  },
  'scheduling-reminder': {
    type: 'scheduling-reminder',
    label: 'Scheduling reminder',
    trigger: 'discovery.pending',
    cadenceDays: [1, 4],
    owner: 'account-executive',
    tone: 'consultive',
  },
  nurture: {
    type: 'nurture',
    label: 'Operational nurture',
    trigger: 'lead.nurture',
    cadenceDays: [0, 30, 60, 90],
    owner: 'automated',
    tone: 'technical',
  },
}

// ─── Color helpers ────────────────────────────────────────────────────────────

const EXPOSURE_PALETTE: Record<string, { bg: string; border: string; text: string }> = {
  critical: { bg: '#fdf0f0', border: '#d94040', text: '#c03030' },
  high:     { bg: '#fdf5e8', border: '#c08020', text: '#a06010' },
  medium:   { bg: '#f4f8f0', border: '#6a9050', text: '#507040' },
  managed:  { bg: '#eff4fb', border: '#4070b0', text: '#3060a0' },
}

const SEVERITY_PALETTE: Record<string, { bg: string; border: string; text: string }> = {
  critical: { bg: '#fdf0f0', border: '#d94040', text: '#c03030' },
  high:     { bg: '#fdf5e8', border: '#c08020', text: '#a06010' },
  medium:   { bg: '#f4f8f0', border: '#6a9050', text: '#507040' },
  low:      { bg: '#eff4fb', border: '#4070b0', text: '#3060a0' },
}

function severityLabel(s: string): string {
  const map: Record<string, string> = {
    critical: 'CRÍTICO',
    high:     'ALTO',
    medium:   'MEDIO',
    low:      'BAJO',
  }
  return map[s] ?? s.toUpperCase()
}

// ─── Section builders ─────────────────────────────────────────────────────────

function buildHeader(data: EmailData): string {
  return `
    <tr>
      <td style="padding:28px 36px 20px;border-bottom:2px solid #0a0a14;background:#0a0a14;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <span style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:#e8e8f0;letter-spacing:-0.02em;">Velkor System</span>
              <br />
              <span style="font-family:Courier New,monospace;font-size:10px;color:#505070;letter-spacing:0.15em;text-transform:uppercase;">Consultoría IT Empresarial · velkor.mx</span>
            </td>
            <td align="right" valign="middle">
              <span style="font-family:Courier New,monospace;font-size:10px;color:#505070;">Ref: ${data.reportRef}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 36px 20px;background:#ffffff;border-bottom:1px solid #e0e0e8;">
        <p style="margin:0 0 6px;font-family:Courier New,monospace;font-size:10px;color:#909098;text-transform:uppercase;letter-spacing:0.15em;">Evaluación Operacional Completada</p>
        <h1 style="margin:0 0 6px;font-family:Georgia,serif;font-size:22px;font-weight:700;color:#0a0a14;letter-spacing:-0.02em;">${data.company}</h1>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#505070;">
          ${data.recipientName}, adjuntamos los resultados de su evaluación operacional de infraestructura IT.
        </p>
      </td>
    </tr>`
}

function buildSummaryBox(data: EmailData): string {
  const palette = EXPOSURE_PALETTE[data.exposureLevel] ?? EXPOSURE_PALETTE.managed
  const scoreColor = palette.text

  return `
    <tr>
      <td style="padding:24px 36px;background:#ffffff;border-bottom:1px solid #e8e8ee;">
        <p style="margin:0 0 14px;font-family:Courier New,monospace;font-size:9px;color:#909098;text-transform:uppercase;letter-spacing:0.2em;">Resumen Ejecutivo</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e0e0e8;border-radius:6px;overflow:hidden;">
          <tr>
            <td width="40%" style="padding:20px 24px;border-right:1px solid #e8e8ee;vertical-align:top;">
              <p style="margin:0 0 2px;font-family:Courier New,monospace;font-size:9px;color:#909098;text-transform:uppercase;letter-spacing:0.15em;">Madurez Operacional</p>
              <p style="margin:0;font-family:Courier New,monospace;font-size:42px;font-weight:700;color:${scoreColor};line-height:1.1;">${data.overallScore}<span style="font-size:18px;color:#b0b0b8;">/100</span></p>
              <p style="margin:6px 0 12px;font-family:Arial,sans-serif;font-size:11px;font-weight:600;color:#505070;text-transform:uppercase;letter-spacing:0.1em;">${data.maturityLabel}</p>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:4px 10px;background:${palette.bg};border:1px solid ${palette.border};border-radius:4px;">
                    <span style="font-family:Courier New,monospace;font-size:10px;font-weight:700;color:${palette.text};letter-spacing:0.08em;">${data.exposureLabel}</span>
                  </td>
                </tr>
              </table>
            </td>
            <td style="padding:20px 24px;vertical-align:top;">
              <p style="margin:0 0 12px;font-family:Courier New,monospace;font-size:9px;color:#909098;text-transform:uppercase;letter-spacing:0.15em;">Hallazgos Identificados</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:8px 12px;background:#fdf0f0;border-left:3px solid #d94040;border-radius:0 4px 4px 0;margin-bottom:8px;">
                    <span style="font-family:Courier New,monospace;font-size:11px;font-weight:700;color:#c03030;">${data.criticalCount}</span>
                    <span style="font-family:Arial,sans-serif;font-size:11px;color:#a04040;margin-left:6px;">hallazgos críticos</span>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:8px 12px;background:#fdf5e8;border-left:3px solid #c08020;border-radius:0 4px 4px 0;">
                    <span style="font-family:Courier New,monospace;font-size:11px;font-weight:700;color:#a06010;">${data.highCount}</span>
                    <span style="font-family:Arial,sans-serif;font-size:11px;color:#806010;margin-left:6px;">hallazgos de riesgo alto</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

function buildTopFlags(flags: EmailData['topFlags']): string {
  if (!flags.length) return ''
  const items = flags.slice(0, 3).map(f => {
    const p = SEVERITY_PALETTE[f.severity] ?? SEVERITY_PALETTE.low
    return `
        <tr>
          <td style="padding:0 0 10px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="border-left:3px solid ${p.border};background:${p.bg};border-radius:0 4px 4px 0;">
              <tr>
                <td style="padding:12px 16px;">
                  <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:6px;">
                    <tr>
                      <td style="padding:2px 8px;border:1px solid ${p.border};border-radius:3px;">
                        <span style="font-family:Courier New,monospace;font-size:9px;font-weight:700;color:${p.text};letter-spacing:0.1em;">${severityLabel(f.severity)}</span>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:0 0 5px;font-family:Arial,sans-serif;font-size:12px;font-weight:600;color:#1a1a2a;">${f.finding}</p>
                  <p style="margin:0;font-family:Courier New,monospace;font-size:11px;color:#505070;">→ ${f.recommendation}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
  }).join('')

  return `
    <tr>
      <td style="padding:20px 36px;background:#fafafa;border-bottom:1px solid #e8e8ee;">
        <p style="margin:0 0 14px;font-family:Courier New,monospace;font-size:9px;color:#909098;text-transform:uppercase;letter-spacing:0.2em;">Principales Hallazgos</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${items}
        </table>
      </td>
    </tr>`
}

function buildQuickWins(wins: string[]): string {
  if (!wins.length) return ''
  const items = wins.slice(0, 3).map(w => `
        <tr>
          <td style="padding:0 0 8px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="20" valign="top" style="font-family:Courier New,monospace;font-size:12px;color:#507040;padding-top:1px;">+</td>
                <td style="font-family:Arial,sans-serif;font-size:12px;color:#404050;line-height:1.5;">${w}</td>
              </tr>
            </table>
          </td>
        </tr>`).join('')

  return `
    <tr>
      <td style="padding:20px 36px;background:#ffffff;border-bottom:1px solid #e8e8ee;">
        <p style="margin:0 0 14px;font-family:Courier New,monospace;font-size:9px;color:#909098;text-transform:uppercase;letter-spacing:0.2em;">Victorias Rápidas (30–90 días)</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${items}
        </table>
      </td>
    </tr>`
}

function buildPhaseAndCTA(data: EmailData): string {
  const ctaUrl = 'https://velkor.mx/contacto'
  const pdfRow = data.pdfUrl ? `
        <tr><td style="height:12px;"></td></tr>
        <tr>
          <td align="center">
            <a href="${data.pdfUrl}" style="font-family:Courier New,monospace;font-size:11px;color:#4070b0;text-decoration:underline;">
              Descargar informe completo (PDF)
            </a>
          </td>
        </tr>` : ''

  return `
    <tr>
      <td style="padding:20px 36px;background:#fafafa;border-bottom:1px solid #e8e8ee;">
        <p style="margin:0 0 10px;font-family:Courier New,monospace;font-size:9px;color:#909098;text-transform:uppercase;letter-spacing:0.2em;">Fase Recomendada</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border:1px solid #c8d4e8;background:#eff4fb;border-radius:4px;">
          <tr>
            <td style="padding:14px 18px;">
              <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:12px;color:#1a2a4a;font-style:italic;">${data.recommendedPhase}</p>
              <p style="margin:0;font-family:Courier New,monospace;font-size:10px;color:#607090;">${data.engagementLabel}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 36px;background:#ffffff;border-bottom:1px solid #e8e8ee;text-align:center;">
        <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:13px;color:#404050;">
          Nuestro equipo realizará seguimiento en las próximas <strong>${data.followUpHours} horas</strong> (${data.followUpLabel}).<br />
          Si desea adelantar la conversación, puede solicitar su propuesta ahora.
        </p>
        <table cellpadding="0" cellspacing="0" border="0" align="center">
          ${pdfRow}
          <tr><td style="height:14px;"></td></tr>
          <tr>
            <td align="center"
                style="background:#0a0a14;border-radius:5px;padding:13px 32px;">
              <a href="${ctaUrl}"
                 style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#e8e8f0;text-decoration:none;letter-spacing:0.02em;">
                Solicitar propuesta detallada
              </a>
            </td>
          </tr>
          <tr><td style="height:8px;"></td></tr>
          <tr>
            <td align="center">
              <a href="${ctaUrl}"
                 style="font-family:Courier New,monospace;font-size:10px;color:#909098;text-decoration:none;">
                velkor.mx/contacto
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

function buildFooter(reportRef: string): string {
  return `
    <tr>
      <td style="padding:20px 36px;background:#0a0a14;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#e0e0f0;">Velkor System</p>
              <p style="margin:0;font-family:Courier New,monospace;font-size:10px;color:#404060;">velkor.mx · contacto@velkor.mx</p>
            </td>
            <td align="right" valign="middle">
              <p style="margin:0;font-family:Courier New,monospace;font-size:10px;color:#404060;">Ref: ${reportRef}</p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-family:Courier New,monospace;font-size:9px;color:#303050;text-align:center;line-height:1.6;">
          Documento confidencial · Generado a partir de la evaluación operacional del prospecto ·
          No constituye propuesta formal ni obligación contractual ·
          La información contenida está sujeta a acuerdo de confidencialidad implícito.
        </p>
      </td>
    </tr>`
}

function operationalSubject(data: OperationalEmailData): string {
  const map: Record<OperationalEmailType, string> = {
    'assessment-follow-up': `Siguientes pasos de evaluación operacional · ${data.company}`,
    'proposal-follow-up': `Seguimiento de propuesta técnica · ${data.company}`,
    'evidence-sharing': `Evidencia técnica relacionada · ${data.company}`,
    'scheduling-reminder': `Agenda de revisión técnica · ${data.company}`,
    nurture: `Referencia operacional para su roadmap IT · ${data.company}`,
  }
  return map[data.type]
}

export function buildOperationalEmailSubject(data: OperationalEmailData): string {
  const ref = data.reportRef ? ` · ${data.reportRef}` : ''
  return `${operationalSubject(data)}${ref}`
}

export function generateOperationalEmail(data: OperationalEmailData): string {
  const sequence = EMAIL_SEQUENCES[data.type]
  const evidence = data.evidenceTitle
    ? `<p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;color:#404050;">Referencia sugerida: <strong>${data.evidenceTitle}</strong>.</p>`
    : ''
  const artifact = data.artifactUrl
    ? `<p style="margin:0 0 12px;font-family:Courier New,monospace;font-size:11px;"><a href="${data.artifactUrl}" style="color:#3060a0;">Abrir artefacto operativo</a></p>`
    : ''
  const schedule = data.schedulingUrl
    ? `<p style="margin:18px 0 0;"><a href="${data.schedulingUrl}" style="display:inline-block;background:#0a0a14;color:#e8e8f0;text-decoration:none;padding:12px 22px;border-radius:5px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;">Agendar revisión técnica</a></p>`
    : ''

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${buildOperationalEmailSubject(data)}</title>
</head>
<body style="margin:0;padding:0;background:#f0f0f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f0f4;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #d8d8e0;border-radius:6px;overflow:hidden;">
          <tr>
            <td style="padding:24px 32px;background:#0a0a14;border-bottom:2px solid #0a0a14;">
              <span style="font-family:Georgia,serif;font-size:18px;font-weight:700;color:#e8e8f0;">Velkor System</span><br />
              <span style="font-family:Courier New,monospace;font-size:10px;color:#505070;letter-spacing:0.15em;text-transform:uppercase;">${sequence.label} · ${sequence.owner}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;background:#ffffff;">
              <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;color:#404050;">${data.recipientName},</p>
              <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:13px;color:#404050;line-height:1.6;">
                Damos seguimiento a ${data.company} con una recomendación concreta y operativa, no una automatización comercial genérica.
              </p>
              ${data.primaryFinding ? `<p style="margin:0 0 14px;font-family:Courier New,monospace;font-size:12px;color:#505070;line-height:1.6;border-left:3px solid #b07828;padding-left:12px;">${data.primaryFinding}</p>` : ''}
              ${evidence}
              ${artifact}
              <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#404050;line-height:1.6;">
                Próximo paso recomendado: <strong>${data.recommendedNextStep}</strong>
              </p>
              ${schedule}
            </td>
          </tr>
          ${buildFooter(data.reportRef ?? 'operational-email')}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateAssessmentEmail(data: EmailData): string {
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Evaluación operacional completada · ${data.reportRef} · Velkor System</title>
</head>
<body style="margin:0;padding:0;background:#f0f0f4;font-family:Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f0f4;padding:32px 0;">
    <tr>
      <td align="center">
        <!-- Email container: max 600px -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;background:#ffffff;border:1px solid #d8d8e0;border-radius:6px;overflow:hidden;">
          ${buildHeader(data)}
          ${buildSummaryBox(data)}
          ${buildTopFlags(data.topFlags)}
          ${buildQuickWins(data.quickWins)}
          ${buildPhaseAndCTA(data)}
          ${buildFooter(data.reportRef)}
        </table>
        <!-- Anti-spam spacer -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td style="padding:16px 0;text-align:center;">
              <p style="margin:0;font-family:Courier New,monospace;font-size:9px;color:#a0a0a8;">
                Este mensaje fue enviado porque completó una evaluación en velkor.mx
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

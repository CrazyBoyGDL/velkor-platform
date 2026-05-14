'use client'

// ─── Velkor Architecture Diagrams ─────────────────────────────────────────────
// SVG-based operational diagrams. Precision-oriented, calm, technical editorial.
// Not decorative — every element represents a real network/identity concept.

// ─── Shared primitives ───────────────────────────────────────────────────────

const MONO = "'JetBrains Mono', 'Fira Code', monospace"
const SANS = "'Inter', system-ui, sans-serif"

function Label({ x, y, text, size = 9, color = '#505070', anchor = 'middle' }: {
  x: number; y: number; text: string; size?: number; color?: string; anchor?: string
}) {
  return (
    <text
      x={x} y={y}
      textAnchor={anchor as never}
      dominantBaseline="middle"
      fill={color}
      fontSize={size}
      fontFamily={MONO}
      style={{ letterSpacing: '0.06em' }}
    >
      {text}
    </text>
  )
}

function Box({ x, y, w, h, color, bg, label, sublabel, mono = true }: {
  x: number; y: number; w: number; h: number
  color: string; bg: string; label: string; sublabel?: string; mono?: boolean
}) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h}
        rx={4}
        fill={bg}
        stroke={color}
        strokeWidth={0.8}
      />
      <text
        x={x + w / 2} y={y + h / 2 - (sublabel ? 5 : 0)}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={9}
        fontFamily={mono ? MONO : SANS}
        fontWeight="600"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x + w / 2} y={y + h / 2 + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color + '80'}
          fontSize={7.5}
          fontFamily={MONO}
        >
          {sublabel}
        </text>
      )}
    </g>
  )
}

function Line({ x1, y1, x2, y2, color = '#2a2a3a', dashed = false }: {
  x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean
}) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color}
      strokeWidth={0.8}
      strokeDasharray={dashed ? '3,3' : undefined}
    />
  )
}

function Arrow({ x1, y1, x2, y2, color = '#3a3a50' }: {
  x1: number; y1: number; x2: number; y2: number; color?: string
}) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len, uy = dy / len
  const sx = x2 - ux * 6, sy = y2 - uy * 6
  return (
    <g>
      <line x1={x1} y1={y1} x2={sx} y2={sy} stroke={color} strokeWidth={0.8} />
      <polygon
        points={`${x2},${y2} ${x2 - uy * 3 - ux * 5},${y2 + ux * 3 - uy * 5} ${x2 + uy * 3 - ux * 5},${y2 - ux * 3 - uy * 5}`}
        fill={color}
      />
    </g>
  )
}

// ─── VLAN Segmentation Diagram ────────────────────────────────────────────────

export function VlanDiagram({ className = '' }: { className?: string }) {
  const W = 680, H = 380

  const vlans = [
    { id: 'VLAN 10', label: 'Corporativo',  sub: '192.168.10.0/24',  color: '#4878b0', y: 80  },
    { id: 'VLAN 20', label: 'Servidores',   sub: '192.168.20.0/24',  color: '#3a7858', y: 130 },
    { id: 'VLAN 30', label: 'Gestión',      sub: '192.168.30.0/24',  color: '#b07828', y: 180 },
    { id: 'VLAN 40', label: 'Impresoras',   sub: '192.168.40.0/24',  color: '#505070', y: 230 },
    { id: 'VLAN 50', label: 'IoT',          sub: '192.168.50.0/24',  color: '#3d88a5', y: 280 },
    { id: 'VLAN 99', label: 'Invitados',    sub: '192.168.99.0/24',  color: '#604040', y: 330 },
  ]

  const deviceMap: Record<string, string[]> = {
    'VLAN 10': ['Workstations', 'Laptops'],
    'VLAN 20': ['AD · File · ERP', 'Backup Server'],
    'VLAN 30': ['Switches · APs', 'FortiManager'],
    'VLAN 40': ['Impresoras HP', 'MFP'],
    'VLAN 50': ['Cámaras · Smart TV', 'Sensores IoT'],
    'VLAN 99': ['WiFi invitados', 'Solo Internet'],
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`w-full ${className}`}
      style={{ fontFamily: MONO, background: 'transparent' }}
      role="img"
      aria-label="Diagrama de segmentación VLAN corporativa"
    >
      {/* Grid background */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#grid)" rx={8} />

      {/* Title */}
      <Label x={20} y={18} text="SEGMENTACIÓN VLAN — SEDE CORPORATIVA" size={8} color="#404060" anchor="start" />
      <Label x={W - 20} y={18} text="FortiGate NGFW · Inter-VLAN routing" size={7.5} color="#303050" anchor="end" />

      {/* Internet cloud */}
      <ellipse cx={100} cy={55} rx={42} ry={18} fill="#0c1020" stroke="#2a2a3a" strokeWidth={0.8} />
      <Label x={100} y={55} text="INTERNET" size={8.5} color="#404060" />

      {/* FortiGate box */}
      <Box x={260} y={35} w={120} h={38} color="#4878b0" bg="rgba(72,120,176,0.08)" label="FortiGate NGFW" sublabel="IPS · AppCtrl · SD-WAN" />

      {/* Arrow internet → FortiGate */}
      <Arrow x1={143} y1={55} x2={260} y2={54} color="#3a3a58" />

      {/* Center bus */}
      <line x1={320} y1={73} x2={320} y2={348} stroke="#2a2a3a" strokeWidth={1} />
      <Label x={320} y={360} text="L3 SWITCH CORE" size={7.5} color="#303050" />

      {/* VLANs */}
      {vlans.map(({ id, label, sub, color, y }) => {
        const devices = deviceMap[id] ?? []
        return (
          <g key={id}>
            {/* Horizontal tap from bus */}
            <line x1={320} y1={y} x2={360} y2={y} stroke={color + '40'} strokeWidth={0.8} />
            {/* VLAN ID box */}
            <Box x={360} y={y - 14} w={58} h={28} color={color} bg={color + '14'} label={id} />
            {/* Name */}
            <text x={428} y={y - 3} fill={color + 'cc'} fontSize={9.5} fontFamily={MONO} fontWeight="600">{label}</text>
            <text x={428} y={y + 9} fill={color + '50'} fontSize={7.5} fontFamily={MONO}>{sub}</text>
            {/* Devices */}
            {devices.map((d, di) => (
              <g key={d}>
                <line x1={550} y1={y + di * 14 - (devices.length - 1) * 7} x2={570} y2={y + di * 14 - (devices.length - 1) * 7} stroke={color + '28'} strokeWidth={0.7} strokeDasharray="2,2" />
                <text x={574} y={y + di * 14 - (devices.length - 1) * 7 + 1} fill="#404060" fontSize={7.5} fontFamily={MONO} dominantBaseline="middle">{d}</text>
              </g>
            ))}
            {/* Devices separator */}
            <line x1={550} y1={y - 14} x2={550} y2={y + 14} stroke={color + '18'} strokeWidth={0.7} />
          </g>
        )
      })}

      {/* ACL note */}
      <rect x={20} y={H - 40} width={200} height={28} rx={3} fill="rgba(176,120,40,0.06)" stroke="rgba(176,120,40,0.2)" strokeWidth={0.6} />
      <Label x={30} y={H - 31} text="ACL explícita entre VLANs" size={7.5} color="#b07828" anchor="start" />
      <Label x={30} y={H - 20} text="deny any any implícito como regla final" size={7.5} color="rgba(176,120,40,0.5)" anchor="start" />
    </svg>
  )
}

// ─── Entra ID Governance Flow ─────────────────────────────────────────────────

export function EntraIdGovernanceFlow({ className = '' }: { className?: string }) {
  const W = 640, H = 400

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`w-full ${className}`}
      style={{ fontFamily: MONO, background: 'transparent' }}
      role="img"
      aria-label="Diagrama de flujo de gobierno de identidad Entra ID"
    >
      <defs>
        <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#grid2)" rx={8} />

      {/* Title */}
      <Label x={20} y={18} text="GOBIERNO DE IDENTIDAD — ACCESO CONDICIONAL" size={8} color="#404060" anchor="start" />

      {/* User */}
      <circle cx={60} cy={80} r={18} fill="#0c1020" stroke="#3a3a50" strokeWidth={0.8} />
      <Label x={60} y={80} text="USR" size={8.5} color="#505070" />
      <Label x={60} y={106} text="Usuario" size={7.5} color="#404060" />

      {/* Entra ID box */}
      <Arrow x1={79} y1={80} x2={140} y2={80} color="#3a3a58" />
      <Box x={140} y={62} w={110} h={36} color="#3a7858" bg="rgba(58,120,88,0.08)" label="Entra ID P2" sublabel="Identity Protection" />

      {/* CA evaluation */}
      <Arrow x1={250} y1={80} x2={300} y2={80} color="#3a3a58" />
      <rect x={300} y={60} width={120} height={40} rx={4} fill="rgba(72,120,176,0.08)" stroke="#4878b0" strokeWidth={0.8} />
      <text x={360} y={76} textAnchor="middle" fill="#4878b0" fontSize={9} fontFamily={MONO} fontWeight="600">Evaluación CA</text>
      <text x={360} y={89} textAnchor="middle" fill="rgba(72,120,176,0.55)" fontSize={7.5} fontFamily={MONO}>Políticas · Condiciones</text>

      {/* Checks column */}
      {[
        { label: '¿MFA requerido?',         y: 160, color: '#b07828' },
        { label: '¿Dispositivo conforme?',  y: 200, color: '#b07828' },
        { label: '¿Ubicación válida?',      y: 240, color: '#b07828' },
        { label: '¿Riesgo aceptable?',      y: 280, color: '#b07828' },
      ].map(({ label, y, color }) => (
        <g key={label}>
          <Arrow x1={360} y1={y - 10} x2={360} y2={y + 10} color="#2a2a40" />
          <rect x={285} y={y + 10} width={150} height={24} rx={3} fill={color + '0a'} stroke={color + '30'} strokeWidth={0.7} />
          <text x={360} y={y + 23} textAnchor="middle" fill={color + '99'} fontSize={8} fontFamily={MONO} dominantBaseline="middle">{label}</text>
        </g>
      ))}

      {/* Lines from CA down */}
      <line x1={360} y1={100} x2={360} y2={150} stroke="#2a2a40" strokeWidth={0.8} />

      {/* MFA challenge */}
      <Arrow x1={435} y1={172} x2={520} y2={145} color="#b07828" />
      <Box x={520} y={130} w={90} h={28} color="#b07828" bg="rgba(176,120,40,0.08)" label="MFA Challenge" sublabel="Authenticator" />

      {/* Intune check */}
      <Arrow x1={435} y1={212} x2={520} y2={212} color="#b07828" />
      <Box x={520} y={198} w={90} h={28} color="#3a7858" bg="rgba(58,120,88,0.08)" label="Intune Check" sublabel="Compliance" />

      {/* Grant / Deny */}
      <Arrow x1={360} y1={316} x2={300} y2={345} color="#3a3a58" />
      <Box x={200} y={332} w={100} h={30} color="#3a7858" bg="rgba(58,120,88,0.08)" label="ACCESO" sublabel="CONCEDIDO" />

      <Arrow x1={360} y1={316} x2={420} y2={345} color="#3a3a58" />
      <Box x={380} y={332} width={100} h={30} color="#c04040" bg="rgba(192,64,64,0.08)" label="ACCESO" sublabel="DENEGADO" />

      {/* PIM note */}
      <rect x={20} y={310} width={160} height={50} rx={3} fill="rgba(72,120,176,0.05)" stroke="rgba(72,120,176,0.18)" strokeWidth={0.6} />
      <text x={30} y={328} fill="#4878b0cc" fontSize={7.5} fontFamily={MONO}>Acceso privilegiado:</text>
      <text x={30} y={341} fill="#4878b080" fontSize={7.5} fontFamily={MONO}>PIM just-in-time</text>
      <text x={30} y={354} fill="#4878b060" fontSize={7.5} fontFamily={MONO}>Aprobación + log de auditoría</text>
    </svg>
  )
}

// ─── Intune Device Lifecycle ──────────────────────────────────────────────────

export function IntuneDiagram({ className = '' }: { className?: string }) {
  const W = 680, H = 200

  const steps = [
    { label: 'Registro',      sub: 'Autopilot / Manual',      color: '#4878b0', x: 50  },
    { label: 'Enrollment',    sub: 'Intune MDM/MAM',           color: '#4878b0', x: 170 },
    { label: 'Compliance',    sub: 'Política evaluada',        color: '#3a7858', x: 290 },
    { label: 'Provisioning',  sub: 'Apps · Configuración',     color: '#3a7858', x: 410 },
    { label: 'Operación',     sub: 'Monitoreo · Parches',      color: '#3d88a5', x: 530 },
  ]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`w-full ${className}`}
      style={{ fontFamily: MONO, background: 'transparent' }}
      role="img"
      aria-label="Ciclo de vida de dispositivo en Intune MDM"
    >
      <defs>
        <pattern id="grid3" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.018)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#grid3)" rx={8} />

      <Label x={20} y={18} text="CICLO DE VIDA DE DISPOSITIVO — INTUNE MDM" size={8} color="#404060" anchor="start" />

      {/* Horizontal baseline */}
      <line x1={50} y1={100} x2={620} y2={100} stroke="#1a1a30" strokeWidth={1} />

      {steps.map(({ label, sub, color, x }, i) => (
        <g key={label}>
          {/* Circle node */}
          <circle cx={x + 55} cy={100} r={16} fill={color + '12'} stroke={color + '50'} strokeWidth={0.8} />
          <text x={x + 55} y={100} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={8} fontFamily={MONO} fontWeight="700">
            {String(i + 1).padStart(2, '0')}
          </text>
          {/* Label above */}
          <text x={x + 55} y={73} textAnchor="middle" fill={color + 'cc'} fontSize={9} fontFamily={MONO} fontWeight="600">{label}</text>
          {/* Sub below */}
          <text x={x + 55} y={129} textAnchor="middle" fill="#404060" fontSize={7.5} fontFamily={MONO}>{sub}</text>
          {/* Arrow to next */}
          {i < steps.length - 1 && (
            <Arrow x1={x + 72} y1={100} x2={x + 108} y2={100} color="#2a2a40" />
          )}
        </g>
      ))}

      {/* Retirement note */}
      <Arrow x1={620} y1={100} x2={637} y2={100} color="#2a2a40" />
      <rect x={637} y={86} width={28} height={28} rx={3} fill="rgba(192,64,64,0.06)" stroke="rgba(192,64,64,0.25)" strokeWidth={0.7} />
      <text x={651} y={100} textAnchor="middle" dominantBaseline="middle" fill="#c0404080" fontSize={7} fontFamily={MONO}>RET</text>
      <text x={651} y={128} textAnchor="middle" fill="#403040" fontSize={7} fontFamily={MONO}>Retire / Wipe</text>

      {/* Offboarding note */}
      <rect x={20} y={155} width={175} height={24} rx={3} fill="rgba(192,64,64,0.04)" stroke="rgba(192,64,64,0.15)" strokeWidth={0.6} />
      <text x={30} y={168} fill="rgba(192,64,64,0.6)" fontSize={7.5} fontFamily={MONO} dominantBaseline="middle">Retire: datos corporativos eliminados</text>
    </svg>
  )
}

// ─── Hybrid Infrastructure Map ────────────────────────────────────────────────

export function HybridInfraMap({ className = '' }: { className?: string }) {
  const W = 680, H = 300

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`w-full ${className}`}
      style={{ fontFamily: MONO, background: 'transparent' }}
      role="img"
      aria-label="Mapa de infraestructura híbrida cloud y on-premises"
    >
      <defs>
        <pattern id="grid4" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.018)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#grid4)" rx={8} />
      <Label x={20} y={18} text="ARQUITECTURA HÍBRIDA — CLOUD + ON-PREMISES" size={8} color="#404060" anchor="start" />

      {/* Cloud zone */}
      <rect x={380} y={35} width={270} height={230} rx={8} fill="rgba(58,120,88,0.03)" stroke="rgba(58,120,88,0.15)" strokeWidth={0.7} strokeDasharray="4,3" />
      <Label x={515} y={50} text="AZURE / M365" size={8} color="#3a7858" />

      <Box x={400} y={65}  w={100} h={30} color="#3a7858" bg="rgba(58,120,88,0.08)" label="Entra ID P2" />
      <Box x={520} y={65}  w={100} h={30} color="#3a7858" bg="rgba(58,120,88,0.08)" label="Microsoft 365" />
      <Box x={400} y={110} w={100} h={30} color="#3d88a5" bg="rgba(61,136,165,0.08)" label="Intune MDM" />
      <Box x={520} y={110} w={100} h={30} color="#3d88a5" bg="rgba(61,136,165,0.08)" label="Defender" />
      <Box x={400} y={155} w={100} h={30} color="#4878b0" bg="rgba(72,120,176,0.08)" label="Azure Backup" />
      <Box x={520} y={155} w={100} h={30} color="#4878b0" bg="rgba(72,120,176,0.08)" label="Log Analytics" />
      <Box x={460} y={200} w={100} h={30} color="#b07828" bg="rgba(176,120,40,0.08)" label="Entra Connect" sublabel="Híbrido sync" />

      {/* On-prem zone */}
      <rect x={20} y={35} width={320} height={230} rx={8} fill="rgba(72,120,176,0.03)" stroke="rgba(72,120,176,0.15)" strokeWidth={0.7} strokeDasharray="4,3" />
      <Label x={180} y={50} text="ON-PREMISES" size={8} color="#4878b0" />

      <Box x={40}  y={65}  w={100} h={30} color="#4878b0" bg="rgba(72,120,176,0.08)" label="Active Directory" />
      <Box x={160} y={65}  w={100} h={30} color="#4878b0" bg="rgba(72,120,176,0.08)" label="File Server" />
      <Box x={280} y={65}  w={40}  h={30} color="#505070" bg="rgba(80,80,112,0.08)" label="ERP" />
      <Box x={40}  y={115} w={100} h={30} color="#3a3a60" bg="rgba(58,58,96,0.08)"  label="FortiGate NGFW" />
      <Box x={160} y={115} w={100} h={30} color="#3a3a60" bg="rgba(58,58,96,0.08)"  label="Switch Core" />
      <Box x={40}  y={165} w={100} h={30} color="#505070" bg="rgba(80,80,112,0.06)" label="Usuarios / PCs" />
      <Box x={160} y={165} w={100} h={30} color="#505070" bg="rgba(80,80,112,0.06)" label="VPN / Remoto" />

      {/* Sync arrow */}
      <Arrow x1={340} y1={215} x2={460} y2={215} color="#b07828" />
      <Arrow x1={460} y1={215} x2={340} y2={215} color="#b07828" />
      <Label x={400} y={230} text="Entra Connect Sync" size={7.5} color="#b07828" />

      {/* Internet */}
      <ellipse cx={340} cy={150} rx={22} ry={16} fill="#08090f" stroke="#2a2a3a" strokeWidth={0.7} />
      <Label x={340} y={150} text="WAN" size={7.5} color="#404060" />
      <Arrow x1={340} y1={134} x2={340} y2={80} color="#3a3a58" />
      <Arrow x1={340} y1={166} x2={340} y2={215} color="#3a3a58" />
    </svg>
  )
}

import Image from 'next/image'

export default function Loading() {
  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="brand-loading-state" role="status" aria-live="polite">
        <Image src="/brand/symbol-dark.svg" alt="" width={42} height={42} priority />
        <div>
          <div className="brand-lockup-title text-sm">VELKOR</div>
          <div className="brand-lockup-subtitle">SYSTEMS</div>
        </div>
        <span className="sr-only">Cargando Velkor Systems</span>
      </div>
    </div>
  )
}

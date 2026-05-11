export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-noc p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-noc-blue-light mb-4">
          Velkor Platform
        </h1>
        <p className="text-xl text-noc-gray mb-8">
          SOC/NOC Enterprise Operations Center
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-noc-blue rounded-lg p-6 bg-noc-darker hover:border-noc-blue-light transition">
            <h2 className="text-2xl font-semibold text-noc-green mb-2">Services</h2>
            <p className="text-noc-gray">Networks, CCTV, Infrastructure & Cloud</p>
          </div>

          <div className="border border-noc-blue rounded-lg p-6 bg-noc-darker hover:border-noc-blue-light transition">
            <h2 className="text-2xl font-semibold text-noc-orange mb-2">Dashboard</h2>
            <p className="text-noc-gray">Real-time monitoring and operations</p>
          </div>

          <div className="border border-noc-blue rounded-lg p-6 bg-noc-darker hover:border-noc-blue-light transition">
            <h2 className="text-2xl font-semibold text-noc-red mb-2">Assessments</h2>
            <p className="text-noc-gray">Technical evaluations & quotations</p>
          </div>

          <div className="border border-noc-blue rounded-lg p-6 bg-noc-darker hover:border-noc-blue-light transition">
            <h2 className="text-2xl font-semibold text-noc-green mb-2">Blog</h2>
            <p className="text-noc-gray">Industry insights & updates</p>
          </div>
        </div>
      </div>
    </main>
  )
}

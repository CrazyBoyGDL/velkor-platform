'use client'
import { useState } from 'react'

const serviceOptions = [
  'Network Infrastructure',
  'CCTV & Surveillance',
  'Microsoft 365 / Cloud',
  'Intune & Entra ID',
  'NOC Monitoring',
  'IT Audit & Compliance',
  'Other',
]

const companySizes = ['1-10', '11-50', '51-200', '200+']

type FormState = {
  name: string
  email: string
  company: string
  phone: string
  companySize: string
  services: string[]
  description: string
  urgency: string
}

const initialForm: FormState = {
  name: '',
  email: '',
  company: '',
  phone: '',
  companySize: '',
  services: [],
  description: '',
  urgency: 'normal',
}

export default function AssessmentsPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const toggleService = (s: string) => {
    setForm(f => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      // TODO: wire to Strapi API or Make/n8n webhook
      await new Promise(r => setTimeout(r, 1200))
      setStatus('sent')
      setForm(initialForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-gradient-noc min-h-screen pt-12 pb-24 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="noc-label">Free evaluation</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-noc-white mt-3 mb-4">
            Technical Assessment
          </h1>
          <p className="text-noc-gray-mid max-w-xl mx-auto">
            Fill out the form below and our engineers will contact you within one business day with a detailed evaluation and quote.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="noc-card border-noc-green/50 shadow-noc-green text-center p-12">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-noc-green mb-3">Assessment Request Received</h2>
            <p className="text-noc-gray-mid">
              Our team will review your request and contact you within 24 hours.
            </p>
            <button onClick={() => setStatus('idle')} className="mt-6 btn-outline">
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="noc-card border-noc-blue/40 space-y-6">

            {/* Contact info */}
            <div>
              <h3 className="text-noc-white font-semibold mb-4 pb-2 border-b border-noc-blue/20">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Smith' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'john@company.com' },
                  { label: 'Company', key: 'company', type: 'text', placeholder: 'Acme Corp' },
                  { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+1 555 000 0000' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="noc-label block mb-1.5">{label}</label>
                    <input
                      type={type}
                      required={key !== 'phone'}
                      value={form[key as keyof FormState] as string}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-noc-dark border border-noc-blue/30 rounded-lg px-4 py-2.5 text-noc-white placeholder-noc-gray text-sm focus:outline-none focus:border-noc-blue-light transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Company size */}
            <div>
              <label className="noc-label block mb-2">Company Size</label>
              <div className="flex flex-wrap gap-2">
                {companySizes.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, companySize: s }))}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      form.companySize === s
                        ? 'border-noc-blue-light bg-noc-blue/30 text-noc-white'
                        : 'border-noc-blue/30 text-noc-gray-mid hover:border-noc-blue/60'
                    }`}
                  >
                    {s} employees
                  </button>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-noc-white font-semibold mb-4 pb-2 border-b border-noc-blue/20">Services Required</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {serviceOptions.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm text-left transition-all ${
                      form.services.includes(s)
                        ? 'border-noc-blue-light bg-noc-blue/20 text-noc-white'
                        : 'border-noc-blue/20 text-noc-gray-mid hover:border-noc-blue/40'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                      form.services.includes(s) ? 'bg-noc-blue-light border-noc-blue-light' : 'border-noc-gray/50'
                    }`}>
                      {form.services.includes(s) && <span className="text-white text-xs">✓</span>}
                    </div>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="noc-label block mb-2">Urgency</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'low', label: 'Planning (1-3 months)', color: 'border-noc-green/50 text-noc-green bg-noc-green-dim/20' },
                  { value: 'normal', label: 'Soon (2-4 weeks)', color: 'border-noc-blue-light/50 text-noc-blue-light bg-noc-blue/20' },
                  { value: 'high', label: 'Urgent (this week)', color: 'border-noc-orange/50 text-noc-orange bg-noc-orange/10' },
                ].map(({ value, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, urgency: value }))}
                    className={`px-4 py-2 rounded-lg border text-xs font-medium transition-all ${
                      form.urgency === value ? color : 'border-noc-blue/20 text-noc-gray-mid'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="noc-label block mb-1.5">Current Situation / Notes</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Briefly describe your current infrastructure, pain points, or specific requirements..."
                className="w-full bg-noc-dark border border-noc-blue/30 rounded-lg px-4 py-3 text-noc-white placeholder-noc-gray text-sm focus:outline-none focus:border-noc-blue-light transition-colors resize-none"
              />
            </div>

            {status === 'error' && (
              <p className="text-noc-red text-sm">Something went wrong. Please try again or contact us directly.</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending' || form.services.length === 0}
              className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? 'Sending...' : 'Submit Assessment Request'}
            </button>

            <p className="text-center text-noc-gray text-xs">
              We respond within 1 business day. No spam, no commitments.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

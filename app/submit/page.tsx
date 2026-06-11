'use client'

import { useState } from 'react'

type FormData = {
  business_name: string
  contact_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  ein: string
  promo_text: string
  agreed_to_terms: boolean
}

const INITIAL: FormData = {
  business_name: '',
  contact_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  ein: '',
  promo_text: '',
  agreed_to_terms: false,
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {hint && <p className="text-xs text-white/35 mb-1.5">{hint}</p>}
      {children}
    </div>
  )
}

const INPUT =
  'w-full bg-white/[0.07] border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-green-500/60 focus:bg-white/10 transition-colors'

export default function SubmitPage() {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) {
        setErrorMsg(json.error ?? 'Submission failed. Please try again.')
        setStatus('error')
        return
      }
      setStatus('success')
      if (typeof window !== 'undefined' && 'fbq' in window) {
        ;(window as unknown as { fbq: (e: string, t: string) => void }).fbq('track', 'Lead')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-5">🎉</p>
        <h1 className="text-3xl font-bold mb-3 font-display uppercase tracking-wide">You&apos;re on the list!</h1>
        <p className="text-white/50 max-w-xs mx-auto">
          We received your submission and will review it within 24 hours.
          Your venue will appear on MatchHive once approved.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 font-display uppercase tracking-wide">List Your Venue</h1>
        <p className="text-white/50 text-sm">
          Free to list during World Cup 2026. Show up where fans are looking.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Business Name" required>
          <input
            className={INPUT}
            placeholder="The Goalpost Sports Bar"
            value={form.business_name}
            onChange={(e) => set('business_name', e.target.value)}
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Your Name" required>
            <input
              className={INPUT}
              placeholder="Maria Gonzalez"
              value={form.contact_name}
              onChange={(e) => set('contact_name', e.target.value)}
              required
            />
          </Field>
          <Field label="Phone" required>
            <input
              className={INPUT}
              type="tel"
              placeholder="(555) 000-0000"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              required
            />
          </Field>
        </div>

        <Field label="Email" required>
          <input
            className={INPUT}
            type="email"
            placeholder="you@yourvenue.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            required
          />
        </Field>

        <Field label="Street Address" required>
          <input
            className={INPUT}
            placeholder="123 Main St"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            required
          />
        </Field>

        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2">
            <Field label="City" required>
              <input
                className={INPUT}
                placeholder="Los Angeles"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                required
              />
            </Field>
          </div>
          <div className="col-span-1">
            <Field label="State" required>
              <input
                className={INPUT}
                placeholder="CA"
                maxLength={2}
                value={form.state}
                onChange={(e) => set('state', e.target.value.toUpperCase())}
                required
              />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="ZIP" required>
              <input
                className={INPUT}
                placeholder="90001"
                value={form.zip}
                onChange={(e) => set('zip', e.target.value)}
                required
              />
            </Field>
          </div>
        </div>

        <Field
          label="EIN (Federal Tax ID)"
          hint="XX-XXXXXXX format. Used to verify you own a registered business."
          required
        >
          <input
            className={INPUT}
            placeholder="12-3456789"
            value={form.ein}
            onChange={(e) => set('ein', e.target.value)}
            required
          />
        </Field>

        <Field
          label="Promo or Special Offer"
          hint="Optional — shown on your listing. Keep it short."
        >
          <input
            className={INPUT}
            placeholder="$5 drinks during all World Cup matches!"
            maxLength={100}
            value={form.promo_text}
            onChange={(e) => set('promo_text', e.target.value)}
          />
        </Field>

        <div className="flex items-start gap-3 pt-1">
          <input
            id="terms"
            type="checkbox"
            className="mt-0.5 accent-green-500 w-4 h-4 shrink-0 cursor-pointer"
            checked={form.agreed_to_terms}
            onChange={(e) => set('agreed_to_terms', e.target.checked)}
            required
          />
          <label htmlFor="terms" className="text-sm text-white/50 cursor-pointer leading-snug">
            I confirm this is a legitimate business and I am authorized to list it.
            I agree to MatchHive&apos;s terms of service.
          </label>
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 px-4 py-3 rounded-lg">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !form.agreed_to_terms}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-full font-semibold transition-colors"
        >
          {status === 'loading' ? 'Submitting…' : 'Submit Venue →'}
        </button>
      </form>
    </div>
  )
}

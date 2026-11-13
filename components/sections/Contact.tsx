'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Contact.module.css'

gsap.registerPlugin(ScrollTrigger)

const SOCIALS = [
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/karthikReddyMalasani',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/karthik-kumar-reddy-malasani/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'malasanikarthikkumarreddy@gmail.com',
    url: 'mailto:malasanikarthikkumarreddy@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m2 7 10 7 10-7"/>
      </svg>
    ),
  },
  {
    id: 'phone',
    label: '+91 93905 24907',
    url: 'tel:+919390524907',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16l.19.92z"/>
      </svg>
    ),
  },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-contact]', {
        opacity: 0, y: 40, duration: 0.85, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg('Please fill out all fields.')
      return
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    // If EmailJS credentials are provided, send via EmailJS API
    if (serviceId && templateId && publicKey) {
      setSubmitting(true)
      setErrorMsg('')

      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              name: form.name.trim(),
              from_name: form.name.trim(),
              user_name: form.name.trim(),
              email: form.email.trim(),
              from_email: form.email.trim(),
              user_email: form.email.trim(),
              reply_to: form.email.trim(),
              message: form.message.trim(),
            },
          }),
        })

        if (response.ok) {
          gsap.to('[data-form]', {
            opacity: 0,
            y: -10,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => setSent(true),
          })
        } else {
          const errText = await response.text()
          setErrorMsg(errText || 'Failed to send message via EmailJS. Please try again or reach out directly.')
        }
      } catch {
        setErrorMsg('Failed to send message. Please check your connection.')
      } finally {
        setSubmitting(false)
      }
      return
    }

    // Alternative fallback: Web3Forms if configured
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
    if (accessKey && accessKey !== 'YOUR_ACCESS_KEY_HERE') {
      setSubmitting(true)
      setErrorMsg('')

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            access_key: accessKey,
            name: form.name.trim(),
            email: form.email.trim(),
            message: form.message.trim(),
          }),
        })

        const data = await response.json()

        if (data.success) {
          gsap.to('[data-form]', {
            opacity: 0,
            y: -10,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => setSent(true),
          })
        } else {
          setErrorMsg(data.message || 'Something went wrong. Please try again.')
        }
      } catch {
        setErrorMsg('Failed to send message. Please check your connection.')
      } finally {
        setSubmitting(false)
      }
      return
    }

    setErrorMsg('Email service is not configured. Please add NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in your .env.local file.')
  }

  return (
    <section id="contact" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <span data-contact className={styles.label}>Get In Touch</span>
        <h2 data-contact className={styles.heading}>
          Let&apos;s build something<br />
          <span className="gradient-text">remarkable together</span>
        </h2>
        <p data-contact className={styles.sub}>
          Open to full-time roles, AI/ML internships, and freelance projects.
          Reach out at{' '}
          <a href="mailto:malasanikarthikkumarreddy@gmail.com" className={styles.emailLink}>
            malasanikarthikkumarreddy@gmail.com
          </a>
          {' '}or via any channel below.
        </p>

        <div className={styles.grid}>
          {/* Form */}
          <div data-contact>
            {sent ? (
              <div className={`${styles.thankYou} glass-card`}>
                <span className={styles.thankIcon}>✦</span>
                <h3>Message received!</h3>
                <p>I&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form
                data-form
                className={`${styles.form} glass-card`}
                onSubmit={handleSubmit}
                noValidate
              >
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.fieldLabel}>Your Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    className={styles.input}
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="emailInput" className={styles.fieldLabel}>Email Address</label>
                  <input
                    id="emailInput"
                    type="email"
                    placeholder="jane@company.com"
                    className={styles.input}
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="msg" className={styles.fieldLabel}>Message</label>
                  <textarea
                    id="msg"
                    placeholder="Tell me about your project..."
                    className={styles.textarea}
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                  <button
                    id="sendBtn"
                    type="submit"
                    className={styles.sendBtn}
                    disabled={submitting}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>

                  {errorMsg && (
                    <div className={styles.errorMessage}>
                      {errorMsg}
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Social links */}
          <div data-contact className={styles.socialCol}>
            <p className={styles.socialLabel}>Find me on</p>
            <div className={styles.socials}>
              {SOCIALS.map(s => (
                <a
                  key={s.id}
                  id={`social-${s.id}`}
                  href={s.url}
                  target={s.id !== 'email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`${styles.socialCard} glass-card`}
                >
                  <span className={styles.socialIcon}>{s.icon}</span>
                  <span className={styles.socialName}>{s.label}</span>
                  <span className={styles.socialArrow}>→</span>
                </a>
              ))}
            </div>
            <div className={styles.availability}>
              <span className={styles.availDot} />
              <span>Available for opportunities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className={styles.footer}>
        <span>© {new Date().getFullYear()} Malasani Karthik Kumar Reddy</span>
        <span>Built with Next.js · Three.js · GSAP</span>
      </div>
    </section>
  )
}

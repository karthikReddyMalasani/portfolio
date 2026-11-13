'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import dynamic from 'next/dynamic'
import styles from './VideoIntro.module.css'
import ScrollIndicator from '../ScrollIndicator/ScrollIndicator'

const CinematicLayer = dynamic(() => import('../CinematicLayer/CinematicLayer'), {
  ssr: false,
})

export default function VideoIntro() {
  const heroRef      = useRef<HTMLDivElement>(null)
  const fgVideoRef   = useRef<HTMLVideoElement>(null)
  const bgVideoRef   = useRef<HTMLVideoElement>(null)
  const taglineRef   = useRef<HTMLSpanElement>(null)
  const firstRef     = useRef<HTMLHeadingElement>(null)
  const lastRef      = useRef<HTMLHeadingElement>(null)
  const subtitleRef  = useRef<HTMLParagraphElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const controlsRef  = useRef<HTMLDivElement>(null)
  const badgeRef     = useRef<HTMLDivElement>(null)

  const [isMuted,  setIsMuted]  = useState(true)
  const [isPlaying,setIsPlaying]= useState(true)
  const [showBadge,setShowBadge]= useState(true)


  // ── GSAP entrance ────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        delay: 0.4,
      })

      tl.fromTo(taglineRef.current,
        { opacity: 0, y: 16, letterSpacing: '0.1em' },
        { opacity: 1, y: 0,  letterSpacing: '0.4em', duration: 1.1 }
      )
      .fromTo(firstRef.current,
        { opacity: 0, x: -60, skewX: -3 },
        { opacity: 1, x: 0,   skewX: 0,  duration: 1.3 },
        '-=0.7'
      )
      .fromTo(lastRef.current,
        { opacity: 0, x: 60,  skewX: 3 },
        { opacity: 1, x: 0,   skewX: 0,  duration: 1.3 },
        '-=1.1'
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0,   duration: 0.9 },
        '-=0.6'
      )
      .fromTo(ctaRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0,   duration: 0.8 },
        '-=0.5'
      )
      .fromTo(controlsRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0,   duration: 0.6 },
        '-=0.4'
      )
    }, heroRef)

    // Auto-hide sound badge
    const timer = setTimeout(() => {
      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          opacity: 0, y: -8, duration: 0.45, ease: 'power2.in',
          onComplete: () => setShowBadge(false),
        })
      }
    }, 4500)

    return () => {
      ctx.revert()
      clearTimeout(timer)
    }
  }, [])

  // ── Controls ─────────────────────────────────────────
  const toggleMute = useCallback(() => {
    if (!fgVideoRef.current) return
    const next = !isMuted
    fgVideoRef.current.muted = next
    setIsMuted(next)
    // Visual feedback
    gsap.fromTo(controlsRef.current,
      { scale: 0.97 }, { scale: 1, duration: 0.2, ease: 'back.out(2)' }
    )
  }, [isMuted])

  const togglePlay = useCallback(() => {
    const v = fgVideoRef.current
    const b = bgVideoRef.current
    if (!v) return
    if (isPlaying) {
      v.pause(); b?.pause()
    } else {
      v.play(); b?.play()
    }
    setIsPlaying(p => !p)
  }, [isPlaying])

  return (
    <section ref={heroRef} className={styles.hero}>

      {/* ── Ambient blurred background video ── */}
      <video
        ref={bgVideoRef}
        className={styles.bgVideo}
        src="/hero.mp4"
        autoPlay loop muted playsInline
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* ── Main foreground video ── */}
      <video
        ref={fgVideoRef}
        className={styles.fgVideo}
        src="/hero.mp4"
        autoPlay loop muted playsInline
        aria-label="Portfolio intro video of Karthik Kumar Reddy"
      />

      {/* ── Cinematic gradient overlays ── */}
      <div className={styles.overlayVignette}  aria-hidden="true" />
      <div className={styles.overlayBottom}    aria-hidden="true" />
      <div className={styles.overlayTop}       aria-hidden="true" />
      <div className={styles.overlaySides}     aria-hidden="true" />

      {/* ── Three.js bokeh particle layer ── */}
      <CinematicLayer />

      {/* ── Hero content ── */}
      <div className={styles.content}>
        <span ref={taglineRef} className={styles.tagline} style={{ opacity: 0 }}>
          ✦ &nbsp; AI/ML Developer &amp; Full-Stack Engineer
        </span>

        <div className={styles.nameBlock}>
          <h1 ref={firstRef} className={styles.firstName} style={{ opacity: 0 }}>
            Karthik
          </h1>
          <h2 ref={lastRef} className={styles.lastName} style={{ opacity: 0 }}>
            Kumar<br />Reddy
          </h2>
        </div>

        <p ref={subtitleRef} className={styles.subtitle} style={{ opacity: 0 }}>
          Building NLP applications, AI chatbots, and scalable web solutions<br className={styles.desktopBr} />
          where machine learning meets pixel-perfect engineering.
        </p>

        <div ref={ctaRef} className={styles.ctaRow} style={{ opacity: 0 }}>
          <a
            id="resumeBtn"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaPrimary}
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            View Résumé
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </a>
          <a id="exploreBtn" href="#about" className={styles.ctaOutline}>
            Explore Work
          </a>
        </div>
      </div>

      {/* ── Glassmorphism media controls ── */}
      <div ref={controlsRef} className={styles.controls} style={{ opacity: 0 }}>
        <button
          id="playPauseBtn"
          className={styles.controlBtn}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <rect x="5"  y="3" width="5" height="18" rx="1.5"/>
              <rect x="14" y="3" width="5" height="18" rx="1.5"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
        </button>

        <div className={styles.controlDivider} />

        <button
          id="muteBtn"
          className={styles.controlBtn}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none"/>
              <line x1="23" y1="9" x2="17" y2="15"/>
              <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          )}
        </button>
      </div>

      {/* ── Sound hint badge ── */}
      {showBadge && (
        <div ref={badgeRef} className={styles.soundBadge}>
          <span className={styles.soundPulse} />
          Tap for sound
        </div>
      )}

      {/* ── Scroll indicator ── */}
      <ScrollIndicator targetId="about" />


    </section>
  )
}

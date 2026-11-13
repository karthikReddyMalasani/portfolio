'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import styles from './ProjectModal.module.css'

interface Project {
  label: string
  title: string
  subtitle: string
  description: string
  stack: string[]
  status: string
  color: string
  highlights?: string[]
  github?: string
  demo?: string
  videoUrl?: string
}

interface Props {
  project: Project | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const cardRef     = useRef<HTMLDivElement>(null)
  const [showVideo, setShowVideo] = useState(false)

  // Animate in
  useEffect(() => {
    if (!project) return
    const tl = gsap.timeline()
    tl.fromTo(backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    )
    .fromTo(cardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0,  scale: 1,    duration: 0.45, ease: 'power3.out' },
      '-=0.15'
    )
  }, [project])

  // Close with animation
  const handleClose = useCallback(() => {
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(cardRef.current,
      { opacity: 0, y: 24, scale: 0.97, duration: 0.28, ease: 'power2.in' }
    )
    .to(backdropRef.current,
      { opacity: 0, duration: 0.2, ease: 'power2.in' },
      '-=0.1'
    )
  }, [onClose])

  // ESC key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showVideo) {
          setShowVideo(false)
        } else {
          handleClose()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showVideo, handleClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!project) return null

  return (
    <>
      <div ref={backdropRef} className={styles.backdrop} onClick={handleClose}>
        <div
          ref={cardRef}
          className={styles.card}
          onClick={e => e.stopPropagation()}
          style={{ '--accent': project.color } as React.CSSProperties}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          {/* Close */}
          <button
            id="modalCloseBtn"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6"  x2="6"  y2="18"/>
              <line x1="6"  y1="6"  x2="18" y2="18"/>
            </svg>
          </button>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.label}>{project.label}</span>
              <span className={styles.status}>{project.status}</span>
            </div>
            <div className={styles.accentBar} />
            <h2 id="modalTitle" className={styles.title}>{project.title}</h2>
            <p className={styles.subtitle}>{project.subtitle}</p>
          </div>

          {/* Body */}
          <div className={styles.body}>
            <div className={styles.descBlock}>
              <span className={styles.blockLabel}>Overview</span>
              <p className={styles.desc}>{project.description}</p>
            </div>

            {project.highlights && project.highlights.length > 0 && (
              <div className={styles.highlightsBlock}>
                <span className={styles.blockLabel}>Key Highlights</span>
                <ul className={styles.highlights}>
                  {project.highlights.map(h => (
                    <li key={h} className={styles.highlight}>
                      <span className={styles.bullet}>›</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.stackBlock}>
              <span className={styles.blockLabel}>Tech Stack</span>
              <div className={styles.stack}>
                {project.stack.map(s => (
                  <span key={s} className={styles.pill}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          {(project.github || project.demo || project.videoUrl) && (
            <div className={styles.footer}>
              {project.github && (
                <a
                  id="modalGithubBtn"
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnOutline}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
                  </svg>
                  View on GitHub
                </a>
              )}
              {project.demo && (
                <a
                  id="modalDemoBtn"
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnPrimary}
                >
                  Live Demo
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </a>
              )}
              {project.videoUrl && (
                <button
                  id="modalVideoBtn"
                  onClick={() => setShowVideo(true)}
                  className={styles.btnPrimary}
                  style={{ cursor: 'pointer' }}
                >
                  Watch Demo Video
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: '4px' }}>
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showVideo && (
        <div className={styles.videoOverlay} onClick={() => setShowVideo(false)}>
          <div className={styles.videoContainer} onClick={e => e.stopPropagation()}>
            <button
              className={styles.videoCloseBtn}
              onClick={() => setShowVideo(false)}
              aria-label="Close video player"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6"  x2="6"  y2="18"/>
                <line x1="6"  y1="6"  x2="18" y2="18"/>
              </svg>
            </button>
            <iframe
              src={project.videoUrl}
              className={styles.videoIframe}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}

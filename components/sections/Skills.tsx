'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Skills.module.css'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  {
    category: 'Languages',
    icon: '{ }',
    items: [
      { name: 'Java',       level: 90 },
      { name: 'Python',     level: 88 },
    ],
  },
  {
    category: 'Backend & Frameworks',
    icon: '⚙',
    items: [
      { name: 'Spring Boot',    level: 80 },
      { name: 'Node.js/Express', level: 82 },
      { name: 'FastAPI',        level: 84 },
      { name: 'REST APIs',      level: 86 },
    ],
  },
  {
    category: 'Web Technologies',
    icon: '◈',
    items: [
      { name: 'HTML',        level: 88 },
      { name: 'CSS',         level: 88 },
      { name: 'JavaScript',  level: 84 },
      { name: 'React.js',    level: 85 },
    ],
  },
  {
    category: 'Database',
    icon: '⬡',
    items: [
      { name: 'MySQL',       level: 80 },
      { name: 'PostgreSQL',  level: 80 },
      { name: 'Supabase',    level: 80 },
      { name: 'H2',          level: 78 },
    ],
  },
  {
    category: 'Core Concepts',
    icon: '◎',
    items: [
      { name: 'Data Structures & Algorithms', level: 85 },
      { name: 'OOPs',        level: 84 },
      { name: 'NLP',         level: 85 },
      { name: 'RAG',         level: 85 },
      { name: 'AI/ML',       level: 82 },
      { name: 'JDBC',        level: 80 },
    ],
  },
]

const CERTS = [
  { name: 'Top 6 — IBM SkillsBuild Hackathon', org: 'South Regional Level', icon: '🏆' },
  { name: '1st Prize — PALS INOWAH Hackathon', org: 'Industry-Level Hackathon', icon: '🏆' },
  { name: 'Java Full Stack Certification', org: 'Wipro TalentNext', icon: '✦', link: '/TNext-SE-2026-J_260661104_Malasani%20Karthik%20Kumar%20Reddy.pdf' },
  { name: 'Machine Learning Specialization', org: 'DeepLearning.AI & Stanford University · Coursera', icon: '✦' },
  { name: 'Fundamentals of AI', org: 'IBM SkillBuild', icon: '✦' },
  { name: 'Java Foundation Skills', org: 'Infosys Springboard', icon: '✦' },
  { name: '150+ DSA Problems Solved', org: 'LeetCode', icon: '✦' },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-skill]', {
        opacity: 0, y: 35, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
      gsap.from('[data-bar]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        stagger: 0.04,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <span data-skill className={styles.label}>Expertise</span>
        <h2 data-skill className={styles.heading}>
          Tools &amp; <span className="gradient-text">Technologies</span>
        </h2>

        <div className={styles.grid}>
          {SKILLS.map((group) => (
            <div key={group.category} data-skill className={`${styles.card} glass-card`}>
              <div className={styles.cardHeader}>
                <span className={styles.icon}>{group.icon}</span>
                <h3 className={styles.catTitle}>{group.category}</h3>
              </div>
              <div className={styles.items}>
                {group.items.map((sk) => (
                  <div key={sk.name} className={styles.skillRow}>
                    <div className={styles.skillMeta}>
                      <span className={styles.skillName}>{sk.name}</span>
                      <span className={styles.skillPct}>{sk.level}%</span>
                    </div>
                    <div className={styles.barTrack}>
                      <div
                        data-bar
                        className={styles.barFill}
                        style={{ width: `${sk.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Core Concepts strip */}
        <div data-skill className={styles.concepts}>
          <p className={styles.conceptsLabel}>Core Concepts</p>
          <div className={styles.conceptsList}>
            {['Data Structures & Algorithms', 'Object-Oriented Programming', 'Natural Language Processing',
              'Retrieval-Augmented Generation (RAG)', 'AI/ML Fundamentals', 'REST API Design',
              'Cloud Deployment', 'Real-time Streaming'].map(c => (
              <span key={c} className={styles.conceptChip}>{c}</span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div data-skill className={styles.certs}>
          <h3 className={styles.certsTitle}>Certifications &amp; Achievements</h3>
          <div className={styles.certGrid}>
            {CERTS.map((c) => {
              const className = `${c.icon === '🏆' ? styles.certCardHighlight : styles.certCard} glass-card`
              const content = (
                <>
                  <span className={styles.certIcon}>{c.icon}</span>
                  <div>
                    <span className={styles.certName}>{c.name}</span>
                    <span className={styles.certOrg}>
                      {c.org}
                      {c.link && <span style={{ marginLeft: '0.4rem', color: 'var(--orange)' }}>↗</span>}
                    </span>
                  </div>
                </>
              )
              return c.link ? (
                <a
                  key={c.name}
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {content}
                </a>
              ) : (
                <div key={c.name} className={className}>
                  {content}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

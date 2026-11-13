'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-fade]', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <span data-fade className={styles.label}>About Me</span>

        <div className={styles.grid}>
          <div className={styles.left}>
            <h2 data-fade className={styles.heading}>
              Building AI that<br />
              <span className="gradient-text">actually works</span>
            </h2>
            <p data-fade className={styles.body}>
              I&apos;m Karthik Kumar Reddy — a Computer Science (AI &amp; ML) student at
              G. Pulla Reddy Engineering College with a CGPA of 8.26. I have a strong
              foundation in Java, object-oriented design, and data structures &amp; algorithms,
              with hands-on experience building API-driven, database-backed applications.
            </p>
            <p data-fade className={styles.body}>
              From building MedAssist AI at Indian Servers and a RAG-powered book
              summarisation platform at Infosys Springboard, to my current work on a Java
              Spring Boot backend for CodeSense AI, I enjoy integrating REST APIs and AI
              services into clean, maintainable, scalable software.
            </p>
            <div data-fade className={styles.stats}>
              {[
                { value: '8.26',  label: 'CGPA' },
                { value: '150+',  label: 'LeetCode Problems' },
              ].map(s => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.right}>
            {/* Education */}
            <div data-fade className={`${styles.card} glass-card`}>
              <h3 className={styles.cardTitle}>Education</h3>

              <div className={styles.eduItem}>
                <span className={styles.eduDeg}>B.Tech — Computer Science (AI &amp; ML)</span>
                <span className={styles.eduSchool}>G. Pulla Reddy Engineering College</span>
                <span className={styles.eduYear}>2023 – Present · CGPA 8.26</span>
              </div>

              <div className={styles.divider} />

              <div className={styles.eduItem}>
                <span className={styles.eduDeg}>Intermediate MPC — 95.7%</span>
                <span className={styles.eduSchool}>Sri Chaitanya Jr College, Tirupati</span>
                <span className={styles.eduYear}>2021 – 2023</span>
              </div>

              <div className={styles.divider} />

              <div className={styles.eduItem}>
                <span className={styles.eduDeg}>SSC</span>
                <span className={styles.eduSchool}>Narayana e-Techno School, Tirupati</span>
                <span className={styles.eduYear}>2020 – 2021</span>
              </div>
            </div>

            {/* Experience */}
            <div data-fade className={`${styles.card} glass-card`}>
              <h3 className={styles.cardTitle}>Experience</h3>

              <div className={styles.expItem}>
                <div className={styles.expHeader}>
                  <span className={styles.expRole}>AI &amp; Cybersecurity Intern</span>
                  <span className={styles.expDate}>8 weeks</span>
                </div>
                <span className={styles.expCompany}>Indian Servers Private Limited</span>
                <ul className={styles.expBullets}>
                  <li>Built MedAssist AI — full-stack app with React (Vite), Tailwind CSS, Node.js/Express &amp; Gemini API</li>
                  <li>Designed API endpoints for an AI chat assistant and a PDF/image medical report analyzer</li>
                  <li>Applied privacy &amp; safety measures: temporary file storage, red-flag detection, disclaimers</li>
                </ul>
              </div>

              <div className={styles.divider} />

              <div className={styles.expItem}>
                <div className={styles.expHeader}>
                  <span className={styles.expRole}>AI/ML Intern</span>
                  <span className={styles.expDate}>Feb – Mar 2026</span>
                </div>
                <span className={styles.expCompany}>Infosys Springboard · Virtual Internship 6.0</span>
                <ul className={styles.expBullets}>
                  <li>Built NLP book summarisation platform using RAG, FastAPI, React &amp; Supabase</li>
                  <li>Integrated DistilBART &amp; RoBERTa for summarisation, Q&amp;A and quiz generation</li>
                </ul>
              </div>

              <div className={styles.divider} />

              <div className={styles.expItem}>
                <div className={styles.expHeader}>
                  <span className={styles.expRole}>AI &amp; Cloud Intern</span>
                  <span className={styles.expDate}>2025</span>
                </div>
                <span className={styles.expCompany}>IBM SkillBuild · Virtual Internship</span>
                <ul className={styles.expBullets}>
                  <li>AI-driven and cloud-based applications with IBM tools</li>
                  <li>Model deployment, API integration &amp; cloud technologies</li>
                </ul>
              </div>
            </div>

            {/* Interests */}
            <div data-fade className={`${styles.card} glass-card`}>
              <h3 className={styles.cardTitle}>Focus Areas</h3>
              <div className={styles.tags}>
                {['Java · Spring Boot', 'REST APIs', 'NLP / RAG', 'AI Chatbots', 'React · FastAPI',
                  'PostgreSQL · MySQL', 'DSA · LeetCode', 'Cloud (IBM)'].map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'
import styles from './Projects.module.css'

gsap.registerPlugin(ScrollTrigger)

const ProjectModal = dynamic(() => import('../ProjectModal/ProjectModal'), { ssr: false })

interface Project {
  id: number
  label: string
  title: string
  subtitle: string
  description: string
  stack: string[]
  status: string
  color: string
  highlight: boolean
  highlights?: string[]
  github?: string
  demo?: string
  videoUrl?: string
}

const PROJECTS: Project[] = [
  {
    id: 4,
    label: '01',
    title: 'CodeSense AI — Code Intelligence & Automated Documentation System',
    subtitle: 'Java Spring Boot · JavaParser · React · PostgreSQL · RAG',
    description:
      'A system that analyzes a GitHub repository or ZIP, answers questions about the codebase using RAG, and generates README, API docs, HLD, LLD and schema documentation. The React frontend is complete and the Spring Boot backend is under development.',
    highlights: [
      'Analyzes GitHub repositories or ZIP uploads and answers codebase questions using RAG',
      'Generates README, API docs, HLD, LLD and schema documentation automatically',
      'Java Spring Boot backend with JavaParser for static code analysis',
      'JWT + BCrypt authentication backed by PostgreSQL',
      'Groq-hosted LLMs power code understanding and documentation generation',
    ],
    stack: ['Spring Boot', 'JavaParser', 'React', 'PostgreSQL', 'JWT', 'Groq LLMs'],
    status: 'In Progress',
    color: '#7C5CFF',
    highlight: true,
    github: 'https://github.com/karthikReddyMalasani',
  },
  {
    id: 1,
    label: '02',
    title: 'AI-Powered Book Summarization & Key Idea Extraction Platform',
    subtitle: 'FastAPI · React · Supabase · NLP · RAG',
    description:
      'Built an NLP-powered platform using RAG, DistilBART, and RoBERTa to generate document summaries, answer context-aware queries, and create automated mind maps and quizzes. Developed using FastAPI, React, and Supabase with real-time streaming support.',
    highlights: [
      'Developed an AI-powered book summarization platform using NLP, RAG, FastAPI, React, and Supabase',
      'Integrated DistilBART and RoBERTa models for summarization, question answering, and quiz generation',
    ],
    stack: ['FastAPI', 'React', 'Supabase', 'DistilBART', 'RoBERTa', 'RAG'],
    status: 'Infosys Intern',
    color: '#FF6B35',
    highlight: true,
    github: 'https://github.com/karthikReddyMalasani',
    videoUrl: 'https://drive.google.com/file/d/1JvBA_kk5PW6ExVJL0Ph3ojG8mHaLiD66/preview',
  },
  {
    id: 2,
    label: '03',
    title: 'AI Healthcare Assistant',
    subtitle: 'Gemini API · Conversational AI',
    description:
      'Developed an AI-powered healthcare chatbot using the Gemini API to provide real-time health information, symptom guidance, and wellness recommendations through conversational AI.',
    highlights: [
      'Conversational AI powered by Google Gemini API for natural, empathetic dialogue',
      'Symptom analysis with guided follow-up questions for better context',
      'Personalised wellness recommendations based on conversation history',
      'Real-time response streaming for a smooth chat experience',
      'Safe, responsible AI — includes medical disclaimer and escalation prompts',
    ],
    stack: ['Gemini API', 'Python', 'React', 'FastAPI'],
    status: 'Live',
    color: '#C96E2E',
    highlight: false,
    github: 'https://github.com/karthikReddyMalasani',
    videoUrl: 'https://drive.google.com/file/d/1NzvVTzs7XgsxzIuwyiocLPqxDPfera_r/preview',
  },
  {
    id: 3,
    label: '04',
    title: 'Banking Management System',
    subtitle: 'Core Java · JDBC · H2 Database · React',
    description:
      'Built a dual-interface banking simulation with a Core Java backend (JDBC, H2 Database) handling authentication, account onboarding, and deposit/withdrawal transactions with minimum-balance safeguards, plus a React + Vite web portal replicating the full business logic with real-time dashboards and a searchable transaction audit log.',
    highlights: [
      'Core Java backend handling authentication, account onboarding, and deposit/withdrawal transactions',
      'Robust JDBC data integration with H2 Database for relational persistence',
      'Minimum-balance safeguards protecting account balance metrics during transactions',
      'React + Vite web portal replicating the full banking business logic',
      'Interactive real-time dashboards and a searchable transaction audit log',
    ],
    stack: ['Java', 'JDBC', 'H2 Database', 'React', 'Vite'],
    status: 'Interactive Demo',
    color: '#00F59B',
    highlight: true,
    github: 'https://github.com/karthikReddyMalasani',
    demo: '/bank',
  },
]

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-proj]', {
        opacity: 0,
        y: 50,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span data-proj className={styles.label}>Selected Work</span>
          <h2 data-proj className={styles.heading}>
            Projects that<br />
            <span className="gradient-text">push boundaries</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {PROJECTS.map((p) => (
            <article
              key={p.id}
              data-proj
              className={`${styles.card} ${p.highlight ? styles.cardFeatured : ''} glass-card`}
              style={{ '--accent': p.color } as React.CSSProperties}
            >
              <div className={styles.cardTop}>
                <span className={styles.number}>{p.label}</span>
                <span className={styles.status}>{p.status}</span>
              </div>
              <div className={styles.cardAccent} />
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardSub}>{p.subtitle}</p>
              <p className={styles.cardDesc}>{p.description}</p>
              <div className={styles.stack}>
                {p.stack.map(s => (
                  <span key={s} className={styles.pill}>{s}</span>
                ))}
              </div>
              <div className={styles.cardFooter}>
                <button
                  id={`viewDetailsBtn-${p.id}`}
                  className={styles.viewBtn}
                  onClick={() => setActiveProject(p)}
                >
                  View Details
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </section>
  )
}

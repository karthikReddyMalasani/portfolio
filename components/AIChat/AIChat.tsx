'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './AIChat.module.css'
import { retrieveChunks, synthesizeLocalAnswer } from '@/lib/rag/engine'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  sources?: Array<{ title: string; category: string }>
}

const STARTER_QUESTIONS = [
  'Tell me about your technical skills & stack',
  'What projects have you built?',
  'Tell me about your internships at Indian Servers & Infosys',
  'What hackathons have you won?',
  'How can I get in touch with you?'
]

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hi there! 👋 I'm **Karthik's AI Assistant**, powered by a **RAG (Retrieval-Augmented Generation)** model built on his verified resume, projects, and academic records.

Ask me anything about his experience, technical stack, internships, or achievements!`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, loading])

  const handleSend = async (questionText?: string) => {
    const query = (questionText || input).trim()
    if (!query || loading) return

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: query
    }

    setMessages(prev => [...prev, userMessage])
    if (!questionText) setInput('')
    setLoading(true)

    try {
      // 1. Try Next.js API route first
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      })

      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            role: 'assistant',
            text: data.answer,
            sources: data.sources
          }
        ])
        return
      }
      throw new Error('API failed')
    } catch {
      // 2. Client-side RAG fallback (guaranteed offline reliability)
      const scored = retrieveChunks(query, 3)
      const answer = synthesizeLocalAnswer(query, scored)
      const sources = scored.map(s => ({
        title: s.chunk.title,
        category: s.chunk.category
      }))

      setMessages(prev => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          role: 'assistant',
          text: answer,
          sources
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Render markdown-like simple formatting safely
  const formatText = (text: string) => {
    // Process lines for bullet points
    const lines = text.split('\n')
    return lines.map((line, idx) => {
      // Bold replacement
      let parsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Link replacement [text](url)
      parsed = parsed.replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // Bullet replacement
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div
            key={idx}
            style={{ paddingLeft: '0.8rem', textIndent: '-0.8rem', marginBottom: '0.25rem' }}
            dangerouslySetInnerHTML={{ __html: parsed }}
          />
        )
      }
      if (line.trim() === '') {
        return <div key={idx} style={{ height: '0.45rem' }} />
      }
      return (
        <p key={idx} dangerouslySetInnerHTML={{ __html: parsed }} />
      )
    })
  }

  return (
    <div className={styles.container}>
      {!isOpen && (
        <button
          className={styles.launcher}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
        >
          <span className={styles.pulseDot} />
          <span className={styles.sparkleIcon}>✦</span>
          <span>Ask Karthik AI</span>
        </button>
      )}

      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerTitleBlock}>
              <div className={styles.avatar}>AI</div>
              <div className={styles.headerText}>
                <span className={styles.headerName}>Karthik&apos;s Assistant</span>
                <span className={styles.headerStatus}>
                  <span className={styles.statusDot} />
                  RAG Knowledge Base Active
                </span>
              </div>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.messageRow} ${m.role === 'user' ? styles.userRow : styles.botRow}`}
              >
                <div className={m.role === 'user' ? styles.userBubble : styles.botBubble}>
                  {formatText(m.text)}
                </div>

                {/* Sources Attribution */}
                {m.sources && m.sources.length > 0 && (
                  <div className={styles.sources}>
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', alignSelf: 'center' }}>
                      📚 Sources:
                    </span>
                    {m.sources.slice(0, 2).map((s) => (
                      <span key={s.title} className={styles.sourceBadge}>
                        {s.title.replace(/^Project \d+:\s*/, '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className={`${styles.messageRow} ${styles.botRow}`}>
                <div className={`${styles.botBubble} ${styles.typing}`}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}

            {/* Quick Suggestions (if only 1 welcome message) */}
            {messages.length === 1 && (
              <div className={styles.suggestionsBox}>
                <span className={styles.suggestionPrompt}>Suggested Questions</span>
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    className={styles.suggestionChip}
                    onClick={() => handleSend(q)}
                  >
                    <span>{q}</span>
                    <span style={{ opacity: 0.5 }}>→</span>
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            className={styles.inputForm}
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about Karthik..."
              className={styles.inputField}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim() || loading}
              aria-label="Send question"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

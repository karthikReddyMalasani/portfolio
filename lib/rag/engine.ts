import { KNOWLEDGE_BASE, KnowledgeChunk } from './knowledge'

export interface ScoredChunk {
  chunk: KnowledgeChunk
  score: number
}

export interface RagResult {
  answer: string
  sources: Array<{ title: string; category: string }>
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
  'with', 'what', 'who', 'how', 'tell', 'me', 'about', 'his', 'him', 'can', 'you',
  'does', 'did', 'do', 'any', 'some', 'please', 'give', 'list', 'show'
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t))
}

export function retrieveChunks(query: string, topK: number = 3): ScoredChunk[] {
  const queryTokens = tokenize(query)
  const queryLower = query.toLowerCase()

  if (queryTokens.length === 0) {
    return [{ chunk: KNOWLEDGE_BASE[0], score: 1 }]
  }

  const scored: ScoredChunk[] = KNOWLEDGE_BASE.map(chunk => {
    let score = 0
    const chunkTokens = tokenize(chunk.content + ' ' + chunk.title)
    const chunkTextLower = (chunk.content + ' ' + chunk.title).toLowerCase()

    // 1. Exact phrase matching bonus
    if (chunkTextLower.includes(queryLower)) {
      score += 10
    }

    // 2. Keyword exact matches
    for (const kw of chunk.keywords) {
      if (queryLower.includes(kw.toLowerCase())) {
        score += 4
      }
    }

    // 3. Token overlap with TF-IDF approximation
    for (const token of queryTokens) {
      const freq = chunkTokens.filter(t => t === token).length
      if (freq > 0) {
        score += 1 + Math.log(1 + freq) * 2
      }
      // Partial prefix match
      if (token.length > 3 && chunkTokens.some(t => t.startsWith(token) || token.startsWith(t))) {
        score += 0.8
      }
    }

    // 4. Category-specific intent boosts
    if (/project|build|made|app|codesense|summariz|system/i.test(query) && chunk.category === 'projects') {
      score += 3
    }
    if (/intern|work|experience|company|job|indian servers|infosys/i.test(query) && chunk.category === 'experience') {
      score += 3
    }
    if (/skill|tech|stack|language|framework|java|python|backend/i.test(query) && chunk.category === 'skills') {
      score += 3
    }
    if (/college|degree|cgpa|study|education|school/i.test(query) && chunk.category === 'education') {
      score += 3
    }
    if (/hackathon|win|award|prize|certificat|pals|ibm/i.test(query) && chunk.category === 'certifications') {
      score += 3
    }
    if (/contact|email|phone|reach|linkedin|github|hire/i.test(query) && chunk.category === 'contact') {
      score += 4
    }

    return { chunk, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.filter(s => s.score > 0).slice(0, topK)
}

/**
 * Intelligent synthesis that generates direct, helpful answers based strictly on retrieved context.
 */
export function synthesizeLocalAnswer(query: string, scoredChunks: ScoredChunk[]): string {
  if (scoredChunks.length === 0 || scoredChunks[0].score === 0) {
    return `I don't have specific information about that in Karthik's profile. You can ask me about his **projects (CodeSense AI, Book Summarizer, etc.)**, **internships (Indian Servers, Infosys, IBM)**, **technical skills (Java, Spring Boot, React, Python, RAG)**, **education (CGPA 8.26 at GPREC)**, **hackathons**, or how to **contact** him directly!`
  }

  const queryLower = query.toLowerCase()
  const top = scoredChunks[0].chunk

  // Contact intent
  if (/contact|email|phone|reach|hire|linkedin|github/i.test(queryLower)) {
    return `You can reach out to Karthik through any of the following channels:
• **Email**: [malasanikarthikkumarreddy@gmail.com](mailto:malasanikarthikkumarreddy@gmail.com)
• **Phone**: [+91 93905 24907](tel:+919390524907)
• **LinkedIn**: [linkedin.com/in/karthik-kumar-reddy-malasani](https://www.linkedin.com/in/karthik-kumar-reddy-malasani/)
• **GitHub**: [github.com/karthikReddyMalasani](https://github.com/karthikReddyMalasani)

He is actively open to **Software Engineer (New Grad / Full-Time)** and **AI/ML Engineer** opportunities!`
  }

  // Hackathons & Achievements
  if (/hackathon|award|prize|win|achievement|pals/i.test(queryLower)) {
    return `Karthik has notable competitive hackathon achievements:
• 🏆 **1st Prize — PALS INOWAH Hackathon**: Won first place in this competitive industry-level hackathon.
• 🏆 **Top 6 — IBM SkillsBuild Hackathon**: Placed in the Top 6 at the South Regional Level across numerous competing collegiate teams.
• ✦ **LeetCode**: Solved **150+ DSA problems** focusing on core algorithms and data structures.
• ✦ **Certifications**: Wipro TalentNext Java Full Stack, Coursera Machine Learning Specialization (DeepLearning.AI), and IBM AI Fundamentals.`
  }

  // CodeSense AI specific
  if (/codesense/i.test(queryLower)) {
    return `**CodeSense AI** is Karthik's automated code intelligence and documentation system (team project under a faculty guide):
• **What it does**: Analyzes GitHub repositories or ZIP uploads, answers codebase questions via **RAG**, and generates README, API docs, HLD, LLD, and schema documentation.
• **Backend**: Java Spring Boot with **JavaParser** for static AST code analysis, **Groq-hosted LLMs**, and Neon PostgreSQL with JWT + BCrypt.
• **Frontend**: Modern React.js with Mermaid/PlantUML diagram visualizations.
• **Status**: React frontend completed; backend and RAG features actively under development.`
  }

  // General Projects intent
  if (/project|build|built|portfolio|work/i.test(queryLower)) {
    return `Here are Karthik's featured engineering projects:
1. **CodeSense AI** (*In Progress*): Automated codebase intelligence & documentation generator using Java Spring Boot, JavaParser AST, RAG, and React.
2. **AI-Powered Book Summarization & Key Ideas Platform** (*Infosys Intern*): NLP platform utilizing DistilBART and RoBERTa with RAG, FastAPI, React, and Supabase for chapter summaries, mind maps, and quizzes.
3. **AI Healthcare Assistant**: Conversational medical chatbot on Google Gemini API featuring symptom triage, wellness tips, and safety guardrails.
4. **Banking Management System**: Core Java & JDBC transaction simulation with H2 database and a React web dashboard (interactive demo available on this site at \`/bank\`).`
  }

  // Internships / Experience intent
  if (/intern|experience|company|work|job/i.test(queryLower)) {
    return `Karthik has completed three industry internships:
1. **Indian Servers Private Limited** (*AI & Cybersecurity Intern, 8 weeks*):
   • Guided by the CEO; built **MedAssist AI** using React, Tailwind, Node.js/Express & Google Gemini API.
   • Created emergency red-flag detection and automated medical report analysis from PDF/images.
2. **Infosys Springboard** (*AI/ML Intern, Virtual Internship 6.0*):
   • Built an NLP book summarization and question-answering platform with RAG, FastAPI, React, Supabase, and DistilBART/RoBERTa.
3. **IBM SkillBuild** (*AI & Cloud Intern, 2025*):
   • Built and deployed AI-driven and cloud-based applications on IBM tools.`
  }

  // Skills intent
  if (/skill|tech|stack|language|framework|java|python|fastapi|spring/i.test(queryLower)) {
    return `Karthik's core technical stack includes:
• **Languages**: Java (90%), Python (88%), JavaScript (84%).
• **Backend & APIs**: Spring Boot, Node.js/Express, FastAPI, REST API Design, JDBC.
• **AI & ML**: RAG, NLP, LLM APIs (Gemini, Groq), DistilBART, RoBERTa.
• **Databases**: PostgreSQL, MySQL, Supabase, H2.
• **Frontend**: React.js, Next.js, HTML5, CSS3, Tailwind CSS.
• **Fundamentals**: Data Structures & Algorithms (150+ LeetCode), OOPs, System Design.`
  }

  // Education intent
  if (/education|cgpa|college|degree|btech|school|gprec/i.test(queryLower)) {
    return `Karthik's academic background:
• **B.Tech — Computer Science (AI & ML)**: G. Pulla Reddy Engineering College (GPREC), Kurnool (2023 – Present). **CGPA: 8.26 / 10** (Expected graduation 2027).
• **Intermediate (MPC)**: Sri Chaitanya Junior College, Tirupati (2021 – 2023) — **95.7%**.
• **SSC**: Narayana e-Techno School, Tirupati (2020 – 2021).`
  }

  // Fallback: Combine top retrieved chunks into a crisp synthesis
  const mainPoints = scoredChunks.map(s => `• **${s.chunk.title}**:\n  ${s.chunk.content}`).join('\n\n')
  return `Based on Karthik's profile:\n\n${mainPoints}\n\n*Feel free to ask for deeper details on any project, skill, or internship!*`
}

/**
 * Full RAG query processor.
 */
export async function queryRag(query: string): Promise<RagResult> {
  const scoredChunks = retrieveChunks(query, 3)
  const sources = scoredChunks.map(s => ({
    title: s.chunk.title,
    category: s.chunk.category
  }))

  // Optional: Check if GEMINI_API_KEY is available for external LLM augmentation
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    try {
      const context = scoredChunks.map(s => `[${s.chunk.title}]: ${s.chunk.content}`).join('\n\n')
      const systemPrompt = `You are the official AI Assistant on Karthik Kumar Reddy's portfolio website.
Answer the user's question accurately, concisely, and professionally using ONLY the provided context. If the answer is not in the context, politely suggest asking about his projects, skills, education, or contact details.
Do not hallucinate facts.

CONTEXT:
${context}`

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUSER QUESTION: ${query}` }] }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 600,
          }
        })
      })

      if (res.ok) {
        const data = await res.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          return { answer: text.trim(), sources }
        }
      }
    } catch {
      // Fallback cleanly to local synthesis if network/key fails
    }
  }

  const answer = synthesizeLocalAnswer(query, scoredChunks)
  return { answer, sources }
}


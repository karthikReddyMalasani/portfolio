export interface KnowledgeChunk {
  id: string
  category: 'profile' | 'education' | 'experience' | 'projects' | 'skills' | 'certifications' | 'contact'
  title: string
  content: string
  keywords: string[]
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: 'bio-summary',
    category: 'profile',
    title: 'Professional Summary & Bio',
    content: `Malasani Karthik Kumar Reddy is a Computer Science (AI & ML) undergraduate at G. Pulla Reddy Engineering College (CGPA 8.26, graduating in 2027). He builds full-stack, AI-powered products end-to-end using Java, Python, and JavaScript across React, Node.js, FastAPI, and Spring Boot. He has completed three internships (Indian Servers, Infosys Springboard, IBM SkillBuild) and led multi-person team projects. He is quick to learn unfamiliar systems, validates AI-assisted output meticulously, and is actively seeking a Software Engineer (New Grad / Full-Time) or AI/ML Engineer role.`,
    keywords: ['karthik', 'who is', 'about', 'summary', 'bio', 'profile', 'overview', 'graduate', 'roles', 'job', 'seeking']
  },
  {
    id: 'education-gprec',
    category: 'education',
    title: 'B.Tech in Computer Science (AI & ML) — GPREC',
    content: `Karthik is pursuing his Bachelor of Technology (B.Tech) in Computer Science & Engineering (Artificial Intelligence and Machine Learning) at G. Pulla Reddy Engineering College (GPREC), Kurnool. He has maintained a strong academic record with a CGPA of 8.26 / 10 and is expected to graduate in 2027.`,
    keywords: ['education', 'college', 'degree', 'btech', 'gprec', 'g pulla reddy', 'cgpa', 'marks', 'gpa', 'university', 'study', 'graduation']
  },
  {
    id: 'education-schooling',
    category: 'education',
    title: 'Schooling & Intermediate Education',
    content: `Karthik scored 95.7% in Intermediate MPC from Sri Chaitanya Junior College, Tirupati (2021 – 2023). Before that, he completed his SSC at Narayana e-Techno School, Tirupati (2020 – 2021).`,
    keywords: ['school', 'intermediate', 'mpc', 'sri chaitanya', 'narayana', 'tirupati', 'ssc', 'tenth', '12th']
  },
  {
    id: 'exp-indian-servers',
    category: 'experience',
    title: 'AI & Cybersecurity Intern — Indian Servers Private Limited',
    content: `Completed an intensive 8-week internship in AI and cybersecurity under the direct guidance of the company's CEO. Built "MedAssist AI", a full-stack medical assistant web application using React (Vite), Tailwind CSS, Node.js/Express, and Google Gemini API. Developed an AI chat assistant with an emergency red-flag detection system and a PDF/image medical report analyzer that translates complex diagnostic reports into plain-language summaries. Engineered the system with strict privacy safeguards including temporary file storage deleted immediately after analysis and persistent medical disclaimers.`,
    keywords: ['indian servers', 'medassist', 'internship', 'cybersecurity', 'gemini', 'medical', 'express', 'node', 'healthcare', 'experience', 'work']
  },
  {
    id: 'exp-infosys',
    category: 'experience',
    title: 'AI/ML Intern — Infosys Springboard Virtual Internship 6.0',
    content: `Completed an AI/ML internship (Feb – Mar 2026) at Infosys Springboard. Designed and developed an AI-powered book summarization and key idea extraction platform using NLP, RAG, FastAPI, React, and Supabase. Integrated DistilBART and RoBERTa models for abstractive summarization, context-aware question answering, and automated mind maps/quizzes with real-time response streaming. Met all milestones and debugged system bottlenecks based on mentor feedback.`,
    keywords: ['infosys', 'springboard', 'internship', 'book summarization', 'rag', 'distilbart', 'roberta', 'fastapi', 'supabase', 'quiz']
  },
  {
    id: 'exp-ibm',
    category: 'experience',
    title: 'AI & Cloud Intern — IBM SkillBuild Virtual Internship',
    content: `Completed the IBM SkillBuild Virtual Internship (2025). Developed AI-driven and cloud-based applications utilizing IBM Cloud tools. Gained practical experience in model deployment, API integration, and cloud architecture.`,
    keywords: ['ibm', 'skillbuild', 'internship', 'cloud', 'deployment', 'virtual internship']
  },
  {
    id: 'proj-codesense',
    category: 'projects',
    title: 'Project 01: CodeSense AI — Code Intelligence & Documentation System',
    content: `CodeSense AI is a team project (three-member team under a faculty guide) that analyzes GitHub repositories or uploaded ZIP files, answers questions about the codebase using RAG, and automatically generates READMEs, API docs, HLD (High-Level Design), LLD (Low-Level Design), and database schema documentation. Tech stack: React.js frontend, Java Spring Boot backend, JavaParser for static AST code analysis, Groq-hosted LLMs for code understanding, Neon PostgreSQL database, JWT + BCrypt authentication, Mermaid/PlantUML diagrams, and Render deployment. Frontend is complete and backend/AI pipelines are in active development.`,
    keywords: ['codesense', 'documentation', 'spring boot', 'javaparser', 'groq', 'neon postgresql', 'hld', 'lld', 'github', 'ast', 'project']
  },
  {
    id: 'proj-book-summary',
    category: 'projects',
    title: 'Project 02: AI-Powered Book Summarization & Key Idea Extraction',
    content: `An NLP and RAG platform that digests long documents and books to generate chapter summaries, answer semantic queries, and create interactive mind maps and test quizzes. Developed with FastAPI, React, and Supabase with real-time SSE streaming. Utilizes Hugging Face DistilBART for abstractive text summarization and RoBERTa for extractive question answering. GitHub repository: https://github.com/karthikReddyMalasani`,
    keywords: ['book summarization', 'distilbart', 'roberta', 'rag', 'nlp', 'fastapi', 'react', 'supabase', 'project', 'mind maps']
  },
  {
    id: 'proj-healthcare',
    category: 'projects',
    title: 'Project 03: AI Healthcare Assistant',
    content: `A conversational AI assistant powered by Google Gemini API providing real-time health information, symptom analysis, and personalized wellness tips. Features guided follow-up questions, conversational memory, medical safety guardrails, emergency escalation warnings, and real-time streaming dialogue. Stack: Gemini API, Python, React, FastAPI.`,
    keywords: ['healthcare', 'assistant', 'gemini api', 'symptoms', 'chatbot', 'medical', 'wellness', 'project']
  },
  {
    id: 'proj-banking',
    category: 'projects',
    title: 'Project 04: Banking Management System (Interactive Demo)',
    content: `A dual-interface banking simulation with a Core Java backend (JDBC, H2 Database) handling secure authentication, account onboarding, deposit/withdrawal transactions with minimum-balance safeguards, plus a React + Vite web portal replicating the full business logic with interactive real-time dashboards and a searchable transaction audit log. An interactive demo is hosted directly at /bank on this portfolio.`,
    keywords: ['banking', 'bank', 'java', 'jdbc', 'h2', 'demo', 'transactions', 'accounts', 'project']
  },
  {
    id: 'skills-languages-backend',
    category: 'skills',
    title: 'Languages & Backend Technologies',
    content: `Languages: Java (90%), Python (88%), JavaScript (84%). Backend & APIs: Java Spring Boot (80%), Node.js / Express (82%), FastAPI (84%), REST API design and integration (86%), JDBC (80%). Databases: MySQL (80%), PostgreSQL (80%), Supabase (80%), H2 Database (78%).`,
    keywords: ['java', 'python', 'javascript', 'spring boot', 'node', 'express', 'fastapi', 'rest api', 'mysql', 'postgresql', 'supabase', 'database', 'backend', 'skills']
  },
  {
    id: 'skills-ai-web',
    category: 'skills',
    title: 'AI/ML, Frontend & Core Concepts',
    content: `AI/ML: Natural Language Processing (NLP), Retrieval-Augmented Generation (RAG), LLM APIs (Gemini API, Groq LLMs), DistilBART, RoBERTa, Machine Learning fundamentals. Frontend: React.js (85%), HTML (88%), CSS (88%), Tailwind CSS, Vite, Next.js. Core Concepts: Data Structures & Algorithms (85%), Object-Oriented Programming / OOPs (84%), System Design basics, Cloud Deployment.`,
    keywords: ['ai', 'ml', 'machine learning', 'nlp', 'rag', 'react', 'frontend', 'tailwind', 'dsa', 'algorithms', 'oops', 'system design', 'skills']
  },
  {
    id: 'achievements-hackathons',
    category: 'certifications',
    title: 'Hackathons & Competitions',
    content: `1. 1st Prize — PALS INOWAH Industry-Level Hackathon (Won first place competing at the industry level).
2. Top 6 — IBM SkillsBuild Hackathon (South Regional Level finish among hundreds of participating teams across southern India).
3. LeetCode: Solved 150+ Data Structures and Algorithms problems in Java & Python.`,
    keywords: ['hackathon', 'achievements', 'awards', 'prize', 'pals', 'inowah', 'ibm hackathon', 'top 6', 'south region', 'leetcode', '150+']
  },
  {
    id: 'certifications-list',
    category: 'certifications',
    title: 'Certifications & Credentials',
    content: `1. Java Full Stack Certification — Wipro TalentNext (Comprehensive full stack Java developer credential; certificate viewable on the site).
2. Machine Learning Specialization — DeepLearning.AI & Stanford University (Coursera, taught by Andrew Ng).
3. Fundamentals of AI — IBM SkillBuild.
4. Java Foundation Skills — Infosys Springboard.`,
    keywords: ['certifications', 'wipro', 'talentnext', 'deeplearning.ai', 'stanford', 'coursera', 'andrew ng', 'infosys springboard', 'credentials']
  },
  {
    id: 'contact-details',
    category: 'contact',
    title: 'Contact Information & Links',
    content: `Email: malasanikarthikkumarreddy@gmail.com
Phone: +91 93905 24907
LinkedIn: https://www.linkedin.com/in/karthik-kumar-reddy-malasani/
GitHub: https://github.com/karthikReddyMalasani
Location: Kurnool / Tirupati, Andhra Pradesh, India.
Availability: Open to full-time Software Engineer / AI-ML roles (graduating 2027 / new grad), internships, and collaborative software projects.`,
    keywords: ['contact', 'email', 'phone', 'call', 'linkedin', 'github', 'hire', 'location', 'reach out', 'number', 'address', 'available']
  }
]


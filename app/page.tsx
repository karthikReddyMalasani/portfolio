import styles from './page.module.css'
import VideoIntro from '@/components/VideoIntro/VideoIntro'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Skills from '@/components/sections/Skills'
import Contact from '@/components/sections/Contact'
import AIChat from '@/components/AIChat/AIChat'

export default function Home() {
  return (
    <main className={styles.page}>
      <VideoIntro />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <AIChat />
    </main>
  )
}

'use client'

import { useRef, useEffect } from 'react'
import styles from './ScrollIndicator.module.css'

interface Props {
  targetId?: string
}

export default function ScrollIndicator({ targetId = 'about' }: Props) {
  const lineRef = useRef<HTMLSpanElement>(null)

  const handleClick = () => {
    const el = document.getElementById(targetId)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button
      id="scrollIndicatorBtn"
      className={styles.indicator}
      onClick={handleClick}
      aria-label={`Scroll to ${targetId} section`}
    >
      <span className={styles.label}>Scroll</span>
      <span className={styles.lineWrap}>
        <span ref={lineRef} className={styles.line} />
      </span>
    </button>
  )
}

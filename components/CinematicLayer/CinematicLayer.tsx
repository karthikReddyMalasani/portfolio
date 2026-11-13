'use client'

import { useRef, useEffect } from 'react'
import type { BufferAttribute } from 'three'
import styles from './CinematicLayer.module.css'

export default function CinematicLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let animId: number
    let disposed = false

    // Capture original positions and phases for sine-wave animation
    const originalPositions: Float32Array = new Float32Array(0)

    const init = async () => {
      const THREE = await import('three')
      if (disposed || !canvas) return

      // ── Renderer ──────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)

      const setSize = () => {
        const w = canvas.parentElement?.clientWidth ?? window.innerWidth
        const h = canvas.parentElement?.clientHeight ?? window.innerHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }

      // ── Scene & Camera ────────────────────────────────────
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
      camera.position.z = 6

      setSize()

      // ── Particles ─────────────────────────────────────────
      const COUNT = 280
      const pos = new Float32Array(COUNT * 3)
      const col = new Float32Array(COUNT * 3)
      const sizes = new Float32Array(COUNT)
      const phases = new Float32Array(COUNT)
      const speeds = new Float32Array(COUNT)

      for (let i = 0; i < COUNT; i++) {
        // Spread across viewport
        pos[i * 3]     = (Math.random() - 0.5) * 22
        pos[i * 3 + 1] = (Math.random() - 0.5) * 14
        pos[i * 3 + 2] = (Math.random() - 0.5) * 6

        phases[i] = Math.random() * Math.PI * 2
        speeds[i] = 0.3 + Math.random() * 0.7

        // Color palette: 65% warm orange, 20% golden, 15% soft white
        const r = Math.random()
        if (r < 0.65) {
          col[i * 3]     = 1.0
          col[i * 3 + 1] = 0.35 + Math.random() * 0.25
          col[i * 3 + 2] = 0.08 + Math.random() * 0.12
        } else if (r < 0.85) {
          col[i * 3]     = 1.0
          col[i * 3 + 1] = 0.75 + Math.random() * 0.15
          col[i * 3 + 2] = 0.2 + Math.random() * 0.15
        } else {
          col[i * 3]     = 1.0
          col[i * 3 + 1] = 0.93 + Math.random() * 0.07
          col[i * 3 + 2] = 0.85 + Math.random() * 0.15
        }

        sizes[i] = 0.5 + Math.random() * 3.5
      }

      // Store originals for animation reference
      const origPos = new Float32Array(pos)

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(col, 3))

      const material = new THREE.PointsMaterial({
        size: 0.07,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        sizeAttenuation: true,
      })

      const points = new THREE.Points(geometry, material)
      scene.add(points)

      // ── Mouse Parallax ────────────────────────────────────
      const mouse  = { x: 0, y: 0 }
      const target = { x: 0, y: 0 }

      const onMouseMove = (e: MouseEvent) => {
        target.x = (e.clientX / window.innerWidth  - 0.5) * 2
        target.y = (e.clientY / window.innerHeight - 0.5) * 2
      }
      const onResize = () => setSize()
      window.addEventListener('mousemove', onMouseMove, { passive: true })
      window.addEventListener('resize',    onResize,    { passive: true })

      // ── Animation Loop ────────────────────────────────────
      let t = 0
      const posAttr = geometry.attributes.position as BufferAttribute

      const tick = () => {
        if (disposed) return
        animId = requestAnimationFrame(tick)
        t += 0.007

        for (let i = 0; i < COUNT; i++) {
          const ph = phases[i]
          const sp = speeds[i]
          posAttr.array[i * 3]     = origPos[i * 3]     + Math.cos(t * sp * 0.8 + ph) * 0.25
          posAttr.array[i * 3 + 1] = origPos[i * 3 + 1] + Math.sin(t * sp        + ph) * 0.35
        }
        posAttr.needsUpdate = true

        // Smooth camera parallax
        mouse.x += (target.x - mouse.x) * 0.04
        mouse.y += (target.y - mouse.y) * 0.04
        camera.position.x = mouse.x * 0.35
        camera.position.y = mouse.y * 0.20

        renderer.render(scene, camera)
      }
      tick()

      // ── Disposal ──────────────────────────────────────────
      return () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize',    onResize)
        cancelAnimationFrame(animId)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
      }
    }

    let cleanup: (() => void) | undefined
    init().then(fn => { cleanup = fn })

    return () => {
      disposed = true
      cancelAnimationFrame(animId)
      cleanup?.()
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}

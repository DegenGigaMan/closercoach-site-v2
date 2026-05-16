/** @fileoverview L3 particle system for S1 Hero and S8 Final CTA.
 * Canvas 2D with 3 depth layers. Two modes: 'ambient' (hero) and 'converge' (S8).
 * Per atmosphere-spec.md Section 4.3 and motion-spec.md Section 5. */

'use client'

import { useRef, useEffect, useCallback } from 'react'

type ParticleMode = 'ambient' | 'converge'

interface Particle {
	x: number
	y: number
	size: number
	speed: number
	opacity: number
	baseOpacity: number
	layer: 'far' | 'mid' | 'near'
}

const LAYER_CONFIG = {
	far: { count: 10, size: 1.5, speed: 0.15, opacity: 0.06 },
	mid: { count: 12, size: 2, speed: 0.25, opacity: 0.12 },
	near: { count: 8, size: 3, speed: 0.4, opacity: 0.20 },
} as const

function createParticles(width: number, height: number): Particle[] {
	const particles: Particle[] = []
	for (const [layer, config] of Object.entries(LAYER_CONFIG)) {
		for (let i = 0; i < config.count; i++) {
			particles.push({
				x: Math.random() * width,
				y: Math.random() * height,
				size: config.size,
				speed: config.speed * (0.8 + Math.random() * 0.4),
				opacity: config.opacity,
				baseOpacity: config.opacity,
				layer: layer as Particle['layer'],
			})
		}
	}
	return particles
}

export default function ParticleCanvas({
	mode = 'ambient',
	className = '',
}: {
	mode?: ParticleMode
	className?: string
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const particlesRef = useRef<Particle[]>([])
	const animationRef = useRef<number>(0)

	const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
		ctx.clearRect(0, 0, width, height)
		const centerX = width / 2
		const centerY = height / 2

		for (const p of particlesRef.current) {
			if (mode === 'ambient') {
				// Upward drift with weak center-pull
				p.y -= p.speed
				p.x += (Math.random() - 0.5) * 0.3
				const pullX = (centerX - p.x) * 0.0005
				p.x += pullX

				// Wrap at top
				if (p.y < -10) {
					p.y = height + 10
					p.x = Math.random() * width
				}
			} else {
				// Converge mode: inward drift toward center
				const dx = centerX - p.x
				const dy = centerY - p.y
				const dist = Math.sqrt(dx * dx + dy * dy)
				const force = 0.002 * dist
				p.x += (dx / dist) * force * (p.layer === 'near' ? 1.5 : 1)
				p.y += (dy / dist) * force * (p.layer === 'near' ? 1.5 : 1)

				// Brighten as approaching center
				const maxDist = Math.sqrt(width * width + height * height) / 2
				p.opacity = p.baseOpacity * (1 + 0.3 * (1 - dist / maxDist))

				// Respawn at edges when reaching center
				if (dist < 40) {
					p.opacity = 0
					const edge = Math.floor(Math.random() * 4)
					if (edge === 0) { p.x = 0; p.y = Math.random() * height }
					else if (edge === 1) { p.x = width; p.y = Math.random() * height }
					else if (edge === 2) { p.y = 0; p.x = Math.random() * width }
					else { p.y = height; p.x = Math.random() * width }
				}
			}

			// Draw particle
			ctx.globalAlpha = p.opacity
			ctx.fillStyle = p.layer === 'near' ? '#FFFFFF' : '#10B981'
			ctx.beginPath()
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
			ctx.fill()
		}
	}, [mode])

	useEffect(() => {
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (prefersReduced) return

		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const resize = () => {
			const dpr = window.devicePixelRatio || 1
			canvas.width = canvas.offsetWidth * dpr
			canvas.height = canvas.offsetHeight * dpr
			ctx.scale(dpr, dpr)
			particlesRef.current = createParticles(canvas.offsetWidth, canvas.offsetHeight)
		}

		resize()
		window.addEventListener('resize', resize)

		const animate = () => {
			if (document.hidden) {
				animationRef.current = requestAnimationFrame(animate)
				return
			}
			draw(ctx, canvas.offsetWidth, canvas.offsetHeight)
			animationRef.current = requestAnimationFrame(animate)
		}

		animationRef.current = requestAnimationFrame(animate)

		return () => {
			window.removeEventListener('resize', resize)
			cancelAnimationFrame(animationRef.current)
		}
	}, [draw])

	return (
		<canvas
			ref={canvasRef}
			className={`pointer-events-none absolute inset-0 z-[2] h-full w-full ${className}`}
			aria-hidden="true"
		/>
	)
}

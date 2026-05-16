/** @fileoverview TextType — typewriter effect adapted from ReactBits
 * (TextAnimations/TextType). Single-string typing only (no rotating array, no
 * deletion loop). Adds `start` prop so callers can chain with motion timelines.
 *
 * Source: ReactBits MCP `mcp__reactbits__get_component name:TextType` 2026-04-25.
 * Customized for CC: TypeScript, single string, gated `start` prop, no GSAP cursor
 * blink (uses CSS animation), token-friendly cursor styling.
 *
 * @description Typewriter that reveals `text` one character at a time once
 * `start` is true. Holds settled (full text) afterwards. Cursor blinks via CSS.
 * No deletion. Reduced-motion: snaps to full text instantly.
 */

'use client'

import { useEffect, useRef, useState, createElement } from 'react'
import type { ElementType, HTMLAttributes } from 'react'
import { useReducedMotion } from 'motion/react'

interface TextTypeProps extends HTMLAttributes<HTMLElement> {
	text: string
	as?: ElementType
	typingSpeed?: number
	initialDelay?: number
	start?: boolean
	showCursor?: boolean
	cursorCharacter?: string
	cursorClassName?: string
	hideCursorOnComplete?: boolean
}

export default function TextType({
	text,
	as: Component = 'span',
	typingSpeed = 24,
	initialDelay = 0,
	start = true,
	showCursor = true,
	cursorCharacter = '|',
	cursorClassName = '',
	hideCursorOnComplete = true,
	className = '',
	...props
}: TextTypeProps) {
	const reduced = useReducedMotion() ?? false
	const [displayed, setDisplayed] = useState(reduced ? text : '')
	const [charIndex, setCharIndex] = useState(reduced ? text.length : 0)
	const startedRef = useRef(false)

	/* Reset internal state when start goes false so a subsequent start=true
	 * always types from the beginning (guards against the start:true→false→true
	 * cycle that caused the JOB field to stay empty). */
	useEffect(() => {
		if (!start && !reduced) {
			setDisplayed('')
			setCharIndex(0)
			startedRef.current = false
		}
	}, [start, reduced])

	useEffect(() => {
		if (reduced) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- prefers-reduced-motion short-circuit fast-forwards typewriter to settled; intentional one-shot batch update
			setDisplayed(text)
			setCharIndex(text.length)
			return
		}
		if (!start) return
		startedRef.current = true

		if (charIndex >= text.length) return

		const isFirst = charIndex === 0 && displayed === ''
		const delay = isFirst ? initialDelay : typingSpeed

		const timeout = setTimeout(() => {
			setDisplayed((prev) => prev + text[charIndex])
			setCharIndex((prev) => prev + 1)
		}, delay)

		return () => clearTimeout(timeout)
	}, [start, text, charIndex, displayed, typingSpeed, initialDelay, reduced])

	const isComplete = charIndex >= text.length
	const cursorVisible = showCursor && (!hideCursorOnComplete || !isComplete)

	return createElement(
		Component,
		{ className: `text-type ${className}`.trim(), ...props },
		<span className='text-type__content'>{displayed}</span>,
		cursorVisible && (
			<span
				aria-hidden='true'
				className={`text-type__cursor ${cursorClassName}`.trim()}
			>
				{cursorCharacter}
			</span>
		),
	)
}

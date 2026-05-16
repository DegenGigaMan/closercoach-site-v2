/** @fileoverview Root-level error boundary. Replaces root layout when the
 * layout itself crashes, so it must define its own <html> + <body> and cannot
 * rely on Tailwind tokens / Lora / Inter being loaded. Critical visuals are
 * inline-styled with system-font fallbacks.
 *
 * IMPORTANT: This Next.js exposes `unstable_retry` (NOT `reset`) per
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`. */

'use client'

import { useEffect } from 'react'

export default function GlobalError({
	error,
	unstable_retry,
}: {
	error: Error & { digest?: string }
	unstable_retry: () => void
}) {
	useEffect(() => {
		console.error('[global-error.tsx]', error)
	}, [error])

	return (
		<html lang='en'>
			<body
				style={{
					margin: 0,
					minHeight: '100vh',
					background: '#0D0F14',
					color: '#FFFFFF',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily:
						'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
					padding: '24px',
				}}
			>
				<div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
					<div
						style={{
							display: 'inline-block',
							marginBottom: '24px',
							padding: '6px 16px',
							border: '1px solid rgba(16, 185, 129, 0.3)',
							borderRadius: '9999px',
							background: 'rgba(16, 185, 129, 0.08)',
							color: '#10B981',
							fontSize: '12px',
							fontFamily:
								'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
							textTransform: 'uppercase',
							letterSpacing: '0.2em',
						}}
					>
						System error
					</div>

					<h1
						style={{
							margin: 0,
							fontSize: '40px',
							lineHeight: 1.05,
							fontWeight: 700,
							color: '#FFFFFF',
							fontFamily:
								'Lora, ui-serif, Georgia, "Times New Roman", serif',
						}}
					>
						We hit a wall.
					</h1>

					<p
						style={{
							marginTop: '16px',
							marginBottom: 0,
							fontSize: '18px',
							lineHeight: 1.5,
							color: '#94A3B8',
						}}
					>
						Refresh the page, or come back in a minute.
					</p>

					{error.digest ? (
						<p
							style={{
								marginTop: '12px',
								marginBottom: 0,
								fontSize: '12px',
								color: '#64748B',
								fontFamily:
									'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
								textTransform: 'uppercase',
								letterSpacing: '0.2em',
							}}
						>
							Ref: {error.digest}
						</p>
					) : null}

					<div
						style={{
							marginTop: '40px',
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							gap: '16px',
							justifyContent: 'center',
						}}
					>
						<button
							type='button'
							onClick={() => unstable_retry()}
							style={{
								appearance: 'none',
								cursor: 'pointer',
								borderRadius: '9999px',
								border: '1px solid transparent',
								background: '#34E18E',
								color: '#0D0F14',
								padding: '16px 24px',
								fontSize: '16px',
								fontWeight: 700,
								lineHeight: '18px',
								boxShadow: '0 4px 12px rgba(29,184,104,0.34)',
								fontFamily: 'inherit',
							}}
						>
							Refresh
						</button>
						{/* Intentional <a> over <Link>: global-error replaces the root
						 * layout, so a full-document reload is the safer recovery path
						 * (next/link's client-side nav assumes a healthy app shell). */}
						{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
						<a
							href='/'
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: '9999px',
								border: '1px solid #10B981',
								background: '#0B1314',
								color: '#34E18E',
								padding: '16px 24px',
								fontSize: '16px',
								fontWeight: 500,
								lineHeight: '18px',
								textDecoration: 'none',
								fontFamily: 'inherit',
							}}
						>
							Back home
						</a>
					</div>
				</div>
			</body>
		</html>
	)
}

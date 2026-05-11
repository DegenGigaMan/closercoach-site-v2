"use client"

import Link from "next/link"
import { motion } from "motion/react"

type AnimatedBadgeProps = {
  text?: string
  color?: string
  href?: string
}

const AnimatedBadge = ({
  text = "Join us",
  color = "#10B981",
  href,
}: AnimatedBadgeProps) => {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      viewport={{ once: true }}
      className="group relative flex max-w-fit items-center justify-center"
    >
      {/* Spreading lines SVG above the pill */}
      <div className="pointer-events-none absolute inset-x-0 bottom-full h-20 w-[165px]">
        <svg className="h-full w-full" width="100%" height="100%" viewBox="0 0 50 50" fill="none">
          <g mask="url(#ml-mask-badge)">
            <circle className="multiline ml-light-badge" cx="0" cy="0" r="20" fill="url(#ml-grad-badge)" />
          </g>
          <defs>
            <mask id="ml-mask-badge">
              <path d="M 69 49.8 h -30 q -3 0 -3 -3 v -13 q 0 -3 -3 -3 h -23 q -3 0 -3 -3 v -13 q 0 -3 -3 -3 h -30" strokeWidth="0.6" stroke="white" />
            </mask>
            <radialGradient id="ml-grad-badge" fx="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="20%" stopColor={color} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Pill with subtly pulsing border */}
      <motion.div
        className="flex items-center gap-2.5 rounded-full px-4 py-1.5"
        style={{ backgroundColor: `${color}0D` }}
        animate={{
          boxShadow: [
            `0 0 0 1px ${color}25`,
            `0 0 0 1px ${color}60`,
            `0 0 0 1px ${color}25`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-sm font-medium text-cc-text-secondary">{text}</span>
      </motion.div>
    </motion.div>
  )

  return (
    <>
      {href ? <Link href={href} className="inline-block">{content}</Link> : content}
      <style>{`
.multiline {
  offset-anchor: 10px 0px;
  animation: multiline-animation-path infinite linear 6s;
}
.ml-light-badge {
  offset-path: path("M 69 49.8 h -30 q -3 0 -3 -3 v -13 q 0 -3 -3 -3 h -23 q -3 0 -3 -3 v -13 q 0 -3 -3 -3 h -50");
}
@keyframes multiline-animation-path {
  0% { offset-distance: 0%; }
  50% { offset-distance: 100%; }
  100% { offset-distance: 100%; }
}
      `}</style>
    </>
  )
}

export default AnimatedBadge

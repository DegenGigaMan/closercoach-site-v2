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
      {/* Pill with static border */}
      <motion.div
        className="flex items-center gap-2.5 rounded-full px-4 py-1.5"
        style={{ backgroundColor: `${color}0D`, boxShadow: `0 0 0 1px ${color}35` }}
      >
        <span className="text-sm font-medium text-cc-text-secondary">{text}</span>
      </motion.div>
    </motion.div>
  )

  return (
    <>
      {href ? <Link href={href} className="inline-block">{content}</Link> : content}
    </>
  )
}

export default AnimatedBadge

"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FadeUpProps {
    children: React.ReactNode
    className?: string
    delay?: number
}

export function FadeUp({ children, className, delay = 0 }: FadeUpProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        ease: [0.4, 0, 0.2, 1],
                        delay
                    }
                }
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    )
} 
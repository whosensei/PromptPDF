import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs"

interface BackButtonProps {
  href?: string
  onClick?: () => void
  className?: string
}

export function BackButton({ href, onClick, className }: BackButtonProps) {
  const router = useRouter()
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleClick}
      className={`text-zinc-400 hover:text-white ${className || ""}`}
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  )
}

interface SignOutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function SignOutButton({ 
  variant = "ghost", 
  size = "icon",
  className,
}: SignOutButtonProps) {
  return (
    <ClerkSignOutButton>
      <Button 
        variant={variant} 
        size={size}
        className={`text-zinc-400 hover:text-white ${className || ""}`}
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </ClerkSignOutButton>
  )
}

export function TextSignOutButton({ 
  variant = "ghost", 
  size = "default",
  className,
}: SignOutButtonProps) {
  return (
    <ClerkSignOutButton>
      <Button 
        variant={variant} 
        size={size}
        className={`text-zinc-400 hover:text-white ${className || ""}`}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </ClerkSignOutButton>
  )
} 
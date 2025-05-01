"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const { isSignedIn } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-semibold gradient-text">PromptPDF</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-charcoal/80 hover:text-orange transition-colors">
            Features
          </Link>
          {/* <Link href="#demo" className="text-charcoal/80 hover:text-orange transition-colors">
            Demo
          </Link> */}
          <Link href="#use-cases" className="text-charcoal/80 hover:text-orange transition-colors">
            Use Cases
          </Link>
          {/* <Link href="#pricing" className="text-charcoal/80 hover:text-orange transition-colors">
            Pricing
          </Link> */}

          {isSignedIn ? (
            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/sign-up">
                <Button className="bg-orange hover:bg-orange-light text-white rounded-md">Get Started</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {isSignedIn && <UserButton afterSignOutUrl="/"  />}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-charcoal focus:outline-none">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md animate-fade-in">
          <div className="flex flex-col space-y-4 p-6">
            <Link
              href="#features"
              className="text-charcoal/80 hover:text-orange transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="text-charcoal/80 hover:text-orange transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              href="#use-cases"
              className="text-charcoal/80 hover:text-orange transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Use Cases
            </Link>
            <Link
              href="#pricing"
              className="text-charcoal/80 hover:text-orange transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>

            {isSignedIn ? (
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-md">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-md">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-orange hover:bg-orange-light text-white rounded-md">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

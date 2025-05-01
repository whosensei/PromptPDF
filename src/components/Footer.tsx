import Link from "next/link"
import { Mail, Twitter, Linkedin, Github } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-semibold gradient-text">PromptPDF</span>
            </Link>
            <p className="mt-4 text-charcoal/70 max-w-xs">
              AI-native document assistant that lets you chat with any PDF in real time.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-charcoal/60 hover:text-orange transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-charcoal/60 hover:text-orange transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-charcoal/60 hover:text-orange transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="mailto:hello@promptpdf.com" className="text-charcoal/60 hover:text-orange transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal/90 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-charcoal/70 hover:text-orange transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-charcoal/70 hover:text-orange transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-charcoal/70 hover:text-orange transition-colors">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link href="#" className="text-charcoal/70 hover:text-orange transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal/90 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-charcoal/70 hover:text-orange transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-charcoal/70 hover:text-orange transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="text-charcoal/70 hover:text-orange transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className="text-charcoal/70 hover:text-orange transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal/90 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-charcoal/70 hover:text-orange transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-charcoal/70 hover:text-orange transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-charcoal/70 hover:text-orange transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-charcoal/70 hover:text-orange transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-charcoal/60 text-sm text-center">
            © {new Date().getFullYear()} PromptPDF. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

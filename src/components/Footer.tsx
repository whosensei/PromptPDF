import Link from "next/link"
import { Twitter, Linkedin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="mt-20 px-4 md:px-8 lg:px-12 mb-8">
      <div
        className="relative rounded-3xl overflow-hidden shadow-xl mx-auto max-w-7xl"
        style={{
          backgroundImage: "url('/images/footer-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange/10 to-white/30 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative z-10 py-16 px-8 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <Link href="/" className="inline-block">
                <span className="text-3xl font-semibold gradient-text">PromptPDF</span>
              </Link>
              <p className="mt-4 text-charcoal/80 max-w-md font-medium">
                AI-native document assistant that lets you chat with any PDF in real time.
              </p>

              <div className="flex space-x-6 mt-8">
                <a href="#" className="text-charcoal/70 hover:text-orange transition-colors">
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="#" className="text-charcoal/70 hover:text-orange transition-colors">
                  <Linkedin className="h-6 w-6" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>

            <div className="pt-8 border-t border-charcoal/10 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-charcoal/70 text-sm">All services online</span>
              </div>
              <p className="text-charcoal/70 text-sm">© 2025 PromptPDF. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

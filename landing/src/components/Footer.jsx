'use client'

import Link from 'next/link'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // SVG icon components
  const MailIcon = (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  )

  const LinkedinIcon = (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <path d="M8 11v5M8 8v.01M16 16v-3a2 2 0 0 0-4 0" />
    </svg>
  )

  const ArrowUpIcon = (props) => (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )

  return (
    <footer className="relative border-t border-gray-200 bg-white z-[1000] py-8">
      <div className="max-w-9xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold leading-tight bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text">BeFin</span>
            </div>
            <p className="text-gray-600 mb-4">
              Be Financially Independent
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-500 hover:text-[#2563eb] transition-colors text-sm"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-500 hover:text-[#2563eb] transition-colors text-sm"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-500 hover:text-[#2563eb] transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Resources</h4>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-[#1173eb] transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-[#1173eb] transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="/"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#1173eb] transition-colors text-sm"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Contact</h4>
            <ul className="ms-1 space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <MailIcon className="w-4 h-4 text-[#2563eb]" />
                <a
                  href="mailto:info@befin.in"
                  className="text-gray-900 hover:text-[#2563eb] transition-colors"
                >
                  info@befin.in
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <LinkedinIcon className="w-4 h-4 text-[#2563eb]" />
                <a
                  href="https://www.linkedin.com/company/befin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-[#2563eb] transition-colors"
                >
                  befin
                </a>
              </li>
            </ul>
            <div className="mt-2">
              <span className="inline-block bg-[#e8f0fe] text-[#2563eb] text-xs font-semibold px-2 py-1 rounded-full border border-gray-300">
                Technology Hub, India
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-2 pb-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-gray-500 text-sm">
            © {new Date().getFullYear()} befin. All rights reserved.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={scrollToTop}
              className="cursor-pointer me-0 md:me-6 p-3 rounded-full bg-gradient-to-r from-[#1173eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1173eb] border-none transition-all shadow"
              aria-label="Scroll to top"
            >
              <ArrowUpIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
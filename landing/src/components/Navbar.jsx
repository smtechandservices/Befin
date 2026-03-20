import Link from 'next/link';
import Image from 'next/image';

export default function Navbar({ activePage = 'home' }) {
  return (
    <nav className="sticky top-0 bg-white border-b border-gray-200 z-[1000] py-4">
      <div className="max-w-10xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-6 sm:gap-8 flex-wrap">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="BeFin Logo"
              width={40}
              height={40}
              priority
              className="rounded-[8px]"
            />
          </div>
          <span className="text-3xl font-bold leading-tight bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text">BeFin</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-8 items-center flex-1 justify-center order-3 md:order-none w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-200 text-nowrap">
          <Link href="/" className={`text-base font-medium transition-colors relative ${activePage === 'home' ? 'text-[#2563eb]' : 'text-gray-900 hover:text-[#2563eb]'}`}>
            {activePage === 'home' && <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-[#2563eb]"></span>}
            Home
          </Link>
          <Link href="/about" className={`text-base font-medium transition-colors relative ${activePage === 'about' ? 'text-[#2563eb]' : 'text-gray-900 hover:text-[#2563eb]'}`}>
            {activePage === 'about' && <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-[#2563eb]"></span>}
            About us
          </Link>
          <Link href="/services" className={`text-base font-medium transition-colors relative ${activePage === 'services' ? 'text-[#2563eb]' : 'text-gray-900 hover:text-[#2563eb]'}`}>
            {activePage === 'services' && <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-[#2563eb]"></span>}
            Services
          </Link>
          <Link href="/contact" className={`text-base font-medium transition-colors relative ${activePage === 'contact' ? 'text-[#2563eb]' : 'text-gray-900 hover:text-[#2563eb]'}`}>
            {activePage === 'contact' && <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-[#2563eb]"></span>}
            Contact Us
          </Link>
        </div>

        {/* Download Now Button */}
        <a target='_blank' href="https://app.thebefin.com">
          <button className="bg-gradient-to-r from-[#1173eb] to-[#1d4ed8] text-white border-none px-4 py-2 rounded-full text-base font-semibold cursor-pointer whitespace-nowrap">
            Login Now
          </button>
        </a>
      </div>
    </nav>
  );
}

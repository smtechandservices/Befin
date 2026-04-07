import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const marqueeItems = [
  'Learn financial skills for life',
  'Interactive market experience',
  'Compete and win rewards',
  'Gamified financial education',
  'AI-powered investing insights',
  'Fast and secure payments',
  'Empowering all age groups',
  'Smart prepaid cards',
  'Safe digital wallet',
];

function InfiniteMarquee() {
  return (
    <div className="w-full bg-[#e0f2fe] py-3 overflow-hidden border-y border-[#2563eb22] relative">
      <style>{`
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 28s linear infinite;
        }
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
      <div className="flex items-center">
        <div className="marquee-track">
          {marqueeItems.concat(marqueeItems).map((text, idx) => (
            <span
              key={idx}
              className="flex items-center whitespace-nowrap px-8 text-base sm:text-lg font-medium text-[#2563eb] opacity-90"
            >
              <span>{text}</span>
              <span className="mx-3 opacity-60 select-none">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar activePage="home" />

      {/* Hero Section */}
      <section className="pb-16 md:pb-0 flex items-center bg-white">
        <div className="w-full mx-auto lg:pe-4">
          <div className="flex flex-col-reverse lg:flex-row items-center">
            {/* Left Section - Phone Mockup */}
            <div
              className="hidden lg:block w-full lg:w-1/2 flex items-center justify-center lg:justify-start relative min-h-[320px] sm:min-h-[400px] lg:min-h-[600px] mb-8 lg:mb-0"
              data-aos="fade-right"
            >
              <div
                className="relative w-[40vw] min-h-[40vw] sm:min-h-[60vw] lg:min-h-[82vh]"
                style={{
                  maskImage: 'url(/left-transparent.svg)',
                  WebkitMaskImage: 'url(/left-transparent.svg)',
                  maskSize: '100% 100%',
                  WebkitMaskSize: '100% 100%',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'left center',
                  WebkitMaskPosition: 'left center'
                }}
              >
                <Image
                  src="/home/hero.png"
                  alt="beFin"
                  fill
                  className="object-cover bg-white"
                  priority
                />
              </div>
            </div>
            {/* Right Section - Marketing Content */}
            <div className="text-center lg:text-left my-4 w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-2 px-4 sm:px-6 lg:px-4 lg:max-w-full lg:-translate-x-[10vh]" data-aos="fade-left">
              <p className="text-lg lg:text-2xl text-[#2563eb] font-medium">
                BeFin- Learn, Save, Pay & Invest
              </p>
              <h1 className="text-2xl lg:text-5xl font-semibold leading-tight bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text">
                Be Financially Independent
              </h1>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-lg">
                From your first allowance to your first salary, BeFin helps every generation grow smarter with money.
              </p>
              
              <div className="flex flex-row gap-3 sm:gap-4 mt-6 flex-wrap">
                <Link href="/" passHref>
                  <button className="bg-[#2563eb] text-white border-none px-6 py-3 lg:py-4 rounded-full text-base font-semibold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:shadow-lg w-full sm:w-auto">
                    Get Early Access
                  </button>
                </Link>
                <Link href="/contact" passHref>
                  <button className="bg-white text-[#2563eb] border-2 border-[#2563eb] px-6 py-3 lg:py-4 rounded-full text-base font-semibold cursor-pointer transition-all hover:bg-[#1273eb] hover:text-white w-full sm:w-auto">
                    Partner With Us
                  </button>
                </Link>
              </div>
  
            </div>
          </div>
        </div>
      </section>

      {/* Finance for Every Age Section */}
      <section className="py-16 bg-[aliceblue] flex items-center min-h-[80vh]">
        <div className="mx-auto px-4 sm:px-8 w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-left mb-4 md:mb-6" data-aos="fade-up">
            Finance for <br className='block md:hidden'/> Every Age. Every Stage.
          </h2>
          <p
            className="text-base md:text-lg lg:text-xl text-gray-700 text-left max-w-2xl md:max-w-3xl mb-7 md:mb-12 leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            BeFin isn&apos;t just an app - it&apos;s your lifelong financial companion. Whether you&apos;re learning to manage your first pocket money or optimizing your salary, BeFin grows with you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <label className="group block relative w-full min-h-[220px] md:min-h-[260px] [perspective:1000px] cursor-pointer" data-aos="fade-up" data-aos-delay="200">
              <input type="checkbox" className="peer sr-only" />
              <div className="absolute w-full h-full transition-transform duration-500 [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] peer-checked:[transform:rotateY(180deg)] shadow-md group-hover:shadow-xl rounded-2xl">
                {/* Front */}
                <div className="absolute w-full h-full bg-white p-6 sm:p-7 md:p-8 rounded-2xl flex flex-col justify-center text-left [backface-visibility:hidden]">
                  <div className="absolute top-0 right-0 w-48 h-24 pointer-events-none select-none leading-[1] overflow-hidden rounded-tr-2xl">
                    <Image
                      src="/home/students.png"
                      alt="Students icon"
                      fill
                      className="w-full h-full object-cover rounded-bl-full"
                      draggable={false}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-0 mt-0 pr-12 md:pr-16 relative z-10">For <br /> <span className='text-3xl text-[#2563eb]'>Students</span></h3>
                  </div>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-[#2563eb] text-white p-6 sm:p-7 md:p-8 rounded-2xl flex flex-col justify-center text-left [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 md:mb-4 mt-0">Students</h3>
                    <p className="text-sm sm:text-base leading-relaxed text-blue-50">
                      Smart money habits, manage allowances, and make confident payments.
                    </p>
                  </div>
                </div>
              </div>
            </label>
            {/* Card 2 */}
            <label className="group block relative w-full min-h-[220px] md:min-h-[260px] [perspective:1000px] cursor-pointer" data-aos="fade-up" data-aos-delay="300">
              <input type="checkbox" className="peer sr-only" />
              <div className="absolute w-full h-full transition-transform duration-500 [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] peer-checked:[transform:rotateY(180deg)] shadow-md group-hover:shadow-xl rounded-2xl">
                {/* Front */}
                <div className="absolute w-full h-full bg-white p-6 sm:p-7 md:p-8 rounded-2xl flex flex-col justify-center text-left [backface-visibility:hidden]">
                  <div className="absolute top-0 right-0 w-48 h-24 pointer-events-none select-none leading-[1] overflow-hidden rounded-tr-2xl">
                    <Image
                      src="/home/parents.png"
                      alt="Parents icon"
                      fill
                      className="w-full h-full object-cover rounded-bl-full"
                      draggable={false}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-0 mt-0 pr-12 md:pr-16 relative z-10">By <br /> <span className='text-3xl text-[#2563eb]'>Parents</span></h3>
                  </div>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-[#2563eb] text-white p-6 sm:p-7 md:p-8 rounded-2xl flex flex-col justify-center text-left [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 md:mb-4 mt-0">Parents</h3>
                    <p className="text-sm sm:text-base leading-relaxed text-blue-50">
                      Set allowances, track spending, and guide your child&apos;s financial growth.
                    </p>
                  </div>
                </div>
              </div>
            </label>
            {/* Card 3 */}
            <label className="group block relative w-full min-h-[220px] md:min-h-[260px] [perspective:1000px] cursor-pointer" data-aos="fade-up" data-aos-delay="300">
              <input type="checkbox" className="peer sr-only" />
              <div className="absolute w-full h-full transition-transform duration-500 [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] peer-checked:[transform:rotateY(180deg)] shadow-md group-hover:shadow-xl rounded-2xl">
                {/* Front */}
                <div className="absolute w-full h-full bg-white p-6 sm:p-7 md:p-8 rounded-2xl flex flex-col justify-center text-left [backface-visibility:hidden]">
                  <div className="absolute top-0 right-0 w-48 h-24 pointer-events-none select-none leading-[1] overflow-hidden rounded-tr-2xl">
                    <Image
                      src="/home/professionals.png"
                      alt="Professionals icon"
                      fill
                      className="w-full h-full object-cover rounded-bl-full"
                      draggable={false}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-0 mt-0 pr-12 md:pr-16 relative z-10">To <br /> <span className='text-3xl text-[#2563eb]'>Professionals</span></h3>
                  </div>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-[#2563eb] text-white p-6 sm:p-7 md:p-8 rounded-2xl flex flex-col justify-center text-left [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 md:mb-4 mt-0">Professionals</h3>
                    <p className="text-sm sm:text-base leading-relaxed text-blue-50">
                      Budget better, save consistently, and invest wisely with AI driven tools.
                    </p>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Smart Card Section as Banner */}
      <section className="relative overflow-hidden bg-[#0a0f1c] py-20 lg:py-32 flex items-center justify-center min-h-[500px]">
        <style>{`
          @keyframes border-glow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          .animate-float-card {
            animation: float-card 6s ease-in-out infinite;
          }
          @keyframes float-card {
            0%, 100% { transform: translateY(0) rotate(-4deg); }
            50% { transform: translateY(-15px) rotate(-6deg); }
          }
          .animate-float-card-bg {
            animation: float-card-bg 7s ease-in-out infinite;
          }
          @keyframes float-card-bg {
            0%, 100% { transform: translate(25px, 25px) rotate(2deg); }
            50% { transform: translate(25px, 10px) rotate(4deg); }
          }
          .animate-sweep {
            animation: sweep-shine 4s ease-in-out infinite;
          }
          @keyframes sweep-shine {
            0% { transform: translateX(-200%) skewX(-30deg); }
            100% { transform: translateX(300%) skewX(-30deg); }
          }
        `}</style>
        
        {/* Dark deep tech background with animated glowing orbs */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <Image
            src="/home/banner.png"
            alt="background pattern"
            fill
            className="object-cover w-full h-full opacity-5"
          />
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#2563eb] blur-[150px] opacity-30 animate-pulse mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#06b6d4] blur-[120px] opacity-20 mix-blend-screen"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-9xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 w-full">
          {/* Text content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10" data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#38bdf8]"></span>
              </span>
              <span className="text-sm font-semibold tracking-wide text-[#bce3ff] uppercase">Smart Prepaid Card</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#7dd3fc] drop-shadow-sm tracking-tight mb-6 leading-tight">
              Spend Smarter.<br className="hidden lg:block md:hidden"/> Stay in Control.
            </h2>
            
            <p className="text-lg sm:text-xl text-blue-200/80 leading-relaxed font-light mb-10 max-w-xl">
              Make everyday payments easy, safe, and exciting. Your own personalized <span className="text-white font-medium">BeFin Smart Card</span>, built for all ages. Track, tap, and manage effortlessly.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12 w-full max-w-xl">
              <div className="flex items-center gap-2 text-[#bae6fd] bg-white/[0.03] px-5 py-3 rounded-xl border border-white/5 backdrop-blur-sm">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                <span className="font-semibold text-sm tracking-wide">Ultra Secure</span>
              </div>
              <div className="flex items-center gap-2 text-[#bae6fd] bg-white/[0.03] px-5 py-3 rounded-xl border border-white/5 backdrop-blur-sm">
                <svg className="w-6 h-6 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <span className="font-semibold text-sm tracking-wide">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 text-[#bae6fd] bg-white/[0.03] px-5 py-3 rounded-xl border border-white/5 backdrop-blur-sm">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                <span className="font-semibold text-sm tracking-wide">Prepaid Tech</span>
              </div>
            </div>

            <Link href="/services" passHref>
              <button className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#0ea5e9] text-white px-9 py-4 rounded-full text-lg font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(56,189,248,0.7)] border border-white/10">
                <div className="absolute inset-0 bg-white/20 w-12 -translate-x-[250%] skew-x-[-30deg] group-hover:animate-[sweep-shine_1.5s_ease-in-out_infinite]"></div>
                <span>Get your BeFin Card</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </Link>
          </div>

          {/* Graphic / CSS Card Right Section */}
          <div className="w-full lg:w-1/2 flex justify-center items-center relative [perspective:2000px] mt-12 lg:mt-0" data-aos="zoom-in" data-aos-delay="200">
            {/* Soft backdrop glow behind cards */}
            <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-blue-600/40 to-cyan-400/40 rounded-full blur-[80px] z-0 animate-pulse"></div>
            
            {/* A second card stacked slightly behind for depth */}
            <div className="absolute z-0 w-[280px] sm:w-[360px] aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] p-[1px] opacity-70 shadow-2xl transition-transform animate-float-card-bg">
              <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-md"></div>
            </div>

            {/* The Main BeFin Card */}
            <div className="relative z-10 w-[300px] sm:w-[400px] aspect-[1.586/1] rounded-2xl bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#38BDF8] p-[1px] shadow-2xl transition-transform duration-500 md:hover:rotate-y-12 md:hover:-rotate-x-12 [transform-style:preserve-3d] animate-float-card cursor-pointer group">
              
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl backdrop-blur-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-8 border border-white/10">
                
                {/* Card Top / Chip */}
                <div className="flex justify-between items-start">
                  {/* EMV Chip */}
                  <div className="w-12 sm:w-14 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-600 shadow-inner flex items-center justify-center opacity-90 overflow-hidden relative border border-yellow-300/30">
                    <div className="absolute inset-0 border border-black/10 rounded-lg mix-blend-overlay"></div>
                    <div className="w-full h-[1px] bg-black/10 absolute top-[30%]"></div>
                    <div className="w-full h-[1px] bg-black/10 absolute top-[70%]"></div>
                    <div className="h-full w-[1px] bg-black/10 absolute left-[30%]"></div>
                    <div className="h-full w-[1px] bg-black/10 absolute right-[30%]"></div>
                    <div className="w-3 h-5 border border-black/10 rounded-full absolute bg-gradient-to-br from-yellow-300 to-yellow-500"></div>
                  </div>
                  
                  {/* Contactless Icon */}
                  <div className="flex gap-1 items-center opacity-80">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M9 11a3 3 0 100 6h6a3 3 0 100-6H9z" />
                    </svg>
                  </div>
                </div>
                
                {/* Card Middle / Number */}
                <div className="text-xl sm:text-2xl tracking-[0.2em] sm:tracking-[0.25em] font-mono text-white/90 drop-shadow-md text-shadow pt-2">
                  **** **** **** 8890
                </div>
                
                {/* Card Bottom / Details */}
                <div className="flex justify-between items-end pb-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-[11px] text-white/50 uppercase tracking-widest font-semibold mb-1">Card Holder</span>
                    <span className="text-sm sm:text-base text-white font-medium tracking-widest">SMART SAVER</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold italic text-white/90 tracking-tighter drop-shadow-lg pr-1">
                    Be<span className="text-[#38BDF8]">Fin</span>
                  </div>
                </div>
                
                {/* Glass glare sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent w-[150%] h-[150%] top-[-25%] left-[-25%] animate-sweep pointer-events-none mix-blend-overlay"></div>
                <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-white/20 blur-[60px] rounded-full pointer-events-none"></div>
              </div>

            </div>
          </div>
        </div>
      </section>
        
      {/* Level Up Game Section */}
      <section className="w-full pb-16 md:pb-0 flex items-center bg-white">
        <div className="w-full px-0">
          <div className="flex flex-col-reverse lg:flex-row items-center w-full">
            {/* Left Section - Image Mockup */}
            <div
              className="hidden lg:block w-full lg:w-1/2 flex items-center justify-center lg:justify-start relative min-h-[320px] sm:min-h-[400px] lg:min-h-[600px] mb-8 lg:mb-0"
            >
              <div
                className="relative w-[40vw] min-h-[40vw] sm:min-h-[60vw] lg:min-h-[80vh]"
                style={{
                  maskImage: 'url(/left-transparent.svg)',
                  WebkitMaskImage: 'url(/left-transparent.svg)',
                  maskSize: '100% 100%',
                  WebkitMaskSize: '100% 100%',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'left center',
                  WebkitMaskPosition: 'left center'
                }}
              >
                <Image
                  src="/home/banner2.png"
                  alt="Level Up Game"
                  fill
                  className="object-cover bg-white"
                  priority
                />
              </div>
            </div>
            {/* Right Section - Marketing Content */}
            <div
              className="my-4 w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-2 px-4 sm:px-6 lg:px-4 lg:max-w-full lg:-translate-x-[10vh]"
              data-aos="fade-up"
            >
              <p
                className="text-lg lg:text-2xl text-[#2563eb] font-medium"
                data-aos="fade-up"
              >
                Level Up Game
              </p>
              <h2
                className="text-xl lg:text-5xl font-semibold leading-tight bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text"
                data-aos="fade-up"
              >
                Learn Money the Fun Way
              </h2>
              <p
                className="text-base md:text-lg text-center md:text-left text-gray-700 leading-relaxed max-w-lg"
                data-aos="fade-up"
              >
                Play interactive challenges, earn rewards, and master real-world financial skills - all in one gamified journey.
              </p>
              <p
                className="text-lg font-medium text-gray-900"
                data-aos="fade-up"
              >Turn learning into earning.</p>
              <div
                className="flex gap-3 items-center text-base sm:text-lg justify-start text-[#2563eb] my-6"
                data-aos="fade-up"
              >
                <span className="font-medium">Fun</span>
                <span className="opacity-70">|</span>
                <span className="font-medium">Rewarding</span>
                <span className="opacity-70">|</span>
                <span className="font-medium">Educational</span>
              </div>
              <Link href="/game" passHref>
                <button className="bg-[#2563eb] text-white border-none px-8 py-3 lg:py-4 rounded-full text-base font-semibold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:shadow-lg w-full sm:w-auto"
                  data-aos="fade-up"
                >
                  Start your challenge now!
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Infinite Marquee Section */}
      <InfiniteMarquee />

      {/* Market Simulator Section */}
      <section className="pb-16 md:pb-0 flex items-center bg-[aliceblue] w-full">
        <div className="w-full px-0">
          <div className="flex flex-col lg:flex-row-reverse items-center w-full">
            {/* right section */}
            <div
              className="hidden lg:block w-full lg:w-1/2 flex items-center justify-center lg:justify-start relative min-h-[320px] sm:min-h-[400px] lg:min-h-[400px] mb-8 lg:mb-0"
            >
              <div
                className="relative w-full min-h-[40vw] sm:min-h-[60vw] lg:min-h-[80vh]"
                style={{
                  maskImage: 'url(/right-transparent.svg)',
                  WebkitMaskImage: 'url(/right-transparent.svg)',
                  maskSize: '100% 100%',
                  WebkitMaskSize: '100% 100%',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'right center',
                  WebkitMaskPosition: 'right center'
                }}
              >
                <Image
                  src="/home/banner3.png"
                  alt="Market Simulator"
                  fill
                  className="object-cover bg-white"
                  priority
                />
              </div>
            </div>
            {/* Left Section - Marketing Content (now comes last on large screens) */}
            <div
              className="my-4 w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-2 px-4 lg:px-8 lg:max-w-full lg:translate-x-[2vh]"
              data-aos="fade-up"
            >
              <p
                className="text-lg lg:text-2xl text-[#2563eb] font-medium"
                data-aos="fade-up"
              >
                Market Simulator
              </p>
              <h2
                className="text-3xl lg:text-5xl font-semibold leading-tight bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text"
                data-aos="fade-up"
              >
                Trade. Compete. Learn.
              </h2>
              <p
                className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl w-full"
                data-aos="fade-up"
              >
                Step into a real market experience - build virtual portfolios, join trading contests, and get AI insights.
              </p>
              <p
                className="text-lg font-medium text-gray-900"
                data-aos="fade-up"
              >
                Learn to invest before you invest.
              </p>
              <div
                className="flex gap-3 items-center text-base sm:text-lg justify-start text-[#2563eb] my-6"
                data-aos="fade-up"
              >
                <span className="font-medium">Real Data</span>
                <span className="opacity-70">|</span>
                <span className="font-medium">Zero Risk</span>
                <span className="opacity-70">|</span>
                <span className="font-medium">AI Guided</span>
              </div>
              <Link href="/services" passHref>
                <button className="bg-[#2563eb] text-white border-none px-8 py-3 lg:py-4 rounded-full text-base font-semibold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:shadow-lg w-full sm:w-auto"
                  data-aos="fade-up"
                >
                  Explore the Simulator
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Empowering Campuses & Enterprises + Final CTA Section (Combined) */}
      <section className="py-10 bg-white">
        <div className="mx-auto px-4 md:px-8 lg:px-10">
          <div className="items-center text-center md:text-left">
            <div className="flex flex-col gap-8">
              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text leading-tight mb-2">
                Empowering Campuses & Enterprises
              </h2>
              {/* Description */}
              <p className="text-lg md:text-xl text-gray-700 max-w-9xl leading-relaxed">
                BeFin collaborates with schools, universities, and corporates to build financially aware communities transforming financial futures at every level.
              </p>
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Feature 1 */}
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-10 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-[#e0f2fe] text-[#2563eb] font-bold text-2xl">
                    1
                  </div>
                  <p className="text-lg text-gray-900 font-medium leading-snug">
                    Offer prepaid cards and wallets
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-10 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-[#e0f2fe] text-[#2563eb] font-bold text-2xl">
                    2
                  </div>
                  <p className="text-lg text-gray-900 font-medium leading-snug">
                    Run financial literacy programs
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-10 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-[#e0f2fe] text-[#2563eb] font-bold text-2xl">
                    3
                  </div>
                  <p className="text-lg text-gray-900 font-medium leading-snug">
                    Enable secure API & integrations
                  </p>
                </div>
              </div>
              {/* Final headline + rich text and stats, flex layout */}
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mt-3">
                Are you Ready to Transform Your Financial Future?
              </h3>
              <div className="flex flex-col lg:flex-row items-start">
                <div className="flex-[2]">
                  <p className="text-2xl font-semibold text-[#2563eb] mb-2">
                    Let&apos;s Build Something Extraordinary Together
                  </p>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl">
                    BeFin offers perfect solutions for individuals, institutions, and enterprises seeking financial empowerment and innovation. Join thousands of users and leading financial partners who trust BeFin for exceptional financial education and services.
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex justify-center md:justify-start gap-4 flex-wrap mt-4">
                    <Link href="/contact" passHref >
                      <button className="bg-[#2563eb] text-white border-none px-8 py-4 rounded-full text-base font-semibold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:shadow-lg">
                        Schedule a Consultation
                      </button>
                    </Link>
                    <Link href="/services" passHref >
                      <button className="bg-white text-[#2563eb] border-2 border-[#2563eb] px-8 py-4 rounded-full text-base font-semibold cursor-pointer transition-all hover:bg-[#2563eb] hover:text-white">
                        Request a Demo
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Closing line */}
              <p className="mt-10 text-lg md:text-xl text-gray-700 max-w-3xl">
                Join us in shaping the next generation of financially confident individuals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

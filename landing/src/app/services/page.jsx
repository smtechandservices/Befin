import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { Activity, Trophy, Globe, Cpu } from "lucide-react";

export default function Services() {
  return (
    <>
      <Navbar activePage="services" />
      
      {/* Hero Section */}
      <section className="pb-16 md:pb-0 flex items-center bg-[aliceblue] w-full">
        <div className="w-full px-0">
          <div className="flex flex-col lg:flex-row-reverse items-center w-full">
            {/* right section */}
            <div
              className="hidden lg:block w-full lg:w-1/2 flex items-center justify-center lg:justify-start relative min-h-[320px] sm:min-h-[400px] lg:min-h-[400px] mb-8 lg:mb-0"
              data-aos="fade-up"
            >
              <div
                className="relative w-full min-h-[40vw] sm:min-h-[60vw] lg:min-h-[60vh]"
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
                  src="/services/hero.png"
                  alt="Market Simulator"
                  fill
                  className="object-cover bg-white"
                  priority
                />
              </div>
            </div>
            {/* Left Section - Marketing Content (now comes last on large screens) */}
            <div
              className="mb-4 w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-2 px-4 lg:px-8 lg:max-w-full"
              data-aos="fade-up"
            >
              <p
                className="text-lg lg:text-xl text-[#2563eb] font-medium"
                data-aos="fade-up"
              >
                Financial Education Simple, Engaging, and Accessible.
              </p>
              <h2
                className="text-3xl lg:text-5xl font-semibold leading-tight bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text"
                data-aos="fade-up"
              >
                Empowering Financial Futures Through Innovation
              </h2>
              <p
                className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl w-full"
                data-aos="fade-up"
              >
                From individuals managing money smarter to schools and enterprises empowering others, we bring practical financial tools designed for India&apos;s digital future.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* The BeFin Smart Card Section as a Banner */}
      <section
        className="py-20 bg-cover relative overflow-hidden"
        style={{
          backgroundImage: "url('/services/banner2.png')",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Diagonal Smart Card */}
        <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 hidden md:block z-10"
          data-aos="fade-up"
        >
          <div className="relative">
            <img
              src="/services/smart-card.png"
              alt="BeFin Smart Card"
              className="
                w-[280px] lg:w-[340px]
                rotate-[-12deg]
                drop-shadow-2xl
                transition-transform duration-500
                hover:rotate-[-8deg]
                rounded-2xl
              "
            />
          </div>
        </div>

        <div className="mx-auto px-4 sm:px-8 relative z-20">
          <div className="flex items-end justify-end">

            {/* Card Info */}
            <div
              className="flex flex-col gap-4 justify-start items-end text-right"
              data-aos="fade-up"
            >
              <div className="max-w-3xl mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Your Money. Your Rules.
                </h2>

                <h2 className="text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-l from-[#e0f7ff] to-[#60cfff] text-transparent bg-clip-text">
                  The BeFin Smart Card
                </h2>

                <p className="text-lg text-white/90 leading-relaxed mt-2">
                  a secure prepaid card linked to your BeFin wallet, designed to give you
                  complete control over your finances while keeping your money safe and
                  accessible.
                </p>
              </div>

              <ul className="max-w-5xl flex flex-wrap justify-end gap-6 text-right text-lg">
                {[
                  "No repeated OTPs",
                  "Real-time parental visibility",
                  "Manage monthly allowances",
                  "Instant, secure payments",
                ].map((item) => (
                  <li key={item} className="group cursor-default" data-aos="fade-up">
                    <h6 className="font-semibold text-white group-hover:text-sky-200 transition-colors">
                      {item}
                      <span className="ms-2 text-sky-200">&#8592;</span>
                    </h6>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Your Complete Financial Companion Section */}
      <section className="pb-0 flex items-start bg-white">
        <div className="w-full mx-auto lg:pe-4">
          <div className="flex flex-col-reverse lg:flex-row items-center">
            {/* Left Section - Phone Mockup */}
            <div
              className="hidden lg:block w-full lg:w-2/3 flex items-center justify-center lg:justify-start relative mb-0"
              data-aos="fade-up"
            >
              <div
                className="relative w-[60vw] min-h-[40vw] sm:min-h-[60vw] lg:min-h-[75vh]"
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
                  src="/services/banner.png"
                  alt="beFin"
                  fill
                  className="object-cover bg-white"
                  priority
                />
              </div>
            </div>
            {/* Right Section - New Marketing Content */}
            <div className="text-center lg:text-left mb-4 w-full lg:w-1/3 flex flex-col items-center lg:items-start gap-6 px-4 sm:px-6 lg:px-0 lg:max-w-full lg:-translate-x-[5vh]" data-aos="fade-up">
              <h1 className="text-3xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text mb-2">
                Your Complete Financial Companion
              </h1>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-xl" data-aos="fade-up">
                Whether you&apos;re a student, a parent, or a professional <br className='hidden md:block' /> <span className="font-semibold text-[#2563eb]">BeFin</span> makes managing money simple, fun, and truly empowering.
              </p>
              <Link href="/contact" passHref>
                <button className="bg-[#2563eb] text-white px-12 py-3 mt-8 rounded-full text-base font-semibold cursor-pointer transition-all hover:bg-[#1273eb] w-full sm:w-auto" data-aos="fade-up">
                  Let&apos;s Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Learn • Save • Pay • Invest Section */}
      <section className="py-12 bg-[aliceblue]">
        <div className="mx-auto px-4 sm:px-8 max-w-9xl">
          <h2
            className="text-4xl md:text-5xl font-bold pb-6 bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text"
            data-aos="fade-up"
          >
            Learn • Save • Pay • Invest
          </h2>
          <p
            className="text-lg text-gray-700 max-w-3xl mb-8"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            BeFin makes money management fun through interactive education and powerful tools.
            Master the fundamentals and build lasting financial habits.
          </p>
          <style>
            {`
              @keyframes bounceYSlow {
                0% { transform: translateY(0); }
                15% { transform: translateY(0); }
                30% { transform: translateY(-5px); }
                45% { transform: translateY(0); }
                100% { transform: translateY(0); }
              }
              .animate-bounce-delay-0 { animation: bounceYSlow 4s cubic-bezier(0.5,0,0.5,1) infinite; animation-delay: 0s; }
              .animate-bounce-delay-1 { animation: bounceYSlow 4s cubic-bezier(0.5,0,0.5,1) infinite; animation-delay: 1s; }
              .animate-bounce-delay-2 { animation: bounceYSlow 4s cubic-bezier(0.5,0,0.5,1) infinite; animation-delay: 2s; }
              .animate-bounce-delay-3 { animation: bounceYSlow 4s cubic-bezier(0.5,0,0.5,1) infinite; animation-delay: 3s; }
            `}
          </style>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Learn */}
            <div
              className="flex gap-6 border-l-4 border-[#30a5fa] pl-6 animate-bounce-delay-0"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Learn</h3>
                <p className="text-gray-600">
                  Interactive lessons, fun quizzes and real-world money challenges
                </p>
              </div>
            </div>
            {/* Save */}
            <div
              className="flex gap-6 border-l-4 border-[#30a5fa] pl-6 animate-bounce-delay-1"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Save</h3>
                <p className="text-gray-600">
                  Set goals, track progress, and earn rewards
                </p>
              </div>
            </div>
            {/* Pay */}
            <div
              className="flex gap-6 border-l-4 border-[#30a5fa] pl-6 animate-bounce-delay-2"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pay</h3>
                <p className="text-gray-600">
                  Seamless payments using your BeFin Smart Card
                </p>
              </div>
            </div>
            {/* Invest */}
            <div
              className="flex gap-6 border-l-4 border-[#30a5fa] pl-6 animate-bounce-delay-3"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Invest</h3>
                <p className="text-gray-600">
                  Start exploring stock market investments with our risk-free simulator
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* how befin works */}
      <section>
        <div className="max-w-9xl mx-auto px-4 sm:px-8 pt-14 overflow-hidden" data-aos="fade-up">
          <h2 className="text-3xl md:text-5xl mb-2 text-right flex items-center justify-end" data-aos="fade-up">
            <span className="inline-block align-middle mr-2" aria-hidden="true">←</span>
            <span
              className="inline-block bg-gradient-to-r from-[#4ab7fa] to-[#2563eb] text-transparent bg-clip-text"
              style={{ fontWeight: 700 }}
            >
              How BeFin Works
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Timeline */}
            <div className="relative -mt-8" data-aos="fade-up">

              {/* Vertical line */}
              <div className="absolute left-3 top-1 -bottom-14 w-px bg-[#2563eb]/30"></div>

              {/* Step 1 */}
              <div className="relative pl-12 mb-12" data-aos="fade-up">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Play Engaging Challenges
                </h4>
                <p className="text-gray-600">
                  Dive into fun, story-driven challenges based on real-life money scenarios.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-12 mb-12" data-aos="fade-up">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Learn Core Money Skills
                </h4>
                <p className="text-gray-600">
                  Master budgeting, saving, and investing through interactive gameplay.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-12 mb-12" data-aos="fade-up">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Earn BeFinCoins & Badges
                </h4>
                <p className="text-gray-600">
                  Unlock rewards, earn badges, and climb ranks as you progress.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative pl-12" data-aos="fade-up">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold">
                  4
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Built by Experts
                </h4>
                <p className="text-gray-600">
                  Designed with fintech professionals and education experts for real impact.
                </p>
              </div>

            </div>
            {/* Image */}
            <div
              className="flex justify-center items-center relative"
              data-aos="fade-up"
            >
              <div className="relative w-full h-[260px] sm:h-[320px] md:h-[400px]">
                <Image
                  src="/services/befin-works.png"
                  alt="befin"
                  fill
                  className="object-cover rounded-t-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-16 md:pb-0 flex items-center bg-[aliceblue]">
        <div className="w-full px-0">
          <div className="flex flex-col-reverse lg:flex-row items-center w-full">

            {/* Left Section - Image */}
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
                  src="/services/banner3.png"
                  alt="Level Up Game"
                  fill
                  className="object-cover bg-white"
                  priority
                />
              </div>
            </div>

            {/* Right Section - Features List with Icons */}
            <div
              className="my-4 w-full lg:w-2/3 flex flex-col items-center lg:items-start px-4 sm:px-6 lg:px-4 lg:max-w-full"
              data-aos="fade-up"
            >
              <p className="text-lg lg:text-2xl text-[#2563eb] font-medium" data-aos="fade-up">
                Stock Market Simulation
              </p>

              <h2 className="text-3xl lg:text-5xl font-semibold leading-tight bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text pb-2" data-aos="fade-up">
                Learn by Doing
              </h2>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-xl mt-2" data-aos="fade-up">
                Step into the world of investing with BeFin&apos;s Stock Market Simulator hands-on, risk-free platform that mirrors global markets.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-12" data-aos="fade-up">
                What You Can Do:
              </h3>

              <div className="flex flex-col gap-4 mt-2 w-full mt-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/50 rounded-lg flex items-center justify-center shadow">
                    <Activity size={24} className="text-[#2563eb]" />
                  </div>
                  <p className="text-gray-700">
                    Build your own virtual portfolio of stocks, ETFs, options, bonds, crypto & more.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/50 rounded-lg flex items-center justify-center shadow">
                    <Trophy size={24} className="text-[#2563eb]" />
                  </div>
                  <p className="text-gray-700">
                    Join contests — customize trading period, initial cash, and diversification rules.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/50 rounded-lg flex items-center justify-center shadow">
                    <Globe size={24} className="text-[#2563eb]" />
                  </div>
                  <p className="text-gray-700">
                    Learn using real market data from global exchanges.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/50 rounded-lg flex items-center justify-center shadow">
                    <Cpu size={24} className="text-[#2563eb]" />
                  </div>
                  <p className="text-gray-700">
                    Get AI-guided insights with our AI Wealth Wizard.
                  </p>
                </div>
              </div>

              <Link href="/game" passHref>
                <button className="bg-[#2563eb] text-white border-none px-8 py-3 lg:py-4 rounded-full text-base font-semibold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:shadow-lg mt-6 w-full sm:w-auto">
                  Start your challenge now!
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}


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

// Infinite vertical stat scroller component
const statData = [
  {
    big: "50K+",
    title: "Active Users",
    extra: null,
  },
  {
    big: "200+",
    title: "Partner Institutions",
    extra: "Across India",
  },
  {
    big: "₹100Cr+",
    title: "Transactions Processed",
    extra: null,
  },
];

// Modified InfiniteVerticalStats for infinite scroll (looped animation)
function InfiniteVerticalStats() {
  return (
    <div className="relative h-[200px] flex flex-col justify-center items-center overflow-hidden w-full mt-8 px-4 sm:px-0">
      <style>{`
        .vert-marquee-track {
          display: flex;
          flex-direction: column;
          animation: vert-marquee 7s linear infinite;
        }
        @keyframes vert-marquee {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-50%);
          }
        }
      `}</style>
      <div className="w-full flex flex-col items-center">
        <div className="vert-marquee-track w-full">
          {[...statData, ...statData].map((stat, i) => (
            <div
              key={i}
              className="text-center p-5 sm:p-8 bg-gray-50 rounded-2xl shadow-md mb-6 last:mb-0 min-h-[120px] flex flex-col items-center justify-center w-full max-w-[450px] mx-auto"
            >
              <div className="text-5xl md:text-6xl font-bold text-[#2563eb] mb-2">{stat.big}</div>
              <div className="text-xl font-semibold text-gray-900">{stat.title}</div>
              {stat.extra && <div className="text-base text-gray-600 mt-2">{stat.extra}</div>}
            </div>
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
                className="relative w-[40vw] min-h-[40vw] sm:min-h-[60vw] lg:min-h-[95vh]"
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
              
              {/* Video Section */}
              <div className="mt-4 sm:mt-10">
                <div className="rounded-xl overflow-hidden shadow-lg aspect-video w-full max-w-2xl min-h-[200px] md:min-h-[300px]">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/0iRbD5rM5qc?si=WGKNGZcuTrBmjMLt"
                    title="BeFin Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full min-h-[200px] md:min-h-[300px]"
                  ></iframe>
                </div>
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
            <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl relative shadow-md transition-all hover:-translate-y-2 hover:shadow-xl text-left flex flex-col justify-center min-h-[220px] md:min-h-[260px]" data-aos="fade-up" data-aos-delay="200">
              {/* Image Top Right */}
              <div className="absolute top-0 right-0 w-48 h-24 pointer-events-none select-none leading-[1]">
                <Image
                  src="/home/students.png"
                  alt="Students icon"
                  fill
                  className="w-full h-full object-cover rounded-bl-full"
                  draggable={false}
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 mt-0 pr-12 md:pr-16">For <br /> <span className='text-3xl'>Students</span></h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Smart money habits, manage allowances, and make confident payments.
                </p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl relative shadow-md transition-all hover:-translate-y-2 hover:shadow-xl text-left flex flex-col justify-center min-h-[220px] md:min-h-[260px]" data-aos="fade-up" data-aos-delay="300">
              {/* Image Top Right */}
              <div className="absolute top-0 right-0 w-48 h-24 pointer-events-none select-none leading-[1]">
                <Image
                  src="/home/parents.png"
                  alt="Parents icon"
                  fill
                  className="w-full h-full object-cover rounded-bl-full"
                  draggable={false}
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 mt-0 pr-12 md:pr-16">By <br /> <span className='text-3xl'>Parents</span></h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Set allowances, track spending, and guide your child&apos;s financial growth.
                </p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-6 sm:p-7 md:p-8 rounded-2xl relative shadow-md transition-all hover:-translate-y-2 hover:shadow-xl text-left flex flex-col justify-center min-h-[220px] md:min-h-[260px]" data-aos="fade-up" data-aos-delay="300">
              {/* Image Top Right */}
              <div className="absolute top-0 right-0 w-48 h-24 pointer-events-none select-none leading-[1]">
                <Image
                  src="/home/professionals.png"
                  alt="Professionals icon"
                  fill
                  className="w-full h-full object-cover rounded-bl-full"
                  draggable={false}
                />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 md:mb-4 mt-0 pr-12 md:pr-16">To <br /> <span className='text-3xl'>Professionals</span></h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Budget better, save consistently, and invest wisely with AI driven tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Card Section as Banner */}
      <section
        className="relative flex items-center justify-center py-16 sm:py-24 md:py-32 overflow-hidden min-h-[420px] sm:min-h-[480px] md:min-h-[540px] bg-[aliceblue]"
        style={{
          background: "linear-gradient(120deg,#141a29 60%,#24304a 100%)"
        }}
      >
        {/* Banner background image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/home/banner.png"
            alt=""
            fill
            className="object-cover w-full h-full opacity-10"
            style={{ pointerEvents: "none", userSelect: "none" }}
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#162036] via-transparent to-[#2e4160] opacity-20"></div>
        </div>
        {/* TEXT CONTENT OVER IMAGE */}
        <div className="relative z-10 max-w-3xl w-full mx-auto px-5 sm:px-8 text-center" data-aos="fade-up">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-5">
            Smart Card
          </h2>
          <p className="text-2xl sm:text-4xl font-semibold text-[#61caff] mb-3">Spend Smarter | Stay in Control</p>
          <p className="text-lg sm:text-xl md:text-3xl text-gray-200 leading-relaxed mb-4">
            Make everyday payments easy, safe and fun with your own &nbsp;
            <span className="bg-gradient-to-r from-[#38bdf8] via-[#5eead4] to-[#f0fdfa] bg-clip-text text-transparent">
              BeFin Smart Card
            </span>
            , built for all ages.
          </p>
          <p className="text-base sm:text-xl text-gray-300 font-medium mb-6">Track, Tap and Manage Effortlessly.</p>
          <div className="flex gap-3 items-center text-base sm:text-lg justify-center text-[#9cd2ff] mb-14">
            <span className="font-medium">Secure</span>
            <span className="opacity-50">&bull;</span>
            <span className="font-medium">Fast</span>
            <span className="opacity-50">&bull;</span>
            <span className="font-medium">Prepaid</span>
          </div>
          <Link href="/services" passHref>
            <button className="bg-[#2563eb] text-white px-8 py-3 rounded-full text-base font-semibold transition-transform hover:scale-105 shadow hover:shadow-xl border-none">
              Get your BeFin Card →
            </button>
          </Link>
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
                className="text-3xl lg:text-5xl font-semibold leading-tight bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text"
                data-aos="fade-up"
              >
                Learn Money the Fun Way
              </h2>
              <p
                className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-lg"
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
                <div className="flex-1 flex justify-center w-full">
                  <InfiniteVerticalStats />
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

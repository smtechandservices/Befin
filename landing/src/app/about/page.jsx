"use client";

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutUs() {
  return (
    <>
      <Navbar activePage="about" />

      {/* About Us Intro Section */}
      <section className="pb-16 md:pb-0 flex items-center bg-white">
        <div className="w-full mx-auto lg:pe-4">
          <div className="flex flex-col-reverse lg:flex-row items-center">
            {/* Left Section - About Banner */}
            <div
              className="hidden lg:block w-full lg:w-1/2 flex items-center justify-center lg:justify-start relative min-h-[320px] sm:min-h-[400px] lg:min-h-[600px] mb-8 lg:mb-0"
              data-aos="fade-right"
            >
              <div
                className="relative w-[40vw] min-h-[40vw] sm:min-h-[60vw] lg:min-h-[75vh]"
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
                  src="/about/hero.png"
                  alt="BeFin About"
                  fill
                  className="object-cover bg-white"
                  priority
                />
              </div>
            </div>
            {/* Right Section - About Us Content */}
            <div className="text-center lg:text-left my-4 w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-8 px-4 sm:px-6 lg:px-4 lg:max-w-full lg:-translate-x-[12vh]" data-aos="fade-left">
              <h1 className="text-3xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text mb-2">
                Who are we ?
              </h1>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
                <span className="block mb-5">
                  At <span className="font-semibold text-[#2563eb]">BeFin</span>, we believe that financial independence should belong to everyone at every age. We&apos;re on a mission to make managing money simple, fun, and empowering, from your first allowance to your first salary.
                </span>
                <span className="block lg:mb-5">
                  Founded by <span className="font-semibold text-[#2563eb]">CommHawk Technologies Pvt. Ltd.</span>, BeFin bridges India&apos;s financial literacy gap with smart tools, gamified learning, and real-world financial experiences helping students, parents, and professionals <span className="font-semibold text-[#2563eb]">Learn • Save • Pay • Invest</span> with confidence.
                </span>
                <span className="hidden lg:block">
                  Built for India&apos;s digital future and powered by trusted financial partners, BeFin combines innovation, education, and technology to shape a financially smarter generation.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Helping India Understand Money */}
      <section className="pt-16 pb-14 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/about/banner.png"
            alt="Helping India Understand Money"
            className="w-full h-full object-cover opacity-45"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/90" />
        </div>

        <div className="relative z-10 mx-auto px-4 sm:px-6 md:px-10">
          {/* Header */}
          <div className="text-left md:text-left mx-auto mb-10 flex flex-col items-start md:items-start">
            <h2
              className="text-4xl md:text-5xl font-semibold text-[#2563eb] mb-6 w-full text-center md:text-left"
              data-aos="fade-up"
            >
              Helping India Understand Money
            </h2>

            <p
              className="text-lg md:text-xl text-gray-700 leading-relaxed w-full text-center md:text-left"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              We&apos;re on a mission to transform how India learns about money. Through
              innovative technology, engaging content, and real world applications,
              BeFin is making financial literacy accessible to millions. &nbsp;
              <span className="bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text font-semibold">
                Learn • Save • Pay • Invest
              </span>
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Vision */}
            <div data-aos="fade-up" data-aos-delay="200" className="text-left flex flex-col items-center md:items-start">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 w-full text-center md:text-left">
                Our Vision
              </h3>

              <ul className="space-y-5 text-lg text-gray-700 leading-relaxed w-full">
                <li className="flex items-start gap-4">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#2563eb]" />
                  <span>
                    To create a financially empowered India where every individual has
                    the knowledge and tools to make informed financial decisions.
                  </span>
                </li>

                <li className="flex items-start gap-4">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#2563eb]" />
                  <span>
                    To bridge the financial literacy gap and make financial education
                    accessible to all, regardless of age, background, or economic
                    status.
                  </span>
                </li>
              </ul>
            </div>

            {/* Mission */}
            <div data-aos="fade-up" data-aos-delay="300" className="relative text-left flex flex-col items-center md:items-start">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 w-full text-center md:text-left">
                Our Mission
              </h3>

              <ul className="space-y-5 text-lg text-gray-700 leading-relaxed w-full">
                <li className="flex items-start gap-4">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#2563eb]" />
                  <span>
                    Financial education through innovative,
                    gamified learning experiences.
                  </span>
                </li>

                <li className="flex items-start gap-4">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#2563eb]" />
                  <span>
                    Empower users with practical tools for saving, spending, and
                    investing wisely.
                  </span>
                </li>

                <li className="flex items-start gap-4">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#2563eb]" />
                  <span>
                    Collaborate with educational institutions and financial partners
                    to build financially aware communities.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team & Trusted Financial Partners Section */}
      <section className="py-20 bg-[aliceblue] relative">
        <div className="mx-auto px-4 sm:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2563eb] mb-6 text-center" data-aos="fade-up">
            Meet the Team & Trusted Partners
          </h2>
          <p className="text-lg text-gray-700 mx-auto mb-10 text-center mb-12" data-aos="fade-up" data-aos-delay="100">
            BeFin is powered by a passionate, multidisciplinary team and guided by industry leaders in the fintech and education domains. <br className='hidden md:block' /> Our trusted financial and educational partners help us deliver top-tier financial education and real-world solutions to learners and families across India.
          </p>
          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Founder & CEO */}
              <div className="flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="100">
              <div
                className="w-48 h-48 rounded-full overflow-hidden mb-6 shadow-lg border-4 border-white relative"
                style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              >
                <Image
                  src="/about/surbhi.jpg"
                  alt="Surbhi Kansal"
                  fill
                  className="object-cover rounded-full"
                  draggable={false}
                  priority
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Founder & CEO</h3>
              <p className="text-lg font-semibold text-gray-700 mb-1">Surbhi Kansal</p>
              <p className="text-sm text-gray-600">CommHawk Technologies Pvt. Ltd.</p>
            </div>

            {/* Advisory Board */}
            <div className="flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="200">
              <div
                className="w-48 h-48 rounded-full overflow-hidden mb-6 shadow-lg border-4 border-white relative"
                style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              >
                <Image
                  src="/about/advisory.jpg"
                  alt="Advisory Board"
                  fill
                  className="object-cover rounded-full"
                  draggable={false}
                  sizes="192px"
                  priority
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Advisory Board</h3>
              <p className="text-lg text-gray-600 max-w-md leading-relaxed">
                Industry leaders from the Fintech & Education ecosystem guiding our vision.
              </p>
            </div>

            {/* Our Team */}
            <div className="flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="300">
              <div
                className="w-48 h-48 rounded-full overflow-hidden mb-6 shadow-lg border-4 border-white relative"
                style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              >
                <Image
                  src="/about/team.jpg"
                  alt="BeFin Team"
                  fill
                  className="object-cover rounded-full"
                  draggable={false}
                  sizes="192px"
                  priority
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Our Team</h3>
              <p className="text-lg text-gray-600  max-w-md leading-relaxed">
                Passionate innovators, educators, and fintech professionals united by one goal.
              </p>
            </div>
          </div>

          <p className="text-lg text-gray-700 text-center max-w-5xl mx-auto leading-relaxed">
            We are proud to collaborate with leading financial institutions and educational organizations across India. These partnerships enable us to deliver comprehensive financial education and innovative payment solutions to millions of users nationwide.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}


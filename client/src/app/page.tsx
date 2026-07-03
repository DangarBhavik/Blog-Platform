'use client';

import NavBar from '@/components/landingPage/NavBar';
import { 
  FiArrowRight, 
  FiEye, 
  FiBookOpen, 
  FiGlobe,
  FiClock,
  FiSend,
  FiAward,
  FiCompass
} from 'react-icons/fi';
import { 
  IoIosTrendingUp, 
  IoMdQuote 
} from 'react-icons/io';
import { 
  FaPenFancy, 
  FaMoneyBillWave, 
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaFeatherAlt
} from 'react-icons/fa';
import { 
  MdOutlineAnalytics, 
  MdOutlineSecurity,
  MdOutlineEmail 
} from 'react-icons/md';
import { 
  RiCommunityLine, 
  RiAiGenerate,
} from 'react-icons/ri';
import { HiOutlineSparkles } from 'react-icons/hi';
import { BsStarFill } from 'react-icons/bs';

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="pt-28 md:pt-32 pb-20 relative overflow-hidden">
        {/* decorative abstract circles */}
        <div className="absolute top-40 -left-20 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-[8%] w-44 h-44 bg-yellow-100/50 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          {/* Premium Hero Section with two-column layout */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left text column */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-amber-200/80 shadow-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-xs font-medium text-amber-800 tracking-wide flex items-center gap-1">
                  <IoIosTrendingUp className="h-3 w-3" /> Trending now
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.2] mb-6">
                Where ideas <br />
                <span className="bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                  come alive.
                </span>
              </h1>
              <p className="text-xl text-stone-600 max-w-lg lg:max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
                Welcome to the <span className="font-semibold text-amber-700">Blog Platform</span> — a sophisticated space for
                creators, thinkers, and storytellers. Explore authentic narratives, share insights, and join a global community.
              </p>

              {/* double CTA group */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button className="group relative px-7 py-3.5 bg-stone-900 text-white rounded-full font-semibold shadow-xl hover:bg-amber-700 transition-all duration-300 flex items-center gap-2 overflow-hidden">
                  <span>Start writing</span>
                  <FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-7 py-3.5 rounded-full border-2 border-stone-300 text-stone-700 font-semibold hover:border-amber-500 hover:text-amber-600 transition-all bg-white/50 backdrop-blur-sm flex items-center gap-2">
                  <FiEye className="h-4 w-4" />
                  <span>Explore stories</span>
                </button>
              </div>

              {/* trust badge stats */}
              <div className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start text-stone-500">
                <div className="flex items-center gap-2">
                  <FaPenFancy className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium">5k+ active writers</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiBookOpen className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium">12k+ featured articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiGlobe className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium">98% reader satisfaction</span>
                </div>
              </div>
            </div>

            {/* Right visual column: Modern abstract card + image simulation */}
            <div className="flex-1 w-full relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-stone-200/30 z-10 pointer-events-none rounded-3xl"></div>
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-white/60 shadow-2xl">
                  <div className="relative z-20">
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full z-20 flex items-center gap-1">
                      <BsStarFill className="h-3 w-3 text-yellow-400" />
                      Editors pick
                    </div>
                    <div className="rounded-2xl overflow-hidden mb-5 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://placehold.co/600x400/f5f0e6/aa8c54?text=Inspired+Writing&font=playfair"
                        alt="premium blog visual"
                        className="w-full h-64 object-cover transition hover:scale-105 duration-700"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold uppercase tracking-wider">
                        <HiOutlineSparkles className="h-3 w-3" />
                        <span>Creativity · Insights</span>
                      </div>
                      <h3 className="text-xl font-bold text-stone-800">The art of modern storytelling</h3>
                      <p className="text-stone-500 text-sm leading-relaxed">
                        Discover how top writers craft compelling narratives that captivate thousands. Join the premium blogging
                        revolution.
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="w-6 h-6 rounded-full border border-amber-300"
                            src="https://randomuser.me/api/portraits/women/68.jpg"
                            alt="author"
                          />
                          <span className="text-xs font-medium text-stone-600">Elena Carter</span>
                        </div>
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <FiClock className="h-3 w-3" />
                          5 min read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-amber-100 rounded-full blur-2xl opacity-50 -z-10"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section className="py-20 bg-white/40 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold tracking-wide text-sm uppercase bg-amber-50 px-4 py-1 rounded-full inline-block">
              Why NexusBlog
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 text-stone-800">
              Crafted for <span className="bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">exceptional</span>{' '}
              creators
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto mt-4">
              Elevate your writing journey with tools, design, and community that feel truly premium.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                icon: <FiAward className="h-6 w-6 text-amber-700" />,
                title: 'Distinguished design',
                description: 'Minimal, elegant, and fully responsive reading experience. Every pixel is refined for deep focus and joy.',
              },
              {
                icon: <MdOutlineAnalytics className="h-6 w-6 text-amber-700" />,
                title: 'Analytics & insights',
                description: 'Track engagement, reader demographics, and trending topics with a powerful dashboard made for authors.',
              },
              {
                icon: <RiCommunityLine className="h-6 w-6 text-amber-700" />,
                title: 'Community hubs',
                description: 'Collaborate, comment, and engage inside curated groups. Build your audience in a meaningful way.',
              },
              {
                icon: <RiAiGenerate className="h-6 w-6 text-amber-700" />,
                title: 'AI-enhanced editor',
                description: 'Get smart suggestions, grammar polish, and SEO tips directly inside your writing workspace.',
              },
              {
                icon: <FaMoneyBillWave className="h-6 w-6 text-amber-700" />,
                title: 'Monetization ready',
                description: 'Turn your passion into income with memberships, tipping, and premium content subscriptions.',
              },
              {
                icon: <MdOutlineSecurity className="h-6 w-6 text-amber-700" />,
                title: 'Secure & reliable',
                description: 'Enterprise-grade infrastructure, data privacy, and 99.9% uptime — your stories are safe with us.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl p-7 border border-amber-100/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">{feature.title}</h3>
                <p className="text-stone-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-stone-50/80">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <IoMdQuote className="h-10 w-10 text-amber-400/60 mx-auto mb-2" />
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800">
              Loved by <span className="border-b-4 border-amber-400">thought leaders</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Julian Marquez',
                role: 'Bestselling author',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                quote: '"NexusBlog has completely reshaped the way I publish. The platform\'s minimal aesthetics and powerful writing tools give me total creative freedom."',
                rating: 5,
              },
              {
                name: 'Dr. Samantha Lin',
                role: 'Creative director',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                quote: '"As a content strategist, I\'ve tried many platforms — NexusBlog feels premium and intuitive. My readers love the immersive layout. 10/10."',
                rating: 5,
              },
              {
                name: 'Marcus Chen',
                role: 'Podcaster & writer',
                avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
                quote: '"The community here is unmatched. I\'ve grown my newsletter by 200% within weeks because of built-in discovery features. Highly recommended."',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-7 rounded-2xl shadow-md border border-stone-100 transition-all hover:shadow-lg">
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <BsStarFill key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-stone-600 italic">{testimonial.quote}</p>
                <div className="flex items-center gap-3 mt-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-10 h-10 rounded-full object-cover" src={testimonial.avatar} alt={testimonial.name} />
                  <div>
                    <h4 className="font-bold text-stone-800">{testimonial.name}</h4>
                    <p className="text-xs text-stone-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-white to-stone-50 opacity-80"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 md:p-14 shadow-2xl border border-white/40">
            <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-inner">
              <MdOutlineEmail className="h-8 w-8 text-amber-700" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">Join the inner circle</h2>
            <p className="text-stone-600 max-w-md mx-auto mb-8">
              Receive weekly writing inspiration, platform updates, and early access to new features — no spam, only gold.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-3 rounded-full border border-stone-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-amber-400 transition shadow-sm"
              />
              <button className="px-7 py-3 bg-stone-900 text-white rounded-full font-semibold hover:bg-amber-700 transition shadow-md flex items-center justify-center gap-2">
                <FiSend className="h-4 w-4" />
                Subscribe
              </button>
            </div>
            <p className="text-xs text-stone-400 mt-5">No spam, unsubscribe anytime. 10k+ subscribers already inspired.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800/60">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
                  <FaFeatherAlt className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-bold text-xl">NexusBlog</span>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed">The premium destination for ambitious storytellers and modern thinkers.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition flex items-center gap-2"><FiCompass className="h-3 w-3" /> Explore</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">For teams</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Affiliate</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Guides</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Help center</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Connect</h4>
              <div className="flex space-x-4 text-lg">
                <a href="#" className="hover:text-amber-400 transition"><FaTwitter className="h-5 w-5" /></a>
                <a href="#" className="hover:text-amber-400 transition"><FaInstagram className="h-5 w-5" /></a>
                <a href="#" className="hover:text-amber-400 transition"><FaGithub className="h-5 w-5" /></a>
                <a href="#" className="hover:text-amber-400 transition"><FaLinkedin className="h-5 w-5" /></a>
              </div>
              <p className="text-xs text-stone-500 mt-4">hello@nexusblog.com</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-sm text-stone-500">
            <span>© 2025 NexusBlog — Where great ideas bloom.</span>
            <div className="flex gap-6 mt-3 md:mt-0">
              <a href="#" className="hover:text-amber-400 transition">Privacy</a>
              <a href="#" className="hover:text-amber-400 transition">Terms</a>
              <a href="#" className="hover:text-amber-400 transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
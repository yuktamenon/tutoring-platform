import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const TYPING_WORDS = ['grow.', 'excel.', 'succeed.', 'connect.', 'thrive.']

const SUBJECTS_ROW1 = ['☕ Java','🌳 Data Structures','🤖 Artificial Intelligence','📐 Mathematics','🧮 Calculus I','🧠 Machine Learning','∫ Calculus II','⚡ Algorithms']
const SUBJECTS_ROW2 = ['🔬 Physics','💾 Database Systems','📊 Statistics','🌐 Computer Networks','🔐 Cryptography','🧬 Discrete Maths','💡 Operating Systems','📡 Digital Logic']

function useTyping(words) {
  const [display, setDisplay] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIdx]
    let delay = deleting ? 55 : 100
    if (!deleting && charIdx === word.length) { delay = 1600; setDeleting(true) }
    else if (deleting && charIdx === 0)       { delay = 300;  setDeleting(false); setWordIdx(i => (i + 1) % words.length) }

    const t = setTimeout(() => {
      setDisplay(word.slice(0, charIdx))
      setCharIdx(i => deleting ? i - 1 : i + 1)
    }, delay)
    return () => clearTimeout(t)
  }, [charIdx, deleting, wordIdx, words])

  return display
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function LandingPage() {
  const typingWord = useTyping(TYPING_WORDS)
  useScrollReveal()

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 relative overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-[-100px] left-[-120px] w-[520px] h-[520px] rounded-full bg-purple-400/35 blur-[70px] animate-blob" />
        <div className="absolute top-[60px] right-[-80px] w-[380px] h-[380px] rounded-full bg-yellow-500/30 blur-[70px] animate-blob [animation-delay:2s]" />
        <div className="absolute bottom-[80px] left-[20%] w-[280px] h-[280px] rounded-full bg-pink-500/25 blur-[70px] animate-blob [animation-delay:4s]" />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(124,111,224,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,111,224,0.06) 1px,transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 100%)' }} />

        {/* Floating badges */}
        <FloatBadge className="hidden lg:flex left-[6%] top-[30%] animate-float" icon="🎓" title="200+ Tutors" sub="Available now" />
        <FloatBadge className="hidden lg:flex right-[6%] top-[28%] animate-float [animation-delay:1s]" icon="⭐" title="4.9 / 5.0" sub="Avg. rating" />
        <FloatBadge className="hidden lg:flex right-[10%] bottom-[22%] animate-float [animation-delay:.5s]" icon="📅" title="Book Instantly" sub="Pick your slot" />
        <FloatBadge className="hidden lg:flex left-[8%] bottom-[28%] animate-float [animation-delay:1.5s]" icon="💬" title="Live Messaging" sub="Chat with tutors" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 border border-purple-200 px-4 py-1.5 rounded-full text-xs font-semibold mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse-slow" />
            University Peer-to-Peer Tutoring
          </div>

          <h1 className="font-syne font-extrabold text-purple-900 leading-[1.08] mb-5"
            style={{ fontSize: 'clamp(2.8rem,6vw,5.2rem)' }}>
            The smarter way<br />
            to{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">learn</span>
            {' & '}
            <span className="text-yellow-500">{typingWord}</span>
            <span className="typing-cursor" />
          </h1>

          <p className="max-w-xl text-purple-500 text-lg leading-relaxed mb-8">
            Connect with top university tutors, book sessions in seconds, and finally understand the subjects that matter most to you.
          </p>

          <div className="flex gap-3 flex-wrap justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-3">Find a Tutor →</Link>
            <Link to="/login"    className="btn-secondary text-base px-8 py-3">Log In</Link>
          </div>

          <div className="flex gap-10 mt-12 flex-wrap justify-center">
            {[['2,400+','Sessions Completed'],['95%','Satisfaction Rate'],['40+','Subjects Covered']].map(([num, lbl], i) => (
              <div key={i} className={`text-center ${i === 1 ? 'px-10 border-x border-purple-200' : ''}`}>
                <div className="font-syne font-extrabold text-3xl text-purple-700">{num}</div>
                <div className="text-xs text-purple-400 mt-1">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[10px] text-purple-400 uppercase tracking-[.12em]">
          <div className="w-px h-10 bg-gradient-to-b from-purple-500 to-transparent animate-pulse" />
          Scroll to explore
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="section-label reveal">How It Works</div>
          <h2 className="section-title text-4xl md:text-5xl reveal">Four steps to your <em className="text-purple-500 not-italic">first session</em></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { num:'01', icon:'📝', title:'Create Account',      desc:'Sign up as student or tutor. Verified university emails for a trusted community.' },
            { num:'02', icon:'🔍', title:'Search & Filter',     desc:'Browse by subject, price, rating, or day. Find exactly who you need.' },
            { num:'03', icon:'📅', title:'Book a Session',      desc:'Pick a date and time slot. Send a message with what you need help with.' },
            { num:'04', icon:'🚀', title:'Learn & Grow',        desc:'Attend, chat in real-time, leave a review. Get personalised recommendations.' },
          ].map((s, i) => (
            <div key={i} className={`card relative overflow-hidden reveal`} style={{ transitionDelay: `${i*0.1}s` }}>
              <div className="absolute top-3 right-4 font-syne font-extrabold text-5xl text-purple-100 leading-none select-none">{s.num}</div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl mb-4">{s.icon}</div>
              <h3 className="font-syne font-bold text-purple-900 mb-2">{s.title}</h3>
              <p className="text-sm text-purple-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUBJECTS MARQUEE ── */}
      <section className="py-20 bg-purple-900 relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-50px] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-[80px]" />
        <div className="absolute bottom-[-50px] left-[10%] w-[300px] h-[300px] rounded-full bg-yellow-500/15 blur-[80px]" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 mb-10">
          <div className="section-label bg-yellow-500/15 text-yellow-400 reveal">Subjects We Cover</div>
          <h2 className="section-title text-white text-3xl md:text-4xl reveal">Whatever you're studying,<br/>we've got a tutor for it.</h2>
        </div>
        <Marquee items={SUBJECTS_ROW1} />
        <div className="mt-3"><Marquee items={SUBJECTS_ROW2} reverse /></div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-label reveal">Student Reviews</div>
          <h2 className="section-title text-4xl md:text-5xl reveal">Loved by <em className="text-purple-500 not-italic">thousands</em><br/>of students</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { text:'I was failing my Java midterm and booked a session the night before. My tutor explained everything so clearly — I passed with distinction!', name:'Sana R.', role:'CS Student • 2nd Year', av:'SR', c:'bg-purple-100 text-purple-700' },
            { text:'The booking flow is so smooth. Found a tutor for Data Structures, picked a slot, and were chatting within minutes. Incredible platform.', name:'Karan P.', role:'Engineering Student', av:'KP', c:'bg-yellow-100 text-yellow-700' },
            { text:'I started tutoring on StudyBudee as side income — the platform handles everything. I just show up and teach. 10/10.', name:'Neha M.', role:'Tutor • AI & ML', av:'NM', c:'bg-pink-100 text-pink-700' },
          ].map((t, i) => (
            <div key={i} className={`card reveal`} style={{ transitionDelay: `${i*0.1}s` }}>
              <div className="text-3xl text-purple-200 mb-2 leading-none font-serif">"</div>
              <p className="text-sm text-purple-700 leading-relaxed mb-5">{t.text}</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${t.c}`}>{t.av}</div>
                <div>
                  <div className="font-semibold text-sm text-purple-900">{t.name}</div>
                  <div className="text-xs text-purple-400">{t.role}</div>
                </div>
                <div className="ml-auto text-yellow-500 text-sm">★★★★★</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-4 md:mx-8 mb-20">
        <div className="bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px' }}>
          <div className="absolute top-[-60px] left-[-40px] w-52 h-52 rounded-full bg-yellow-500/20 blur-[60px] animate-float" />
          <div className="absolute bottom-[-40px] right-[10%] w-36 h-36 rounded-full bg-pink-500/20 blur-[50px] animate-float [animation-delay:1s]" />
          <div className="relative z-10">
            <h2 className="font-syne font-extrabold text-white text-4xl md:text-5xl mb-4">Ready to find your<br/>StudyBudee?</h2>
            <p className="text-purple-300 text-lg mb-10 max-w-md mx-auto">Join thousands of students and tutors already learning together.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/register?role=student" className="bg-white text-purple-700 font-semibold rounded-full px-8 py-3 hover:-translate-y-1 hover:shadow-xl transition-all">I'm a Student →</Link>
              <Link to="/register?role=tutor" className="border-2 border-white/40 text-white font-medium rounded-full px-8 py-3 hover:bg-white/10 hover:-translate-y-1 transition-all">I'm a Tutor</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-purple-400 px-8 py-8 flex items-center justify-between flex-wrap gap-4 text-sm">
        <div className="font-syne font-extrabold text-white text-xl">Study<span className="text-yellow-500">Budee</span></div>
        <div className="flex gap-6">
          {['About','Privacy','Terms','Contact'].map(l => <a key={l} href="#" className="hover:text-purple-200 transition-colors">{l}</a>)}
        </div>
        <div>© 2026 StudyBudee. All rights reserved.</div>
      </footer>
    </div>
  )
}

function FloatBadge({ className, icon, title, sub }) {
  return (
    <div className={`absolute flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg shadow-purple-900/10 pointer-events-none ${className}`}>
      <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-base">{icon}</div>
      <div>
        <div className="font-semibold text-sm text-purple-900">{title}</div>
        <div className="text-xs text-purple-400">{sub}</div>
      </div>
    </div>
  )
}

function Marquee({ items, reverse }) {
  const doubled = [...items, ...items]
  return (
    <div className="flex overflow-hidden">
      <div className={`flex gap-3 flex-shrink-0 ${reverse ? 'animate-scroll-right' : 'animate-scroll-left'}`}
        style={{ width: 'max-content' }}>
        {doubled.map((s, i) => (
          <div key={i} className={`flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm font-medium whitespace-nowrap
            ${i % 3 === 0 ? 'bg-purple-500/20 text-purple-200' : i % 3 === 1 ? 'bg-yellow-500/10 text-yellow-300' : 'bg-white/5 text-white/70'}`}>
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

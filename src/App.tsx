import { Routes, Route, useLocation, Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Timeline from './pages/Timeline'
import Contact from './pages/Contact'
import logo from './assets/logo.png'

const page = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>

      <div className="min-h-screen max-w-5xl mx-auto px-4 py-6">
        <nav className="sticky top-0 z-10 backdrop-blur bg-black/30 rounded-2xl border border-white/10 px-4 py-3 mb-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-semibold">
              <img src={logo} alt="Logo" className="h-14 w-auto" />
            </Link>
            <div className="flex gap-4 text-sm text-neutral-300">
              {['/', '/projects', '/timeline', '/contact'].map((p, i) => (
                <NavLink key={i} to={p} className={({isActive}) => isActive ? 'underline' : 'hover:text-white'}>
                  {p === '/' ? 'Home' : p.replace('/','').replace(/^[a-z]/, s=>s.toUpperCase())}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
        {children}
        <footer className="mt-16 text-center text-neutral-400 text-sm">© {new Date().getFullYear()} Bishal Adhikari</footer>
      </div>
    </>
  )
}

export default function App() {
  const loc = useLocation()
  return (
    <Shell>
      <AnimatePresence mode="wait">
        <motion.div key={loc.pathname} variants={page} initial="initial" animate="animate" exit="exit">
          <Routes location={loc}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Shell>
  )
}

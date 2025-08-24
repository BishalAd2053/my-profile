import { Link, NavLink } from 'react-router-dom'
export default function Nav() {
  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-black/30 rounded-2xl border border-white/10 px-4 py-3 mb-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="font-semibold">BA</Link>
        <div className="flex gap-4 text-sm text-neutral-300">
          {['/', '/projects', '/timeline', '/contact'].map((p, i) => (
            <NavLink key={i} to={p} className={({isActive}) => isActive ? 'underline' : 'hover:text-white'}>
              {p === '/' ? 'Home' : p.replace('/','').replace(/^[a-z]/, s=>s.toUpperCase())}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}


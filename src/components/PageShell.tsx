import Nav from './Nav'
import Footer from './Footer'
import GalaxyBackground from './GalaxyBackground'

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GalaxyBackground />
      <div className="min-h-screen max-w-5xl mx-auto px-4 py-6 text-neutral-100 relative">
        <Nav />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  )
}

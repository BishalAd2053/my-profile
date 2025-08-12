import Nav from './Nav'
import Footer from './Footer'
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-6 text-neutral-100 bg-neutral-950">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  )
}


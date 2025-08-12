import { useProfile } from '../hooks/useProfile'
import { useContributions } from '../hooks/useContributions'
import { motion } from 'framer-motion'
import Heatmap from '../components/Heatmap'
import Skeleton from '../components/Skeleton'

export default function Home() {
  const { data: profile, isLoading: loadingProfile } = useProfile()
  const { data: contributions, isLoading: loadingContrib } = useContributions()

  return (
    <div className="space-y-10">
      <section className="grid md:grid-cols-[120px_1fr] items-center gap-6">
        {loadingProfile ? (
          <Skeleton className="w-24 h-24" />
        ) : (
          <motion.img
            src={profile?.avatarUrl || 'https://placehold.co/120x120'}
            alt="avatar"
            className="w-24 h-24 rounded-2xl object-cover border border-white/10"
            initial={{ rotate: -5, opacity: 0, y: 10 }}
            animate={{ rotate: 0, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          />
        )}
        <div>
          <h1 className="text-3xl font-semibold">{profile?.name ?? 'Bishal'}</h1>
          <p className="text-neutral-300">{profile?.title ?? 'Your Title'}</p>
          <p className="mt-2 text-neutral-400">{profile?.bio ?? 'Short bio goes here.'}</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg mb-3 text-neutral-300">Contribution heatmap</h2>
        {loadingContrib ? <Skeleton className="h-16 w-full" /> : contributions?.items ? <Heatmap items={contributions.items} /> : <p>No data</p>}
      </section>
    </div>
  )
}

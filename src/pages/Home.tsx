import { useProfile } from '../hooks/useProfile'
import { motion } from 'framer-motion'
import { GitHubHeatmap } from '../components/GitHubHeatmap'
import Skeleton from '../components/Skeleton'

export default function Home() {
  const { data: profile, isLoading: loadingProfile } = useProfile()

  return (
    <div className="space-y-10">
      <section className="grid md:grid-cols-[120px_1fr] items-center gap-6">
        {loadingProfile ? (
          <Skeleton className="w-24 h-24" />
        ) : (
          <motion.img
            src={profile?.avatarUrl || 'https://robohash.org/b371f893a19a64572cce32dffe1196dc?set=set4&bgset=&size=400x400'}
            alt="avatar"
            className="w-24 h-24 rounded-2xl object-cover border border-white/10"
            initial={{ rotate: -5, opacity: 0, y: 10 }}
            animate={{ rotate: 0, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          />
        )}
        <div>
          <h1 className="text-3xl font-semibold">{profile?.name ?? 'Bishal Adhikari'}</h1>
          <p className="text-neutral-300">{profile?.title ?? 'Your Title'}</p>
          <p className="mt-2 text-neutral-400">{profile?.bio ?? 'Short bio goes here.'}</p>
        </div>
      </section>

      <section>
        <GitHubHeatmap username="BishalAd2053" />
      </section>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { motion } from 'framer-motion'

type Project = { id:number; name:string; slug:string; description:string; url:string; repo:string; featured:boolean; tags:string[] }

export default function Projects() {
  const { data } = useQuery<Project[]>({ queryKey: ['projects'], queryFn: async () => (await api.get('/projects')).data })

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {data?.map((p, i) => (
        <motion.a
          key={p.id}
          href={p.url || '#'}
          target="_blank"
          rel="noreferrer"
          className="block rounded-2xl border border-white/10 p-4 bg-white/5 hover:bg-white/10 transition"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{p.name}</h3>
            {p.featured && <span className="text-xs px-2 py-1 rounded-full bg-white/10">Featured</span>}
          </div>
          <p className="mt-2 text-sm text-neutral-300">{p.description}</p>
          <div className="mt-3 flex gap-2 flex-wrap">
            {p.tags?.map((t,idx)=>(
              <span key={idx} className="text-xs px-2 py-1 rounded-full bg-black/40 border border-white/10">{t}</span>
            ))}
          </div>
        </motion.a>
      ))}
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { motion } from 'framer-motion'

type Exp = { id:number; orgName:string; role:string; startDate:string; endDate:string | null; summary:string; bullets:string[] }

export default function Timeline() {
  const { data } = useQuery<Exp[]>({ queryKey: ['timeline'], queryFn: async () => (await api.get('/timeline')).data })
  return (
    <div className="space-y-6">
      {data?.map((e, i)=>(
        <motion.div key={e.id} className="rounded-2xl border border-white/10 p-4"
          initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i*0.05 }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{e.role}</div>
              <div className="text-sm text-neutral-300">{e.orgName}</div>
            </div>
            <div className="text-xs text-neutral-400">
              {new Date(e.startDate).toLocaleDateString()} – {e.endDate ? new Date(e.endDate).toLocaleDateString() : 'Present'}
            </div>
          </div>
          <p className="mt-2 text-sm text-neutral-300">{e.summary}</p>
          <ul className="mt-2 list-disc list-inside text-neutral-400 text-sm">
            {e.bullets?.map((b,idx)=>(<li key={idx}>{b}</li>))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}
